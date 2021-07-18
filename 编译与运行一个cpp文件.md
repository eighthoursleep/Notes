---
title: "编译和运行一个Cpp文件"
date: "2021-07-11 18:00:01"
lastmod: "2021-07-18 14:33:01"
toc: true
tags: [C++,]
draft: false
---

<!--more-->
## VSCode
### 安装编译器集合包MinGW

如果使用VSCode，由于其只是一个纯文本编辑器，不是IDE，不含编译器和许多其它功能，编译器要自己装。

编译器下载地址：[MinGW-w64 - for 32 and 64 bit Windows](https://link.zhihu.com/?target=https%3A//sourceforge.net/projects/mingw-w64/files/) 往下翻，选最新版本中的`x86_64-posix-seh`。最好不要用 *Download Latest Version*，这个是在线安装包，可能因为国内的“网络环境”下载失败。

下好后解压到合适的位置，然后拷贝mingw64\bin路径，加到环境变量中的PATH里去。

打开一个命令窗口，输入`gcc`，应该会提示 *no input files* 而不是“不是内部命令或外部命令”或者“无法将 "gcc" 项识别为 cmdlet、函数、脚本文件或可运行程序的名称”。如果是“不是内部命令或外部命令”，说明gcc在的文件夹没有在环境变量的Path中，要加进去才行。如果加了还是这样，重启。如果重启了还不行，那就是你自己进行的操作有问题。

输`gcc -v`可以显示出gcc的版本。如果显示出来的版本与你刚下的不同/更老，说明Path里原本有老版本的编译器，可能是安装其它IDE时装上的，最好去掉老的。

这两项验证**一定要符合**，否则必须修改环境变量。



### 安装扩展

- C/C++：又名 cpptools，提供Debug和Format功能
- Code Runner：右键即可编译运行单文件，很方便；但无法Debug

可选：

- One Dark Pro：大概是VS Code安装量最高的主题
- C/C++ Compile Run: 安装以后按F6/F7直接编译运行（前提：安装了MinGW）
- C/C++ Extension

安装完cpptools后，一般 VSCode 弹窗还会提示下载 C/C++其他依赖如：C/C++ language components(Windows), 一般都无法下载成功。这时可以手动下载，地址：https://link.zhihu.com/?target=https%3A//github.com/Microsoft/VSCode-cpptools/releases

在下载页面中选择最新版本 `cpptools-win32.vsix`点击下载到本地。

回到VSCode ，按住`Ctrl+Shfit+P`，在弹窗的输入框中输入`Install from VSIX`（或简单输入`vsix`），再选择刚才下载好的`cpptools-win32.vsix`，VSCode 会自动安装，安装好后，重启 VSCode 即可。

## VS 2017

如果使用VS 2017开发，安装过程中注意勾选“Desktop development with C++”，这个组件包含C++命令编译器，而且该编译器还可用于创建基本的控制台程序、通用Windows平台程序、桌面程序、设备驱动和.NET组建。

### 打开开发者命令提示符

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

### 编译cpp源文件

新建一个源文件取名hello.cpp，代码如下：
```
int main(){
	return 0;
}
```
在开发者命令提示符界面中输入命令，将当前目录切换到源代码文件所在的目录。

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

### 运行程序
成功编译后在命令行界面执行命令：
```
hello
```

程序顺利执行，通过echo命令获取main函数的返回值(0)。

```
echo %ERRORLEVEL% 
```