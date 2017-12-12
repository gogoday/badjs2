//
//
//

var log4js = require('log4js'),
     logger = log4js.getLogger();
 
 var path = require("path");
 
 var orm = require('orm');
 
 global.pjconfig = require(path.join(__dirname , ".." , 'project.json'));

 var msqlUrl = global.pjconfig.mysql.url;
 
 
 logger.info('connect mysql: ' + msqlUrl);
 
 var EmailService = require("../service/EmailService_test.js");
 
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
     

        var apply = params;
        apply.userName = params.user.loginName;

        var applyService = new ApplyService();
        if (apply.id) {
            applyService.update(apply, function(err, items) {
                if (isError(res, err)) {
                    return;
                }
                res.json({
                    ret: 0,
                    msg: "success-add"
                });
            });
        } else {
            apply.status = 0;
            apply.createTime = new Date();
            apply.appkey = crypto.createHash("md5").update(new Date - 0 + "badjsappkey" + params.user.loginName).digest('hex');

        var self = this;
        var userId = target.user.id;

        models.applyDao.create(target, function(err, newApply) {
            if (err) {
	        console.log('inser apply error')
                return;
            }
            logger.debug("Insert into b_apply success! target1: " + newApply.id);
            //创建项目的即为管理员 故role ==1
            var userApply = {
                userId: userId,
                applyId: newApply.id,
                role: 1,
                createTime: new Date()
            };
            self.userApplyDao.create(userApply, function(err, items) {
                if (err) {
		    console.log('insert into user apply error')
                    return;
                }

		console.log('suc')
            })

        });
 });


