import * as readline from 'node:readline';
// eslint-disable-next-line import/no-named-as-default,import/no-named-as-default-member
import parserApi from './src/parserApi.js';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const askQuestion = (query) => new Promise((resolve) => { rl.question(query.trim(), resolve); });

const app = async () => {
  const url = await askQuestion('Введите ссылку на каталог: ');
  await parserApi(url);
  rl.close();
};
app();
