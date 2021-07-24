---
title: Lua元表
date: 2020-01-30 17:04:46
tags: Lua
---

元表概念、设置元表、特定操作（__tostring, _call, _index, _newIndex）、运算符重载

<!--more-->

## 元表概念

任何表变量都可以作为另一个表变量的元表

任何表变量都可以有自己的元表（父表）

当我们在子表中进行一些特定操作时，会执行元表中的内容

## 设置元表

```lua
myTable = {}
metaTable = {}
-- 设置元表函数
-- 第一个参数：子表
-- 第二个参数：元表
setmetatable(myTable,metaTable)
```



## 特定操作

### __tostring

```lua
myTable = {
	name = "Sero"
}
metaTable = {
	-- 当子表要被当做字符串使用时，会默认调用这个元表的__tostring()方法
	__tostring = function()
		return "fus ro dah"
	end

}
metaTable2 = {
	-- 默认第一个参数传入自身
	__tostring = function(t)
		return t.name
	end
	
}
-- 设置元表函数 setmetatable(table_1,table_2)
-- 第一个参数：子表
-- 第二个参数：元表
setmetatable(myTable,metaTable)
print(myTable)
setmetatable(myTable,metaTable2)
print(myTable)
```

> fus ro dah
> Sero

### __call

```lua
myTable = {
	name = "Sero"
}
metaTable = {
	-- 当子表要被当做字符串使用时，会默认调用这个元表的__tostring()方法
	__tostring = function(t)
		return t.name
	end,
	-- 当子表被当做一个函数来使用时，会默认调用这个元表的__call()方法
	-- 当希望传参数时，默认第一个参数是调用者本身
	__call = function(a,b)
		print(a)
		print(b)
		print("fus ro dah")
	end

}

setmetatable(myTable,metaTable)
print(myTable)
print("-------------分割线---------------")
-- 把子表作为函数使用，就会调用元表的__call方法
-- 没有实现__call无法把表作为函数使用
myTable()
print("-------------分割线---------------")
myTable(666)
```

> Sero
> -------------分割线---------------
> Sero
> nil
> fus ro dah
> -------------分割线---------------
> Sero
> 666
> fus ro dah

### 元表的运算符重载

```lua
metaTable = {
	-- 当子表要被当做字符串使用时，会默认调用这个元表的__tostring()方法
	__tostring = function(t)
		return t.name
	end,
	-- 当子表被当做一个函数来使用时，会默认调用这个元表的__call()方法
	-- 当希望传参数时，默认第一个参数是调用者本身
	__call = function(a,b)
		print(a)
		print(b)
		print("fus ro dah")
	end,
	-- 运算符 +
	__add = function(t1,t2)
		return t1.golds + t2.golds
	end,
	-- 运算符 -
	__sub = function(t1,t2)
		return t1.golds - t2.golds
	end,
	-- 运算符 *
	__mul = function(t1,t2)
		return t1.golds * t2.golds
	end,
	-- 运算符 /
	__div = function(t1,t2)
		return t1.golds / t2.golds
	end,
	-- 运算符 %
	__mod = function(t1,t2)
		return t1.golds % t2.golds
	end,
	-- 运算符 ^
	__pow = function(t1,t2)
		return t1.golds ^ t2.golds
	end,
	-- 运算符 ==
	__eq = function(t1,t2)
		return t1.golds == t2.golds
	end,
	-- 运算符 <
	__lt = function(t1,t2)
		return t1.golds < t2.golds
	end,
	-- 运算符 <=
	__le = function(t1,t2)
		return t1.golds <= t2.golds
	end,
	-- 运算符 ==
	__concat = function(t1,t2)
		return t1.golds .. t2.golds
	end

}
myTable = {
	name = "Sero",
	golds = 25

}
myTable2 = {
	name = "James",
	golds = 2
}
setmetatable(myTable,metaTable)
setmetatable(myTable2,metaTable)
print(myTable + myTable2)
print(myTable - myTable2)
print(myTable * myTable2)
print(myTable / myTable2)
print(myTable % myTable2)
print(myTable ^ myTable2)
-- 两个对象的元表要一致，才可以准确调用元表条件运算
print(myTable == myTable2)
print(myTable < myTable2)
print(myTable2 <= myTable)
print(myTable .. myTable2)
```

> 27
> 23
> 50
> 12.5
> 1
> 625
> false
> false
> true
> 252
> [Finished in 0.1s]

### __index

当**子表中找不到某个属性**时，回到元表中的**__index指定的表**去找索引

```lua
meta = {
	level = 1
}
myTable = {}
setmetatable(myTable,meta)
print(myTable.level)

meta.__index = meta
print(myTable.level)

meta.__index = {level = 10}
print(myTable.level)

meta2 = {
	level = 2,
	__index = {level = 20}
}
setmetatable(myTable,meta2)
print(myTable.level)
print("----------------分割线---------------------")
-- __index 最好写在表外
meta3 = {
	level = 3,
	__index = meta3
}
setmetatable(myTable,meta3)
print(myTable.level)
print("----------------分割线---------------------")
-- 可以逐层查找__index
meta4 = {
	secret = 9999
}
meta4.__index = meta4
setmetatable(myTable,meta)
setmetatable(meta,meta4)
print(myTable.secret) -- meta的__index此时指向不是自身
meta.__index = meta -- meta的__index指向自身
print(myTable.secret) -- 先在meta自身的找，再向meta4的__index指向的表（meta4自身）里找
```

> nil
> 1
> 10
> 20
> ----------------分割线---------------------
> nil
> ----------------分割线---------------------
> nil
> 9999

### __newIndex

如果给子表的属性赋值，如果属性索引不存在，会把这个值赋值到元表的__newindex所指向的表中，不会修改子表

```lua
myTable = {}
myTable.level = 1
print(myTable.level)

myTable.level = nil
meta = {}
setmetatable(myTable,meta)
meta.__newindex = meta
myTable.level = 2
print(myTable.level)
print(meta.level)

meta.level = nil
meta.__newindex = {}
myTable.level = 3
print(myTable.level)
-- getmetatable(子表)：返回元表
print(getmetatable(myTable))
-- rawget(表名,属性)：忽略__index,只在自身查找属性
meta.health = 1000
meta.__index = meta
print(myTable.health)
print(rawget(myTable,"health"))
print("-------------分割线----------------")
-- rawset(表名,属性,值)：忽略__newindex,给自身属性赋值
meta.__newindex = meta
myTable.mega = 500
print(rawget(myTable,"mega"))
print(rawget(meta,"mega"))

rawset(myTable,"stamina",2000)
print(rawget(myTable,"stamina"))
print(rawget(meta,"stamina"))
```

> 1
> nil
> 2
> nil
> table: 00C895B0
> 1000
> nil
> -------------分割线----------------
> nil
> 500
> 2000
> nil

## Lua中元表的作用是什么？对于开发者何意义

Lua中不存在重载，通过元表我们可以实现对应功能的运算符“重载”，比如实现tostring“重载”。

通过元表，我们可以利用__index可以完成面向对象继承多态的实现