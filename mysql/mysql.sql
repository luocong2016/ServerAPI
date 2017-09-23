DROP DATABASE IF EXISTS `TestApp`;

CREATE DATABASE `TestApp`;

USE `TestApp`;

CREATE TABLE `valid`( #有效标志表
    `validId` VARCHAR(32) NOT NULL PRIMARY KEY,
    `validCode` int(12) NOT NULL, #有效Code
    `validName` VARCHAR(50) NOT NULL, #有效标志名称
    `validSynopsis` TINYTEXT DEFAULT NULL #有效标志描述
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `valid` (`validId`, `validCode`, `validName`, `validSynopsis`) VALUES(UUID(), '0', '正常', '有效标志'),
(UUID(), '1', '无效', '无效标志');

CREATE TABLE `course`( #课程信息表
    `courseCode` VARCHAR(32) NOT NULL PRIMARY KEY,
    `courseTypeCode` VARCHAR(32) DEFAULT NULL, #课程类别Code
    `courseName` VARCHAR(50) DEFAULT NULL, #课程名称
    `courseSynopsis` TINYTEXT DEFAULT NULL, #课程描述
    `courseDetail` TEXT DEFAULT NULL, #课程详情
    `createtime` datetime DEFAULT CURRENT_TIMESTAMP, #创建时间
    `updatetime` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP #修改时间
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `course`(`courseCode`, `courseName`, `courseSynopsis`, `courseDetail`) VALUES(UUID(), '少儿编程', '让中国儿童也学会编程！ 500多万美国青年正在学习编程！', '2016年3月2日 - 另外你说的统一时间还是个宏观的概念,这个仅仅是决定了UUID生产串中的某一部分相同而已,因为为了保证UUID的唯一性,规范定义了包括网卡MAC地址、时间戳...'),
(UUID(), '机器人编程', '让中国儿童走向世界！基于乐高，面向国际机器人奥林匹克竞赛！玩中学，玩中炼，传播创新理念，培养创新人才！','穿行测试（walk through testing）是指追踪交易在财务报告信息系统中的处理过程。这是注册会计师了解被审计单位业务流程及其相关控制时经常使用的审计程序。在风险管理中，在正...');


CREATE TABLE `courseType`( #课程类别表
    `courseTypeCode` VARCHAR(32) NOT NULL PRIMARY KEY,
    `courseTypeName` VARCHAR(50) DEFAULT NULL #课程类别名称
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `courseType` (`courseTypeCode`, `courseTypeName`) VALUES(UUID(), '少年编程'),
(UUID(),'机器人编程');


CREATE TABLE `teacher`( #教师信息表
    `teacherCode` VARCHAR(32) NOT NULL PRIMARY KEY,
    `teacherName` VARCHAR(24) DEFAULT NULL, #教师姓名
    `teacherSynopsis` TINYTEXT DEFAULT NULL, #教师简介
    `teacherPicture` VARCHAR(500) DEFAULT NULL, ##照片图片路径
    `cellPhone` VARCHAR(16) DEFAULT NULL, #联系电话
    `courseTypeCode` int(12) NOT NULL, #教授课程
    `createtime` datetime DEFAULT CURRENT_TIMESTAMP, #创建时间
    `updatetime` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, #修改时间
    `validCode` int(12) DEFAULT 0 #有效标志（0: 有效）
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `teacher` (`teacherCode`, `teacherName`, `teacherSynopsis`) VALUES(UUID(), '少年编程'),
(UUID(),'机器人编程');

CREATE TABLE `school`( #校区信息表
    `schoolCode` VARCHAR(32) NOT NULL PRIMARY KEY, #校区Code
    `schoolName` VARCHAR(24) DEFAULT NULL, #校区名称
    `schoolSynopsis` TINYTEXT DEFAULT NULL, #校区简介
    `schooladdress` VARCHAR(50) DEFAULT NULL, ##校区地址
    `schoolPicture` VARCHAR(500) DEFAULT NULL, ##校区图片路径
    `Telephone` VARCHAR(16) DEFAULT NULL #联系电话
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `school` (`schoolCode`, `schoolName`, `schoolSynopsis`, `schooladdress`, `Telephone`) VALUES(UUID(), '北京大钟寺校区' ,NULL ,'海淀区北三环西路甲18号中鼎大厦B座3、5、8层', '400-690-6161'),
(UUID(), '北京大钟寺校区' ,NULL ,'海淀区北三环西路甲18号中鼎大厦B座3、5、8层', '400-690-6161'),
(UUID(), '北京万寿路校区' ,NULL ,'海淀区复兴路47号天行建商务大厦1106', '400-690-6162'),
(UUID(), '北京广渠门校区' ,NULL ,'东城区广渠家园25号启达大厦4层', '400-690-6163'),
(UUID(), '北京亚运村校区' ,NULL ,'朝阳区南沙滩66号院1号楼3层', '400-690-6164');

CREATE TABLE `new`( #新闻动态信息表
    `newCode` VARCHAR(32) NOT NULL PRIMARY KEY,
    `newTitle` VARCHAR(24) DEFAULT NULL, #新闻标题
    `newSynopsis` TINYTEXT DEFAULT NULL, #新闻简介
    `newDetail` TEXT DEFAULT NULL, #新闻详情
    `createtime` datetime DEFAULT CURRENT_TIMESTAMP, #创建时间
    `updatetime` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, #修改时间
    `newPicture` VARCHAR(500) DEFAULT NULL, ##新闻图片路径
    `validCode` int(12) DEFAULT 0 #有效标志（0: 有效）
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `new`(`newCode`, `newTitle`, `newSynopsis`, `newDetail`) VALUES(UUID(), '童程童美《青少年趣味编程》系列图书正版上线', '童程童美自主研发的《青少年趣味编程》系列图书正版上线了', '《规划》指出，实施全民智能教育项目，在中小学阶段设置人工智能相关课程，逐步推广编程教育，鼓励社会力量参与寓教于乐的编程教学软件、游戏的开发和推广。')
