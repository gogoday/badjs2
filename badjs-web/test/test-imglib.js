var imgLib = require('../lib/getImg.js');
var pv = require('../service/handle_pv_2.js');
const orm = require('orm');


var extParam = {
    busId: 'badjsid',
    key: 'date',
    value: 'score',
    tableName: 'now直播录播页面',
    valueName: 'scoret',
    path: '/static/scoreimg/'
}

var data = [

    {
         badjsid: 1,
         date: 20170506,
         score: '90.11'
    },
    {
         badjsid: 1,
         date: 20170516,
         score: '91.11'
    },
    {
         badjsid: 2,
         date: 20170506,
         score: '92.11'
    },
    {
         badjsid: 2,
         date: 20170516,
         score: '95.11'
    },
]

    var mysqlUrl  = 'mysql://root:root@localhost:3306/badjs';

    orm.connect(mysqlUrl, function(err, db){

        var Score = db.define('b_score',  {
            id: Number,
            badjsid: Number, 
            score: String,
            date : Number
        });
        console.log(pv.getImg)
        pv.getImg(Score, db);
    })


// imgLib(data, extParam);
