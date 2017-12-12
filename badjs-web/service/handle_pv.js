
const fs = require('fs');
const readline = require('readline');
const orm = require('orm');

console.log(process.argv);
var filePath = process.argv[2];
var date = process.argv[3]
var pv = {}, pvlist = [], badjsid;

var mysqlUrl  = 'mysql://root:root@localhost:3306/badjs';

var getYesterday = function() {
    var date = new Date();
    date.setDate(date.getDate() - 1);
    date.setHours(0, 0, 0, 0);
    return date;
};



const rs = fs.createReadStream(filePath, 'utf8');

const rl  = readline.createInterface({
    input: rs,
    output: null // process.stdout
});

rl.on('line', (input) => {
	var r  = /\/badjs\/(\d+)/g.exec(input);

	if (r) {
	    badjsid = r[1];
	    if (!pv[badjsid]) {
	        pv[badjsid] = 1;
	    } else {
	        pv[badjsid] += 1;
	    }
	}
})


rl.on('close', () => {
    console.log('文件读完了。')
    for(i in pv) {

	pvlist.push({
	    badjsid: i - 0,
	    pv: pv[i],
	    date: date -0
	})
    }


    console.log(pvlist);

    var mysqlUrl  = 'mysql://root:root@localhost:3306/badjs';

    var mdb = orm.connect(mysqlUrl, function(err, db){

		//createScore(db, pvlist);
		//return;
        var pv = db.define("b_pv", {
            id          : Number,
            badjsid          : Number,
            pv          : Number,
            date          : Number
        });


        pv.create(pvlist, function(err, items) {

            if (!err) {
                console.log('ok')

            } else {
                console.log(err);
            }

            mdb.close();
        })

    });
})


