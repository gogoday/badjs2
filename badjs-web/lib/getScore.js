
var handleScore = function (pv, e_pv) {
    
    // 算分
    var e_rate = e_pv / pv;
    var score;
    if (e_rate <= 0.005) {
        score = 100;
    } else if (e_rate < 0.1 && e_rate > 0.005) {
        score = 100 - 10 * 100 * e_rate;
    } else {
        score = 0;
    }

    return score.toFixed(2);

}
module.exports = {
    handleScore: handleScore
}
