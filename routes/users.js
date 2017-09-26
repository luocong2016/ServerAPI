var express = require('express');
var router = express.Router();

/* GET users listing. */
app.get('/login',function(req,res){
    console.log('/login')
});

app.post('/login',function(req,res){
    if(req.body.username=="love" && req.body.password=="love"){
        var user = {'username':'love'};
        req.session.user = user;
        res.redirect('/admin/app/list');
    } else {
        res.redirect('/login');
    }
});

app.get('/logout',function(req,res){
    req.session.user = null;
    res.redirect('/login');
});

module.exports = router;
