/**
 * Created by Lutz on 2017/9/27.
 */

fetch('http://localhost:3000/users/login', {
    method: 'post',
    mode: 'cors',
    credentials: 'include', //保持会话的一致性
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        user: 'user',
        password: 'hubot',
    })
}).then(function (data) {
    console.log('Request succeeded with JSON response', data);
}).catch(function (error) {
    console.log('Request failed', error);
});


/*
nginx 配置

location ^~ /test {
    add_header 'Access-Control-Allow-Origin' '*';
    add_header 'Access-Control-Allow-Credentials' 'true';
    add_header 'Access-Control-Allow-Methods' 'OPTION, POST, GET';
    add_header 'Access-Control-Allow-Headers' 'X-Requested-With, Content-Type';
}*/
