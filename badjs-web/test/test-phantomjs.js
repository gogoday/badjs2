


var path = require('path')
var childProcess = require('child_process')
var phantomjs = require('/data/badjs/badjs-installer/badjs-web/node_modules/node-highcharts-exporting/node_modules/phantomjs-prebuilt')
var binPath = phantomjs.path

console.log(binPath)
 
var childArgs = [
  path.join(__dirname, 'phantomjs-script.js'),
    '1', '2'
]
     
childProcess.execFile(binPath, childArgs, function(err, stdout, stderr) {
    // handle results 
    console.log(err)
    console.log(stdout)
    console.log(stderr)
})





