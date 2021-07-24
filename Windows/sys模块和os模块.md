---
title: sys模块和os模块
date: 2019-03-20 01:04:16
tags: Python
---

初识sys模块和os模块
<!-- more -->

# sys模块

```python
import sys
"""
先到当前目录下找sys模块，因此py文件起名最好不要和标准库名相同
sys.path返回sys模块的所有目录
(以Python3.6为例)Python的第三方库一般保存在Python36/Lib/site-packages下，
标准库一般存放在Python36/Lib下
"""
print(sys.path)#打印环境变量
print(sys.argv)
#在pycharm中运行打印sys_mod.py的绝对路径
#在命令提示符窗口中运行打印sys_mod.py的相对路径
print(sys.argv[2])
#在命令提示符窗口中运行打印sys_mod.py的相对路径以及第2个参数
```

# os模块

```python
import os

cmd_res = os.system("dir") #执行命令，不保存结果
print("--->",cmd_res)
```

运行后
![result_1](result_1.png)

左下角的代表os.system("dir")执行成功返回的状态码，“0”表示成功，非“0”表示失败。

```python
import os

cmd_res = os.popen("dir").read()
'''
为什么加read()?

因为执行完os.popen("dir")后，结果存在内存的一个临时区域，
需要用read()方法把结果取出来。
'''
print("--->",cmd_res)
```

运行后

![result_2](result_2.png)

```python
import os
os.mkdir("new_dir")#在当前目录创建一个文件夹
```
运行后

![result_3](result_3.png)

