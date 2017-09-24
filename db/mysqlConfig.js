/**
 * Created by Lutz on 2017/9/23 0023.
 */

/* 配置存储session信息的mysql */
const store ={
    user:'root',
    password:'',
    database:'TestApp',
    host:'localhost',
    port:3306,
};

// 存放sessionId的cookie配置
const cookie = {
    maxAge:30 * 60* 1000, // cookie有效时长
    expires:'',  // cookie失效时间
    path: '/', // 写cookie所在的路径,如果路径不能匹配时，浏览器则不发送这个Cookie
    domain: 'localhost', // 写cookie所在的域名
    httpOnly: true, // 如果在cookie中设置了httpOnly属性，则通过程序(JS脚本)将无法读取到COOKIE信息，防止XSS攻击产生
    overwrite: false,  // 是否允许重写
    secure: false, //当secure 值为 true 时，cookie 在 HTTP 中是无效，在 HTTPS 中才有效
    sameSite: '',//cookie_sameSite
    signed: '',//cookie_signed
}

module.exports = {
    store,
    cookie,
}