/**
 * Created by Lutz on 2017/9/20.
 */

const CURRENT = 1;
const SIZE = 10;

const UpperLimit = 5;
const UUID_MAX = 32;

/*
    param: <string|number>
        => parseInt(<number>)
    return:
        param >= 1 ? <number> : false
*/
const IntFunc = (str) => {
    if(!isNaN(parseInt(str)) && str >= 1){
        return parseInt(str)
    }
    return false
}


module.exports = {
    SIZE,
    CURRENT,
    UpperLimit,
    UUID_MAX,
    IntFunc,
}