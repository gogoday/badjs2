/**
 * @info 用户列表js
 * @author coverguo
 * */


require("jquery/jquery.datetimepicker");
var Dialog = require("dialog/dialog");
var statisticsTpl = require("./template/statistics.ejs");
var scoreLib = require('getScore')

var encodeHtml = function (str) {
    return (str + '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\x60/g, '&#96;').replace(/\x27/g, '&#39;').replace(/\x22/g, '&quot;');
};


    var statistics = {
        init : function (){

            var maxDate = 60*60*1000*24 *1;

            $(".datetimepicker").datetimepicker({format: 'YYYY-MM-DD'}).data("DateTimePicker").setMaxDate(new Date());

            $('#startTime').data("DateTimePicker").setDate( new Date(new Date() - maxDate));

            this.bindEvent();

        },
        bindEvent : function (){
            $('#showLogs').bind("click" , function(e){
                var projectId = $("#select-business").val();

                if(isNaN(projectId) || projectId<0){
                    Dialog({
                        header: '警告',
                        body: '请选择一个项目'
                    })
                    return ;
                }

                $.getJSON("/controller/statisticsAction/queryById.do" , {projectId : projectId , startDate : new Date($('#startTime').val() + " 00:00:00") - 0} , function (data){
                        $('#table-content').html(statisticsTpl({it : data,  opt : {encodeHtml : encodeHtml }}));
                    if(  data && data.data[0] ){
                        $('#error-count').html(data.data[0].total || 0 );
                    }
                });

                $.getJSON("/controller/statisticsAction/getRate.do" , {badjsid: projectId , date: $('#startTime').val()} , function (data){
                    // console.log(data)
                   var pv, rate;
                    if (data.length>0) {
                        pv = data[0].pv;
                        rate = data[0].rate;
                        $('#score').html(scoreLib.handleScore(pv, data[0].badjscount));
                        $('#pre-view').html(pv);

                    }
                });
            });
        }

    }

module.exports = statistics;
