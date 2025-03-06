import * as readline from 'node:readline';
// eslint-disable-next-line import/no-named-as-default ,import/no-named-as-default-member
import parserPage from './src/parserPage.js';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const askQuestion = (query) => new Promise((resolve) => { rl.question(query.trim(), resolve); });

const app = async () => {
  const url = await askQuestion('Введите ссылку на товар: ');
  const region = await askQuestion('Введите регион: ');
  await parserPage(url, region);
  rl.close();
};
app();
