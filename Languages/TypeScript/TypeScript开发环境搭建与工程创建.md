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

执行以下命令生成编译设置文件`tsconfig.json`

```
tsc --init
```

内容如下：

```json
{
  "compilerOptions": {
    "target": "es2018",		// 规定ES目标版本: 'ES3' (默认), 使用最新的'ES2018'或者'ESNEXT'
    "module": "commonjs",	// 规定模块代码生成规范为'commonjs'
    "outDir": "./bin",		//规定编译结果输出目录
    "rootDir": "./src"		//规定源文件目录
  }
}

```

`outDir`和`rootDir`默认是被注释的，可以取消这两项的注释，分别填入输出路径和源文件路径

编译选项完整列表请看：https://www.tslang.cn/docs/handbook/compiler-options.html

### 第3步：添加TypeScript源文件

在项目文件夹下新建名为`src`的文件夹，在里边新建一个`.ts`文件，取名为`index.ts`，编写内容：

```typescript
console.clear();	//清理命令行窗口
console.log("Hi, I want eighthoursleep.");
```

### 第4步：编译并执行代码

TypeScript文件必须被编译为纯JavaScript文件才可以被浏览器或Node.js运行时执行。
在**项目根目录**下执行以下命令进行编译：

```
tsc
```

编译器读取tsconfig.json，定位`src`目录里的TypeScript源文件。创建`bin`文件夹并向其中写入JavaScript文件。

使用下边的命令执行`index.js`

```
node bin/index.js
```
