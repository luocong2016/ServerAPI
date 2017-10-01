/**
 * Created by Lutz on 2017/9/24 0024.
 */
const fs = require('fs');
const path = require('path');
const mime = require('mime');
const express = require('express');
const router = express.Router();

const { operation } = require('../db/mysqlOperation');

const { CURRENT, SIZE, UpperLimit, UUID_MAX, IntFunc, BoolFunc, ListTemp, message } = require('../constants')

router.post('/getSchoolList', async function(req, res, next) {
    let response = { status: false }
    let sql = "SELECT * FROM `school`";
    let where = "";
    let order = " ORDER BY `region_id` DESC";
    let limit = " LIMIT ?,?";
    let dataArray = [];

    let { pageCurrent, pageSize, schoolName, schoolCode} = req.body;
    pageCurrent = IntFunc(pageCurrent) || CURRENT;
    pageSize = IntFunc(pageSize) || SIZE;

    console.log('pageSize:',pageSize, ',pageCurrent:',pageCurrent, ',schoolName:',schoolName, ',schoolCode:', schoolCode)

   if(BoolFunc(schoolCode)){
       where = " WHERE `schoolCode` = ?"
       dataArray.push(validCode, `%${schoolCode}%`)
   }else if(BoolFunc(schoolName)){
       where = " WHERE `schoolName` LIKE ?"
       dataArray.push(validCode, `%${newsSynopsis}%`)
   }

    console.log('SQL:',sql + where + order + limit)

    const result = operation(sql + where + order + limit, [...dataArray, (pageCurrent -1 )* pageSize, pageCurrent * pageSize ]);
    result.then(function(data){
        response = ListTemp(data, pageSize, pageCurrent)
        res.send(JSON.stringify(response));
    }).catch(function(err){
        response.message = err;
        res.send(JSON.stringify(response));
    });
})

router.post('/updateSchool', async function(req, res, next) {
    const response = {status: false}

    let lock = {
        schoolCode: true,
        schoolName: true,
        schoolSynopsis: true,
        schooladdress: true,
        schoolPicture: false, //production: true
        province_id: false,
        city_id: false,
        region_id: false,
        Telephone:false
    }

    let {
        schoolCode,
        schoolName,
        schoolSynopsis,
        schooladdress,
        schoolPicture,
        province_id,
        city_id,
        region_id,
        Telephone
    } = req.body

    Object.keys(lock).map(item => {
        if(!BoolFunc(req.body[item]) && lock[item]){
            response.message = message.notNull + `${item}`;
            res.send(JSON.stringify(response));
            return
        }
    })

    console.log(1)

    return

    if(schoolCode.length !== UUID_MAX){
        response.message = message.fail + `schoolCode`
        res.send(JSON.stringify(response));
        return
    }

    let select = "SELECT * FROM `school` WHERE `schoolCode` = ?;";
    let total = 0;
    let selectResult = await operation(select, [schoolCode])
    try{
        total = selectResult.length
    }catch(err) {
        response.message = err
    }

    if(total == 0){
        response.message = message.nonentity + `schoolCode`
        res.send(JSON.stringify(response));
        return;
    }

    return
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

router.post('/insertSchool', function(req, res, next){
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
    console.log(sql)
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

router.post('/deleteSchool', function(req, res, next){
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

module.exports = router;