import * as readline from 'node:readline';
import parser from './src/parser.js';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const askQuestion = (query) => new Promise((resolve) => { rl.question(query.trim(), resolve); });

const app = async () => {
  const url = await askQuestion('Введите ссылку на товар: ');
  const region = await askQuestion('Введите регион: ');
  await parser(url, region);
  rl.close();
};
app();
