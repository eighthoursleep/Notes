---
title: C#入坑与VS的使用
date: 2020-01-14 14:13:12
tag: C Sharp
toc: true
---

《Professional C# 7 and .NET Core 2.0》、《C#高级编程（第7版）》笔记

<!--more-->

# 一、C#与.net

C#: 一种编程语言，可以开发基于.net平台的应用

.net能干啥？

1. 桌面应用程序：C/S程序，比如QQ，办公软件等（Winform应用程序）

2. Internet应用程序：B/S程序，即网站

# 二、入坑编程语言国际惯例——Hello World！

开发IDE：Visual Studio 2019

创建项目步骤：

打开VS2019 > 创建新项目 >  平台选择Windows > 语言选择C# > 项目类型选择控制台 > 自定义项目名、路径，选.Net框架4.7.2 > 完成

此时模板生成：

```c#
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ConsoleApp1
{
    class Program
    {
        static void Main(string[] args)
        {
        }
    }
}
```

于是我在Main函数下添加了两句

```c#
Console.WriteLine("Long may the sun shine!");  //控制台打印"Long may the sun shine!"
Console.ReadKey();  //等待任意键继续
```

Ctrl + S 保存，点击功能栏的【启动】，运行程序

![image_1](image_1.png)

# 三、VS中常用快捷键

- Ctrl + D：拷贝一行
- Ctrl + K + C : 注释选中代码
- Ctrl + K + U : 取消对所选代码的注释
- 折叠冗余代码：#region 和 #endregion
- ///：方法描述注释
- 输入try后按Tab键：快速生成try catch语句

# 四、VS界面各部分讲解

![image_2](image_2.png)

- 解决方案、项目、类之间的关系

  解决方案包含项目，一个解决方案可以有多个项目。

  项目包含类，一个项目可以包含多个类。

- Properties: 属性

  App.config: 配置文件

  Program.cs: 类文件

![image_3](image_3.png)

1. 引用命名空间（地址）
2. namespace: 项目名称
3. Class Program: Program类
4. Main函数：程序主入口
