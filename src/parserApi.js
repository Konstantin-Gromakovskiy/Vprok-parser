import puppeteer from 'puppeteer';
import fs from 'fs';

// TODO: написать README

function buildUrlApi(url) {
  const urlConstructor = new URL(url);
  const parts = urlConstructor.pathname.split('/');
  const id = parts[parts.length - 2];
  const urlApi = new URL(`/web/api/v1/catalog/category/${id}?sort=popularity_desc&limit=30&page=1`, urlConstructor.origin);
  return { urlApi: urlApi.href, categoryPath: urlConstructor.pathname };
}

const parserApi = async (pageUrl) => {
  const { urlApi, categoryPath } = buildUrlApi(pageUrl);

  const browser = await puppeteer.launch();
  try {
    const page = await browser.newPage();
    await page.goto(pageUrl);
    await page.waitForNavigation({ waitUntil: 'load' });

    const response = await page.evaluate(async (urlApi, categoryPath) => {
      try {
        const result = await fetch(urlApi, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ noRedirect: true, urlApi: categoryPath }),
        });
        return result.ok ? await result.json() : null;
      } catch (error) {
        console.error('Ошибка при запросе API:', error);
        return null;
      }
    }, urlApi, categoryPath);

    if (!response || !response.products) {
      console.error('Ошибка: API вернул некорректный ответ', response);
      return;
    }

    const productsParsed = response.products.map((product) => {
      const result = (
        `Название товара: ${product.name}\n`
        + `Ссылка на изображение: ${product.images[0]?.url.replace('<SIZE>', 'x500') || 'нет изображения'}\n`
        + `Рейтинг: ${product.rating}\n`
        + `Количество отзывов: ${product.reviews}\n`
        + `Цена: ${product.price}\n`
      );
      const extraInfo = product.discount !== 0 ? `Цена до акции: ${product.oldPrice}\nРазмер скидки: ${product.discount}\n` : '';
      return result + extraInfo;
    }).join('\n');

    await fs.promises.writeFile('products-Api.txt', productsParsed);
    console.log('Товары записаны в products-Api.txt');
  } catch (error) {
    console.error('Ошибка в parserApi:', error);
  } finally {
    await browser.close();
  }
};

export default parserApi;
