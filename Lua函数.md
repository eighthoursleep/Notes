---
title: Lua函数
date: 2020-01-26 18:04:46
toc: true
tags: Lua
---

没写完...

无参无返回、有参、标准库函数

<!--more-->

## 自定义函数

```lua
--函数的两种定义格式
function [function_name](param1, param2, ...)
	...
    -- return ...
end
-- 或者
a = funtion()
end
```

### 无参数无返回值

```lua
function F1()
    print("执行F1 !")
end
F1() -- 函数必须在先定义再使用
F2 = function()
	print("执行F2 !")
end
F2()
```

> 执行F1 !
> 执行F2 !

### 多参数多返回

```lua
function F3(a)
	print(a)
end
function F4(a)
	return a , "- yes?", true
end
F3(233)
F3("Hi :)")
F3(true)
F3() -- 外部没填参数，则传入nil
F3(11,22,33) -- 多传入的参数会被丢弃
-- 多返回值时，在前边声明多个变量来接收
temp1, temp2, temp3 = F4("-- Excuse me.")
print(temp1, temp2, temp3)
-- 如果变量不够，直接去对应位置的返回值
temp1, temp2 = F4("-- Excuse me.")
print(temp1, temp2)
-- 如果变量多了，多出的变量会被赋值为nil
temp1, temp2, temp3, temp4 = F4("-- Excuse me.")
print(temp1, temp2, temp3, temp4)
```

> 233
> Hi :)
> true
> nil
> 11
> -- Excuse me.	-- yes?	true
> -- Excuse me.	-- yes?
> -- Excuse me.	-- yes?	true	nil

### 函数不可重载

```lua
-- 函数重载即函数名相同，参数类型不同，或者参数个数不同
-- Lua中函数不支持重载
-- 默认调用最后一个声明的函数
function F6()
	print("Kojima is God!")
end

function F6(str)
	print(str)
end

F6()
```

> nil

### 参数个数未知

```lua
function F7( ... )
	-- 未知个数的参数，用一个表存起来，再用
	arg = {...}
	for i=1,#arg do
		print(arg[i])
	end
end
F7(1,"♂", true,4,5,6)
```

> 1
> ♂
> true
> 4
> 5
> 6

### 函数嵌套

```lua
function F8()
	return function()
		print(666)
	end
end
f9 = F8()
f9()
-- 闭包
function F9(x)
	-- 改变传入参数的生命周期
	return function (y) --返回函数地址，注意不是执行函数
		return x + y
	end
end
F10 = F9(10)
-- F10实际接收到的是F9的执行结果
-- 即: function(y) return 10 + y end
print(F10(5))
-- 执行F10
-- 即: function(5) return 10 + 5 end
```

> 666
> 15

闭包在Lua中是一个非常重要的概念，闭包是由函数和与其相关的引用环境组合而成的实体。

闭包=函数+引用环境。子函数可以使用父函数中的局部变量，这种行为叫做闭包。

lua中函数是一种类型，可以被存放在变量或者数据结构中，可以当做参数传递给另一个函数，也可以是一个函数的返回值，也可以在运行期间被创建。Lua中还有一个非局部变量的概念，可以理解为不是在局部作用范围内定义的一个变量，同时，它又不是一个全局变量，也就是大家说的upvalue。这种变量主要应用在嵌套函数和匿名函数中（这个变量的环境就是前面说的引用环境）。

在Lua函数中再定义函数，称为内嵌函数，内嵌函数可以访问外部函数已经创建的所有局部变量，而这些变量就被称为该内嵌函数的upvalue（upvalue实际指的是变量而不是值），这些变量可以在内部函数之间共享。于是成全了Lua中闭包。

## 标准库（标准函数）

Lua内置提供了一些[常用的函数](https://www.lua.org/manual/5.4/)帮助我们开发：

1. 数学处理的math相关函数
2. 字符串处理的string相关函数
3. 表处理的table相关函数
4. 文件操作的io相关函数

### math、string相关函数

```lua
print(math.abs(-90))	-- 求绝对值
print(math.max(12,34,56,78))	--求最大值
print(math.min(12,34,56,78))	--求最小值
print(math.random())	--[[返回一个伪随机数。
无参时，返回在[0,1)范围内概率均匀分布的浮点型伪随机数；
参数为两个整型数m、n时，返回一个在[m,n]范围内概率均匀分布的整型伪随机数；
参数为一个正数n时，等价于math.random(1,n)；
math.random(0)返回一个所有位（bit）都伪随机的整型数。]]--

sentence = "Skyrim belongs to the Nord !"
print(string.upper(sentence)) -- 字符串全部转小写
print(string.lower(sentence))	-- 字符串全部转大写
print(string.sub(sentence,1,3))	-- 字符串拆分，从第1个字符开始到第3个结束
print("https://".."www.baidu.com") -- 字符串相加
--[[
string.byte
string.char
string.find
string.format

toString()把一个数字转化成字符串
tonumber()把一个字符串转化成数字
]]--
```

### table相关函数

Lua中的table类似C#中的字典，其实就是一个key-value键值对的数据结构。

```lua
-- table的创建：
myTable = {} -- 表名后面使用{}赋值，表示一个空的表
-- table的赋值：
myTable[3] = 34 -- 当键是数字的赋值方式
myTable["name"] = "MJ" -- 当键是字符串的赋值方式
myTable.name = "mj" -- 当键是字符串的赋值方式
-- table的访问：
myTable[3]	-- 当键是数字的时候，只有这一种访问方式
myTable.name	-- 当键是字符串的时候有两种访问方式
myTable["name"]
-- table的第二种创建方式：
myTable = {name="MJ",age="24",isMale=true} --[[
表创建之后依然可以添加数据
表内元素的访问：
myTable.name
myTable["name"]
]]
-- table的第三种创建方式：
myTable = {12,34,5,"mj",true}	--[[当没有键的时候，
编译器会默认给每一个值，添加一个数字的键，该键从1开始]]
```

表的遍历分为两种：

```lua
-- 1. 如果只有数字键，并且是连续的可以使用下面的遍历
for index = 1，table.getn(myTable) do
    ...
end
-- 2. 所有的表都可以通过下面的方式遍历
for index,value in pairs(myNames) do
    print(index,value)
end

-- 注意：
-- 当我们获取 table 的长度的时候无论是使用 # 还是 table.getn 其都会在索引中断的地方停止计数，而导致无法正确取得 table 的长度。
-- 可以使用以下方法来代替：
function table_leng(t)
  local leng=0
  for k, v in pairs(t) do
    leng=leng+1
  end
  return leng;
end
```

表相关的函数

```lua
table.concat -- 把表中所有数据连成一个字符串
table.insert -- 向指定位置插入一个数据
table.move -- 移动数据
table.pack -- 包装成一个表
table.remove -- 移除指定位置的数据
table.sort -- 排序
table.unpack -- 返回一个数组，指定范围的数组
```

## 求最大值与函数作为参数传递

```lua
function max(num1, num2)
	if (num1 > num2) then
		result = num1;
	else
		result = num2;
	end
	return result;
end

print("两值比较最大值为",max(10,4));
print("两值比较最大值为",max(5,6));

myprint = function(param)
	print("这是一个打印函数-##", param,"##")
end

function add(num1, num2, functionPrint)
	result = num1 + num2;
	functionPrint(result);
end

myprint(10);
add(2, 5, myprint);
```

> 两值比较最大值为	10
> 两值比较最大值为	6
> 这是一个打印函数-##	10	##
> 这是一个打印函数-##	7	##

