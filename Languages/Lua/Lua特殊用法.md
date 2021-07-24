---
title: Lua特殊用法
date: 2020-01-30 17:04:46
tags: Lua
---

多变量赋值，多返回值，三目运算符

<!--more-->

```lua
-- 多变量赋值
a, b, c = 1, 2, "123"
print(a,b,c)
--如果后边的值不够，会自动补nil
a,b,c = 1,2
print(a,b,c)
-- 后边的值多了，自动省略
a,b,c = 1,2,3,4,5
print(a,b,c)
-- 多返回值
function Test()
	return 10,20,30,40
end
-- 多返回值用几个变量接收就有几个值
-- 如果少了就少接，多了自动补空
a,b,c = Test()
print(a,b,c)

a,b,c,d,e = Test()
print(a,b,c,d,e)
-- and or
-- 逻辑与，逻辑或
-- 不仅可以连接boolean,任何东西都可以连接
print(123 and 456) -- 打印456
print(123 or 456) -- 打印123
-- 在Lua中只有nil，和false才认为是假
print(nil and 111) -- 打印nil
print(false and 222) -- 打印false
print(true and 333) -- 打印333
print(true or 444) -- 打印true
print(nil or 555) -- 打印555
print(false or 666) -- 打印666
-- Lua不支持三目运算符，需要自己实现
x, y= 12,34
local res = (x<y) and x or y
print(res)
-- (x<y) and x --> true and x --> x
-- x or y --> x

-- (x>y) and x --> false and x -->false
-- false or y --> y
```

> 1	2	123
> 1	2	nil
> 1	2	3
> 10	20	30
> 10	20	30	40	nil
> 456
> 123
> nil
> false
> 333
> true
> 555
> 666
> 12