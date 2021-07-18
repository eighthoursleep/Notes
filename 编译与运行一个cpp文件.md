---
title: 编译与运行一个cpp文件
date: 2019-07-05 20:38:44
tags: C++
toc: true
---

在Win 10中使用命令行界面编译、运行一个cpp文件

<!-- more -->

# 源文件准备

新建一个文件取名hello.cpp，代码如下：
```
int main(){
	return 0;
}
```

# 编译器准备

Visual C++组件包含一个C++命令编译器，这个编译器还可用于创建基本的控制台程序、通用Windows平台程序、桌面程序、设备驱动和.NET组建。

从微软的Visaul Studio官网下载Visual Studio Community 2017。

安装过程中注意勾选“Desktop development with C++”

# 打开开发者命令提示符

点击“开始”菜单，在程序列表找到并点击Visual Studio 2017文件夹下的“VS 2017的开发人员命令提示符”

输入如下命令以验证VC++的开发者命令提示符已设置妥当：
```
cl
```
窗口会反馈如下：
> C:\Program Files (x86)\Microsoft Visual Studio\2017\Community>cl
Microsoft (R) C/C++ Optimizing Compiler Version 19.15.26732.1 for x86
Copyright (C) Microsoft Corporation.  All rights reserved.
>
> usage: cl [ option... ] filename... [ /link linkoption... ]

# 编译cpp源文件

安装完编译所需的工具后，在开发者命令提示符界面中输入命令，将当前目录切换到源代码文件所在的目录。

```
d:
cd d:\ProgrammingLearning\cpp
```

输入以下代码编译源文件：

```
cl /EHsc hello.cpp
```

窗口反馈如下，则表示编译成功：
> Microsoft (R) C/C++ Optimizing Compiler Version 19.15.26732.1 for x86
> Copyright (C) Microsoft Corporation.  All rights reserved.
>
> hello.cpp
Microsoft (R) Incremental Linker Version 14.15.26732.1
> Copyright (C) Microsoft Corporation.  All rights reserved.
>
> /out:hello.exe
>hello-world.obj

# 运行程序
成功编译后在命令行界面执行命令：
```
hello
```

程序顺利执行，通过echo命令获取main函数的返回值(0)。

```
echo %ERRORLEVEL% 
```
