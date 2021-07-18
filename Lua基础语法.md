---
title: Lua基础语法
date: 2020-01-23 11:41:20
tags: Lua
---

环境搭建、Lua基本语法、

<!--more-->

## Lua简介

巴西大学研究项目，设计目的是在嵌入应用程序中，提供灵活的扩展和定制功能。[Lua](https://www.lua.org/)由C语言编写而成，于1993年完成开发。

Lua无需编译，利于集成与扩展（C#、Java、C++等）。

## 开发环境搭建


在Windows上环境：[SciTE](https://github.com/rjpcomputing/luaforwindows/releases)

IDE：VSCode、IDEA、LuaStudio

选好安装路径，一路Next，完成安装后即可在该环境下编写 Lua 程序并运行。

在哪运行？
![image-20200123115402942](image-20200123115402942.png)

或者按快捷键F5。

快捷键Ctrl+D，复制光标所在行并插入到光标的下一行。

## 交互式编程、脚本编程

1. 交互式编程方式

   打开cmd控制命令窗口，使用命令：
   
   > Lua -i

2. 脚本式编程方式
   
   将Lua代码保存成.lua文件然后运行。
   
   ```lua
#!/usr/local/bin/lua
   
   print("Hello world!")
   ```

   上边第一行表示指定解释器，解释器执行时会忽略井号开头的第一行。
   
3. 注释格式

   ```lua
   -- 单行注释

   --[[
   第一种
   多行
   注释
   ]]--
   
   --[[第二种
   多行
   注释
   ]]
   
   --[[
   第三种
   多行
   注释--]]
   ```

### 标识符、关键字

1. 标识符组成

   - 字母、数字、下划线；

   - 必须以字母/下划线开头；

   - 区分大小写；

2. 关键字
   - 保留关键字不能用作变量名或自定义标识符：
     and, break, do, else, elseif, end, false, for, function, if, in , local, nil, not, or, repeat, return, then, true, until, while
   - 一般约定，用下划线开头连接一串大写字母的名字比如：_VERSION，被保留用于Lua内部全局变量。

### 全局变量、局部变量

- 全局变量：

  - 默认情况下，变量总被认为是全局的，全局变量不需要声明，给一个变量赋值即可创建该全局变量。
  - 写在函数外部
  - 作用范围从定义的那一行开始到文件末尾

  ```lua
  b = 10
  print(b)
  b = nil -- 要删除一个变量，就给它赋值为nil
  print(b) -- 当且仅当一个变量的值不为nil时，这个变量即存在
  ```

  > 10
  > nil

- 局部变量：

  - 用关键字“local”定义
  - 写在函数内，if语句内
  - 作用范围从定义的那一行开始到函数结束或return

## 赋值语句

```lua
a, b, c = 0, 1;
print("a\t".."b\t".."c")
print(a, b, c);

a, b = a+1,b+1,b+2; -- 没有被赋值的变量会被忽略
print(a, b, c);

a, b, c = 0; -- 同时为多个变量赋相同的值
print(a, b, c);
```

> a	b	c
> 0	1	nil
> 1	2	nil
> 0	nil	nil

### 简单变量类型（8种）

Lua里所有的变量声明都**不需要声明变量类型**，类似C#里的var。

Lua中的一个变量可以随便赋值并自动识别类型

**nil**表示空数据，无效值，类似null。

**boolean**布尔类型，存储true或false。

**number**双精度实浮点数)

**string**字符串类型（双引号或单引号括起来，Lua里没有char）

**table**表类型，关联数组，通过构造表达式产生

**userdata**（任意存储在变量中的C数据结构）

**function**函数

**thread**独立线程

详细例子与注意事项见《Lua变量类型》。

### 运算符

1. 算数运算符 +，-，\*，/，%，^ （Lua中没有自增自减++、--，也没有没有复合运算符+=、-=、/=、*=、%=）
2. 关系运算符（条件运算符） <=，<，>，>=，==，~=（不等于）
3. 逻辑运算符**and**，**or**，**not**分别表示“与”、“或”、“非”，类似C#中的&&，||，！。

4. Lua不支持位运算符（&，|），需要我们自己实现
5. Lua不支持三目运算符（ ? : ）

```lua
-- 算数运算符例子：
print("string可以自动转为number: " .. "123.4" + 20)
print("幂运算: " .. 2 ^ 10)
```

### 条件分支语句

```lua
-- 单分支
if [条件] then
    ...
end
-- 双分支
if [条件] then
    ...
else
    ...
end
-- 多分支
if [条件] then
    ...
elseif [条件]
        ...
else
        ...
end
```

Lua中不支持switch语法不支持三目运算符，需要自己实现。

### 循环（while循环、repeat循环、for循环）

```lua
while [进入循环条件] do
    ...
end

repeat
    ...
until [结束循环条件]

for i = [起始索引],[结束索引],[递增数量(默认为1,可以为负数)] do -- i会递增
	...
-- break(可以终止循环，没有continue语句)
end
```

```lua
-- for循环遍历数组例子：
a = {[0] = 1,2,[-1] = 3,4,5}

for k,v in pairs(a) do -- k存放索引，v存放值
	print(k .." - " .. v)
end
print()
for k in pairs(a) do
	print(k .." - " .. a[k])
end
```

> 1 - 2
> 2 - 4
> 3 - 5
> 0 - 1
> -1 - 3
>
> 1 - 2
> 2 - 4
> 3 - 5
> 0 - 1
> -1 - 3

### 函数（方法）

```lua
--函数定义格式
function [function_name](param1, param2, ...)
	...
    -- return ...
end
-- 或者
a = funtion()
end
```

详细例子和用法，参阅《Lua函数》

### 通过表来实现面向对象

```lua
myTable = {} -- 声明对象
local this = myTable -- 声明this关键字代表当前对象
-- 声明并初始化对象中的属性
myTable.name = "MJ"
myTable.age = 24
-- 声明并定义对象中的方法
myTable.functionName = function()
    ...
end

function myTable.function()
    ...
end
```

```lua
Enemy = {}
local this = Enemy

Enemy.hp = 100
Enemy.speed = 12.3

Enemy.Move = function()
	print("敌人在移动")
end

function Enemy.Attack()
    print(this.hp,"attack")
    this.Move()
end

Enemy.Attack()
```

