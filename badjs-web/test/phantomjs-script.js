//
//
//
var page = require('webpage').create();
page.open('https://www.baidu.com', function () {
    page.render('example.png');
    phantom.exit();
});
console.log(123)
