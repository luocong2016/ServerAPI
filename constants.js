/**
 * Created by Lutz on 2017/9/20.
 */


/* constants */
const CURRENT = 1;
const SIZE = 10;

const UpperLimit = 5;
const UUID_MAX = 32;


/* function */
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

/*
    param:<string|number|boolean>
        str
    return:<boolean>
*/
const BoolFunc = (str) => {
    if(str != null && str != ''){
        return str
    }
    return false
}


/* modules */
const ListTemp = (data = [], pageSize = SIZE, pageCurrent = CURRENT, total = 0, status = true) => {
    return {
        status: true,
        data: {
            list: data,
            pageSize,
            total,
            current: pageCurrent,
        }
    }
}

/* message */
const message = {
    nonentity: 'Nonentity: ', // 不存在
    existence: 'Existence.',
    notNull: 'Not null: ',    // 不能为空
    unknownError: 'Unknown Error.', //未知错误
    successful: 'Successful operation.', //操作成功
    fail: 'Failed operation.' //操作失败
}

module.exports = {
    SIZE,
    CURRENT,
    UpperLimit,
    UUID_MAX,

    IntFunc,
    BoolFunc,

    ListTemp,

    message,
}