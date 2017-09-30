/**
 * Created by Lutz on 2017/9/24 0024.
 */
const fs = require('fs');
const path = require('path');
const mime = require('mime');
const express = require('express');
const router = express.Router();

const { operation } = require('../db/mysqlOperation');

const { CURRENT, SIZE, UpperLimit, IntFunc, UUID_MAX } = require('../constants')

router.post('/getCourseList', async function(req, res, next) {
    let response = {status: false}
    let sql = "SELECT *,DATE_FORMAT(createtime,'%Y-%m-%d %k:%i:%s') AS `createtime`,DATE_FORMAT(updatetime,'%Y-%m-%d %k:%i:%s') AS `updatetime` FROM `course`";
    let where = '';
    let order = ' ORDER BY `createtime` DESC'
    let limit = ' LIMIT ?,?';
    let total = 0;

    let dataArray = [];
    let { pageCurrent, pageSize, courseName = void 0 } = req.body;

    pageCurrent = IntFunc(pageCurrent) || CURRENT;
    pageSize = IntFunc(pageSize) || SIZE;

    if(courseName != null){
        where = " WHERE `courseName` LIKE ?";
        dataArray.push(`%${courseName}%`);
        let totalResult = await operation(sql + where, dataArray);
        total = totalResult.length;
        if(total<1){
            response = {
                status: true,
                data: {
                    list: [],
                    pageSize,
                    page: {
                        total,
                        current: pageCurrent,
                    },
                }
            }
            res.send(JSON.stringify(response));
            return;
        }
    }



    dataArray = [ ...dataArray,(pageCurrent -1 )* pageSize, pageCurrent * pageSize]
    sql += where + order + limit;

    const result = operation(sql, dataArray);
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

router.post('/updateCourse', async function(req, res, next) {
    const response = {status: false}
    let { courseCode = null, courseTypeCode = null, courseName = 'NULL', courseSynopsis = 'NULL', courseDetail = 'NULL' } = req.body
    console.log(" courseCode:",courseCode,' courseTypeCode:',courseTypeCode,' courseName:',courseName,' courseSynopsis:',courseSynopsis,' courseDetail:',courseDetail)
    if(!courseCode || courseCode.length !== UUID_MAX){
        let select = "SELECT * FROM `course` WHERE `courseCode` = ?;";
        response.message = `courseCode: error`
        res.send(JSON.stringify(response));
        return
    }
    if(courseTypeCode && courseTypeCode.split('^').length > UpperLimit){
        response.message = `courseTypeCode: Not greater than ${UpperLimit}`
        res.send(JSON.stringify(response));
        return
    }

    let sql = "UPDATE `course` SET `courseTypeCode` = ?,`courseName` = ?,`courseSynopsis` = ?,`courseDetail` = ? WHERE `courseCode` =?;";

    const result = operation(sql, [courseTypeCode, courseName, courseSynopsis, courseDetail, courseCode]);
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

router.post('/insertCourse', function(req, res, next){
    let response = {status:false}
    let { courseTypeCode, courseName, courseSynopsis, courseDetail } = req.body
    if(courseName == null){
        response.message = 'courseName: Is not null';
        res.send(JSON.stringify(response));
        return
    }

    if(courseSynopsis == null){
        response.message = 'courseSynopsis: Is not null';
        res.send(JSON.stringify(response));
        return
    }
    if(courseDetail == null){
        response.message = 'courseDetail: Is not null';
        res.send(JSON.stringify(response));
        return
    }
    if(courseTypeCode && courseTypeCode.split('^').length > UpperLimit){
        response.message = `courseTypeCode: Not greater than ${UpperLimit}`
        res.send(JSON.stringify(response));
        return
    }

    let sql = "INSERT INTO `course`(`courseCode`, `courseTypeCode`, `courseName`, `courseSynopsis`, `courseDetail`) VALUES(UUID(), ?, ?, ?, ?);"
    const result = operation(sql, [courseTypeCode, courseName, courseSynopsis, courseDetail]);
    result.then(function(data){
        response.status = true;
        response.data = 'INSERT: success';
        res.send(JSON.stringify(response));
    }).catch(function(err){
        response.message = err;
        res.send(JSON.stringify(response));
    });
})

router.post('/deleteCourse', function(req, res, next){
    const response = { status: false}
    const { courseCode } = req.body;
    if(!courseCode || courseCode.length !== UUID_MAX){
        response.message = 'courseCode: error';
        res.send(JSON.stringify(response));
        return
    }
    let sql = 'DELETE FROM `course` WHERE `courseCode` = ?';
    const result = operation(sql,[courseCode]);
    result.then(function(data){
        if(data.affectedRows === 0){
            response.message = 'courseCode: Non-existent';
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