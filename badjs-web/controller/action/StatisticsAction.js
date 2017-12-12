/**
 * Created by chriscai on 2015/1/15.
 */
var BusinessService = require('../../service/BusinessService'),
    _ = require('underscore'),
    StatisticsService = require('../../service/StatisticsService');

var log4js = require('log4js'),
    logger = log4js.getLogger();

var StatisticsAction = {


    index: function(param, req, res) {
        var params = req.query,
            user = req.session.user;

        var businessService = new BusinessService();

        businessService.findBusinessByUser(user.loginName, function(err, item) {
            res.render(param.tpl, {
                layout: false,
                user: user,
                index: 'statistics',
                statisticsTitle: param.statisticsTitle,
                items: item
            });
        });
    },
    getRate: function(param, req, res) {
          var db = global.models.db,
          date = param.date.replace(/\D/g, '');
          db.driver.execQuery('select * from b_quality where date=' + date + ' and badjsid=' + param.badjsid + ';', (err, data) => {
              res.json(data);
          })
    },
    projectTotal: function(param, req, res) {
        var params = req.query,
            user = req.session.user;

        var businessService = new BusinessService();

        businessService.findBusiness(function(err, items) {
            res.render(param.tpl, {
                layout: false,
                user: user,
                index: 'projectTotal',
                statisticsTitle: param.statisticsTitle,
                items: items
            });
        });

    },
    queryByChart: function(param, req, res) {
        var statisticsService = new StatisticsService();
        if (!param.projectId || isNaN(param.projectId) || !param.timeScope) {
            res.json({
                ret: 0,
                msg: 'success',
                data: {}
            });
            return;
        }
        statisticsService.queryByChart({
            userName: param.user.loginName,
            projectId: param.projectId - 0,
            timeScope: param.timeScope - 0
        }, function(err, data) {
            if (err) {
                res.json({
                    ret: -1,
                    msg: "error"
                });
                return;
            }
            res.json(data);
        });
    },
    queryByChartForAdmin: function(param, req, res) {
        var statisticsService = new StatisticsService();
        if (!param.projectId || isNaN(param.projectId) || !param.timeScope || param.user.role != 1) {
            res.json({
                ret: 0,
                msg: 'success',
                data: {}
            });
            return;
        }

        statisticsService.queryByChart({
            projectId: param.projectId - 0,
            timeScope: param.timeScope - 0
        }, function(err, data) {
            if (err) {
                res.json({
                    ret: -1,
                    msg: "error"
                });
                return;
            }
            res.json(data);
            return;
        });
    },
    queryById: function(param, req, res) {
        var statisticsService = new StatisticsService();
        if (!req.query.projectId || isNaN(req.query.projectId) || !req.query.startDate) {
            res.json({
                ret: 0,
                msg: 'query invalid！',
                data: {}
            });
            return;
        }
        //console.log(param);
        statisticsService.queryById({
            userName: param.user.loginName,
            projectId: req.query.projectId - 0,
            startDate: new Date(param.startDate - 0)
        }, function(err, data) {
            if (err) {
                res.json({
                    ret: -1,
                    msg: 'error',
                    data: {}
                });
            } else {
                res.json({
                    ret: 0,
                    msg: 'success',
                    data: data
                });
            }

        });
    },

    getpvbyid: function(param, req, res) {
        var statisticsService = new StatisticsService();
        statisticsService.getPvById({
            badjsid: req.query.badjsid,
            date: req.query.date
        }, function(err, data) {
            if (err) {
                res.json({
                    retcode: 2,
                    msg: err
                });
                    return;
            }
            res.json(data)
        })
    }
};

module.exports = StatisticsAction;
