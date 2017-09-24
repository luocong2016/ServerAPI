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


router.post('/getCourse', function(req, res, next) {
    let { limitStart = '', limitEnd = ''} = req.body;
    let limit = ` LIMIT ${limi_10}`;
    limitStart = parseInt(limitStart);
    limitEnd = parseInt(limitEnd);
    if(!isNaN(limitStart)){
        if(!isNaN(limitEnd) && limitStart < limitEnd){
            limit = ` LIMIT ${limitStart},${limitEnd}`;
        }else{
            limit = ` LIMIT ${limitStart}`;
        }
    }
    const response = {status: false}
    const sql = "SELECT *,DATE_FORMAT(createtime,'%Y-%m-%d %k:%i:%s') AS `createtime`,DATE_FORMAT(updatetime,'%Y-%m-%d %k:%i:%s') AS `updatetime` FROM `course` ORDER BY `createtime` DESC"
    const result = operation(sql + limit);
    result.then(function(data){
        response.status = true;
        response.data = data;
        res.send(JSON.stringify(response));
    }).catch(function(err){
        response.message = err;
        res.send(JSON.stringify(response));
    });
})

module.exports = router;