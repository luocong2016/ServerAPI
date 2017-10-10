/**
 * Created by Lutz on 2017/9/19 0019.
 * http://www.cnblogs.com/xiaofeixiang/p/5140673.html
 */
const fs = require('fs');
const path = require('path');
const mime = require('mime');

const express = require('express');
const router = express.Router();

const formidable = require('formidable');

/* 配置 */
const PICTURE_UPLOAD = '/picture/'; //设置上传路径
const PICTURE_MAX_SIZE = 2 * 1024 * 1024; //设置文件大小
const PICTURE_PATH = path.resolve(__dirname, '..', 'public/picture'); //picture文件夹路径

/* 删除上传失败文件 */
const deletePic = (filename) => {
    if(!filename){
        return
    }

    const upload_ = 'upload_'

    if(filename.indexOf(upload_) !== -1){
        filename = filename.substring(filename.indexOf(upload_))
    }

    const filePath = path.resolve(PICTURE_PATH, filename);

    fs.exists(filePath, function(exists){
        if(exists) {
            fs.unlink(filePath)
        }
    })
}


/*
*  ## POST
*/
/* 上传一张图片 */
router.post('/putPicture', function (req, res, next){
    const response = {status:false}; //输出数据
    const form = new formidable.IncomingForm(); //创建上传表单
    form.encoding = 'utf-8'; //设置编码格式
    form.uploadDir = 'public' + PICTURE_UPLOAD; //设置上传目录
    form.keepExtensions = true; //保留后缀
    form.parse(req, function (err, fields, files) {
        const file = files.file || files.upload || {}
        if(err){
            response.message = '上传过程错误，请重新上传'
            res.send(JSON.stringify(response));
            return
        }

        if(file.size > PICTURE_MAX_SIZE){
            response.message = `图片最大不得超过:${PICTURE_MAX_SIZE/1024}KB`;
            res.send(JSON.stringify(response));
            deletePic(file.path)
            return
        }

        let extName = ''; //后缀名
        switch (file.type){
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
            case 'image/gif':
                extName = 'gif';
                break;
        }

        if(extName.length === 0){
            response.message = '只支持png/jpg/gif格式的图片';
            res.send(JSON.stringify(response));
            deletePic(file.path);
            return
        }

        //图片新文件名
        let avatarName  = `${new Date().toLocaleDateString()}_${Math.random().toString(16).substr(2)}.${extName}`;
        let picturePath = form.uploadDir + avatarName;

        //同步重命名文件名
        fs.renameSync(file.path, picturePath);

        response.status = true;
        response.data = '/picture/' + avatarName;
        res.send(JSON.stringify(response));
    })
})

/*
* ## GET
*/

/* 获取一组图片 */
router.get('/getPicture', function(req, res, next){

    let data = []
    debug(data)
    fs.readdirSync(PICTURE_PATH).forEach(function(file){
        data.push({
            imgUrl:PICTURE_UPLOAD + file
        })
    })

    const response = {status:true,data};
    res.send(JSON.stringify(response));
})

/* 浏览器浏览图片 */
router.get('/:url', function (req, res, next) {
    const filePath = path.resolve(PICTURE_PATH, req.params.url)
    fs.exists(filePath, function(exists){
        if(exists){
            let content = new Buffer(fs.readFileSync(filePath, 'binary'));
            res.writeHead(200,{'Content-type': mime.lookup(filePath)})
            res.write(content, 'binary')
        }else{
            const err = new Error('Not Found');
            err.status = 404;
            next(err);
        }
    })
})

module.exports = router;