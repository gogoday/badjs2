
/**
 *  @info: userDao
 *  @author: coverGuo
 *  @date: 2014-12-30
 */

module.exports  = function (db){
    var pv = db.define("b_pv", {
        id          : Number,
        badjsid          : Number,
        pv          : Number,
        date          : Number
    });

    return pv;
}
