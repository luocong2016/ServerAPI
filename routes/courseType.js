/**
 * Created by Lutz on 2017/9/24 0024.
 */
const fs = require('fs');
const path = require('path');
const mime = require('mime');
const express = require('express');
const router = express.Router();

const { operation } = require('../db/mysqlOperation');

const { CURRENT, SIZE, UUID_MAX, UpperLimit, IntFunc, BoolFunc, message } = require('../constants')

router.post('/getCourseTypesList', async function(req, res, next) {
    let response = { status: false }
    let sql = "SELECT * FROM `courseType`";
    let where = "";
    let order = " ORDER BY `courseTypeName` DESC"
    let limit = "";

    let { validCode = 0 } = req.body;
    where = " WHERE `validCode` = ?"
    const result = operation(sql + where + order + limit, [validCode]);
    result.then(function(data){
        response = {
            status: true,
            data,
            total: data.length
        }
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

router.post('/insertCourseType', function(req, res, next){
    let response = { status:false }
    let { courseTypeName, validCode = 0} = req.body
    if(!BoolFunc(courseTypeName)){
        response.message = message.notNull + "courseTypeName";
        res.send(JSON.stringify(response));
        return
    }

    let sql = "INSERT INTO `courseType`(`courseTypeCode`, `courseTypeName`, `validCode`) VALUES(UUID(), ?, ?);"
    const result = operation(sql, [courseTypeName, validCode]);
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

module.exports = router;