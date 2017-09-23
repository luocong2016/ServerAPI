/**
 * Created by Lutz on 2017/9/23 0023.
 */
import mysql from 'mysql';
import { store } from './mysqlConfig';
const pool = mysql.createPool( store );

/*
 数据库操作
 @params
 //增
 sql:'INSERT INTO `user`(`username`,`password`) VALUES(?,?)';
 values:['username','password'];
 //删
 sql:'DELETE FROM `user`';
 values:;
 //改
 sql:'UPDATE `user` SET `password` = ? WHERE `username` = ?';
 values:['pass','username1'];
 //查
 sql:'SELECT * FROM `user`';
 values:;
 @return
 {Promise}
 */

const operation = (sql,values) => {
    return new Promise((resolve,reject) => {
        pool.getConnection((err,connection) => {
            if(err){
                reject(err);
            }else{
                connection.query(sql,values,(err,rows,fields) => {
                    if(err){
                        reject(err);
                    }else{
                        resolve(rows);
                    }
                    connection.release();
                })
            }
        })
    })
}
module.exports = { operation };