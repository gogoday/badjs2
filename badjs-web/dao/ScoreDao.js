
/**
 *  @info: userDao
 *  @author: coverGuo
 *  @date: 2014-12-30
 */

module.exports  = function (db){

    var score = db.define("b_score", {
        id          : Number,
        badjsid          : Number,
        score          : Number,
        date          : Number
    });

    return score;
}
