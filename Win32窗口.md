---
title: Win32窗口
date: 2020-01-29 12:15:19
tags: C++
---

没写完...

<!--more-->

# 一、创建项目

- 开发软件：VS2017

新建项目 > Visual C++ > Windows桌面 > Windows桌面向导，填好项目名，项目路径后，下一步，选择“桌面应用程序(.exe)”，勾选“空项目”，点击确定。

PS：在VS2013、2015中，窗口程序叫”Win32项目“，在VS2017、2019中叫做“桌面应用程序"。



# 二、

在线搜索API网址：https://docs.microsoft.com/zh-cn/

1. 头文件：windows.h文件是win32 API的主要头文件，首字母大小写都行。

2. 主函数WinMain：是main函数的一个自定义函数，在底层由main函数调用它。

   右键函数名，选择“转到定义”可以查看函数的具体定义。

   1. 返回值为int类型。

   2. 调用约定

      - WINAPI
      - 作用：决定函数名字编译方式、参数入栈顺序、函数逻辑调用时间

   3. 参数：由系统传递供我们使用

      - HINSTANCE hInstance：实例句柄，当前软件运行时，系统分配给的唯一ID，int类型。

      - HINSTANCE hPreInstance：前一个实例句柄，即前一个打开的软件的句柄，值为NULL，功能名存实亡。

      - LPSTR lpCmdLine：命令行参数，main函数传递到WinMain函数的参数，类型为char*，

        PS：P或LP开头的转义变量类型均为指针类型

      - int nShowCmd：窗口显示方式，默认是窗口正常显示，值为1

      - SAL：微软源代码注释语言（8个）

        功能：提醒编译器帮我们检查函数参数可能存在的问题，避免这些问题在运行时爆发。

   4. SDL：安全开发生命周期

# 三、

1. WNDCLASS：窗口类（类是结构体的拓展）
2. WNDCLASSEX：拓展版本的窗口类



