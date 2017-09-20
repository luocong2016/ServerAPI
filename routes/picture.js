/**
 * Created by Lutz on 2017/9/19 0019.
 *
 * https://segmentfault.com/a/1190000005706031
 */
const fs = require('fs');
const path = require('path');

const express = require('express');
const router = express.Router();

const formidable = require('formidable');

/* 配置 */
const PICTURE_UPLOAD = '/picture/'; //设置上传路径
const PICTURE_MAX_SIZE = 2 * 1024 * 1024; //设置文件大小

router.get('/getPicture', function(req, res, next){
    let data = [{
        imgName: 'album0',
        imgUrl: 'http://img002.21cnimg.com/photos/album/20150702/m600/2D79154370E073A2BA3CD4D07868861D.jpeg',
    },{
        imgName: 'album1',
        imgUrl: 'http://img0.imgtn.bdimg.com/it/u=1762486476,495249870&fm=200&gp=0.jpg',
    },{
        imgName: 'album2',
        imgUrl: 'http://image.baidu.com/search/detail?ct=503316480&z=&tn=baiduimagedetail&ipn=d&word=%E7%BE%8E%E5%A5%B3&step_word=&ie=utf-8&in=&cl=2&lm=-1&st=-1&cs=80010223,1636758455&os=41641126,2882191549&simid=0,0&pn=9&rn=1&di=4968753040&ln=3916&fr=&fmq=1505833172895_R&ic=0&s=undefined&se=&sme=&tab=0&width=&height=&face=undefined&is=0,0&istype=2&ist=&jit=&bdtype=13&spn=0&pi=0&gsm=0&objurl=http%3A%2F%2F4493bz.1985t.com%2Fuploads%2Fallimg%2F151026%2F1-151026162420.jpg&rpstart=0&rpnum=0&adpicid=0',
    },{
        imgName: 'album3',
        imgUrl: 'http://image.baidu.com/search/detail?ct=503316480&z=&tn=baiduimagedetail&ipn=d&word=%E7%BE%8E%E5%A5%B3&step_word=&ie=utf-8&in=&cl=2&lm=-1&st=-1&cs=3788029916,877244249&os=56601258,2891687170&simid=0,0&pn=15&rn=1&di=12094479890&ln=3916&fr=&fmq=1505833172895_R&ic=0&s=undefined&se=&sme=&tab=0&width=&height=&face=undefined&is=0,0&istype=2&ist=&jit=&bdtype=13&spn=0&pi=0&gsm=0&objurl=http%3A%2F%2F4493bz.1985t.com%2Fuploads%2Fallimg%2F160311%2F3-160311161602.jpg&rpstart=0&rpnum=0&adpicid=0',
    },{
        imgName: 'album4',
        imgUrl: 'http://image.baidu.com/search/detail?ct=503316480&z=&tn=baiduimagedetail&ipn=d&word=%E7%BE%8E%E5%A5%B3&step_word=&ie=utf-8&in=&cl=2&lm=-1&st=-1&cs=2444189497,2849976162&os=4090719169,697469997&simid=0,0&pn=18&rn=1&di=11673510220&ln=3916&fr=&fmq=1505833172895_R&ic=0&s=undefined&se=&sme=&tab=0&width=&height=&face=undefined&is=0,0&istype=2&ist=&jit=&bdtype=13&spn=0&pi=0&gsm=0&objurl=http%3A%2F%2F4493bz.1985t.com%2Fuploads%2Fallimg%2F160927%2F3-16092G02T3.jpg&rpstart=0&rpnum=0&adpicid=0',
    }]

    const response = {status:true,data};
    res.send(JSON.stringify(response));
})

router.post('/putPicture', function (req, res, next){
    const response = {status:false}; //输出数据
    const form = new formidable.IncomingForm(); //创建上传表单
    form.encoding = 'utf-8'; //设置编码格式
    form.uploadDir = 'public' + PICTURE_UPLOAD; //设置上传目录
    form.keepExtensions = true; //保留后缀
    form.parse(req, function (err, fields, files) {

        if(err){
            response.message = err
            res.send(JSON.stringify(response));
            return
        }

        if(files.upload.size > PICTURE_MAX_SIZE){
            response.message = `图片最大不得超过:${PICTURE_MAX_SIZE/1024}KB`;
            res.send(JSON.stringify(response));
            return
        }

        let extName = ''; //后缀名
        switch (files.upload.type){
            case 'image/pjpeg':
                extName = 'jpg';
                break;
            case 'image/jpeg':
                extName = 'jpg';
                break;
            case 'image/png':
                extName = 'png';
                break;
            case 'image/x-png':
                extName = 'png';
                break;
        }

        if(extName.length == 0){
            response.message = '只支持png和jpg格式的图片';
            res.send(JSON.stringify(response));
            return
        }

        let avatarName  = `${new Date().toLocaleDateString()}_${Math.random().toString(16).substr(2)}.${extName}`; //图片写入地址
        let picturePath = form.uploadDir + avatarName;

        fs.renameSync(files.upload.path, picturePath);

        response.status = true;
        response.data = '/' + picturePath;
        res.send(JSON.stringify(response));
    })
})

module.exports = router;