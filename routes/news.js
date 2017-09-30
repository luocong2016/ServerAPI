/**
 * Created by Lutz on 2017/9/24 0024.
 */
const fs = require('fs');
const path = require('path');
const mime = require('mime');
const express = require('express');
const router = express.Router();

const { operation } = require('../db/mysqlOperation');

const { CURRENT, SIZE, UpperLimit, UUID_MAX, IntFunc } = require('../constants')

router.post('/getNesList', async function(req, res, next) {
    let response = { status: false }
    let sql = "SELECT *,DATE_FORMAT(createtime,'%Y-%m-%d %k:%i:%s') AS `createtime`,DATE_FORMAT(updatetime,'%Y-%m-%d %k:%i:%s') AS `updatetime` FROM `news`";
    let where = "";
    let order = " ORDER BY `createtime` DESC";
    let limit = " LIMIT ?,?";
    let dataArray = [];

    let { pageCurrent, pageSize, newsTitle, newsSynopsis, validCode = '*' } = req.body;
    pageCurrent = IntFunc(pageCurrent) || CURRENT;
    pageSize = IntFunc(pageSize) || SIZE;

    console.log('pageSize:',pageSize, ',pageCurrent:',pageCurrent, ',newsTitle:',newsTitle, ',newsSynopsis:', newsSynopsis, ',valiCode:',validCode)

    if(validCode !== '*' && !isNaN(parseInt(validCode))){
       if(newsTitle != null){
           where = " WHERE `validCode` = ? AND `newsTitle` LIKE ?"
           dataArray.push(validCode, `%${newsTitle}%`)
       }else if(newsSynopsis != null){
           where = " WHERE `validCode` = ? AND `newsSynopsis` LIKE ?"
           dataArray.push(validCode, `%${newsSynopsis}%`)
       }else{
           where = " WHERE `validCode` = ?"
           dataArray.push(validCode)
       }
    }else {
        if(newsTitle != null){
            where = " WHERE `newsTitle` LIKE ?"
            dataArray.push(`%${newsTitle}%`)
        }else if(newsSynopsis != null){
            where = " WHERE `newsSynopsis` LIKE ?"
            dataArray.push(`%${newsSynopsis}%`)
        }
    }

    console.log('SQL:',sql + where + order + limit)

    const result = operation(sql + where + order + limit, [...dataArray, (pageCurrent -1 )* pageSize, pageCurrent * pageSize ]);
    result.then(function(data){
        response = {
            status: true,
            data: {
                list: data,
                pageSize,
                page: {
                    total: data.length,
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

router.post('/updateNesList', async function(req, res, next) {
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

router.post('/insertNes', function(req, res, next){
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

router.post('/deleteNes', function(req, res, next){
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

module.exports = router;