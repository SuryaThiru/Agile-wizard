const http = require('http');

http.createServer(function (req, res) {
  res.write('wubba lubba dub dub'); //write a response to the client
  res.end(); //end the response
}).listen(8080);

