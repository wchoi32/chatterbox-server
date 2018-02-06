/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var messageArray = [{
  username: 'jeff',
  text: 'check it out'
}, {
  username: 'john',
  text: 'checking this out'
}];
var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

var requestHandler = function(request, response) {
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
  var headers = defaultCorsHeaders;

  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.
  headers['Content-Type'] = 'application/json';

  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.
  var body;
  if (request.method === 'POST') {
    request.on('data', (postdata) =>{
      var holderBuff = postdata.toString('utf8');
      var newHolder = holderBuff.replace(/=/gi, ':');
      var editHolder = newHolder.split('&');
      var obj = {username: editHolder[0].substr(9), text: editHolder[1].substr(5), roomname: editHolder[2].substr(9)};
      // var newHolder = holderBuff.replace(/=/gi, ': ');
      // body = newHolder.split('&');
      //body = holderBuff.split('&');
      // body += JSON.parse(JSON.stringify(obj));
      body = obj;
    });
    request.on('end', () => {
      try {
        // if (JSON.parse(body).type === 'Buffer') {
          // console.log('this is a buffer');
          // var holderBuff = body.toString('utf8');
          // console.log(holderBuff);
          
          
        // }
        messageArray.push(body);
      } catch (error) {
        response.writeHead(404, headers);
        return;
      }
    });
    // request.on('data', (data) => somehting
    
    // data needs to be stringified to be a string
    //and then json parsed to be a json object, and then you can add it.)
    //
    //
    console.log(headers);
    response.writeHead(204, headers);
    response.end();
    return;
  } 
  if (request.method === 'GET') { 
    //if (request.url === '/classes/messages') {
    response.writeHead(200, headers);
    var jsonObj = JSON.stringify({
      results: messageArray
    });
    response.end(jsonObj);
    return;
    //} 
  }
  if (request.method === 'OPTIONS') {
    response.writeHead(201, headers);
    response.end('option work');
    return; 
  }
  
  response.writeHead(404, headers);
  response.end('404 all else');
  return;
  
  
  // response.writeHead(statusCode, headers);
  // var testArr = ['result', 'another'];
  // var jsonObj = JSON.stringify({
  //   results: testArr
  // });

  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
  // response.end(jsonObj);
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

