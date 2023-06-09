const { ifError } = require("assert");
const { log } = require("console");
const fs = require("fs");
const http = require("http");
const url = require("url");



///////// SERVER ///////////
const replaceTemp = (temp, product) => {
    let output = temp.replace(/{%Product%}/g,product.productName)
    output = output.replace(/{%Image%}/g,product.image)
    output = output.replace(/{%Origin%}/g,product.from)
    output = output.replace(/{%Nutrients%}/g,product.nutrients)
    output = output.replace(/{%Quantity%}/g,product.quantity)
    output = output.replace(/{%Id%}/g,product.id)
    output = output.replace(/{%Description%}/g,product.description)
    output = output.replace(/{%Price%}/g,product.price)

    if(!product.organic){ output = output.replace(/{%notOrganic%}/g,'not-organic') }
    return output
}

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const tempOverview = fs.readFileSync(`${__dirname}/templates/temp_overview.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/temp_product.html`, 'utf-8');
const tempCards = fs.readFileSync(`${__dirname}/templates/temp_card.html`, 'utf-8');
    const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const { query , pathname} = url.parse(req.url,true)

  //OVERVIEW//
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200,{'Content-type':'text/html'})
    
    const cardHtml = dataObj.map(el => replaceTemp(tempCards,el)).join('')
    const output = tempOverview.replace('{%Product-Card%}',cardHtml)

    res.end(output);

  //PRODUCT// 
  } else if (pathname === "/product") {
    res.writeHead(200,{'Content-type':'text/html'})
    const product = dataObj[query.id]
    const output = replaceTemp(tempProduct,product)
    res.end(output);

    // API //
  } else if (pathname === "/api") {
      res.writeHead(200,{'Content-type':'application/json'})
      res.end(data)

      //NOT FOUND///
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hello-world",
    });
    res.end("<h1>Server not found</h1>");
  }
});
server.listen("1000", "127.0.0.1", () => {
  console.log("Listening to request from port 1000");
});
