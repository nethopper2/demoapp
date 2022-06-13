
const axios = require('axios').default;
const fs = require('fs');

var backendRequestStatus = 400
var backendResponse = undefined
var backendClusterName = undefined
var count = 0

console.log("version 1.0")

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function startLoop () {
// eslint-disable-next-line no-constant-condition
while (true) {
    count = count + 1
    // foundBackend = false
    // make api request to backend
    try {
      // const response = await fetch("http://backend:8080/api")
      const response = await axios({ method: "GET", "url": "http://backend:8080/api", headers: {}, timeout: 2000 })
      backendRequestStatus = await response.status
      // console.log('response', response)
      if (backendRequestStatus == 200) {
        // foundBackend = true
        backendResponse = await response.data
        // console.log('backendResponse', backendResponse)
        backendClusterName = backendResponse.myClusterName
        // console.log('backendClusterName', backendClusterName)
        writeToConfigFile(backendClusterName)
      } else {
        // foundBackend = false
      }
    }
    catch {
      // foundBackend = false
      backendClusterName = 'not found'
      writeToConfigFile(backendClusterName)
    }
    await sleep(1000)
  }
}

startLoop()

function writeToConfigFile (backendClusterName) {

  let json = { 
    myClusterName: process.env.MYCLUSTERNAME,
    backendClusterName: backendClusterName
  }
  process.env.VUE_APP_MYCLUSTERNAME = process.env.MYCLUSTERNAME
  process.env.VUE_APP_MYBACKENDCLUSTERNAME = backendClusterName
  // console.log('process.env', process.env)
   
  let data = JSON.stringify(json);
  fs.writeFileSync('config.json', data);
}


module.exports = {
  devServer: {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
    },
    disableHostCheck: true,
    before: function(app, server) {
      app.get('/api', function(req, res) {
        const result = {
          myClusterName: process.env.VUE_APP_MYCLUSTERNAME,
          backendClusterName: process.env.VUE_APP_MYBACKENDCLUSTERNAME
        }
        // const result = [{
        //   type: 'warning',
        //   icon: 'ti-server',
        //   title: 'Cases',
        //   value: this.items,
        //   footerText: 'Updated now',
        //   footerIcon: 'ti-reload'}];
        res.writeHead(200, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'});
        res.end(JSON.stringify(result));
        // const result = "This is the backend responding from cluster " + process.env.CLUSTERNAME + "\n"
        // res.writeHead(200, {'Content-Type': 'text'});
        // res.end(result);
      });
    }
  }
}