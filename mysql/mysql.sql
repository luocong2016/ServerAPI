#DROP DATABASE IF EXISTS `TestApp`;
CREATE DATABASE IF NOT EXISTS `TestApp` CHARACTER SET utf8;
USE `TestApp`;

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`( #用户表
    `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `userId` VARCHAR(32) NOT NULL UNIQUE,
    `user` VARCHAR(32) NOT NULL UNIQUE,
    `password` VARCHAR(32) NOT NULL,
    `validCode` int(12)  NOT NULL DEFAULT 0, #有效标志（0: 有效, 1: 无效）
    CHECK(`validCode` = 0 OR `validCode` = 1)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `user` (`userId`, `user`, `password`, `validCode`) VALUES ('test', 'test', 'test', NULL),
('Lutz', 'Lutz', 'Lutz', 1);


DROP TABLE IF EXISTS `valid`;
CREATE TABLE `valid`( #有效标志表
    `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `validId` VARCHAR(32) NOT NULL UNIQUE,
    `validName` VARCHAR(50) NOT NULL, #有效标志名称
    `validSynopsis` TINYTEXT DEFAULT NULL, #有效标志描述
    `validCode` int(12) DEFAULT 0 #有效标志（0: 有效）
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `valid` (`validId`, `validCode`, `validName`, `validSynopsis`) VALUES ('13fe35c0-a05c-11e7-aa02-c0ea56ec', '0', '正常', '有效标志'),
('14002c75-a05c-11e7-aa02-c0ea56ec', '1', '无效', '无效标志');

DROP TABLE IF EXISTS `course`;
CREATE TABLE `course`( #课程信息表
    `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `courseCode` VARCHAR(32) NOT NULL UNIQUE,
    `courseTypeCode` VARCHAR(2000) DEFAULT NULL, #课程类别Code
    `courseName` TINYTEXT DEFAULT NULL, #课程名称
    `courseSynopsis` TINYTEXT DEFAULT NULL, #课程描述
    `courseDetail` TEXT DEFAULT NULL, #课程详情
    `createtime` datetime DEFAULT CURRENT_TIMESTAMP, #创建时间
    `updatetime` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP #修改时间
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `course`(`courseCode`, `courseName`, `courseTypeCode`, `courseSynopsis`, `courseDetail`) VALUES('143ce037-a05c-11e7-aa02-c0ea56ec', '少儿编程1', '147694fb-a05c-11e7-aa02-c0ea56ec', '让中国儿童也学会编程！ 500多万美国青年正在学习编程！', '2016年3月2日 - 另外你说的统一时间还是个宏观的概念,这个仅仅是决定了UUID生产串中的某一部分相同而已,因为为了保证UUID的唯一性,规范定义了包括网卡MAC地址、时间戳...'),
('143dc47a-a05c-11e7-aa02-c0ea56ec', '机器人编程2', '1476aa18-a05c-11e7-aa02-c0ea56ec', '让中国儿童走向世界！基于乐高，面向国际机器人奥林匹克竞赛！玩中学，玩中炼，传播创新理念，培养创新人才！','穿行测试（walk through testing）是指追踪交易在财务报告信息系统中的处理过程。这是注册会计师了解被审计单位业务流程及其相关控制时经常使用的审计程序。在风险管理中，在正...'),
('3569037f-a063-11e7-aa02-c0ea56ec', '少儿编程3', '147693fb-a05c-11e7-aa02-c0ea56ec', '让中国儿童也学会编程！ 500多万美国青年正在学习编程！', '2016年3月2日 - 另外你说的统一时间还是个宏观的概念,这个仅仅是决定了UUID生产串中的某一部分相同而已,因为为了保证UUID的唯一性,规范定义了包括网卡MAC地址、时间戳...'),
('356e04e4-a063-11e7-aa02-c0ea56ec', '机器人编程4', '1476aa17-a05c-11e7-aa02-c0ea56ec', '让中国儿童走向世界！基于乐高，面向国际机器人奥林匹克竞赛！玩中学，玩中炼，传播创新理念，培养创新人才！','穿行测试（walk through testing）是指追踪交易在财务报告信息系统中的处理过程。这是注册会计师了解被审计单位业务流程及其相关控制时经常使用的审计程序。在风险管理中，在正...'),
('447c9628-a063-11e7-aa02-c0ea56ec', '少儿编程5', '147692fb-a05c-11e7-aa02-c0ea56ec', '让中国儿童也学会编程！ 500多万美国青年正在学习编程！', '2016年3月2日 - 另外你说的统一时间还是个宏观的概念,这个仅仅是决定了UUID生产串中的某一部分相同而已,因为为了保证UUID的唯一性,规范定义了包括网卡MAC地址、时间戳...'),
('4480aa97-a063-11e7-aa02-c0ea56ec', '机器人编程6', '1476aa16-a05c-11e7-aa02-c0ea56ec', '让中国儿童走向世界！基于乐高，面向国际机器人奥林匹克竞赛！玩中学，玩中炼，传播创新理念，培养创新人才！','穿行测试（walk through testing）是指追踪交易在财务报告信息系统中的处理过程。这是注册会计师了解被审计单位业务流程及其相关控制时经常使用的审计程序。在风险管理中，在正...');

DROP TABLE IF EXISTS `courseType`;
CREATE TABLE `courseType`( #课程类别表
    `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `courseTypeCode` VARCHAR(32) NOT NULL UNIQUE,
    `courseTypeName` VARCHAR(50) DEFAULT NULL, #课程类别名称
    `validCode` int(12) DEFAULT 0 #有效标志（0: 有效）
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `courseType` (`courseTypeCode`, `courseTypeName`) VALUES ('147694fb-a05c-11e7-aa02-c0ea56ec', '少年编程'),
('1476aa18-a05c-11e7-aa02-c0ea56ec','机器人编程');

DROP TABLE IF EXISTS `teacher`;
CREATE TABLE `teacher`( #教师信息表
    `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `teacherCode` VARCHAR(32) NOT NULL UNIQUE,
    `teacherName` VARCHAR(24) DEFAULT NULL, #教师姓名
    `teacherSynopsis` TINYTEXT DEFAULT NULL, #教师简介
    `teacherPicture` VARCHAR(500) DEFAULT NULL, ##照片图片路径
    `cellPhone` VARCHAR(20) DEFAULT NULL, #联系电话
    `courseTypeCode` VARCHAR(200) DEFAULT NULL, #教授课程(多选：code1^code2^...codeN)
    `weight` int(12) DEFAULT NULL, #权重(用于排名)
    `createtime` datetime DEFAULT CURRENT_TIMESTAMP, #创建时间
    `updatetime` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, #修改时间
    `schoolCode` VARCHAR(32) DEFAULT NULL, #校区Code
    `validCode` int(12) DEFAULT 0 #有效标志（0: 有效）
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `teacher` (`teacherCode`, `teacherName`, `teacherSynopsis`) VALUES ('15038b15-a05c-11e7-aa02-c0ea56ec', '石远丽', 'JAVA企业级应用专家，系统评测专家。曾任文思创新技术有限公司高级项目经理，具备多年的Java企业级应用系统开发经验。责任心强、授课思路清晰、逻辑严谨、复杂问题简单化，易于学生理解。善于寻找生活中的实例模拟编程过程、条理清晰、主次分明、重点难点突出、引人入胜。'),
('150399d9-a05c-11e7-aa02-c0ea56ec','汪美玲','授课自然,通过互动引导示范观察等方法。在教学中,开拓学生的创意思维,使得学生能轻松掌握编程技术的要点，细致耐心的解决学员的问题。');

DROP TABLE IF EXISTS `school`;
CREATE TABLE `school`( #校区信息表
    `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `schoolCode` VARCHAR(32) NOT NULL UNIQUE, #校区Code
    `schoolName` VARCHAR(24) DEFAULT NULL, #校区名称
    `schoolSynopsis` TINYTEXT DEFAULT NULL, #校区简介
    `schooladdress` VARCHAR(50) DEFAULT NULL, #校区具体地址
    `schoolPicture` VARCHAR(500) DEFAULT NULL, #校区图片路径
    `province_id` VARCHAR(50) DEFAULT NULL, #省
    `city_id` VARCHAR(50) DEFAULT NULL,#市
    `region_id` VARCHAR(50) DEFAULT NULL, #区/县
    `Telephone` VARCHAR(16) DEFAULT NULL #联系电话
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `school` (`schoolCode`, `schoolName`, `schoolSynopsis`, `schooladdress`, `Telephone`) VALUES ('1554b833-a05c-11e7-aa02-c0ea56ec', '北京大钟寺校区' ,NULL ,'海淀区北三环西路甲18号中鼎大厦B座3、5、8层', '400-690-6161'),
('1554b441-a05c-11e7-aa02-c0ea56ec', '北京大钟寺校区' ,NULL ,'海淀区北三环西路甲18号中鼎大厦B座3、5、8层', '400-690-6161'),
('1554b6f6-a05c-11e7-aa02-c0ea56ec', '北京万寿路校区' ,NULL ,'海淀区复兴路47号天行建商务大厦1106', '400-690-6162'),
('1554b788-a05c-11e7-aa02-c0ea56ec', '北京广渠门校区' ,NULL ,'东城区广渠家园25号启达大厦4层', '400-690-6163'),
('1554b7e1-a05c-11e7-aa02-c0ea56ec', '北京亚运村校区' ,NULL ,'朝阳区南沙滩66号院1号楼3层', '400-690-6164');

DROP TABLE IF EXISTS `news`;
CREATE TABLE `news`( #新闻动态信息表
    `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `newsCode` VARCHAR(32) NOT NULL UNIQUE,
    `newsTitle` VARCHAR(24) DEFAULT NULL, #新闻标题
    `newsSynopsis` TINYTEXT DEFAULT NULL, #新闻简介
    `newsDetail` TEXT DEFAULT NULL, #新闻详情
    `newsPicture` VARCHAR(500) DEFAULT NULL, ##新闻缩略图路径
    `createtime` datetime DEFAULT CURRENT_TIMESTAMP, #创建时间
    `updatetime` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, #修改时间
    `validCode` int(12) DEFAULT 0 #有效标志（0: 有效）
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `news`(`newsCode`, `newsTitle`, `newsSynopsis`, `newsDetail`) VALUES('158fe97f-a05c-11e7-aa02-c0ea56ec', '童程童美《青少年趣味编程》系列图书正版上线', '童程童美自主研发的《青少年趣味编程》系列图书正版上线了', '《规划》指出，实施全民智能教育项目，在中小学阶段设置人工智能相关课程，逐步推广编程教育，鼓励社会力量参与寓教于乐的编程教学软件、游戏的开发和推广。');
