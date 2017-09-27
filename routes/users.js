const { operation } = require('../db/mysqlOperation');
const express = require('express');
const router = express.Router();

router.post('/login',function(req, res, next){
    console.log('session', req.session)
    console.log('body',req.body, 'params',req.params, 'query',req.query)

    const   response = { status: false };
    const { user = '', password = '' } = req.body
    if( !user || !password ){
        response.message = 'error: user or password is not null';
        res.send(JSON.stringify(response));
        return
    }
    let sql = 'SELECT * FROM `user` WHERE `user` = ?'
    const result = operation(sql, [user]);
    result.then(function(data){
        if(data.length < 1 || data[0].password !== password){
            response.message = 'error:Account or password error';
            res.send(JSON.stringify(response));
            return
        }
        req.session.regenerate(function(err) {
            if (err) {
                response.message = 'error:Unknown error session';
                res.send(JSON.stringify(response));
                return
            }
        })

        req.session.user = { user };
        response.status = true;
        response.data = true;
        res.send(JSON.stringify(response));
    }).catch(function(err){
        response.message = err;
        res.send(JSON.stringify(response));
    });
});

router.get('/logout',function(req, res, next){
    const response = { status: false };
    req.session.destroy(function(err) {
        if(err){
            response.message = 'logout: Unknown error'
            res.send(JSON.stringify(response));
        }
        res.clearCookie('session-common-id');
        response.status = true;
        response.data = true;
        res.send(JSON.stringify(response));
    });
})

module.exports = router;
