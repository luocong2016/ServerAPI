/**
 * Created by Lutz on 2017/9/23 0023.
 */

import { limit } from './mysqlConfig'

module.exports = {
    insert: 'INSERT INTO `course`(`courseCode`, `courseTypeCode`, `courseName`, `courseSynopsis`, `courseDetail`) VALUES(UUID(), ?, ?, ?, ?)',
    updeta: 'UPDATE `course` SET `courseTypeCode` = ?, `courseName` = ?, `courseSynopsis` = ?, `courseDetail` = ? WHERE `courseCode` = ?',
    delete: 'DELETE FROM `course` WHERE `courseCode` = ?',
    select: 'SELECT * FROM `course` WHERE `courseCode` = ?',
    defaultQuery: 'SELECT * FROM `course` ORDER BY `updatetime` DESC LIMIT ' + limit,
}