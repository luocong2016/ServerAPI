/**
 * Created by Lutz on 2017/9/24 0024.
 */
const fs = require('fs');
const path = require('path');
const mime = require('mime');
const express = require('express');
const router = express.Router();

const { operation } = require('../db/mysqlOperation');

const { CURRENT, SIZE, UpperLimit, UUID_MAX, IntFunc, BoolFunc, ListTemp } = require('../constants')

router.post('/getTeacherList', async function(req, res, next) {
    let response = { status: false }
    let sql = "SELECT *,DATE_FORMAT(createtime,'%Y-%m-%d %k:%i:%s') AS `createtime`,DATE_FORMAT(updatetime,'%Y-%m-%d %k:%i:%s') AS `updatetime` FROM `teacher`";
    let where = "";
    let order = " ORDER BY `weight` DESC";
    let limit = " LIMIT ?,?";
    let total = 0;
    let dataArray = [];

    let { pageCurrent, pageSize, teacherName, courseTypeCode } = req.body;
    pageCurrent = IntFunc(pageCurrent) || CURRENT;
    pageSize = IntFunc(pageSize) || SIZE;

    console.log('pageSize:',pageSize, ',pageCurrent',pageCurrent, ',teacherName',teacherName, ',valiCode',validCode)

    if(BoolFunc(teacherName)){
        where = " WHERE `teacherName` LIKE ?"
        dataArray.push(`%${teacherName}%`)
    } else if(BoolFunc(courseTypeCode)) {
        where = " WHERE `courseTypeCode` LIKE ?"
        dataArray.push(`%${courseTypeCode}%`)
    }

    console.log('SQL:',sql + where + order + limit)

    try{
        let selectResult = await operation(sql + where + order, [teacherCode])
        total = selectResult.length
    }catch(err) {
        response.message = err
    }

    if(total == 0){
        response.message = `teacherCode: Non-existent`
        res.send(JSON.stringify(response));
        return;
    }

    const result = operation(sql + where + order + limit, [...dataArray, (pageCurrent -1 )* pageSize, pageCurrent * pageSize ]);
    result.then(function(data){
        response = ListTemp(data, pageSize, pageCurrent, total);
        res.send(JSON.stringify(response));
    }).catch(function(err){
        response.message = err;
        res.send(JSON.stringify(response));
    });
})

router.post('/updateTeacher', async function(req, res, next) {
    const response = {status: false}
    let {
        teacherCode,
        teacherName,
        teacherSynopsis,
        teacherPicture,
        cellPhone,
        courseTypeCode,
        weight,
        schoolCode,
        validCode = 0
    } = req.body

    if(!teacherCode || teacherCode.length !== UUID_MAX){
        response.message = `teacherCode: error`
        res.send(JSON.stringify(response));
        return
    }

    if(courseTypeCode && courseTypeCode.split('^').length > UpperLimit){
        response.message = `courseTypeCode: Not greater than ${UpperLimit}`
        res.send(JSON.stringify(response));
        return
    }

    let select = "SELECT * FROM `teacher` WHERE `teacherCode` = ?;";
    let total = 0;
    let selectResult = await operation(select, [teacherCode])
    try{
        total = selectResult.length
    }catch(err) {
        response.message = err
    }

    if(total == 0){
        response.message = `teacherCode: Non-existent`
        res.send(JSON.stringify(response));
        return;
    }

    if(teacherName == null){
        response.message = `teacherName: IS NOT NULL`
        res.send(JSON.stringify(response));
        return
    }

    if(teacherSynopsis == null){
        response.message = `teacherSynopsis: IS NOT NULL`
        res.send(JSON.stringify(response));
        return
    }

    let sql = "UPDATE `teacher` SET `teacherName` = ?, `teacherSynopsis` = ?, `teacherPicture` = ?, `cellPhone` = ?, `courseTypeCode` = ?, `weight` = ?, `schoolCode` = ?, `validCode` = ? WHERE `teacherCode` = ?;"
    let dataArray = [teacherName, teacherSynopsis, teacherPicture, cellPhone, courseTypeCode, weight, schoolCode, validCode, teacherCode]
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

router.post('/insertTeacher', function(req, res, next){
    let response = { status: false }
    let {
        teacherCode,
        teacherName,
        teacherSynopsis,
        teacherPicture,
        cellPhone,
        courseTypeCode,
        weight,
        schoolCode,
        validCode = 0
    } = req.body

    if(teacherName == null){
        response.message = 'teacherSynopsis: Is not null';
        res.send(JSON.stringify(response));
        return
    }

    if(teacherSynopsis == null){
        response.message = 'courseSynopsis: Is not null';
        res.send(JSON.stringify(response));
        return
    }
    if(courseTypeCode && courseTypeCode.split('^').length > UpperLimit){
        response.message = `courseTypeCode: Not greater than ${UpperLimit}`
        res.send(JSON.stringify(response));
        return
    }

    let sql = "INSERT INTO `teacher`(`teacherCode`, `teacherName`, `teacherSynopsis`, `teacherPicture`, `cellPhone`, `courseTypeCode`, `weight`, `schoolCode`, `validCode`) VALUES(UUID(), ?, ?, ?, ?, ?, ?, ?, ?);"
    let dataArrary = [teacherName, teacherSynopsis, teacherPicture, cellPhone, courseTypeCode, weight, schoolCode, validCode];
    const result = operation(sql, dataArrary);
    result.then(function(data){
        response.status = true;
        response.data = 'INSERT: success';
        res.send(JSON.stringify(response));
    }).catch(function(err){
        response.message = err;
        res.send(JSON.stringify(response));
    });
})

router.post('/deleteTeacher', function(req, res, next){
    const response = { status: false}
    const { teacherCode } = req.body;

    if(!teacherCode || teacherCode.length !== UUID_MAX){
        response.message = 'teacherCode: error';
        res.send(JSON.stringify(response));
        return
    }
    let sql = 'DELETE FROM `teacher` WHERE `teacherCode` = ?';
    const result = operation(sql, [teacherCode]);
    result.then(function(data){
        if(data.affectedRows === 0){
            response.message = 'teacherCode: Non-existent';
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

router.post('/getTeacherCode', async function(req, res, next){
    let response = { status: false }, temp = [];
    const { teacherCode } = req.body
    console.log(req.body, teacherCode)
    if(!BoolFunc(teacherCode)){
        response.message = message.notNull + 'teacherCode';
        res.send(JSON.stringify(response));
        return
    }
    let sql = "SELECT * FROM `teacher`";
    let where = "WHERE `teacherCode` = ?";
    try {
        temp = await operation(sql + where, [teacherCode]);
    }catch (e){
        temp = [];
    }
    console.log(temp)
    response.status = true;
    response.data = temp[0]
    res.send(JSON.stringify(response));
})

module.exports = router;