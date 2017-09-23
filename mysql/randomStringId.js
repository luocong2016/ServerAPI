/**
 * Created by Lutz on 2017/9/23 0023.
 */


/* 去掉了容易混淆的字母 Oo0,Ll,9gq,Vv,Uu,I1*/
const charMatrix = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'


export const randomString = (len = 32) => {
    let pwd = '';
    for (i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * charMatrix.length));
    }
    return pwd;
}