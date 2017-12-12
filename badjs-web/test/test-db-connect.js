
var mysql = require('mysql');

var conn = mysql.createConnection({
    host     : '127.0.0.1',
    user     : 'root',
    password : '',
    database : 'badjs'

});

conn.connect(function(err ) {
    if(err){
        throw e;
    }

    console.log('good');
});

