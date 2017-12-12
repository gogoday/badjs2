/* global global, global, module, __dirname, Buffer */
/**
 * Created by kaelyang on 2015/5/19.
 */
var fs = require("fs");
var http = require('http');
var path = require("path");

var _ = require('underscore');
var logger = require('log4js').getLogger();
var UserService = require('./UserService');
var dateFormat = require("../utils/dateFormat");
var exporting = require('node-highcharts-exporting-v2');
var StatisticsService = require('./StatisticsService');
var scoreLib = require('../lib/getScore.js');
var sendEmail = require("../utils/" + global.pjconfig.email.module);

var DAY_LENGTH = 30;

var EmailService = function() {
    this.userService = new UserService();
    this.statisticsService = new StatisticsService();
    this.top = parseInt(global.pjconfig.email.top, 10) || 20;
    this.from = global.pjconfig.email.from || "x@x.com";
    this.homepage = global.pjconfig.email.homepage;
    this.host = global.pjconfig.host;
};

var getYesterday = function() {
    var date = new Date();
    date.setDate(date.getDate() - 1);
    date.setHours(0, 0, 0, 0);
    return date;
};

var setChartX = function(number) {
    var days = [];
    var nowDay = new Date() - 0;

    for (var i = number; i > 0; i--) {
        var day = nowDay - i * 1000 * 60 * 60 * 24;
        days.push(dateFormat(new Date(day), 'MM-dd'));
    }
    return days;
};

var getImageData = function(name, data) {

    var totalArray = [];
    var categories = setChartX(DAY_LENGTH);

    for (var i = 0; i < DAY_LENGTH; i++) {
        totalArray.push(0);
    }

    function whichDayIndex(day1) {
        for (var i = 0, len = categories.length; i < len; i++) {
            if (day1 == categories[i]) {
                return i;
            }
        }
        return false;
    }

    _.forEach(data, function(value, key) {
        var index = whichDayIndex(dateFormat(new Date(value.startDate), 'MM-dd'));
        totalArray[index] = value.total;
    });

    return {
        data: {
            width: 800,
            title: {
                text: "The last " + DAY_LENGTH + " days line charts"
            },
            xAxis: {
                categories: categories
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Total'
                }
            },
            series: [{
                data: totalArray,
                name: 'badjs count' 
            }]
        }
    };
};

var encodeHtml = function(str) {
    return (str + '').replace(/&/g, '&amp;')
	.replace(/</g, '&lt;').replace(/>/g, '&gt;')
	.replace(/\x60/g, '&#96;').replace(/\x27/g, '&#39;')
	.replace(/\x22/g, '&quot;').replace(/@/g, '<br/>@');
};

EmailService.prototype = {
    render: function(data, imagePath) {
        var that = this;
        data = data || {};
        var html = [];
        html.push('<html>');
        html.push('<h3>【BadJS日报邮件】 ' + data.title + '</h3>');
        that.homepage &&
            html.push('<p style="font-size:12px"><a href="{{homepage}}">日志查看点这: {{homepage}}</a></p>'
                .replace(/{{homepage}}/g, that.homepage));
        var content = data.content;
        if (content && content.length) {

            if (imagePath) {
                html.push('<h4>最近' + DAY_LENGTH + '天图表统计</h4>');
                html.push('<p><img src="cid:' + data.cid1 + '"></p>');
            }

            var total_top = 0;
            var index = 0;
            content.forEach(function(v) {
                v = typeof v === 'object' ? v : null;
                if (v) {
                    total_top += v.total;
                }
            });

            var total = data.total;
	    var viewPv = 0, score = 0;
	    if (data.pvData && data.pvData.length > 0) {
		viewPv = data.pvData[0].pv;
		score = scoreLib.handleScore(viewPv, total || 0);
	    }
            total > 0 && html.push('<p style="border-top:1px solid #666;margin-top:20px;padding:5px 0 0 10px">错误PV： {{total}} , Top {{top}} 占 {{per}}。访问PV：{{viewPv}}，<span style="color:red;">质量评分：{{score}}</span></p>'
                .replace(/{{total}}/g, total)
                .replace(/{{top}}/g, that.top)
                .replace(/{{per}}/g, (total_top * 100 / total).toFixed(2) + '%')
		.replace(/{{viewPv}}/g, viewPv)
		.replace(/{{score}}/g, score)
            );

	    html.push('<p>注：badjs得分规则</p> <p>（1）当报错率 <= 0.5%： badjs得分=100</p> <p>（2）当 0.5%< 报错率 < 10%：badjs得分： 100 - 10 * 报错率</p> <p>（3）当报错率 >= 10%： badjs得分=0</p>');

	    // 质量趋势图

            html.push('<table style="border-collapse:collapse;;width:95%"><tr style="background-color:#188eee;text-align:left;color:#fff"><th style="padding:2px 0 2px 10px;border:1px solid #dedede;width:60px">#</th><th style="padding:2px 0 2px 10px;border:1px solid #dedede;;width:120px">出现次数</th><th style="padding:2px 0 2px 10px;border:1px solid #dedede">错误内容</th></tr>');
            content.forEach(function(v) {
                v = typeof v === 'object' ? v : null;
                if (v) {
                    html.push('<tr style="background-color:{{bgc}}"><td style="padding:2px 0 2px 10px;border:1px solid #dedede">{{index}}</td><td style="padding:2px 0 2px 10px;border:1px solid #dedede">{{times}}</td><td style="padding:2px 0 2px 10px;border:1px solid #dedede">{{desc}}</td></tr>'
                        .replace(/{{index}}/g, index + 1)
                        .replace(/{{times}}/g, v.total)
                        .replace(/{{desc}}/g, encodeHtml(v.title))
                        .replace(/{{bgc}}/g, index % 2 ? '#fff' : '#eee')
                    );
                    total_top += v.total;
                    ++index;
                }
            });
            html.push('</table><br/><br/>');
        } else {
            html.push('<p style="border-top:1px solid #666;margin-top:20px;width:520px;padding:5px 0 0 10px">暂无数据</p>');
        }

        html.push('</html>');
        return html.join('');
    },
    queryAll: function(isRetry, sendObject) {
        var that = this;
        that.date = getYesterday();
        logger.info('Send mail query all start');
        that.userService.queryListByCondition({
            applyId: -1,
            role: -1
        }, function(err, userlist) {
            if (err) {
                return logger.error('Send email userService queryListByCondition error');
            } else {
                var orderByApplyId = {};
                userlist.forEach(function(v) {
                    // 兼容没有登陆过的用户，自动拼接 邮箱后缀
                    if (!v.email) {
                        v.email = v.loginName + global.pjconfig.email.emailSuffix;
                    }
                    if (orderByApplyId[v.applyId]) {
                        orderByApplyId[v.applyId].push(v);
                    } else {
                        orderByApplyId[v.applyId] = [v];
                    }
                });
                var count = 0 ;
                for (var applyId in orderByApplyId) {
                    (function(users, applyId) {
                        var to_list = []; // 收件方
                        var cc_list = []; // 抄送方
                        var name = '';
                        users.forEach(function(v) {
                            v.role === 0 ? cc_list.push(v.email) : to_list.push(v.email);
                            name = v.name;
                        }); // jshint ignore:line

                        // 测试代码
                        if (sendObject) {
                            if (sendObject.sendId && sendObject.sendId != applyId) {
                                return;
                            }
                            if (sendObject.sendToList.length) {
                                to_list = sendObject.sendToList;
                            }
                            cc_list = [];
                        }
                        that.statisticsService.queryById({
                            top: that.top,
                            projectId: applyId,
                            startDate: that.date
                        }, function(err, data) {
                            if (err) return logger.error('Send email statisticsService queryById error ' + applyId);
                            if (data && data.length > 0) {
                                that.statisticsService.queryByChart({
                                    projectId: applyId,
                                    timeScope: 2
                                }, function(err, chartData) {
                                    if (err || chartData.data.length <= 0) {
                                        that.sendEmail({
                                            to: to_list,
                                            cc: cc_list,
                                            title: name
                                        }, data[0], applyId);
                                    } else {
                                        count ++ ;
                                        setTimeout(function (){
                                            exporting(getImageData(name, chartData.data), function(err, image) {
                                                if (err) {
                                                    logger.info("generate image error " + err.toString() + ", id =" + applyId);
                                                    that.sendEmail({
                                                        to: to_list,
                                                        cc: cc_list,
                                                        title: name
                                                    }, data[0], applyId);
                                                } else {
                                                    var imagePath = "static/img/tmp/" + (new Date - 0 + applyId) + ".png";
                                                    fs.writeFile(path.join(__dirname, "..", imagePath), new Buffer(image, 'base64'), function() {
							that.sendEmail({
							    to: to_list,
							    cc: cc_list,
							    title: name,
							    imagePath: imagePath
							}, data[0], applyId);
                                                    });
                                                }
                                            });
                                        }, 1000 * count)
                                    }
                                });
                            } else {
                                logger.error('Send email data format error by ' + applyId );
                            }
                        }); // jshint ignore:line
                    })(orderByApplyId[applyId], applyId); // jshint ignore:line
                }
            }
        });
        // if( isRetry === undefined ? true : !!isRetry) {
        setTimeout(function() {
            that.queryAll();
        }, 86400000);
        // }
    },
    sendEmail: function(emails, data, badjsid) {
        var that = this;
        var title = "【BadJS 日报 " + dateFormat(this.date, "yyyy-MM-dd") + "】- " + emails.title;
        data.title = emails.title;
        var pvParam = {
            badjsid: badjsid,
            date: dateFormat(this.date,  "yyyyMMdd")
        }
        this.statisticsService.getPvById(pvParam, function (err, pvdata) {
            data.pvData = pvdata; 
            data.cid1 = '000' + parseInt(Math.random() * 1000);
            var content = that.render(data, emails.imagePath);

            var attachments = [{
                filename: data.cid1 + '01.png',
            path: that.host + emails.imagePath,
            cid: data.cid1
            }]
            sendEmail(this.from, emails.to, emails.cc, title, content, attachments);
        })
    },
    start: function() {
        var that = this;
        var date = new Date();
        date.setDate(date.getDate() + 1);
        var time = global.pjconfig.email.time.toString().split(':');
        date.setHours(parseInt(time[0], 10) || 9, parseInt(time[1], 10) || 0, parseInt(time[2], 10) || 0, 0);
        var timeDiff = date.valueOf() - (new Date()).valueOf();
        setTimeout(function() {
            that.queryAll();
        }, timeDiff);
        logger.info('Email service will start after: ' + timeDiff);
    }
};

module.exports = EmailService;
