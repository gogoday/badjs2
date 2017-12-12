var moment = require('moment');

const orm = require('orm');

var pv = {}, pvlist = [], badjsid;

var mysqlUrl  = 'mysql://root:root@localhost:3306/badjs';

var getYesterday = function() {
    var date = new Date();
    date.setDate(date.getDate() - 1);
    date.setHours(0, 0, 0, 0);
    return date;
};

var getYesterdayForPv = function() {
    var y = getYesterday();
    return moment(y.getTime()).format('YYYYMMDD');
};


var mysqlUrl  = 'mysql://root:root@localhost:3306/badjs';

var mdb = orm.connect(mysqlUrl, function(err, db){

    var pv = db.define("b_pv", {
        id          : Number,
        badjsid          : Number,
        pv          : Number,
        date          : Number
    });

    var param = {
        
        date: getYesterdayForPv()
    }
    console.log(param)

    pv.find(param, function(err, items) {
        if (!err) {
            console.log('ok')

            console.log(JSON.stringify(items))

            // 插入score
            createScore(db, items);
        } else {
            console.log(err);
        }
    })

})

// pvlist pv的元数据
function createScore(db, pvlist) {

    var Statistics = db.define('b_statistics',  {
        id: Number,
        projectId: Number, 
        startDate : Date,
        endDate : Date,
        content: String,
        total : Number
    });

    var param = {
        startDate: getYesterday()
    };

    console.log(param);

    Statistics.find(param, (err, data) => {

	    var scoreList = [];

        if (err) {
            console.log('error')
            console.log(err)
        } else {

 //           console.log(data[0].startDate)
  //          return;
        // data 所有的项目
            data.forEach(item => {

                var proId  = item.projectId,
                badjsTotal = item.total,
                pv = 0, score = 0;

                pvlist.forEach(item => {
                    if (item.badjsid == proId) {
                        
                        pv = item.pv;
                    }
                })
                console.log(pv)
                //score = scoreLib.handleScore(pv, badjsTotal)
                console.log(`badjsid: ${proId}, badjsTotal: ${badjsTotal}, pv: ${pv}, date: ${getYesterdayForPv()}`)

                if (pv > 0) {
                    score = ((badjsTotal / pv) * 100).toFixed(5);
                } 

                scoreList.push({
                    badjsid: proId,
                    rate: score,
                    pv: pv,
                    badjscount: badjsTotal,
                    date: getYesterdayForPv() 
                });
            })


            console.log(scoreList);

            var Quality = db.define('b_quality',  {
                id: Number,
                badjsid: Number, 
                rate: String,
                pv: Number,
                badjscount: Number,
                date : Number
            });

            Quality.create(scoreList, function(err, data) {
                mdb.close();
                if (!err) {
                    console.log('ok')


                } else {
                    console.log(err);
                }
            })

            
        }

    })


}



