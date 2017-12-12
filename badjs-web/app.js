var workflow = require('./workflow.config.json'),
    _ = require("underscore");


var workflowPath = workflow.path;

global.apiPath = __dirname + '/service/apis/ApiService.js';

if(!workflowPath){
    workflowPath = "./"
}

if(!workflow.workflow){
    return ;
}

_.each(workflow.workflow , function (value , key){
    require(workflowPath +"/"+ value)();

})



