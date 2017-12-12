

var log4js = require('log4js'),
     logger = log4js.getLogger();
 
 var path = require("path");
 
 var orm = require('orm');
 
 global.pjconfig = require(path.join(__dirname , ".." , 'project.json'));

 var msqlUrl = global.pjconfig.mysql.url;
 
 
 logger.info('connect mysql: ' + msqlUrl);
 
        var EmailService = require("../service/EmailService.js");
 
 orm.connect(msqlUrl, function (err, db) {
 
 var models = {};
     db.use(require("orm-transaction"));
     models.userDao = require('../dao/UserDao')(db);
     models.applyDao = require('../dao/ApplyDao')(db);
     models.approveDao = require('../dao/ApproveDao')(db);
     models.userApplyDao = require('../dao/UserApplyDao')(db);
     models.statisticsDao = require('../dao/StatisticsDao')(db);
     models.pvDao = require('../dao/PvDao')(db);
     models.db = db;
 
     global.models = models;
     logger.info('mysql connected');
     
     // new email().queryAll();
 
        console.log('start email report ...');
        new EmailService().start();
 });


