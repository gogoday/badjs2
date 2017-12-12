'use strict';

const Promise = require('bluebird');

function getDao(daoName) {

}

exports.module = {
    getDao
}


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
