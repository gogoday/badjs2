
var mysql = require('mysql'),
    StatisticsService = require('../service/StatisticsService'),
    orm = require('orm');
var id = process.argv[2];
console.log(id);

GLOBAL.pjconfig = require('../project.json');
//GLOBAL.DEBUG = true;
var mysqlUrl = GLOBAL.pjconfig.mysql.url

orm.connect( mysqlUrl, function(err , db) {
    if(err){
        throw err;
    }

    global.models = {
        userDao : require('../dao/UserDao')(db),
        applyDao : require('../dao/ApplyDao')(db),
        approveDao : require('../dao/ApproveDao')(db),
        statisticsDao : require('../dao/StatisticsDao')(db),
        db : db
    }


    var aa = new StatisticsService();


    var startDate = new Date('2017-07-29 00:00:00');
    var nowDate = new Date;

    //fetch data until today
    var fetch = function (id , startDate){
        aa.fetchAndSave(id , startDate , function (){
            console.log(startDate.toLocaleDateString() + " ok ");
            if((startDate -0) > (nowDate - 0) ){
                console.log("out today");
                return ;
            }
            // fetch(id , new Date(startDate.getFullYear() + "-" + (startDate.getMonth()+1)+"-"+ (startDate.getDate()+1)+" 00:00:00"));

        })
    }


    for(var i=28; i<40; i++) {

    fetch(i , startDate);
    }


});



