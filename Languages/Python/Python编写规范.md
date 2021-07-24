---
title: Python编写规范
date: 2019-03-19 16:48:24
tags: Python
---

Python中变量的定义规则、定义规范以及其他注意事项。
<!-- more -->

# 一、变量定义

## 规则：

1. 变量名只能是**字母**、**下划线**、**数字**的任意组合；
2. 变量名的**第一个字符不能是数字**；
3. 变量名不能和关键字重名。

## 规范：

1. 起变量名要**见名知意**；
2. **驼峰**形式命名；
3. 变量名字母要小写，**常量**名子母要**大写**。

**在shell中赋值变量，语句中不能加空格，如：**

```python
name="Mingjun Wei"（√）
name = "Mingjun Wei"（×）
```

# 二、不是同级的语句要顶格写

错误示范：

```python
_usrname = 'Mingjun Wei'
_pwd = 123456

usrname = input("name:")
pwd = int(input("password:"))

if _usrname == usrname and _pwd == pwd:
    print("Welcome {usrname} login ...".format(usrname=_usrname))
else:
    print("invalid username or password!")

 print("sssss")#此句前边要么和if语句同级顶格，要么
#和print("invalid username or password!")同级缩进(4个空格),
#前边不能留一个空格，否则会报错。
```

<font color='red'>编写前一定要画流程图。</font>