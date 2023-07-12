const fs = require('fs');

// Blocking code execution
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(textIn);

// Non-blocking code execution
fs.readFile('./txt/input.txt', 'utf-8', (err, data) => {
  console.log(data);
});
console.log('Reading file...');

const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;
fs.writeFileSync('./txt/output.txt', textOut);
console.log('File saved!');
