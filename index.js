const http = require("http");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;

const hostname = "localhost";
const port = 7777;

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);

  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, "");
  const queryStringObject = parsedUrl.query;
  const method = req.method.toLowerCase();
  const headers = req.headers;

  const decoder = new StringDecoder('utf-8');
  let buffer = '';
  req.on('data', data => {
    buffer += decoder.write(data);
  });
  req.on('end', () => {
    buffer += decoder.end();
    const chosenHandler = typeof (router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : router.notFound;
    const data = {
      'trimmedPath': trimmedPath,
      'queryStringObject': queryStringObject,
      'method': method,
      'headers': headers,
      'payload': buffer,
    };
    chosenHandler(data, (statusCode, payload) => {
      statusCode = typeof (statusCode) == 'number' ? statusCode : 200;
      payload = typeof (payload) == 'object' ? payload : {};
      const payloadString = JSON.stringify(payload);
      res.setHeader('Content-type', 'application/json');
      res.writeHead(statusCode);
      res.end(payloadString);
    })
  });
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

const router = {
  hello: (data, callback) => {
    callback(200, { welcomeMessage: "I am a welcome message" });
  },
  notFound: (data, callback) => {
    callback(404)
  }
};
