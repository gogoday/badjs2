
var fs = require("fs");
var http = require('http');
var path = require("path");

var _ = require('underscore');
var logger = require('log4js').getLogger();
var exporting = require('node-highcharts-exporting');
var StatisticsService = require('../service/StatisticsService');

var DAY_LENGTH = 30;


 var orm = require('orm');
 
 global.pjconfig = require(path.join(__dirname , ".." , 'project.json'));

 var msqlUrl = global.pjconfig.mysql.url;
 
 
 logger.info('connect mysql: ' + msqlUrl);
 
 
 orm.connect(msqlUrl, function (err, db) {
 
 var models = {};
     db.use(require("orm-transaction"));
     models.userDao = require('../dao/UserDao')(db);
     models.applyDao = require('../dao/ApplyDao')(db);
     models.approveDao = require('../dao/ApproveDao')(db);
     models.userApplyDao = require('../dao/UserApplyDao')(db);
     models.statisticsDao = require('../dao/StatisticsDao')(db);
     models.pvDao = require('../dao/PvDao')(db);
    models.scoreDao = require('../dao/ScoreDao')(db);
     models.db = db;
 
     global.models = models;
     logger.info('mysql connected');
     
     // new email().queryAll();
      var statisticsService = new StatisticsService();
 
        console.log('start email report ...');
	statisticsService.queryScoreById({
             id: 2
	}, function(items) {
	var list = {}, xdata = [];
	    items.forEach((item, index) => {

		list[item.date] = item.score - 0;
		xdata.push(item.score - 0);
		})

	    var xkey = Object.keys(list);


    var _d = {
        data: {
            width: 800,
            title: {
                text: "The last 30 days line charts"
            },
            xAxis: {
                categories: xkey
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Total'
                }
            },
            series: [{
                data: xdata,
                name: 'badjs score'
            }]
        }
    };

    console.log(_d);

    exporting(_d, (err, image)=> {
	    console.log(err)
	    console.log(image);
	    })



	})

 });


