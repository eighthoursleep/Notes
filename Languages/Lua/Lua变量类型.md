# Lua变量类型

   ```lua
print(type("Hello World!")) -- 建议用双引号讲字符串括起来，用单引号括单个字符
print(type(10.4 * 3))
print(type(print))
print(type(type))
print(type(true))
print(type(nil))
print(type(type(X))) -- type()返回结果是字符串
   ```

   > string
   > number
   > function
   > function
   > boolean
   > nil
   > string

## 布尔类型（boolean）

Lua把false和nil看作是假，其他都看作是真

```lua
print(type(true));
print(type(false));
print(type(nil));
```

> boolean
> boolean
> nil

```lua
if false or nil then
	print("至少有一个是true");
else
	print("false nil都为false");
end
```

> false nil都为false

## 双精度实浮点数（number）

```lua
print(type(2));
print(type(2.2));
print(type(0.2));
print(type(2e+1));
print(2e+1);
print(type(0.2e-1));
print(type(1.25489e-6));

```

> number
> number
> number
> number
> 20
> number
> number

## 字符串（String）

```lua
str1 = "Hi,I'm MJ.";
str2 = "Hello, MJ.Nice to meet you.";
print(str1.."\n"..str2) -- 支持转义字符、字符串拼接
-- 多行字符串打印
html = [[
	<html>
		<head></head>
		<body>
			<a href = "www.baidu.com">百度搜索</a>
		</body>
	</html>
]]
print(html);
```

> Hi,I'm MJ.
> Hello, MJ.Nice to meet you.
> 	<html>
>
> 		<head></head>
> ​		<body>
> ​			<a href = "www.baidu.com">百度搜索</a>
> ​		</body>
> ​	</html>

```lua
print('2' + 3); -- 在进行数字相加时，lua会自动把字符串转成数字
print('2' + '3');
print('n'..'b'); -- 字符串连接
print(123 .. 456); -- 数字连接，数字与点号间要有空格

website = "www.baidu.com"
print(#website); -- 输出字符串长度
print(#"www.baidu.com")

s = "aBcdEFG字符串"
-- 一个汉字占3个长度
-- 一个英文字符占1个长度
print(#s)
```

> 5
> 5
> nb
> 123456
> 13
> 13
> 16

```lua
print(string.format("I am %d years old",24))
-- %d : 与数字拼接
-- %a : 与任何字符拼接
-- %s : 与字符配对
-- 以上为常用3种

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

> I am 24 years old
> true
> DARK SOULS
> dark souls
> sluoS kraD
> 2	4
> rk
> Dark SoulsDark Souls
> Bright Souls	1
> 117
> u

## 表（table）

```lua
local tb1 = {}; -- 创建一个空表
local tb2 = {"Java","Python","Lua","C++"}; -- 创建后表以后直接初始化
-- 关联数组
a = {};
a["key"] = "value";
key = 101;
a[key] = 2222;
a[key] = a[key] + 111;
-- 表的遍历
for k,v in pairs(a) do
	print(k.. " : " ..v);
end
```
> key : value
> 101 : 2333

```lua
local games = {"Skyrim","DarkSouls","FarCry","DevilMayCry"}

for k, v in pairs(games) do -- k:索引，v:值
	print(k .. " - " .. v)
	print(k .. " - " .. games[k])
end

a = {};

for i = 1, 10 do
	a[i] = i * 10
end
print()
for i = 1, 10, 2 do
	print(i .. " - " .. a[i])
end
```

> 1 - Skyrim
> 1 - Skyrim
> 2 - DarkSouls
> 2 - DarkSouls
> 3 - FarCry
> 3 - FarCry
> 4 - DevilMayCry
> 4 - DevilMayCry
>
> 1 - 10
> 3 - 30
> 5 - 50
> 7 - 70
> 9 - 90

```lua
valveGames = {"half-life 1", "half-life 2",impossible = "half-life 3"}
for k,v in pairs(valveGames) do
    print(k.." - ".. v) 
end
print()
valveGames.impossible = nil; -- 可以用nil删除键值对
valveGames.vr = "half-life: alyx"
for k,v in pairs(valveGames) do
    print(k.. " - ".. v)
end
```

> 1 - half-life 1
> 2 - half-life 2
> impossible - half-life 3
>
> 1 - half-life 1
> 2 - half-life 2
> vr - half-life: alyx

tab.i是当索引为字符串类型时的一种简化写法。

gettable_event(t, i)采用索引访问本质上是一个类似这样的函数调用。

```lua
site = {};
site["key"] = "www.baidu.com";
print(site["key"]); -- 建议写法
print(site.key); -- 不建议写法
```

> www.baidu.com
> www.baidu.com

## 函数（function）

```lua
result = function()
	print("F")
end
print(type(result))
```

> function

```lua
function factorial1(n)
	if n == 0 then
		return 1;
	else
		return n * factorial1(n-1);
	end
end
print(factorial1(5));

factorial2 = factorial1;
print(factorial2(5));
```

> 120
> 120

```lua
function testFun(tab, fun)
	for k, v in pairs(tab) do
		print(fun(k, v))
	end
end

tab = {key1 = "val1", key2 = "val2"};
-- function可以以匿名函数的方式通过参数传递
testFun(tab,
function (key, val) -- 匿名函数
	return key .. " = " .. val;
end);

```

> key1 = val1
> key2 = val2

## 线程（Thread）

## 自定义类型（Userdata）

