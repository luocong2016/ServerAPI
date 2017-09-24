/**
 * Created by Lutz on 2017/9/24 0024.
 */
const fs = require('fs');
const path = require('path');
const mime = require('mime');
const express = require('express');
const router = express.Router();

const { operation } = require('../db/mysqlOperation');

router.post('/getCourse', function(req, res, next) {
    const { limit = 5 } = req.body;

    let response = {status: false}
    let result = operation('SELECT * FROM `course` ORDER BY `createtime` DESC LIMIT 5');
    result.then(function(data){
        response.status = true;
        response.data = data;
        res.send(JSON.stringify(response));
    })
})

module.exports = router;