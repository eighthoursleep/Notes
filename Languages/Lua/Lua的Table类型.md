# Lua的Table类型



## 表的本质

Lua变量没有预定义类型，任何变量都可以包含任何类型的值。

Table可以表示各种数据结构：

Table是Lua中主要的数据结构机制，可以作为其他数据结构的基础，具有强大的功能。

基于Table可以以一种简单、统一和高效的方式来表示“数组”、“二维数组”、“键值对集合”、“链表”、“双向队列”和其他数据结构等。同时Lua也是通过table来表示“模块”、“对象”等。

Table在Lua中既不是“值”也不是“变量”，而是“对象”。

Lua不会暗中产生Table的副本或创建新的Table，也不需要声明一个Table。

Table是通过“构造表达式”完成的，最简单的构造表达式就是“{}”。

Table永远是“匿名的”，一个持有Table变量与Table自身之间是没有固定关联性的。

可以将Table认为是一种动态分配的对象，程序仅保存对他们的引用。（即：可以理解为指针）

当程序没有对一个Table进行引用时，Lua的垃圾收集器最终会删除该Table，并复用它的内存。

```lua
local myArr1 = {10,20,50,60,90};
local myArr2 = myArr1;
myArr1 = nil;

for i = 1, #myArr2 do
    print(myArr2[i]);
end
```



## 二维数组

Table实现“关联数组”是一种具有特殊索引方式的数组。不仅可以通过整数来索引它，还可以是以哦那个字符串或其他非nil值类索引。

Table没有固定大小，可以通过表元素来进行动态扩容。当初始化数组时，也就间接的定义了它的大小。

```lua
local doubleArr = {};
local arrayRow_1 = {};
local arrayRow_2 = {};

arrayRow_1[1] = 10;
arrayRow_1[2] = 10;

arrayRow_2[1] = 60;
arrayRow_2[2] = 80;

doubleArr[1] = arrayRow_1;
doubleArr[2] = arrayRow_2;

for i = 1, #doubleArr do
    local curLine = "";
    for j = 1, #doubleArr[i] do
        curLine = curLine .. doubleArr[i][j] .. " ";
    end
    print(curLine);
end

for i, v in ipairs(doubleArr) do
    print(unpack(v));
end
```

> 10 10 
> 60 80 
> 10	10
> 60	80

```lua
function CreateDoubleArray(row, col)
    local doubleArray = {};
    for i = 1, row do
        doubleArray[i] = {};
        for j = 1, col do
            doubleArray[i][j] = 0;
        end
    end
    return doubleArray;
end

local doubleArray = CreateDoubleArray(5,4);

for i, v in ipairs(doubleArray) do
    print(unpack(v));
end
```

> 0	0	0	0
> 0	0	0	0
> 0	0	0	0
> 0	0	0	0
> 0	0	0	0



## 链表

由于Lua中Table是动态的实体，所以在Lua中实现链表是很方便的。

每一个链表结点以Table来表示，节点包含两个值Next和Value，注意尾节点的Next应该是nil。

```lua
function CreateLinked(n)
    n = (n or 0);
    local listResult = {};
    n = n + 1;
    if (n > 10) then
        return nil;
    end
    listResult.Value = n;
    listResult.Next = CreateLinked(n);
    return listResult;
end

function QueryLinkList(list)
    return function()
        local returnValue = nil;
        if (not list) then
            return nil;
        end
        returnValue = list.Value;
        list = list.Next;
        return returnValue;
    end
end

local list = CreateLinked();
local listStr = "";
for v in QueryLinkList(list) do
    if v then
        listStr = listStr .. v .. " ";
    else
        break;
    end
end
print(listStr);
```

> 1 2 3 4 5 6 7 8 9 10



## 所有复杂数据类型都基于表

```lua
a = {1,2,3,"hahaha",true,nil}
-- 数组
print(a[0]) -- Lua中，索引从1开始
print(a[1])

-- #是通用的获取长度的关键字
-- 在打印长度的时候，nil会被忽略
-- 如果表中某一位变成nil，会影响#获取的长度
print(#a)
-- 数组的遍历
for i=1,#a do -- 不靠谱的遍历方式
	print(a[i])
end
-- 二维数组
a = {{10,20,30},{40,50,60}}
print(a[1][1])
-- 二维数组的遍历
for i=1,#a do
	b = a[i]
	for j=1,#b do
		print(b[j])
	end
end
```

> nil
> 1
> 5
> 1
> 2
> 3
> hahaha
> true
> 10
> 10
> 20
> 30
> 40
> 50
> 60

```lua
-- 自定义索引
aa = {[0] = 11, 22, 33,[-1] = 44, 55}
print(aa[0])
print(aa[-1])
for i=-1,#aa do
	print(aa[i])
end
bb = {[1] = 1,[2] = 2,[4] = 4,[6] = 6}
print(#bb); --当两个自定义索引之间间隔为1中间的索引被赋值为nil
cc = {[1] = 1,[2] = 2,[5] = 5,[6] = 6}
print(#cc) -- 当间隔为2时，数组长度只统计前边的数组单元
for i=1,#bb do
	print(bb[i])
end
```

> 11
> 44
> 44
> 11
> 22
> 33
> 55
> 6
> 2
> 1
> 2
> nil
> 4
> nil
> 6

## 迭代器遍历（ipairs与pairs的区别）

```lua
-- 迭代器，主要用来遍历表
-- #得到的长度不能保证准确，一般不用#遍历表
a = {[0] = 1, 2, [-1] = 3, 4, 5, [5] = 6}

--ipairs遍历从1开始往后遍历，索引小于等于0的值得不到
for k,v in ipairs(a) do
	print(k .. " - " .. v)
end
-- pairs遍历可以找到所有的索引和值
for k,v in pairs(a) do
	print(k .. " ~ " .. v)
end
```

> 1 - 2
> 2 - 4
> 3 - 5
> 1 ~ 2
> 2 ~ 4
> 3 ~ 5
> 0 ~ 1
> -1 ~ 3
> 5 ~ 6

### ipairs和pairs的区别

1. pairs可以遍历出表中的所有键值对信息，在遍历不规则表时，建议用它。
2. ipairs只能遍历出连续信息，理论上来说它的本质 是按长度for循环叠加遍历
   所以用它遍历连续数组没问题，但只要中间断了索引就无法遍历完全了。

## 用表实现字典

```lua
-- 字典由键值对构成
a = {["name"] = "dovahkiin",
["level"] = 80,["1"] = 999}
-- 访问单个变量，用中括号填键访问
print(a["name"],a["level"])
-- 还可以类似".成员变量"的形式得到值
print("name: ",a.name,"\nlevel: ",a.level)
-- 但不能是数字
print(a["1"])

a["level"] = 100 -- 修改
a["gender"] = "male" -- 新增
a["name"] = nil -- 删除
print("name: ",a["name"],
	"\nlevel: ",a["level"],
	"\ngender: ",a["gender"])
-- 遍历字典一定用pairs
for i in pairs(a) do
	print(i .. "->" .. a[i])
end
```

> dovahkiin	80
> name: 	dovahkiin	
> level: 	80
> 999
> name: 	nil	
> level: 	100	
> gender: 	male
> 1->999
> level->100
> gender->male

### 用Lua实现选择排序

```lua
a = {0,9,3,5,7,1,6,8,4,2}

function SelectSort(a)
	local min = 0
	for i=1,#a do
		min = i
		for j=i+1,#a do
			if a[min] > a[j] then
				min = j
			end
		end
		if min ~= i then
			a[i] = a[i] + a[min]
			a[min] = a[i] - a[min]
			a[i] = a[i] - a[min]
		end
	end
end
SelectSort(a)
for i=1,#a do
	print(a[i])
end
```

> 0
> 1
> 2
> 3
> 4
> 5
> 6
> 7
> 8
> 9

## 用表实现类

```lua
-- 类和结构体
-- Lua中默认没有面向对象，需要自行实现
-- 成员变量，成员函数
Player = {
	name = "Dovahkiin",
	level = 80,
	isMale = true,
	PrintInfo = function()
		-- 想要在表内部函数中调用表本身的属性或方法
		-- 一定要指定是谁的，即通过“表名.属性”和“表名.方法”调用
		print(Player.name,Player.level,Player.isMale)
	end,
	Attack = function(p)
		-- 第2种在表内部调用自身属性或方法的方式
		-- 通过传参传入自身
		print(p.name .. " is attacking.")
	end
}
Player.PrintInfo()
-- 声明表过后，在表外声明表的变量和方法
Player.health = 1000
Player.Spell01 = function ()
	print("FireBall")
end
function Player.Spell02()
	print("FireStorm")
end
print(Player.health)
Player.Spell01()
Player.Spell02()

Player.Attack(Player)
-- Lua中, 点"."和冒号":"的区别：
-- 冒号调用方法会默认把调用者，作为第一个参数传进来 
Player:Attack()

function Player:Block() -- 用冒号声明，相当于有一个默认参数
	-- 在Lua中，有一个关键字self表示默认传入的第一个参数
	print(self.name .. " is blocking.")
end
Player:Block()
Player.Block(Player)
```

> Dovahkiin	80	true
> 1000
> FireBall
> FireStorm
> Dovahkiin is attacking.
> Dovahkiin is attacking.
> Dovahkiin is blocking.
> Dovahkiin is blocking.

### Lua中点和冒号的区别

使用上：

```lua
test = {a = 1}
-- 声明一个有参数的函数
test.Fun = function (t)
	print(t.a)
end
-- 点，就是正常调用函数，有几个参数传几个
test.Fun(test)
-- 冒号，会默认把调用函数的表传入到函数中
test:Fun()-- 此处相当于把test传
```

> 1
> 1

```lua
test = {a = 1}
-- 声明一个有参数的函数
test.Fun = function (t)
	print(t.a)
end
-- 这样写相当于把自己传入
function test:FunPro()
	-- self代表默认的第一个参数
	-- self的作用和C#的this不一样
	-- self也可以是别的对象
	print(self.a)
end

test:FunPro()
test.FunPro(test)
testPlus = {a = 2}
test.FunPro(testPlus)
```

> 1
> 1
> 2

## 表的公共操作

```lua
-- table提供的处理表的公共方法
table01 = {
	{player = "ESO",gender = "male"},
{player = "Jessie",gender = "female"}}
table02 = {bot = "PC001",level = 159}
-- 插入
print(#table01)
table.insert(table01,table02)
print(#table01)
print(table01[3].bot)
-- 删除指定元素
-- remove方法，传入表，移除最后一个索引的内容
table.remove(table01)
print(#table01)
print(table01[3])
-- remove方法，传入两个参数
-- 第一个参数：要移除内容的表
-- 第二个参数：要移除内容的索引
table.remove(table01, 1)
print(table01[1].player)
print(#table01)
-- 排序
table03 = {55,22,77,99,33}
-- 传入要排序的表，默认升序
table.sort(table03)
for _,v in pairs(table03) do
	print(v)
end
-- 降序，要传入两个参数
-- 第一个参数：用于排序的表
-- 第二个参数：排序规则函数
table.sort(table03,function(a,b)
	if a > b then
		return true
	end
end)
for _,v in pairs(table03) do
	print(v)
end
-- 拼接
table04 = {"123","456","789","1999"}
-- 连接函数，用于拼接表中元素，返回值是一个字符串
str = table.concat(table04,"-")
print(str)
```

> 2
> 3
> PC001
> 2
> nil
> Jessie
> 1
> 22
> 33
> 55
> 77
> 99
> 99
> 77
> 55
> 33
> 22
> 123-456-789-1999

### 用Lua实现冒泡排序

```lua
a = {1,3,4,9,5,7,2,8,6,0}
function BubbleSort(a)
	local temp = 0;
	for i=1, #a do
		for j=1, #a - i do
			if a[j] > a[j+1] then
				temp = a[j]
				a[j] = a[j+1]
				a[j+1] = temp
			end
		end
	end
end

BubbleSort(a)
for i=1,#a do
	print(a[i])
end
```

> 0
> 1
> 2
> 3
> 4
> 5
> 6
> 7
> 8
> 9

### 用Lua实现插入排序

```lua
a = {0,5,3,8,2,9,7,4,6,1}

function InsertSort(a)
	local temp = 0
	local index = 0
	for i=2,#a do
		temp = a[i]
		index = i;
		while index ~= 1 and a[index-1] > temp do
			a[index] = a[index - 1]
			index = index - 1
		end
		a[index] = temp
	end
end
InsertSort(a)
for i=1,#a do
	print(a[i])
end
```

>0
>1
>2
>3
>4
>5
>6
>7
>8
>9