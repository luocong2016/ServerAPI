/**
 * Created by Lutz on 2017/9/23 0023.
 */

/* 常量 */
const limit_5 = 5;
const limit_10 = 10;

/* 有效标志表 */
const valid = {
    defaultQuery: 'SELECT `validCode`, `validName`, `validSynopsis` FROM `valid` ORDER BY `validCode`',
}

/* 课程信息表 */
const course ={
    defaultQuery: 'SELECT * FROM `course` ORDER BY `createtime` DESC LIMIT ' + limit_5,
    insert: 'INSERT INTO `course`(`courseCode`, `courseTypeCode`, `courseName`, `courseSynopsis`, `courseDetail`) VALUES(UUID(), ?, ?, ?, ?)',
    updeta: 'UPDATE `course` SET `courseTypeCode` = ?, `courseName` = ?, `courseSynopsis` = ?, `courseDetail` = ? WHERE `courseCode` = ?',
    delete: 'DELETE FROM `course` WHERE `courseCode` = ?',
    select: 'SELECT * FROM `course` WHERE `courseCode` = ?',
}

/* 课程类别表 */
const courseType = {
    defaultQuery: 'SELECT * FROM `courseType`',
    delete: 'DELETE FROM `courseType` WHERE `courseTypeCode` = ?',
    select: 'SELECT * FROM `courseType` WHERE `courseTypeName` LIKE \'%?%\'',
}

/* 教师信息表 */
const teacher = {
    defaultQuery: 'SELECT * FROM `teacher` ORDER BY `weight` DESC LIMIT ' + limit_10,
    insert: 'INSERT INTO `teacher`(`teacherCode`, `teacherName`, `teacherSynopsis`, `teacherPicture`, `cellPhone`, `courseTypeCode`, `weight`, `schoolCode`, `validCode`) VALUES(UUID(), ?, ?, ?, ?,?, ?, ?, ?)',
    updeta: 'UPDATE `teacher` SET `teacherCode` = ?, `teacherName` = ?, `teacherSynopsis` = ?, `teacherPicture` = ?, `cellPhone` = ?, `courseTypeCode` = ?, `weight` = ?, `schoolCode` = ?, `validCode` = ? WHERE `teacherCode` = ?',
    delete: 'DELETE FROM `teacher` WHERE `teacherCode` = ?',
    select: 'SELECT * FROM `teacher` WHERE `teacherCode` = ?',
}

/* 学校信息表 */
const school = {
    defaultQuery: 'SELECT * FROM `school` WHERE `region_id` = ?',
    delete: 'DELETE FROM `school` WHERE `schoolCode` = ?',
    select: 'SELECT * FROM `school` WHERE `schoolCode` = ?',
}

/* 新闻动态信息表*/
const news = {
    defaultQuery: 'SELECT * FROM `news` ORDER BY `createtime` DESC LIMIT ' + limit_5,
    delete: 'DELETE FROM `news` WHERE `newsCode` = ?',
    select: 'SELECT * FROM `news` WHERE `newsCode` = ?',
}

module.exports = {
    valid,
    course,
}