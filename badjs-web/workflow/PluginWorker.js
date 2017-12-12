'use strict';

// 检测plugin文件夹
// 动态加载文件

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const logger = require('log4js').getLogger();
const pluginConfig = global.pjconfig.plugin;
logger.info('init plugin ...')

const apiType = ['route'];

// 插件的信息
// rout list 
let list = [];
// login hook
let login;

let plugins = [];
let enablePlugins = [];

// 通过配置文件得到启用的插件
enablePlugins = pluginConfig.filter(item => item.enable);

function getPlugin(name) {
    return 'badjs-plugin-' + name;
}

// 分别加载插件
enablePlugins.forEach(item => {

    const plugin = require(getPlugin(item.name));
    plugin.name = item;
    handlePlugin(plugin);
    logger.info('load plugin: ' + item.name);
})

function handlePlugin(plugin) {
    getRoutePluginInfo(plugin);
    getLoginPluginInfo(plugin);
}

function getRoutePluginInfo(plugin) {
    if (plugin.route) {

        plugin.route.forEach(item => {

            list.push({
                type: 'route',
                path: item.path,
                handle: item.handle
            });

        })


    }
}

function getLoginPluginInfo(plugin) {
    if (plugin.login) {

        login = plugin.login;
        
    }
}


function getList() {
    return list;
}

// 请求合法行校验
function checkReq (req, res, next) {

   var ffname = req.cookies._ffname,
       md5str = crypto.createHash("md5").update(req.query.applyName + req.query.userName + 'feflow').digest('hex');
   if (ffname == md5str) {
       next();
   } else {
       res.json({recode: 3, msg: 'ill request.'})
   }
}

// 路由服务调用
function registerRoute(app) {
    app.use('/plugin', checkReq);

    list.forEach(item => {
        if (item.type == 'route') {
            app.use('/plugin/' + item.path, item.handle);
            logger.info('plugin  registerRoute succ. path: ' + item.path);
        }
    })    
}


module.exports = {
   getList,
   registerRoute,
   login
}


