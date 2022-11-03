const fs = require('fs');
const path = require('path');
const readline = require('readline');

const filePath = path.join(__dirname, 'output.txt');
const writableStream = fs.createWriteStream(filePath);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let line = '';
console.log('Для записи в файл нажми Enter после ввода строки.');
console.log('Для завершения программы - введи exit, нажми Enter, или используй сочетание клавиш Ctrl+C');
console.log('Введите текст:\n');

rl.on('line', (text) => {
  switch (text) {
  case 'exit':
    rl.close();
    break;
  default:
    line = text + '\n';
    writableStream.write(line);
    break;
  }
}).on('close', () => {
  writableStream.end();
  writableStream.on('finish', () => {
    console.log(`\n Текст записан в файл ${filePath}`);
  });
});