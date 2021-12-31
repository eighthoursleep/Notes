# Lua函数

## 参数的简化

函数若只有一个参数，且这个参数是一个字符串或Table构造式，则圆括号可以省略，这种是一种语法现象。

```lua
myName = "";

function SetName(name)
	myName = name;
end

SetName "Mi 12 Pro" -- 参数简化

print(myName)

function PrintArr(arr)
	print(table.concat( arr, " + "));
end

PrintArr {"点赞","投币","收藏","关注"} -- 参数简化
```

> Mi 12 Pro
> 点赞 + 投币 + 收藏 + 关注

## 可变参数

"可变参数"又称”变长参数“，使用符号`...`表示多个参数，主要应用在形参中。类似C#的para关键字。

```lua
function PrintMultiArgs( ... )
	arg = {...} -- 未知个数的参数，用一个表存起来，再用
	for k,v in pairs(arg) do -- pairs关键字可以输出集合中的所有非nil 数值,ipairs会在遇到nil时中断
		print(v)
	end
end
PrintMultiArgs(1999,"♂", true, nil, 648)
```

> 1999
> ♂
> true
> 648

**注意：**

1. Lua 5.0以上版本通过局部变量`arg`可以接收所有变长参数。`arg`是Lua中内置的函数，本质是把可变参数封装成一个表。`#arg`可以表示参数的个数。

2. 函数访问变长参数时，使用`{...}`表达式。

如果变长参数中可能包含`nil`，则必须使用`select`来访问变长参数。调用`select`时必须传入一个固定的实参`select`（选择开关）和一系列变长参数。

格式：

1. `select(index, ...)`返回从`index`下标开始，一直到变长参数列表结尾的元素。
2. `select('#', ...)`返回变长参数列表的长度。

```lua
function PrintMultiArgs( ... )
	local value
	for i = 1, select('#', ...) do
		value = select(i, ...)
		print(value)
	end

	print(select(1,...))
	print(select(2,...))

	for i = 1, select('#', ...) do
		print(select(i, ...))
	end
end

PrintMultiArgs(1999,"♂", true, nil, 648)
```

> 1999
> ♂
> true
> nil
> 648
> 1999	♂	true	nil	648
> ♂	true	nil	648
> 1999	♂	true	nil	648
> ♂	true	nil	648
> true	nil	648
> nil	648
> 648

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

## Lua标准库函数

Lua内置提供了一些[常用的函数](https://www.lua.org/manual/5.4/)帮助我们开发：

1. 数学处理的math相关函数
2. 字符串处理的string相关函数
3. 表处理的table相关函数
4. 文件操作的io相关函数
4. 操作系统库函数

### math相关函数

```lua
print(math.abs(-90))	-- 求绝对值
print(math.max(12,34,56,78))	--求最大值
print(math.min(12,34,56,78))	--求最小值
print(math.sin(0)) -- 正弦
print(math.cos(0)) -- 余弦
print(math.sqrt(25)) -- 平方根
print(math.floor(18.88)) -- 舍去取整

print(math.random())	--返回一个伪随机数。
```

`math.random()`：

1. 无参时，返回在[0,1)范围内概率均匀分布的浮点型伪随机数；
2. 参数为两个整型数m、n时，返回一个在[m,n]范围内概率均匀分布的整型伪随机数；
3. 参数为一个正数n时，等价于math.random(1,n)；
4. math.random(0)返回一个所有位（bit）都伪随机的整型数。

```lua
print(math.randomseed(8000)) -- 随机因子，越大越随机
print(math.random(1,10)) -- 产生随机数
```

自己写一个随机性比较强的随机数获取函数：

```lua
function GetRandom(min, max)
	local strTime = tostring(os.time()) --取时间戳
	print("strTime",strTime) --时间戳转字符串
	local strReverse = strTime.reverse(strTime) --反转字符串
	local strRandom = string.sub(strReverse, 1, 6) -- 限制随机因子大小
	print("strRandom", strRandom)

	math.randomseed(strRandom) --设置随机因子
	return math.random(min, max)
end

print(GetRandom(1,10))
```



### string相关函数

```lua
sentence = "Skyrim Belongs To The Nord !"
print(string.upper(sentence)) -- 字符串全部转小写
print(string.lower(sentence))	-- 字符串全部转大写
print(string.sub(sentence,1,3))	-- 字符串拆分，从第1个字符开始到第3个结束

--[[
string.byte
string.char
string.find
string.format

toString()把一个数字转化成字符串
tonumber()把一个字符串转化成数字
]]--
```



### 操作系统库函数

```lua
print(os.date()) -- 返回当前日期
print(os.time()) -- 返回当前时间戳
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



## 函数尾调用

函数中，使用`return`返回另外一个函数，称为“尾调用”。

即，一个函数调用是另一个函数的最后一个动作。

```lua
function f(x)
    return g(x)
end
```

```lua
function FunA()
    local res = math.abs(-88) --不是尾调用
    return res
end

function FunB()
    return math.abs(-88) --尾调用
end

function FunB()
    return FunA() --尾调用
end
```

因为**尾调用不占用堆栈空间**，所以**不会出现栈溢出**，可以起到**优化存储空间**的作用。

在什么情况下需要使用“尾调用”？大量次数的递归

```lua
function RecurFunc(num)
	if(num > 0) then
		return RecurFunc(num - 1) -- 尾调用
		-- return RecurFunc(num - 1) + 0 -- 不是尾调用, 容易栈溢出
	else
		return "End!"
	end
end

res = RecurFunc(100000) -- 10w次递归
print(res)
```

**注意：**

封装函数中的`return x()`与`return (x())`含义不同，后者只能返回一个结果。

即：**前者返回函数类型，后者是一个数值。**

当A函数调用完B函数后，再没有可执行的工作时，程序就不需要返回B所在的函数。所以在尾调用之后程序也不需要保存任何关于函数的栈信息。

由于“尾调用”不会耗费栈空间，所以一个程序可以拥有无数嵌套的“尾调用”而不用担心造成栈溢出。

```lua
function FunC()
	print("FunC")
	return FunD() -- 返回多个数值
end

function FunD()
	print("FunD")
	return 100,200
end

num1, num2 = FunC()
print(num1,num2)
```

> FunC
> FunD
> 100	200

```lua
function FunC()
	print("FunC")
	return (FunD()) -- 仅返回1个数值
end

function FunD()
	print("FunD")
	return 100,200
end

num1, num2 = FunC()
print(num1,num2)
```

> FunC
> FunD
> 100	nil

## Lua函数的本质

Lua函数本质是匿名的，即没有名称。

讨论一个函数，本质是讨论一个持有此函数的变量。

函数与普通类型的数值权利相同。

1. 函数可以存储在变量或者Table中，也可以作为实参传递给其他函数，还可以作为其他函数的返回值。
2. 本质上函数就是一条语句，可以将其存储在全局变量中，也可以存储在局部变量中。

```lua
function GetNum1(num)
	return num * 2;
end

GetNum2 = function(num)
	return num * 3;
end

funcArr = {};
funcArr[1] = GetNum1; -- 先定义函数再放入表里
funcArr[2] = GetNum2;

for i=1, #funcArr do
	print(funcArr[i](5))
end
```

> 10
> 15

```lua
funcArr = {};
funcArr.add = function(x, y) return x + y end -- 函数的定义与表的初始化同时进行
funcArr.mul = function(x, y) return x * y end

for k,v in pairs(funcArr) do
	print(v(10,20))
end
```

> 200
> 30

## 闭包

一个函数中嵌套子函数，子函数可以使用父函数中的局部变量，这种行为称为“闭包”。

闭包 = 函数 + 引用环境

```lua
function Func()
	local i=0; -- i变量称为内嵌函数的upValue, 既不是全局变量，也不是局部变量。
	print("--- A ---", i);
	return function() -- 内部嵌入的匿名函数
		print("--- B ---", i);
		i = i + 1;
		print("--- C ---", i);
		return i;
	end
end

f = Func();
print("第1次执行",f());
print("第2次执行",f());
print("第3次执行",f());
```

> --- A ---	0
> --- B ---	0
> --- C ---	1
> 第1次执行	1
> --- B ---	1
> --- C ---	2
> 第2次执行	2
> --- B ---	2
> --- C ---	3
> 第3次执行	3

**闭包的特点：**

闭包中的内嵌函数可以访问外部函数已经创建的所有局部变量，这些变量称为该内嵌函数的“up value”。

**闭包与一般函数的区别：**

闭包只是在形式上和表现上像函数，但实际上不是函数。函数只有一个实例，定义后逻辑就确定了，不会执行时发生变化。

### 带参数的闭包

```lua
function Func(i)
	print("i = ",i); -- 参数i, 是内嵌函数的“up value”
	return function() -- 内部嵌入的匿名函数
		i = i + 1;
		return i;
	end
end

f = Func(10);
print(f());
print(f());
print(f());
```

> i = 	10
> 11
> 12
> 13

### 多内嵌函数的闭包

```lua
function Func()
	local num = 10; -- num共享
	function InnerFunction1()
		print(num)
	end

	function InnerFunction2()
		num = num + 100
	end

	return InnerFunction1,InnerFunction2
end

local result1, result2 = Func()
result1() -- 只打印
result2() -- 只计算不打印
result1()
result2()
result1()
```

> 10
> 110
> 210

### 闭包的带参数内嵌函数

```lua
function Func(num)
	return function(value)
		return num + value; -- 无法保存num的状态
	end
end

function Func2(num)
	return function(value)
		num = num + value;
		return num;
	end
end

local f = Func(10)
local f2 = Func2(10)
print(f(2))
print(f(2))

print(f2(2))
print(f2(2))
```

> 12
> 12
> 12
> 14

### 闭包可以具备多个实例

```lua
function Func()
	local num = 0;
	return function()
		num = num + 1;
		return num;
	end
end

local f1 = Func();
print(f1());
print(f1());
print(f1());

local f2 = Func();
print(f2());
print(f2());
print(f2());
```

> 1
> 2
> 3
> 1
> 2
> 3

**闭包的另一种解释——“词法域”概念：**

若将一个函数写在另一个函数之内，那么这个位于内部的函数便可以访问外部函数中的局部变量，这项特征称为“词法域”。

外部函数中的局部变量在匿名函数内既不是全局变量，也不是局部变量，将其称之为“非全局变量”。

**闭包的典型应用：**

“迭代器”的实现可以借助于闭合函数实现，闭合函数能保持每次调用之间的一些状态。

### 使用闭包开发自己的迭代器

```lua
function Itrs(tabArray)
	local i=0;
	return function()
		i = i + 1;
		return tabArray[i];
	end
end

myTab = {10,20,99,78};

itrs = Itrs(myTab);
print(itrs());
print(itrs());
print(itrs());
print(itrs());
print(itrs());

for m in Itrs(myTab) do
	print("for loop, m = ",m);
end

iterator = Itrs(myTab);
while(true) do
	local j = iterator();
	if j == nil then
		break;
	end
	print("while loop, j = ",j);
end
```

> 10
> 20
> 99
> 78
> nil
> for loop, m = 	10
> for loop, m = 	20
> for loop, m = 	99
> for loop, m = 	78
> while loop, j = 	10
> while loop, j = 	20
> while loop, j = 	99
> while loop, j = 	78

**闭包的作用：**

1. 开发自定义迭代器函数
2. 扩展现有函数的功能
3. 扩展命名空间

## 模块

**模块的定义：**

由变量、函数等组成的table，创建模块本质就是创建一个table，此table最后需要返回。

**模块的作用：**

类似于一个封装库，把一些公用的代码放在一个文件里，以API接口的形式在其他地方调用，有利于代码的重用和降低代码耦合度。

**注意事项：**

定义local的函数名，就不要加模块限定，否在出错。

### Lua文件的互调用

使用`require`关键字实现lua文件的加载。

**语法格式：**

```lua
require("YourLuaFileName")
```

**说明：**

1. 执行`require`后，返回一个由模块常量或函数组成的table。
2. 模块名称与lua文件名称必须相同。

**注意事项：**

1. 被调用的lua文件，必须定义为“模块”的形式。
2. 调用的变量与函数必须不能是局部的（local）,否则无法访问。
3. 可以给加载的模块定义一个别名变量，方便调用。
4. 给`require`赋值一个变量的时候，还可以加入local关键字，表示本别名方式只在本文件中起作用。

**例子：**

myModule.lua：

```lua
local myModule = {}; -- 定义局部模块

myModule.gHeight = 180; -- 定义模块字段

function myModule.Fun1() -- 定义模块函数
	print("Fun1 Method invoked")
end

function myModule.Fun2()
	print("Fun2 Method invoked")
end

-- 模块中不能定义私有的（local）“函数”与“字段”，否则无法调用。

return myModule;
```

luaTest.lua：

```lua
local myModule = require("myModule") -- 加载lua文件，并接收
if not myModule then
    print("Lua模块不存在");
    return;
end

myModule.Fun1();
myModule.Fun2();
print(myModule.gHeight);
```

执行luaTest.lua，输出如下：

> Fun1 Method invoked
> Fun2 Method invoked
> 180

## 函数的前置声明

```lua
local Fun1, Fun2 -- 函数前置声明，可以提高程序的易读性

function Fun1()
    print("Func1");
    Fun2();
end

function Fun2()
    print("Func2");
end

Fun1();
```

## unpack函数

unpack函数：**接受一个数组作为参数，并从下标1开始返回该数组的所有元素。**

**注意事项：**

1. unpack可以很容易的把table集合中数据“解包”输出。
2. 与之对应的是table.concat()函数，可以把table集合中数据“压缩”为一个字符串输出。

```lua
tab = {"hello","hi","nice","welcome"};
print(unpack(tab));

function testFun(str1,str2,str3,str4)
    print(str1 .. str2 .. str3 .. str4);
end

testFun(unpack(tab)); -- 类似”解包“函数，将表里的元素依次放出使用。

print(table.concat(tab,"-")); -- 相当于“压包"函数，把表中数据连接起来一起显式。
```

> hello	hi	nice	welcome
> hellohinicewelcome
> hello-hi-nice-welcome
