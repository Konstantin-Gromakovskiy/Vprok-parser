import puppeteer from 'puppeteer';
import fs from 'fs';

//TODO: сделать обработку ошибок
//TODO: настроить ссылки для переадресации

const testUrl = 'https://www.vprok.ru/product/domik-v-derevne-dom-v-der-moloko-ster-3-2-950g--309202'
const testRegion = 'Санкт-Петербург и область'

const parser = async (url, region) => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: {
      width: 1080,
      height: 720,
    },
  });
  try {
    const page = await browser.newPage();
    await page.goto(testUrl);
    await page.waitForNavigation({waitUntil: "load"});
    
    await page.locator('.UiHeaderHorizontalBase_region__2ODCG').click();
    await page.locator(`.Modal_modal__Pja4P ::-p-text(${testRegion})`, {}).click();
    await page.waitForSelector('.Modal_modal__Pja4P', {hidden: true});
    await page.locator('button.Tooltip_closeIcon__skwl0').click();
    await page.locator('.CookiesAlert_agreeButton__cJOTA > button').click();
    const body = await page.waitForSelector('body');
    await body.screenshot({path: 'screenshot.jpg'});
    console.log('Скриншот сохранен в screenshot.jpg');
    
    const productData = await page.evaluate(() => {
      const getNumber = (priceText) => {
        const regExp = /\d+([.,]\d+)?/;
        const number = priceText.match(regExp);
        return number ? number[0] : null;
      };
      const selectors = {
        price: '.Price_size_XL__MHvC1',
        priceOld: '.Price_size_XS__ESEhJ',
        rating: '.ActionsRow_stars__EKt42',
        reviewCount: '.ActionsRow_reviews__AfSj_',
      };
      
      return Object.entries(selectors).reduce((acc, [key, selector]) => {
        const element = document.querySelector(selector);
        if (!element && key === 'priceOld') return acc;
        if (!element) throw new Error(`Элемент с селектором ${selector} не найден`);
        acc[key] = getNumber(element.textContent);
        return acc;
      }, {});
    });
    console.log(productData);
    try {
      const dataString = Object.entries(productData).map(([key, value]) => `${key}=${value}`).join('\n');
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
export default parser;
