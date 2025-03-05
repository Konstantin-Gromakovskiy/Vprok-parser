import puppeteer from 'puppeteer';
import * as util from "node:util";
import fs from 'fs';

//TODO: сделать обработку ошибок
//TODO: настроить ссылки для переадресации
//TODO: сделать интерфейс
//TODO: написать README

const parser = async () => {
  const preUrl = 'https://www.vprok.ru/catalog/7382/pomidory-i-ovoschnye-nabory '
  const url = "https://www.vprok.ru/web/api/v1/catalog/category/7382?sort=popularity_desc&limit=30&page=1";
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(preUrl);
  await page.waitForNavigation({waitUntil: "load"});
  
  const response = await page.evaluate(async (url) => {
    const result = await fetch(url, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({noRedirect: true, url: "/catalog/7382/pomidory-i-ovoschnye-nabory"}),
    });
    return result.json();
  }, url);
  
  const productsParse = response.products.map(product => {
    const result = (
      `Название товара: ${product.name}\n` +
      `Ссылка на изображение: ${product.images[0].url.replace('<SIZE>', 'x500')}\n` +
      `Рейтинг: ${product.rating}\n` +
      `Количество отзывов: ${product.reviews}\n` +
      `Цена: ${product.price}\n`
    )
    
    const extraInfo = product.discount !== 0 ? `Цена до акции: ${product.oldPrice}\nРазмер скидки: ${product.discount}\n` : '';
    
    return result + extraInfo
  }).join('\n');
  
  await fs.promises.writeFile('products-Api.txt', productsParse);
  console.log('Товары зписаны в products-Api.txt');
  
  // console.log(util.inspect(response.products, {depth: 3, colors: true}));
  
  await browser.close();
};

parser();
