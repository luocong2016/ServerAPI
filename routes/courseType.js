/**
 * Created by Lutz on 2017/9/24 0024.
 */
const fs = require('fs');
const path = require('path');
const mime = require('mime');
const express = require('express');
const router = express.Router();

const { operation } = require('../db/mysqlOperation');

const { CURRENT, SIZE, UUID_MAX, UpperLimit, IntFunc, BoolFunc, ListTemp, message } = require('../constants')

router.post('/getCourseTypesList', async function(req, res, next) {
    let response = { status: false }
    let sql = "SELECT * FROM `courseType`";
    let where = "";
    let order = " ORDER BY `courseTypeCode` DESC";
    let limit = " LIMIT ?, ?";
    let total = 0;
    let dataArray = [];

    let { courseTypeCode, courseTypeName, pageCurrent, pageSize } = req.body;

    pageCurrent = IntFunc(pageCurrent) || CURRENT;
    pageSize = IntFunc(pageSize) || SIZE;

    if(BoolFunc(courseTypeCode)){
        where = " WHERE `courseTypeCode` = ?";
        dataArray.push(courseTypeCode);
    }else if(BoolFunc(courseTypeName)) {
        where = " WHERE `courseTypeName` LIKE ?";
        dataArray.push(`%${courseTypeName}%`);
    }

    try {
        const selectResult = operation(sql + where + order, dataArray);
        total = selectResult.length;
    } catch(err) {
        response.message = err;
    }

    if(total == 0){
        response.message = message.nonentity;
        res.send(JSON.stringify(response));
        return;
    }
    console.log("sql:", sql + where + order + limit, [...dataArray,  (pageCurrent -1 )* pageSize, pageCurrent * pageSize])

    const result = operation(sql + where + order + limit, [...dataArray,  (pageCurrent -1 )* pageSize, pageCurrent * pageSize]);
    result.then(function(data){
        response = ListTemp(data, pageSize, pageCurrent, total);
        res.send(JSON.stringify(response));
    }).catch(function(err){
        response.message = err;
        res.send(JSON.stringify(response));
    });
})

router.post('/updateCourseType', async function(req, res, next) {
    let lock = {
        courseTypeCode: true,
        courseTypeName: true,
        validCode: false
    }

    const response = {status: false}
    let { courseTypeCode, courseTypeName, validCode = 0 } = req.body

    Object.keys(lock).map(item => {
        if(!BoolFunc(req.body[item]) && lock[item]){
            response.message = message.notNull + `${item}`;
            res.send(JSON.stringify(response));
            return
        }
    })

    let select = "SELECT * FROM `courseType` WHERE `courseTypeCode` = ?";
    const selectResult = await operation(select, [courseTypeCode]);

    console.log(selectResult)
    if(selectResult.length <1 ){
        response.message = message.nonentity + "courseTypeCode";
        res.send(JSON.stringify(response));
        return
    }


    let sql = "UPDATE `courseType` SET `courseTypeName` = ?,`validCode` = ? WHERE `courseTypeCode` =?;";

    const result = operation(sql, [courseTypeName, validCode, courseTypeCode]);
    result.then(function(data){
        console.log(data)
        response.status = true;
        response.data = 'UPDATE: success';
        res.send(JSON.stringify(response));
    }).catch(function(err){
        response.message = err;
        res.send(JSON.stringify(response));
    });
})

router.post('/insertCourseType', async function(req, res, next){
    let response = { status:false }
    let { courseTypeName } = req.body
    if(!BoolFunc(courseTypeName)){
        response.message = message.notNull + "courseTypeName";
        res.send(JSON.stringify(response));
        return
    }

    let total =0;
    const selcet = "SELECT * FORM `courseType` WHERE `courserTypeName` = ?";
    try{
       let selectResult = await operation(selcet, [courseTypeName]);
       total = selectResult.length;
       console.log(total)
    } catch (err){
        response.message = err;
    }

    if(total !=0){
        res.message = message.
        res.send(JSON.stringify(response));
        return;
    }

    let sql = "INSERT INTO `courseType` (`courseTypeCode`, `courseTypeName`) VALUES(UUID(), ?);"
    console.log(sql, courseTypeName)

    const result = operation(sql, [courseTypeName]);
    result.then(function(data){
        response.status = true;
        response.data = message.successful;
        res.send(JSON.stringify(response));
    }).catch(function(err){
        response.message = err;
        res.send(JSON.stringify(response));
    });
})

router.post('/deleteCourseType', function(req, res, next){
    const response = { status: false}
    const { courseTypeCode } = req.body;
    if(!courseTypeCode || courseTypeCode.length !== UUID_MAX){
        response.message = 'courseTypeCode: error';
        res.send(JSON.stringify(response));
        return
    }
    let sql = 'DELETE FROM `courseType` WHERE `courseTypeCode` = ?';
    const result = operation(sql,[courseTypeCode]);
    result.then(function(data){
        if(data.affectedRows === 0){
            response.message = message.nonentity + 'courseTypeCode';
            res.send(JSON.stringify(response));
            return
        }
        response.status = true;
        response.data = message.successful;
        res.send(JSON.stringify(response));
    }).catch(function(err){
        response.message = err;
        res.send(JSON.stringify(response));
    });
})

router.post('/getCourseTypeCode', async function(req, res, next){
    let response = { status: false };
    const { courseTypeCode } = req.body
    console.log("getCourseTypeCode", courseTypeCode)
    if(!BoolFunc(courseTypeCode)){
        response.message = message.notNull + 'courseTypeCode';
        res.send(JSON.stringify(response));
        return
    }

    let sql = "SELECT * FROM `courseType`";
    let where = "WHERE `courseTypeCode` = ?";
    let temp = [];

    try {
        temp = await operation(sql + where, [courseTypeCode]);
    } catch (err){
        response.message = err;
    }

    if(temp.length > 0){
        response = {
            status: true,
            data: temp[0]
        };
    }

    res.send(JSON.stringify(response));
})

module.exports = router;