## tearch

### getTearchList
```
name:
    获取教师信息列表
url:
    /course/getTearchList
mode:
    POST
params:
    * pageCurrent #当前页码[int] <default: 1>
    * pageSize #页面显示数据条数[int] <default: 10>
    * validCode #有效标志[int] <default: *>
    TearchName #教师名称[string]
return:
    status: true
    data: {
       teacherCode #教师ID,
       teacherName #教师姓名
       teacherSynopsis #教师简介
       teacherPicture #照片图片路径
       cellPhone #联系电话
       courseTypeCode #教授课程 | (多选：code1^code2^...codeN)
       weight #权重(用于排名)
       createtime #创建时间
       updatetime #修改时间
       schoolCode #学校ID
       validCode #有效标志
    }
```

### updateTeacher
```
name:
    修改课程信息
url:
    /teacher/updateTeacher
mode:
    POST
params:
    * teacherCode #教师ID[string]
    * teacherName #教师姓名[string]
    * teacherSynopsis #教师简介[string]
    teacherPicture #教师图片路径[string]
    cellPhone #联系电话[string]
    courseTypeCode #教授课程[string] | (多选：code1^code2^...codeN) 且小于等于5
    weight #权重（用于排名）[int]
    schoolCode #学校ID[string]
    validCode #有效标志[string] <defalut: 0>
return:
    status: true,
    data:'Success message'
```

### insertTeacher
```
name:
    添加课程信息
url:
    /teacher/insertTeacher
mode:
    POST
params:
    * teacherName #教师姓名[string]
    * teacherSynopsis #教师简介[string]
    teacherPicture #教师图片路径[string]
    cellPhone #联系电话[string]
    courseTypeCode #教授课程[string] | (多选：code1^code2^...codeN) 且小于等于5
    weight #权重（用于排名）[int]
    schoolCode #学校ID[string]
    validCode #有效标志[string] <defalut: 0>
return:
    status: true,
    data:'Success message'
```

### deleteTeacher
```
name:
    删除课程信息
url:
    /teacher/deleteTeacher
mode:
    POST
params:
    * teacherCode #课程ID
return:
    status: true,
    data:'Success message'
```