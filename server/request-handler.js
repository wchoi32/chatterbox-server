/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var url = require('url');
var messageArray = [];
var headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'application/json'
};
var objectIDcount = 1;

var requestHandler = function(request, response) {
  var route = url.parse(request.url).pathname;
  if (route !== '/classes/messages') {
    response.writeHead(404, headers);
    response.end('u messed up');
  }
  

  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  // The outgoing status.
  var statusCode = 200;


  // See the note below about CORS headers.


  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.

  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.
  var body = '';
  if (request.method === 'POST') {
    request.on('data', (postdata) =>{
      body += postdata;
    });
    request.on('end', () => {
      if (body) {
        console.log(body);
        var messageData = JSON.parse(body);
        if (messageData.message === undefined || messageData.username === undefined) {
          response.writeHead(404, headers);
          response.end('u messed up');
          return;
        }
        messageData.objectId = ++objectIDcount;
        messageArray.push(messageData);
        response.writeHead(201, headers);
        response.end(JSON.stringify(messageData));
      }
    });
    // request.on('data', (data) => somehting
    
    // data needs to be stringified to be a string
    //and then json parsed to be a json object, and then you can add it.)
    //
    //

    return;
  } 
  if (request.method === 'GET') { 
    response.writeHead(200, headers);
    var jsonObj = JSON.stringify({
      results: messageArray
    });
    response.end(jsonObj);
    return;
  }
  if (request.method === 'OPTIONS') {
    response.writeHead(201, null);
    response.end('option work');
    return; 
  }
  
  response.writeHead(404, headers);
  response.end('404 all else');
  return;
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.

// exports.defaultCorsHeaders = defaultCorsHeaders;
exports.requestHandler = requestHandler;

