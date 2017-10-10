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
    let total = 0;

    let { pageCurrent, pageSize, schoolName, schoolCode, validCode = 0 } = req.body;
    pageCurrent = IntFunc(pageCurrent) || CURRENT;
    pageSize = IntFunc(pageSize) || SIZE;

    console.log('pageSize:',pageSize, ',pageCurrent:',pageCurrent, ',schoolName:',schoolName, ',schoolCode:', schoolCode)

   if(BoolFunc(schoolCode)){
       where = " WHERE `schoolCode` = ?"
       dataArray.push(schoolCode)
   }else if(BoolFunc(schoolName)){
       where = " WHERE `schoolName` LIKE ?"
       dataArray.push(`%${schoolName}%`)
   }
   try{
       let selectResult = await operation(sql + where + order, dataArray )
       console.log(sql+ where+ order)
       console.log("selectResult:", selectResult, 'dataArray:', dataArray)
       total = selectResult.length
   }catch (e){
       response.message = err
   }

    if(total == 0){
        response = ListTemp([], pageSize, pageCurrent, total)
        res.send(JSON.stringify(response));
        return;
    }


    console.log('SQL:',sql + where + order + limit)

    const result = operation(sql + where + order + limit, [...dataArray, (pageCurrent -1 )* pageSize, pageCurrent * pageSize ]);
    result.then(function(data){
        response = ListTemp(data, pageSize, pageCurrent, total)
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
        Telephone:true
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

    let sql = "UPDATE `school` SET `schoolName` = ?, `schoolSynopsis` = ?, `schooladdress` = ?, `schoolPicture` = ?, `province_id` = ?, `city_id` = ?, `region_id` = ?, `Telephone` = ? WHERE `schoolCode` = ?;"
    let dataArray = [schoolName,schoolSynopsis,schooladdress,schoolPicture,province_id,city_id,region_id,Telephone,schoolCode]
    console.log("sql:",sql,"data\n", dataArray)

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
        schoolName: true,
        schoolSynopsis: true,
        schooladdress: true,
        schoolPicture: false, //production: true
        province_id: false,
        city_id: false,
        region_id: false,
        Telephone:true
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

    let sql = "INSERT INTO `school`(`schoolCode`, `schoolName`, `schoolSynopsis`, `schooladdress`, `schoolPicture`, `province_id`, `city_id`, `region_id`, `Telephone`) VALUES(UUID(), ?, ?, ?, ?, ?, ?, ?, ?);"
    let dataArrary = [schoolName,schoolSynopsis,schooladdress,schoolPicture,province_id,city_id,region_id,Telephone];
    console.log(sql)
    const result = operation(sql, dataArrary);
    result.then(function(data){
        response.status = true;
        response.data = message.successful;
        res.send(JSON.stringify(response));
    }).catch(function(err){
        response.message = err;
        res.send(JSON.stringify(response));
    });
})

router.post('/deleteSchool', function(req, res, next){
    console.log('deleteSchool')
    const response = { status: false}
    const { schoolCode } = req.body;

    if(!schoolCode || schoolCode.length !== UUID_MAX){
        response.message = message.fail + 'schoolCode';
        res.send(JSON.stringify(response));
        return
    }
    let sql = 'DELETE FROM `school` WHERE `schoolCode` = ?';
    const result = operation(sql, [schoolCode]);
    result.then(function(data){
        if(data.affectedRows === 0){
            response.message = message.nonentity + 'schoolCode';
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

router.post('/getSchoolCode', async function(req, res, next){
    let response = { status: false }, temp = [];
    const { schoolCode } = req.body
    console.log(req.body, schoolCode)
    if(!BoolFunc(schoolCode)){
        response.message = message.notNull + 'schoolCode';
        res.send(JSON.stringify(response));
        return
    }
    let sql = "SELECT * FROM `school`";
    let where = "WHERE `schoolCode` = ?";

    console.log("sql:",sql + where,'arr',[schoolCode])
    try {
        temp = await operation(sql + where, [schoolCode]);
    }catch (e){
        temp = [];
    }
    console.log(temp)
    response.status = true;
    response.data = temp[0]
    res.send(JSON.stringify(response));
})

module.exports = router;