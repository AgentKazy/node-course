/////////////////////////////////////////////////////////////
// MODULES
const fs = require('fs');
const http = require('http');
const url = require('url');

/////////////////////////////////////////////////////////////
// FILES

// Blocking, synchronous way
/* const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
console.log(textIn);
const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;
fs.writeFileSync('./txt/output.txt', textOut);
console.log('File saved!'); */

// Non-blocking, asynchonous way
// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//   if (err) return console.log('Error.');

//   fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//     console.log(data2);
//     fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
//       console.log(data3);

//       fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', (err) => {
//         console.log('File has been written.');
//       });
//     });
//   });
// });
// console.log('Reading file...');

/////////////////////////////////////////////////////////////
// SERVER
/* This code is on the top level, it will only be executed
once and won't be called every time there is a new request. */
const replaceTemplate = (temp, product) => {
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);

  if (!product.organic)
    output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
  return output;
};
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);
// Top level code ends here.

// req - request, res - response
const server = http.createServer((req, res) => {
  // DEPRECATED /////////
  // const { query, pathname } = url.parse(req.url, true);
  ///////////////////////

  const baseURL = `http://${req.headers.host}`;
  const requestURL = new URL(req.url, baseURL);
  // requestURL variable contains the absolute URL.
  // In this case it's http://localhost:8000/product?id=1
  // Get the path name from URL: /product
  const pathname = requestURL.pathname;
  // Get the query from the URL.
  const query = requestURL.searchParams.get('id');
  // .searchParams returns this: URLSearchParams { 'id' => '1' }

  // Handle routing
  // Overview page
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'Content-type': 'text/html' });

    const cardsHtml = dataObj
      .map((elem) => replaceTemplate(tempCard, elem))
      .join('');
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);

    res.end(output);

    // Product page
  } else if (pathname === '/product') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    const product = dataObj[query];

    const output = replaceTemplate(tempProduct, product);
    res.end(output);

    // API
  } else if (pathname === '/api') {
    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(data);

    // Not found
  } else {
    res.writeHead(404, {
      'Content-type': 'text/HTML',
      'my-own-header': 'hello-world',
    });
    res.end('<h1>Page not found!</h1>');
  }
});

const port = 8000;

server.listen(port, '127.0.0.1', () => {
  console.log(`Listening to requests on port ${port}`);
});
