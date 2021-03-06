/**
 * Created by Lutz on 2017/9/24 0024.
 */
const fs = require('fs');
const path = require('path');
const mime = require('mime');
const express = require('express');
const router = express.Router();

const { operation } = require('../db/mysqlOperation');

const { CURRENT, SIZE, UpperLimit, UUID_MAX, IntFunc, BoolFunc, message } = require('../constants')

router.post('/getNewsList', async function(req, res, next) {
    let response = { status: false }
    let sql = "SELECT *,DATE_FORMAT(createtime,'%Y-%m-%d %k:%i:%s') AS `createtime`,DATE_FORMAT(updatetime,'%Y-%m-%d %k:%i:%s') AS `updatetime` FROM `news`";
    let where = "";
    let order = " ORDER BY `createtime` DESC";
    let limit = " LIMIT ?,?";
    let dataArray = [];

    let { pageCurrent, pageSize, newsTitle = void 0, newsSynopsis, validCode = '*' } = req.body;
    pageCurrent = IntFunc(pageCurrent) || CURRENT;
    pageSize = IntFunc(pageSize) || SIZE;

    console.log('pageSize:',pageSize, ',pageCurrent:',pageCurrent, ',newsTitle:',newsTitle, ',newsSynopsis:', newsSynopsis, ',valiCode:',validCode)

    if(validCode !== '*' && !isNaN(parseInt(validCode))){
       if(BoolFunc(newsTitle)){
           where = " WHERE `validCode` = ? AND `newsTitle` LIKE ?"
           dataArray.push(validCode, `%${newsTitle}%`)
       }else if(BoolFunc(newsSynopsis)){
           where = " WHERE `validCode` = ? AND `newsSynopsis` LIKE ?"
           dataArray.push(validCode, `%${newsSynopsis}%`)
       }else{
           where = " WHERE `validCode` = ?"
           dataArray.push(validCode)
       }
    }else {
        if(BoolFunc(newsTitle)){
            where = " WHERE `newsTitle` LIKE ?"
            dataArray.push(`%${newsTitle}%`)
        }else if(BoolFunc(newsSynopsis)){
            where = " WHERE `newsSynopsis` LIKE ?"
            dataArray.push(`%${newsSynopsis}%`)
        }
    }

    console.log('SQL:',sql + where + order + limit)
    console.log('dataArray:', dataArray)

    const total = (await operation(sql + where + order, dataArray)).length;
    console.log("total", total.length)

    const result = operation(sql + where + order + limit, [...dataArray, (pageCurrent -1 )* pageSize, pageCurrent * pageSize ]);
    result.then(function(data){
        response = {
            status: true,
            data: {
                list: data,
                pageSize,
                page: {
                    total,
                    current: pageCurrent,
                },
            }
        }
        res.send(JSON.stringify(response));
    }).catch(function(err){
        response.message = err;
        res.send(JSON.stringify(response));
    });
})

router.post('/updateNews', async function(req, res, next) {
    const response = {status: false}

    let lock = {
        newsCode: true,
        newsTitle: true,
        newsSynopsis: true,
        newsDetail: true,
        newsPicture: false, //production => true
        validCode: false,
    }

    let {
        newsCode,
        newsTitle,
        newsSynopsis,
        newsDetail,
        newsPicture,
        validCode = 0,
    } = req.body

    Object.keys(lock).map(item => {
        if(!BoolFunc(req.body[item]) && lock[item]){
            response.message = message.notNull + item;
            res.send(JSON.stringify(response));
            return
        }
    })

    let select = "SELECT * FROM `news` WHERE `newsCode` = ?;";
    let total = 0;

    console.log("newsCode:", newsCode)

    try{
        let selectResult = await operation(select, [newsCode])
        total = selectResult.length
    }catch(err) {
        response.message = err
    }

    if(total == 0){
        response.message = `newsCode: Non-existent`
        res.send(JSON.stringify(response));
        return;
    }


    let sql = "UPDATE `news` SET `newsTitle` = ?, `newsSynopsis` = ?, `newsDetail` = ?, `newsPicture` = ?, `validCode` = ? WHERE `newsCode` = ?;"
    let dataArray = [ newsTitle, newsSynopsis, newsDetail, newsPicture, validCode, newsCode]
    console.log("sql:",sql,"data", dataArray)

    const result = operation(sql, dataArray);
    result.then(function(data){
        response.status = true;
        response.data = 'UPDATE: success';
        res.send(JSON.stringify(response));
    }).catch(function(err){
        response.message = err;
        res.send(JSON.stringify(response));
    });
})

router.post('/insertNews', async function(req, res, next){
    let response = { status: false }
    let lock = {
        newsCode: false,
        newsTitle: true,
        newsSynopsis: true,
        newsDetail: true,
        newsPicture: false, //production => true
        validCode: false,
    }

    let {
        newsCode,
        newsTitle,
        newsSynopsis,
        newsDetail,
        newsPicture,
        validCode = 0
    } = req.body


    Object.keys(lock).map(item => {
        if(!BoolFunc(req.body[item]) && lock[item]){
            response.message = `${item}: Is not null`;
            res.send(JSON.stringify(response));
            return
        }
    })

    let sql = "INSERT INTO `news`(`newsCode`, `newsTitle`, `newsSynopsis`, `newsDetail`, `newsPicture`, `validCode`) VALUES(UUID(), ?, ?, ?, ?, ?);"
    let dataArrary = [newsTitle, newsSynopsis, newsDetail, newsPicture, validCode];
    console.log(sql, dataArrary)

    const result =operation(sql, dataArrary);
    console.log(result)
    result.then(function(data){
        response.status = true;
        response.data = 'INSERT: success';
        res.send(JSON.stringify(response));
    }).catch(function(err){
        response.message = err;
        res.send(JSON.stringify(response));
    });
})

router.post('/deleteNews', function(req, res, next){
    const response = { status: false}
    const { newsCode } = req.body;

    if(!newsCode || newsCode.length !== UUID_MAX){
        response.message = 'newsCode: error';
        res.send(JSON.stringify(response));
        return
    }
    let sql = 'DELETE FROM `news` WHERE `newsCode` = ?';
    const result = operation(sql, [newsCode]);
    result.then(function(data){
        if(data.affectedRows === 0){
            response.message = 'newsCode: Non-existent';
            res.send(JSON.stringify(response));
            return
        }
        response.status = true;
        response.data = 'DELETE: success';
        res.send(JSON.stringify(response));
    }).catch(function(err){
        response.message = err;
        res.send(JSON.stringify(response));
    });
})

router.post('/getNewsCode', async function(req, res, next){
    let response = { status: false }, temp = [];
    const { newsCode } = req.body
    console.log(req.body, newsCode)
    if(!BoolFunc(newsCode)){
        response.message = message.notNull + 'newsCode';
        res.send(JSON.stringify(response));
        return
    }
    let sql = "SELECT *,DATE_FORMAT(createtime,'%Y-%m-%d %k:%i:%s') AS `createtime`,DATE_FORMAT(updatetime,'%Y-%m-%d %k:%i:%s') AS `updatetime` FROM `news`";
    let where = "WHERE `newsCode` = ?";
    try {
        temp = await operation(sql + where, [newsCode]);
    }catch (e){
        temp = [];
    }
    console.log(temp)
    response.status = true;
    response.data = temp[0]
    res.send(JSON.stringify(response));
})

module.exports = router;