# TypeScript开发环境搭建与工程创建



## 一、准备开发环境

### 第1步：安装Node.js

下载安装Node.js，下载链接在这：https://nodejs.org/

安装后用以下命令查看版本号来检查是否安装成功：

```
node --version
npm --version
```

### 第2步：安装Git

下载链接在这：https://git-scm.com/ 

安装后用以下命令查看版本号检查是否安装成功：

```
git --version
```

### 第3步：安装TypeScript包

执行安装命令：

```
npm install --global typescript@4.2.2
```

安装结束后执行以下命令查看版本号来检查是否安装正确：

```
tsc --version
```

这个包包含了一个叫`tsc`的编译器，它可以将`.ts`文件编译为`.js`文件

### 第4步：安装IDE

用的是VSCode，下载链接在这：https://code.visualstudio.com



## 二、创建工程

### 第1步：初始化工程

新建一个存放项目的文件夹，在里边执行以下命令进行初始化：

```
npm init --yes
```

这个命令生成了一个`package.json`文件，这个文件用于记录该项目需要用到的包以及设置开发工具。

### 第2步：创建编译设置文件

为了给编译做一些设置，新建一个`.json`文件，取名为`tsconfig.json`，写入内容如下：

```json
{
	"compileOptions":{
		"target":"es2018",
		"outDir":"./dist",
		"rootDir":"./src",
		"module":"commonjs"
	}
}
```

这个段设置告诉编译器：

- 要使用的js版本
- 要编译的`.ts`源文件在`./src`目录下
- 将编译结果输出到`./dist`目录下
- 加载分立的文件要使用`commonjs`标准

### 第3步：添加TypeScript源文件

在项目文件夹下新建名为`src`的文件夹，在里边新建一个`.ts`文件，取名为`index.ts`，编写内容：

```typescript
console.clear();	//清理命令行窗口
console.log("Hi, I want eighthoursleep.");
```

### 第4步：编译并执行代码

TypeScript文件必须被编译为纯JavaScript文件，才可以被浏览器或Node.js运行时执行。在**项目根目录**下执行以下命令进行编译：

```
tsc
```

编译器读取tsconfig.json，定位`src`目录里的TypeScript源文件。创建`dist`文件夹并向其中写入JavaScript文件。

使用下边的命令执行`index.js`

```
node dist/index.js
```
