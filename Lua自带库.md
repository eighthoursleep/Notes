---
title: Lua自带库函数
date: 2020-07-07 17:04:46
tags: Lua
---

涉及时间、数学运算、路径

<!--more-->

```lua
print("----------------时间-----------------")
-- 获取系统时间（秒）
print(os.time()) -- 当前时间的距离1970.1.1.08:00时间的秒数
-- 获取自定义时间（秒）
print(os.time({year = 2020,month = 1,day = 1})) -- 指定时间转化为秒数
-- os.date("*t")
local currentTime = os.date("*t") -- 获取当前时间的table格式
for k,v in pairs(currentTime) do
	print(k,v)
end
print(currentTime.hour)

print("---------------数学运算----------------")
print(math.abs(-11)) -- 求绝对值
print(math.deg(math.pi)) -- 弧度转角度
-- 三角函数（传入弧度）
print(math.cos(math.pi)) -- 余弦
print(math.floor(2.6)) -- 向下取整
print(math.ceil(5.2)) -- 向上取整
print(math.max(1,2)) -- 求最大值
print(math.min(4,5)) -- 求最小值

print(math.modf(1.2)) -- 返回整数部分和小数部分
print(math.pow(2,10)) -- 幂运算
print(math.random(100)) -- 伪随机数
print(math.random(100)) -- 伪随机数
math.randomseed(os.time()) -- 设置随机种子
print(math.random(100))
print(math.random(100))
print(math.sqrt(4)) -- 开平方
print("----------------路径-----------------")
print(package.path) -- Lua脚本加载路径
```

> ----------------时间-----------------
> 1600997699
> 1577851200
> hour	9
> min	34
> wday	6
> day	25
> month	9
> year	2020
> sec	59
> yday	269
> isdst	false
> 9
> ---------------数学运算----------------
> 11
> 180
> -1
> 2
> 6
> 2
> 4
> 1	0.2
> 1024
> 1
> 57
> 54
> 44
> 2
> ----------------路径-----------------
> ;.\?.lua;d:\Program Files (x86)\Lua\5.1\lua\?.lua;d:\Program Files (x86)\Lua\5.1\lua\?\init.lua;d:\Program Files (x86)\Lua\5.1\?.lua;d:\Program Files (x86)\Lua\5.1\?\init.lua;d:\Program Files (x86)\Lua\5.1\lua\?.luac

Lua中如何截取字符串？

```lua
str = "hello world !"
-- 参数1：用于截取的字符串
-- 参数2：截取起始位置
-- 参数3：截取结束为止，不填默认截取到尾
str2 = string.sub(str,1,5)
str3 = string.sub(str,7)
print("str2 : " .. str2)
print("str3 : " .. str3)
```

> str2 : hello
> str3 : world !