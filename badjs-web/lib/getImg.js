var path = require('path')

var Promise = require('bluebird')
var moment = require('moment');
var logger = require('log4js').getLogger();
var exporting = require('node-highcharts-exporting');
var fs = require('fs');

var dateKey = [];
 
// busId, key, value, tableName, valueName, path
module.exports = function(data, extParam) {

    var list = {}, _key;
    // data 是数据库表数据 元数据
    data.forEach(item => {
        var busKey = item[extParam.busId];

        if (!list[busKey]) {
            list[busKey] = [];
        }

        list[busKey].push(item);

        // 生成x轴
        _key = item[extParam.key]; 
        if (dateKey.indexOf(_key) < 0) {
            dateKey.push(_key - 0);
        }

    });

    dateKey.sort();
    
    console.log(dateKey);

    // list 保存了badjsid 和 业务数据的map
    for(var i in list) {
        //saveImg(list[i], i, extParam);
        handleImgData(list[i], i, extParam);

    }



    // 按平均分来倒序排名
    chartData = chartData.sort((a, b) => {

        var a_s = a.avg,
            b_s = b.avg;
        if (a_s > b_s) {
            return -1;
        } else if (a_s < b_s) {
            return 1;
        } else {
            return 0;
        }
    })
    // 每8个分割数组
    var result = [];
    for(var i=0,len=chartData.length;i<len;i+=extParam.perCount){
           result.push(chartData.slice(i,i+extParam.perCount));
    }

    console.log(JSON.stringify(result));

    // 循环数组生成合并图片
    result.forEach((item, index)  => {

        getImg(dateKey, item, extParam, index);
    })
    

    return result;


}

var chartData = [];
// items 是一个项目
function handleImgData(items, busId, extParam) {

    var xdata = [], _key, _score; 

    // 生成数据
    var _index;
    dateKey.forEach(item => {
        xdata.push(null);
    })
    
    items.forEach((item, index) => {

            // 判断当前这个值在x轴的哪个位置
        _key = item[extParam.key]; 
        _index = dateKey.indexOf(_key);


        _score = item[extParam.value] - 0;
        xdata[_index] = (_score > 10 ? 10 : _score);
    })

    var avg  = xdata.reduce((pre, cur) => cur += pre?pre:0) / items.length;

    chartData.push({
        data: xdata,
        avg,
        name: extParam.apply[busId]
    })
}

function getImg(xkey, data, extParam, index) {



    var _d = {
        data: {
            width: 800,
            title: {
                text: '最近30天质量评分趋势-' + (index + 1)
            },
            xAxis: {
                categories: xkey
            },
            yAxis: {
                max: 10,
                min: 0,
                title: {
                    text: '错误率(%)'
                }
            },
            series: data
        }
    };


    exporting(_d, (err, image)=> {
        if (err) {
            console.log(err);
        }
        var yestday = moment().subtract(1, 'day').format('YYYYMMDD');
        imgFullPath = [extParam.path, '/', yestday, '-',index, 'all.png'].join(''); 
        var _path = path.join(__dirname, "..", imgFullPath);
        console.log(_path);

        // console.log(image)
        fs.writeFile(_path, new Buffer(image, 'base64'), function() {

        })
    })
}



