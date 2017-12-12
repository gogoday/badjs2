'use strict';
const Promise = require('bluebird');

const userService = require('../UserService.js'),
    crypto = require('crypto'),
    logger = require('log4js').getLogger(),
    ApplyService = require('../ApplyService.js');
function _getUserByName(name) {

    const db = global.models.db;

    return new Promise((resolve, reject) => {

        if (!/^\w+$/.test(name)) {
            reject('name error.');
            return;
        }

        let sql = `select id, loginName, chineseName, role, email from b_user where loginName='${name}'`,
            userObj;

        db.driver.execQuery(sql, (err, data) => {

            if (err) {
                logger.error(err);
                reject(err)
            } else {
                if (data.length > 0) {
                    userObj = data[0];
                    resolve({
                        userId: userObj.id,
                        name: userObj.loginName,
                        role: userObj.role,
                        email: userObj.email
                    });
                } else {
                    reject({retcode: 1, msg: 'user not found'});

                }
            }
        })
    })
}



/**
 * 获取用户资料
 * @param {string} name 用户名
 *
 * @returns {Promise} userObj 用户对象 
 */
function getUser(name) {

    return _getUserByName(name);

}

function _addApply(apply) {

    return new Promise((resolve, reject) => {

        new ApplyService().add(apply, (err, item) => {

            if (err) {

                reject({retcode: 1, msg: err});
            }else {
                resolve({retcode: 0, badjsId: item.applyId});
            }

        })
    })
}


/**
 * 自动注册项目 
 * @param {object} applyObj  { applyObj.applyName 项目名称 ,  applyObj.url 项目url }
 *
 * @returns {promise} obj { obj.retcode 返回码 ,  obj.badjsId badjs id }
 *
 */
function registApply(applyObj) {

    if (!applyObj.applyName || !applyObj.url) {
        return Promise.reject({retcode: 2, msg: 'params error. '});
    }

    var apply = {
        userName : applyObj.userName,
        status : 0,
        name : applyObj.applyName,
        appkey : crypto.createHash("md5").update(new Date - 0 + "badjsappkey" + applyObj.userName).digest('hex'),
        url: applyObj.url,
        blacklist: applyObj.blacklist || '{"ip":[],"ua":[]}',
        description: applyObj.description,
        mail: '',
        createTime : new Date(),
        passTime: new Date(),
    }

    return getUser(apply.userName).then(data => {
        apply.user = {id: data.userId};
        return _addApply(apply);
    }).catch(e => {
        return e;
    })



}

module.exports = {
    getUser,
    registApply
}
