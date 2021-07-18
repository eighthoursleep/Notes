---
title: CodeBlocks的入门操作
date: 2019-07-30 21:16:17
tags: CodeBlocks
---

安装好CodeBlocks 16.0.1后打开软件，新建工程：File -> New -> Project...

选择“Console application”，一路“Next”来到如下界面：

![photo_1](photo_1.png)

手动选择工程的保存路径，注意第二行新建工程的路径和最后一行保存工程文件的路径要保持一致如下图，否则后续编译运行程序时容易报奇怪的错。

![photo_2](photo_2.png)

设置好以后点击“Next”，编译器设置默认，点击“Finish”

![photo_3](photo_3.png)

新建项目完成后，可以看到source文件夹下有一个自动建好的带主函数的源文件main.cpp。可以把它删掉后另建：单击选中main.cpp，右键调出菜单选择“R二move file from project”

新建一个.cpp(或.c)文件:File -> New -> File...

选择“C/C++ source”，一路“Next”，选择源文件保存路径（建好的工程文件夹）并添上文件名“test01.cpp”（看见刚才的“main.cpp”记得删掉）。

此时，新建的源文件还没有在工程里，需要手动添加进去。选中工程，右键调出菜单，选择“Add files...”。选择“test01.cpp”,点击“打开”源文件就添加好了。

![photo_4](photo_4.png)

在“test01.cpp”写好代码,编译无报错后运行即可。

![photo_5](photo_5.png)



