/*
 * Primary file for Homework Assignment #1
 * Pirple
 */

// Dependencies
var http = require('http');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;

// Configure the server to respond to all requests with a string
var server = http.createServer(function(req,res){
  // Parse the url
  var parsedUrl = url.parse(req.url, true);

  // Get the path
  var path = parsedUrl.pathname;
  var trimmedPath = path.replace(/^\/+|\/+$/g,'');

  // Get the query string as an object
  var queryStringObject = parsedUrl.query;

  // Get the HTTP method
  var method = req.method.toLowerCase();

  //Get the headers as an object
  var headers = req.headers;

  // Get the payload,if any
  var decoder = new StringDecoder('utf-8');
  var buffer = '';
  req.on('data', function(data) {
     buffer += decoder.write(data);
  });

  // Send the response
  req.on('end',function(){
      buffer += decoder.end();
      // Choose a handler from path
      var chosenPath = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

      // Data object to send to handlers
      var data = {
        'trimmedPath' : trimmedPath,
        'queryStringObject' : queryStringObject,
        'method' : method,
        'headers' : headers,
        'payload' : buffer
      };

      chosenPath(data,function(statusCode,payload){
          // Define default statusCode
          statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

          // Define default payload
          payload = typeof(payload) == 'object' ? payload : {};

          // Convert payload to string
          payloadString = JSON.stringify(payload);

          // Return the response
          res.writeHead(statusCode);
          res.end(payloadString+"\n");

          // Log the request/response
          console.log('Returning this response: ',statusCode,payloadString);
      });
  });


});

// Start the server
server.listen(5000,function(){
 console.log('The server is up and running now');
});

// Create the handlers object
var handlers = {};

// Hello handler
handlers.hello = function(data,callback){
  // Callback an https status code and a payload object
  ret = data.method !== 'post' ? {} : {'message' : 'Welcome!'};
  callback(200,ret);
};

// Not found handler
handlers.notFound = function(data,callback){
  // Callback an http status code
  callback(404);
};

// Create the request router object
var router = {
  'hello' : handlers.hello
};
