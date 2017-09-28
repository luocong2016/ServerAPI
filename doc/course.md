## course

### getCourseList
```
name:
    获取课程列表
url:
    /course/getCourseList
mode:
    POST
params:
    * pageCurrent #当前页码[int]
    * pageSize #页面显示数据条数[int]
    courseName #课程名称[string]
return:
    status: true
    data: {
        id
        courseCode #课程ID
        courseTypeCode #课程类别Code
        courseName #课程名称
        courseSynopsis #课程描述
        courseDetail #课程详情
        createtime #创建时间
        updatetime #修改时间
    }
```

### updateCourse
```
name:
    修改课程信息
url:
    /course/updateCourse
mode:
    POST
params:
    * courseCode #课程ID
    courseTypeCode #课程类型编码 [string] | 多选"^" 分开且小于5
    courseName #课程名称 [string]
    courseSynopsis #课程简介 [string]
    courseDetail #课程详情 [string]
return:
    status: true,
    data:'Success message'
```

### insertCourse
```
name:
    添加课程信息
url:
    /course/insertCourse
mode:
    POST
params:
    courseTypeCode #课程类型编码 [string] | 多选"^" 分开且小于5
    * courseName #课程名称 [string]
    * courseSynopsis #课程简介 [string]
    * courseDetail #课程详情 [string]
return:
    status: true,
    data:'Success message'
```

### deleteCourse
```
name:
    删除课程信息
url:
    /course/deleteCourse
mode:
    POST
params:
    * courseCode #课程ID
return:
    status: true,
    data:'Success message'
```