import puppeteer from 'puppeteer';
import fs from 'fs';

const app = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 300,
    defaultViewport: {
      width: 1080,
      height: 720,
    },
  });
  const page = await browser.newPage();
  await page.goto('https://www.vprok.ru/product/makfa-makfa-izd-mak-spirali-450g--306739');
  await page.locator('.UiHeaderHorizontalBase_region__2ODCG').click();
  await page.locator('.Modal_modal__Pja4P ::-p-text(Санкт-Петербург и область)').click();
  await page.waitForSelector('.Modal_modal__Pja4P', { hidden: true });
  await page.locator('button.Tooltip_closeIcon__skwl0').click();
  await page.locator('.CookiesAlert_agreeButton__cJOTA > button').click();
  const body = await page.waitForSelector('body');
  await body.screenshot({ path: 'body.jpg' });
  console.log('Скриншот сохранен');

  const productData = await page.evaluate(() => {
    const getNumber = (priceText) => {
      const regExp = /\d+(,\d+)?/;
      const number = priceText.match(regExp);
      return number ? number[0] : null;
    };
    const priceText = document.querySelector('.Price_size_XL__MHvC1');
    const oldPriceText = document.querySelector('.Price_size_XS__ESEhJ');
    const rating = document.querySelector('.ActionsRow_stars__EKt42');
    const reviewCount = document.querySelector('.ActionsRow_reviews__AfSj_');

    return {
      price: priceText ? getNumber(priceText.textContent) : null,
      priceOld: oldPriceText ? getNumber(oldPriceText.textContent) : null,
      rating: rating ? rating.textContent : null,
      reviewCount: reviewCount ? getNumber(reviewCount.textContent) : null,
    };
  });
  console.log(productData);
  const dataString = Object.entries(productData).map(([key, value]) => `${key}=${value}`).join('\n');
  await fs.promises.writeFile('product.txt', dataString);
  await browser.close();
};
app();
