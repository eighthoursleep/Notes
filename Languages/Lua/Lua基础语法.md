# Lua基础语法



## 开发环境搭建


在Windows上环境：[LuaForWindows](https://github.com/rjpcomputing/luaforwindows/releases)

IDE：Sublime Text 3

安装LuaForWindows后，打开Sublime，菜单栏Tools > Build System > New Build System

覆盖以下内容：

```lua
{
"cmd": ["D:/Program Files (x86)/Lua/5.1/lua.exe", "$file"], 
"file_regex": "^(?:lua:)?[\t ](...*?):([0-9]*):?([0-9]*)",  
"selector": "source.lua"  
}
```

保存在默认目录，文件名`myLua.sublime-build`。编译运行的时候在Tools > Build System选择myLua。

编译快捷键：`F7` 或 `Ctrl + B`

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
3. 推荐命名规则：
   1. 常量用全大写和下划线：MY_ACOUNT
   2. 变量的第一个字母小写：strNumber
   3. 全局变量第一个字母用小写g表示：gMyAcount
   4. 函数名第一个字母大写：`function MyFirstFunction()`


### 变量

Lua中的变量，无需声明类型。

```lua
num = 20
print(num)
num = "二十"
print(num)
```

变量不需要再使用前声明，且不需要指定变量的类型（string, number等）。Lua中的一个变量可以随便赋值并自动识别类型。

- 变量都是弱类型，类似JS，无需指定变量类型。
- Lua中语句是否分号结尾都可以正常运行
- print()是Lua中内置的方法
- Lua中双引号与单引号都可以
- 变量命名不能数字开头，否在报错
- 尽量避免使用下划线加大写字母开头（Lua自身保留）

- 推荐使用类似C#命名规范

### 简单变量类型（8种）

**nil**：空类型，空数据，无效值，类似null。

**boolean**：布尔类型，存储true或false。

**number**：双精度实浮点数，Lua中没有整数类型。

**string**：字符串类型（双引号或单引号括起来，Lua里没有char）

**table**：表类型。表示一个集合，序号从1开始。

**userdata**：任意存储在变量中的C数据结构

**function**：函数

**thread**：独立线程（本质是“伪多线程”，协程的概念），用于执行协同程序。

```lua
str = "Hello World"
num = 88
isTrue = true
nullVar = nil
tab = {}
print(type(str))
print(type(num))
print(type(isTrue))
print(type(nullVar))
print(type(tab))

function myFun()
	return 10
end
print(type(myFun))
```

### 全局与局部变量

#### 全局变量

- **默认**情况下，变量总被认为是**全局**的，全局变量不需要声明，给一个变量赋值即可创建该全局变量。
- **作用范围**从定义的那一行开始到文件末尾

```lua
b = 10
print(b)
b = nil -- 要删除一个变量，就给它赋值为nil
print(b) -- 当且仅当一个变量的值不为nil时，这个变量即存在
```

> 10
> nil

#### 局部变量

- 用**关键字`local`**定义
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

## 三大运算符

1. **算数运算符**： +，-，\*，/，%，^ 

   **注意**：（Lua中**没有自增自减**++、--，也没有没有复合运算符+=、-=、/=、*=、%=）

2. **关系运算符**：（条件运算符） <=，<，>，>=，==，**~=（不等于）**

   **注意**：

   1. **nil只与自身相等**
   2. 对于**table、函数、userdata**，Lua是作**引用比较**的。只有**引用同一个对象**时，**才认为相等**。

3. **逻辑运算符**：**and**，**or**，**not**分别表示“与”、“或”、“非”，类似C#中的&&，||，！。

   **注意**：Lua**不支持位运算符**（&，|），需要我们自己实现

Lua**不支持三目运算符**（ ? : ）

```lua
-- 算数运算符例子：
print("string可以自动转为number: " .. "123.4" + 20)
print("幂运算: " .. 2 ^ 10)
```



## 流程控制语句



### 条件分支语句（if语句）

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

### 循环（while循环、repeat-until循环、for循环）

```lua
while [进入循环条件] do
    ...
end
```

```lua
repeat
    ...
until [结束循环条件]
```

```lua
for i = [起始索引],[结束索引],[递增步长(默认为1,可以为负数)] do -- i会递增
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

### ipair与pair迭代器

#### ipairs

ipairs**顺序遍历集合**。中间序号**不能中断，遇到nil就停止**。

**一般用于数组**类型集合的遍历。

```lua
arr = {10,20,30,40,50};
for v in ipairs(arr) do
	print(v)
end

for k, v in ipairs(arr) do
	print(k, v)
end
```

> 1
> 2
> 3
> 4
> 5
> 1	10
> 2	20
> 3	30
> 4	40
> 5	50

#### pairs

pairs遍历集合中**所有数据**。序号**可以中断，一般用于键值对**类型集合的遍历。

```lua
myArr = {player1="剑客",player3="法师",player5="牧师"};

for k,v in pairs(myArr) do
    print(v)
end
```

> 剑客
> 法师
> 牧师

Lua标准库提供了几种迭代器：

- 迭代文件每行的`io.lines`
- 迭代table元素的`pairs`
- 迭代数组元素的`ipairs`
- 迭代字符串中单词的`string.gmatch`等



## 函数



### 定义函数

```lua
--函数定义格式
function [function_name](param1, param2, ...)
	...
    -- return ...
end
-- 或者
a = funtion()--匿名函数
	...
	-- return ...
end
```

Lua函数的**基本性质**：

1. 函数**无需定义返回类型**，可以**返回任意类型**与**任意数量**的数值。
2. 函数的参数，**无需定义参数类型**。
3. 函数无大括号。
4. **可以定义变量，把函数直接赋值给它**，从而获得相同功能。

**注意：函数中由于函数的参数没有类型，所以在没有（编译）运行前，计算机是无法发现错误的。**



### 函数中的全局与局部变量

```lua
function fun1()
	print("in function 4");
	num1 = 10; -- Lua语言规定默认变量都是全局变量，无论是否定义在语句块中
    local num2 = 20;
    
end

fun1()

print("num1 = "..num1);
print("num2 = "..num2); -- 报错
```



### 局部函数

```lua
local function fun()--无法被所在.lua文件以外的地方调用
    return true;
end
```



### 函数的多返回值特性

一个函数返回多个数值，可以使用多个变量直接接收

```lua
function GetNumber2()
	return 10,20
end
function GetNumber4()
	return 10,20,30,40
end


res1, res2, res3 = GetNumber2()
print(res1,res2,res3)
res1, res2, res3 = GetNumber4()
print(res1,res2,res3)
```

函数**多返回值性质**：

1. 如果一个函数调用在最后，或者仅有一个表达式，则Lua会保留尽可能多的返回值，用于匹配。
2. 如果一个函数没有返回数值，或者没有足够多的返回数值，用`nil`来补充缺失数值。



### 函数的赋值

函数可以**作为数据进行赋值**，也可以**作为参数进行传递**（相当于C#的委托）

```lua
function PrintResult(result)
	print("结果 : " .. result);
end

function AddNum( num1, num2, handleResult )
	local result = num1 + num2;
	handleResult(result);
end

AddNum(11,22,PrintResult);
```



### 匿名函数

匿名函数定义：没有函数名称的函数

如何调用？

通过赋值给一个变量（相当于C#的委托注册方法），通过调用这个变量来间接调用这个匿名函数。

```lua
add = function (num1, num2)
	print(num1 + num2);
end

add(33,55);
```

定义的时候无需定义函数名称，但一定要把匿名函数赋值给变量。

### 可变参数



### 标准库函数



#### 常用数学函数



#### 常用字符串函数



#### 操作系统函数



## 字符串

### 字符串定义与三种表示方式

```lua
str1 = "Hello"
str2 = '你好'
str3 = [[大家好]]
```

### 字符串的基本操作

1. 多行字符串**（用两个中括号表示“一块”字符串）**

   ```lua
   htmlStr = [[
   	<html>
   		<head></head>
   		<body>
   			<a href = "www.baidu.com">百度搜索</a>
   		</body>
   	</html>
   ]]
   print(htmlStr);
   ```

2. 字符串连接**（用`..`连接字符串）**

   ```lua
   str1 = "Hi,I'm MJ.";
   str2 = "Hello, MJ. Nice to meet you.";
   print(str1.."\n"..str2) -- 支持转义字符、字符串拼接
   print(22 .. 33); -- 数字连接，数字与点号间要有空格
   print('n'..'b'); -- 字符串连接
   
   print(string.format("I am %d years old",24))
   -- %d : 与数字拼接
   -- %a : 与任何字符拼接
   -- %s : 与字符配对
   -- 以上为常用3种
   ```

3. 取得字符串长度

   ```lua
   website = "www.baidu.com"
   print(#website); -- 输出字符串长度
   print(#"www.baidu.com")
   print(string.len(website))
   
   s = "aBcdEFG字符串"
   -- 一个汉字占3个长度
   -- 一个英文字符占1个长度
   print(#s)
   ```

4. 字符串与数值型相互转换

   ```lua
   print('2' + 3); -- 输出5，在进行数字相加时，lua会自动把字符串转成数字
   print('2.2' + '30'); -- 输出32.2
   
   -- 字符串显式转换为数字, tonumber()
   aa = '789';
   print(type(aa)); -- string
   aa = tonumber(aa);
   print(type(aa)); -- number
   
   -- 字符串隐式转换数字
   bb = '789';
   print(type(bb)); -- string
   bb = bb + 0;
   print(type(bb)); -- number
   
   -- 其他类型转字符串
   a = true
   print(tostring(a))
   -- 字符串提供的公共方法
   str = "Dark Souls"
   print(string.upper(str)) -- 小写转大写
   print(string.lower(str)) -- 大写转大写
   print(string.reverse(str)) -- 翻转字符串
   print(string.find(str, "ark")) -- 字符串索引查找
   print(string.sub(str, 3, 4)) -- 截取字符串
   print(string.rep(str, 2)) -- 字符串重复
   print(string.gsub(str, "Dark", "Bright")) -- 字符串修改
   
   a = string.byte("Lua",2) --字符 转 ASCII码
   print(a)
   --ASCII码转字符
   print(string.char(a))
   ```

**注意：**

1. 如果字符串应用`+`号，则字符串会自动转换为`number`类型处理（但必须保证是“数字字符串”，否在报错。）
2. 字符串与数值类型，使用`..`连接一般没有问题，不报错。但是数值型如果可能为nil，则推荐加入`tostring()`函数

### 必须使用tostring()的情况

1. 表
2. nil



### 转义字符串

常用转移字符串：

1. 回车`\r`
2. 换行`\n`
3. 反斜杠`\\`
4. 双引号`""`

```lua
print("你好\r呀！"); -- 回车
print("Hello\nWorld"); -- 换行
print("D:\\Programe\\Lua");
print("哈哈'哈哈'哈");
print('哈哈"哈哈"哈');
```



### 字符串常用函数

1. 字符串长度：`string.len()`
2. 大小写：`string.upper()`、`string.lower()`
3. 查找：`string.find()`
4. 截取：`string.sub()`
5. 替换：`string.gsub()`
6. 反转：`string.reverse()`
7. 格式化：`string.format()`

```lua
str = "Dark Souls 3"
print(string.len(str));

print(string.upper(str));

str = string.lower(str)
print(str);

-- 查找
print(string.find(str,"souls"));
result = string.find(str,"s");
print(result);
result = string.find(str,"s",7);
print(result);

-- 分割
strSub = string.sub(str,1,4);
print(strSub);
strSub = string.sub("遥遥领先同行",1,3);
print(strSub);

-- 替换
strSub = string.gsub("war never changed.","war","bug");
print(strSub);
strSub = string.gsub("hello","l","L")
print(strSub);

-- 反转
strSub = string.reverse(strSub);
print(strSub);
```

> 12
> DARK SOULS 3
> dark souls 3
> 6	10
> 6
> 10
> dark
> 遥
> bug never changed.
> heLLo
> oLLeh

## 表（Table）



### 表的构造与基本访问方式



### 表的赋值与迭代输出



### 使用迭代器函数输出



### 表的常用函数



## 面向对象编程

面向对象编程概念：封装、继承、多态。

### 使用表模拟“字段”、“方法”



### 调用表中字段与方法



### 表对象self关键字的作用



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

