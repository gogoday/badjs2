var  log4js = require('log4js'),
    logger = log4js.getLogger();

var path = require("path");



var argv = process.argv.slice();
if(argv.indexOf('--debug') >= 0){
    logger.setLevel('DEBUG');
    global.DEBUG = true;
    logger.info('running in debug');

}else {
    logger.setLevel('INFO');
}

if(argv.indexOf('--project') >= 0){
    global.pjconfig =  require(path.join(__dirname , ".." , '/project.debug.json'));
}else {
    global.pjconfig = require(path.join(__dirname , ".." , 'project.json'));
}


module.exports = function (){

}

