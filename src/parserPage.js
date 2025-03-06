import puppeteer from 'puppeteer';
import fs from 'fs';

const parserPage = async (url, region) => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: {
      width: 1080,
      height: 720,
    },
  });
  try {
    const page = await browser.newPage();
    await page.goto(url);
    await page.waitForNavigation({ waitUntil: 'load' });

    await page.locator('.UiHeaderHorizontalBase_region__2ODCG').click();
    await page.locator(`.Modal_modal__Pja4P ::-p-text(${region.trim()})`, {}).click();
    await page.waitForSelector('.Modal_modal__Pja4P', { hidden: true });
    await page.locator('button.Tooltip_closeIcon__skwl0').click();
    await page.locator('.CookiesAlert_agreeButton__cJOTA > button').click();
    const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
    await page.setViewport({ width: 1080, height: bodyHeight });
    await page.screenshot({ path: 'screenshot.jpg' });
    console.log('Скриншот сохранен в screenshot.jpg');

    const productData = await page.evaluate(() => {
      const getNumber = (priceText) => {
        if (!priceText) return null;
        const regExp = /\d+([.,]\d+)?/;
        const number = priceText.match(regExp);
        return number ? number[0] : null;
      };
      const selectors = {
        price: '.Price_size_XL__MHvC1',
        outOfStock: '.OutOfStockInformer_informer__NCD7v > span',
        priceOld: '.Price_size_XS__ESEhJ',
        rating: '.ActionsRow_stars__EKt42',
        reviewCount: '.ActionsRow_reviews__AfSj_',
      };
      return {
        price: getNumber(document.querySelector(selectors.price)?.textContent)
          || document.querySelector(selectors.outOfStock).textContent,
        priceOld: getNumber(document.querySelector(selectors.priceOld)?.textContent) || null,
        rating: getNumber(document.querySelector(selectors.rating).textContent),
        reviewCount: getNumber(document.querySelector(selectors.reviewCount).textContent),
      };
    });
    try {
      const dataString = Object.entries(productData).filter(([_, value]) => value !== null).map(([key, value]) => `${key}=${value}`).join('\n');
      await fs.promises.writeFile('product.txt', dataString);
      console.log('Данные сохранены в product.txt');
    } catch (error) {
      console.error('Ошибка записи файла:', error);
    }
  } catch (error) {
    console.error('Ошибка парсинга:', error);
  } finally {
    await browser.close();
  }
};

export default parserPage;
