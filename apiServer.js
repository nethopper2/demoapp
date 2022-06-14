// the purpose of this file is to provide a nodeJS api server
// it has two purposes:
// (1) To update ENV variables to give to VUE app
// (2) respond to get requests to /api with MYCLUSTERNAME and MYBACKENDCLUSTERNAME
// (3) request MYCLUSTERNAME and MYBACKENDCLUSTERNAME from backend:8080/api
const http = require('http')
const url = require('url')
const request = require('request')

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// (1) Update ENV to give to VUE app
async function updateENV () {
  process.env.VUE_APP_MYCLUSTERNAME = process.env.MYCLUSTERNAME
  json = JSON .stringify({"myClusterName":process.env.VUE_APP_MYCLUSTERNAME,"backendClusterName":process.env.VUE_APP_MYBACKENDCLUSTERNAME})
  return json
  // console.log('process.env', process.env)
}

// (2) respond to get requests to /api with MYCLUSTERNAME and MYBACKENDCLUSTERNAME
var path = require('path');
var fs = require('fs');

var dir = path.join(__dirname, 'public');
var mime = {
  html: 'text/html',
  txt: 'text/plain',
  css: 'text/css',
  gif: 'image/gif',
  jpg: 'image/jpeg',
  png: 'image/png',
  svg: 'image/svg+xml',
  js: 'application/javascript'
};

var server = http.createServer(function (req, res) {
  var reqpath = req.url.toString().split('?')[0];
  // console.log('reqpath', reqpath)
  if (req.method !== 'GET') {
      res.statusCode = 501;
      res.setHeader('Content-Type', 'text/plain');
      return res.end('Method not implemented');
  }
  if (reqpath == '/api') {
    // console.log('/api request')
    const json = JSON.stringify({
      myClusterName: process.env.VUE_APP_MYCLUSTERNAME,
      backendClusterName: process.env.VUE_APP_MYBACKENDCLUSTERNAME
    })
    res.writeHead(200, {"Content-Type": "application/json"});
    return res.end(json);
  }
  var file = path.join(dir, reqpath.replace(/\/$/, '/index.html'));
  if (file.indexOf(dir + path.sep) !== 0) {
      res.statusCode = 403;
      res.setHeader('Content-Type', 'text/plain');
      return res.end('Forbidden');
  }
  var type = mime[path.extname(file).slice(1)] || 'text/plain';
  var s = fs.createReadStream(file);
  s.on('open', function () {
      res.setHeader('Content-Type', type);
      s.pipe(res);
  });
  s.on('error', function () {
      res.setHeader('Content-Type', 'text/plain');
      res.statusCode = 404;
      res.end('Not found');
  });
});

const { Server } = require("socket.io");
const io = new Server(server);

server.listen(8080, function () {
  console.log('Listening on http://localhost:8080/');
});

startLoop(io)

// (3) request MYCLUSTERNAME and MYBACKENDCLUSTERNAME from backend:8080/api
async function getBackendAPI () {
  request('http://backend:8080/api', function (error, response, body) {
    // console.error('error:', error) // Print the error if one occurred
    // console.log('statusCode:', response && response.statusCode) // Print the response status code if a response was received
    // console.log('body:', body); // Print the HTML for the Google homepage.
    if (error) {
      // cannot reach backend
      process.env.VUE_APP_MYBACKENDCLUSTERNAME = 'undefined'
      return
    } else {
      bodyObj = JSON.parse(body)
      // console.log("bodyObj", bodyObj)
      if (response.statusCode == 200 && bodyObj.myClusterName != "undefined") {
        process.env.VUE_APP_MYBACKENDCLUSTERNAME = bodyObj.myClusterName
        // console.log(process.env)
      } else {
        process.env.VUE_APP_MYBACKENDCLUSTERNAME = "undefined"
      }
      return
    }
  })
}

async function startLoop (io) {
  // eslint-disable-next-line no-constant-condition
  let oldEnv = {}
  while (true) {
  // console.log("this is from outside the vue app")
    await getBackendAPI ()
    const env = await updateENV()
    if (env != oldEnv) {
      console.log("environment updated ", JSON.stringify(env))
      oldEnv = env
    }
    io.emit('env', env);
    // console.log('a user connected');
    await sleep(1000)
  }
}