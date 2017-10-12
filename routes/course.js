/**
 * Created by Lutz on 2017/9/24 0024.
 */
const fs = require('fs');
const path = require('path');
const mime = require('mime');
const express = require('express');
const router = express.Router();

const { operation } = require('../db/mysqlOperation');

const { CURRENT, SIZE, UpperLimit,BoolFunc, IntFunc, UUID_MAX, ListTemp } = require('../constants')

router.post('/getCourseList', async function(req, res, next) {
    let response = {status: false}
    let sql = "SELECT *,DATE_FORMAT(createtime,'%Y-%m-%d %k:%i:%s') AS `createtime`,DATE_FORMAT(updatetime,'%Y-%m-%d %k:%i:%s') AS `updatetime` FROM `course`";
    let where = '';
    let order = ' ORDER BY `createtime` DESC'
    let limit = ' LIMIT ?,?';
    let total = 0;
    let dataArray = [];
    let { pageCurrent, pageSize, courseName } = req.body;

    pageCurrent = IntFunc(pageCurrent) || CURRENT;
    pageSize = IntFunc(pageSize) || SIZE;

    if(BoolFunc(courseName)){
        where = " WHERE `courseName` LIKE ?";
        dataArray.push(`%${courseName}%`);
        let totalResult = await operation(sql + where + order, dataArray);
        total = totalResult.length;
        if(total<1){
            response = ListTemp([], pageSize, pageCurrent, total);
            res.send(JSON.stringify(response));
            return;
        }
    }
    const result = operation(sql + where + order + limit, [ ...dataArray,(pageCurrent -1 )* pageSize, pageCurrent * pageSize]);
    result.then(function(data){
        response = ListTemp(data, pageSize, pageCurrent, total);
        res.send(JSON.stringify(response));
    }).catch(function(err){
        response.message = err;
        res.send(JSON.stringify(response));
    });
})

router.post('/updateCourse', async function(req, res, next) {
    const response = {status: false}
    let lock = {
        courseTypeCode: true,
        courseName: true,
        courseSynopsis: true,
        courseDetail: true,
        coursePicture: true,
    }

    let { courseCode, courseTypeCode, courseName, courseSynopsis, courseDetail, coursePicture } = req.body

    let bool = false;
    Object.keys(lock).map(item => {
        if(!BoolFunc(req.body[item]) && lock[item]){
            response.message = message.notNull + item;
            bool = true
        }
    })

    if(bool){
        res.send(JSON.stringify(response));
        return
    }

    if(courseTypeCode.split('^').length > UpperLimit){
        response.message = `courseTypeCode: Not greater than ${UpperLimit}`
        res.send(JSON.stringify(response));
        return
    }

    if(courseCode.length !== UUID_MAX){
        let select = "SELECT * FROM `course` WHERE `courseCode` = ?;";
        response.message = `courseCode: error`
        res.send(JSON.stringify(response));
        return
    }
    if(courseTypeCode.split('^').length > UpperLimit){
        response.message = `courseTypeCode: Not greater than ${UpperLimit}`
        res.send(JSON.stringify(response));
        return
    }

    let sql = "UPDATE `course` SET `courseTypeCode` = ?,`courseName` = ?,`courseSynopsis` = ?,`courseDetail` = ?, `coursePicture` = ? WHERE `courseCode` =?;";

    const result = operation(sql, [courseTypeCode, courseName, courseSynopsis, courseDetail, coursePicture, courseCode]);
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
    let lock = {
        courseTypeCode: true,
        courseName: true,
        courseSynopsis: true,
        courseDetail: true,
        coursePicture: true,
    }

    let { courseTypeCode, courseName, courseSynopsis, courseDetail, coursePicture } = req.body

    let bool = false;
    Object.keys(lock).map(item => {
        if(!BoolFunc(req.body[item]) && lock[item]){
            response.message = message.notNull + item;
            bool = true
        }
    })

    if(bool){
        res.send(JSON.stringify(response));
        return
    }

    if(courseTypeCode.split('^').length > UpperLimit){
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

router.post('/getCourseCode', async function(req, res, next){
    let response = { status: false };
    const { courseCode } = req.body
    if(!BoolFunc(courseCode)){
        response.message = message.notNull + 'courseCode';
        res.send(JSON.stringify(response));
        return
    }

    let sql = "SELECT * FROM `course`";
    let where = "WHERE `courseCode` = ?";
    let temp = [];

    try {
        temp = await operation(sql + where, [courseCode]);
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