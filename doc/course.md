## course

```
name:
    获取课程列表
url:
    course/getCourseList
params:
    * pageCurrent #当前页码[int]
    * pageSize #页面显示数据条数[int]
    courseName #课程名称[string]
return:
    id
    courseCode 课程ID
    courseTypeCode #课程类别Code
    courseName #课程名称
    courseSynopsis #课程描述
    courseDetail #课程详情
    createtime #创建时间
    updatetime #修改时间
```