/**
 * Created by Lutz on 2017/9/24 0024.
 */
const fs = require('fs');
const path = require('path');
const mime = require('mime');
const express = require('express');
const router = express.Router();

const { operation } = require('../db/mysqlOperation');

const limi_5 = 5;
const limi_10 = 10;


router.post('/getCourseList', function(req, res, next) {
    let { limitStart = '', limitEnd = ''} = req.body;
    let limit = ` LIMIT ${limi_10};`;
    limitStart = parseInt(limitStart);
    limitEnd = parseInt(limitEnd);
    if(!isNaN(limitStart)){
        if(!isNaN(limitEnd) && limitStart < limitEnd){
            limit = ` LIMIT ${limitStart},${limitEnd};`;
        }else{
            limit = ` LIMIT ${limitStart};`;
        }
    }
    const response = {status: false}
    const sql = "SELECT *,DATE_FORMAT(createtime,'%Y-%m-%d %k:%i:%s') AS `createtime`,DATE_FORMAT(updatetime,'%Y-%m-%d %k:%i:%s') AS `updatetime` FROM `course` ORDER BY `createtime` DESC" + limit;
    const result = operation(sql);
    result.then(function(data){
        response.status = true;
        response.data = data;
        res.send(JSON.stringify(response));
    }).catch(function(err){
        response.message = err;
        res.send(JSON.stringify(response));
    });
})

router.post('/updateCourse', function(req, res, next) {
    const response = {status: false}
    let { courseCode, courseTypeCode, courseName = 'NULL', courseSynopsis = ' NULL', courseDetail = ' NULL' } = req.body
    if(!courseCode || courseCode.length !== 32){
        response.message = `courseCode 错误`
        res.send(JSON.stringify(response));
        return
    }
    if(courseTypeCode && courseTypeCode.split('^').length > limi_5){
        response.message = `courseTypeCode不能大于${limi_5}`
        res.send(JSON.stringify(response));
        return
    }
    if(courseTypeCode == null){
        courseTypeCode = 'NULL'
    }

    let sql = "UPDATE `course` SET" +
        "`courseTypeCode` = '" + courseTypeCode +
        "',`courseName` = '" + courseName +
        "',`courseSynopsis` = '" + courseSynopsis +
        "',`courseDetail` = '" + courseDetail +
        "' WHERE `courseCode` ='" + courseCode + "';";


    console.log(courseTypeCode)
    console.log(sql)
    const result = operation(sql);
    result.then(function(data){
        response.status = true;
        response.data = '修改成功';
        res.send(JSON.stringify(response));
    }).catch(function(err){
        response.message = err;
        res.send(JSON.stringify(response));
    });
})

module.exports = router;