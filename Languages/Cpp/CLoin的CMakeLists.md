# 什么是CMake

CMake是一个跨平台的安装（编译）工具，可以用简单的语句来描述所有平台的安装(编译过程)。他能够输出各种各样的makefile或者project文件，能测试编译器所支持的“C++”特性,类似UNIX下的automake。只是 CMake 的组态档取名为 CMakeLists.txt。Cmake 并不直接建构出最终的软件，而是产生标准的建构档（如 Unix 的 Makefile 或 Windows Visual C++ 的 projects/workspaces），然后再依一般的建构方式使用。这使得熟悉某个集成开发环境（IDE）的开发者可以用标准的方式建构他的软件，这种可以使用各平台的原生建构系统的能力是 CMake 和 SCons 等其他类似系统的区别之处。

使用JetBrains公司的clion时发现有时候代码没法编译，原来是没有CMakeLists.txt，于是在项目根目录生成一个空的CMakeLists.txt，编写内容如下：

```
#CMake最低版本号要求
cmake_minimum_required(VERSION 3.12)
#项目信息
project(chapter1)
#使用C++ 11标准
set(CMAKE_CXX_STANDARD 11)
#指定生成目标
add_executable(chapter1 myFirstProgram.cpp)
```

然后右击文件reload CMake Project就可以了。