DROP DATABASE IF EXISTS `test`;

CREATE DATABASE `test`;

USE `test`;

CREATE TABLE `valid`( #有效标志表
    `id`  int(12) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `validCode` VARCHAR(12) NOT NULL UNIQUE, #有效Code
    `validName` VARCHAR(50) NOT NULL, #有效标志名称
    `validSynopsis` TINYTEXT DEFAULT NULL #有效标志描述
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `valid` (`validCode`, `validName`, `validSynopsis`) VALUES('0', '正常', '有效标志');

CREATE TABLE `course`( #课程信息表
    `id` int(12) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `courseCode` VARCHAR(12) NOT NULL UNIQUE, #课程Code
    `courseTypeCode` VARCHAR(50) DEFAULT NULL, #课程类别
    `courseName` VARCHAR(50) DEFAULT NULL, #课程姓名
    `courseSynopsis` TINYTEXT DEFAULT NULL, #课程描述
    `courseDetail` TEXT DEFAULT NULL, #课程详情
    `createtime` datetime DEFAULT CURRENT_TIMESTAMP, #创建时间
    `updatetime` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP #修改时间
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `courseType`( #课程类别表
    `id` int(12) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `courseTypeCode` VARCHAR(12) NOT NULL UNIQUE, #课程类别Code
    `courseTypeName` VARCHAR(50) DEFAULT NULL #课程类别名称
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `teacher`( #教师信息表
    `id` int(12) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `teacherCode` VARCHAR(12) NOT NULL UNIQUE, #教师Code
    `teacherName` VARCHAR(24) DEFAULT NULL, #教师姓名
    `teacherSynopsis` TINYTEXT DEFAULT NULL, #教师简介
    `teacherPicture` VARCHAR(500) DEFAULT NULL, ##照片图片路径
    `cellPhone` VARCHAR(16) DEFAULT NULL, #联系电话
    `courseTypeCode` int(12) NOT NULL UNIQUE, #教授课程
    `createtime` datetime DEFAULT CURRENT_TIMESTAMP, #创建时间
    `updatetime` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, #修改时间
    `validCode` int(12) DEFAULT 0 #有效标志（0: 有效）
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `school`( #校区信息表
    `id` int(12) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `schoolCode` VARCHAR(12) NOT NULL UNIQUE, #校区Code
    `schoolName` VARCHAR(24) DEFAULT NULL, #校区名称
    `schoolSynopsis` TINYTEXT DEFAULT NULL, #校区简介
    `schooladdress` VARCHAR(50) DEFAULT NULL, ##校区地址
    `schoolPicture` VARCHAR(500) DEFAULT NULL, ##校区图片路径
    `Telephone` VARCHAR(16) DEFAULT NULL #联系电话
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `new`( #新闻动态信息表
    `id` int(12) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `newCode` int(12) NOT NULL UNIQUE, #新闻Code
    `newTitle` VARCHAR(24) DEFAULT NULL, #新闻标题
    `newSynopsis` TINYTEXT DEFAULT NULL, #新闻简介
    `newDetail` TEXT DEFAULT NULL, #新闻详情
    `createtime` datetime DEFAULT CURRENT_TIMESTAMP, #创建时间
    `updatetime` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, #修改时间
    `newPicture` VARCHAR(500) DEFAULT NULL, ##新闻图片路径
    `validCode` int(12) DEFAULT 0 #有效标志（0: 有效）
)ENGINE=InnoDB DEFAULT CHARSET=utf8;