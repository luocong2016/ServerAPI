/**
 * Created by Lutz on 2017/9/20.
 */

const CURRENT = 1;
const SIZE = 10;


const IntFunc = (str) => {
    if(isNaN(parseInt(str))){
        return false;
    }else{
        return parseInt(str)
    }
}


module.exports = {
    SIZE,
    CURRENT,
    IntFunc,
}