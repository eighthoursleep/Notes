# Lua元表



## 元表概念

任何表变量都可以作为另一个表变量的元表

任何表变量都可以有自己的元表（父表）

当我们在子表中进行一些特定操作时，会执行元表中的内容

**为什么需要”元表“？**

在Lua中的每个值都有一套预定义的操作合集。例如可以将数字相加，可以连接字符串，还可以在table中插入一对key-value等。

但是我们无法将两个table相加，无法对函数作比较，也无法调用一个字符串。

**元表的作用：**

Lua提供了元表与元方法来修改一个值的行为，使其在面对一个“非预定义”的操作时执行一个指定的操作。

例如：对两个“表”进行“加法”操作。类似C#中的“扩展方法”、“操作符重载”等技术。

**元表性质：**

**任何table都可以作为任何值的元表**，而**一组相关的table也可以共享一个通用的元表**，此元表描述了它们共同的行为。一个table甚至可以作为它自己的元表，用于描述其特有的行为。总之任何搭配形式都是合法的。



## 设置元表

**设置元表的步骤：**

1. 定义原始表
2. 定义元表（核心计算）
3. 设置元方法
4. 设置元表
5. 测试输出

```lua
myTable = {}
metaTable = {}
-- 设置元表函数
-- 第一个参数：子表
-- 第二个参数：元表
setmetatable(myTable,metaTable)
```



## 元表方法

**元表重要函数：**

有两个函数可以获取与设置元表：`setmetatable(t1, t2)`设置t1的元表为t2。`getmetatable(t)`获取t的元表。

**“元方法”定义值的行为，就有相应的元方法。**

### 算术类元方法

`__add`加, `__sub`减, `__mul`乘, `__div`除,

`__unm`相反数, `__mod`取模, `__pow`乘幂, `__concat`连接操作符



### 关系类元方法

`__eq`等于, `__lt`小于, `__le`小于等于



### 库定义的元方法

`__tostring`（print时调用），`__metatable`（设置后不可修改元表）

```lua
tab_1 = {10,20,50};
tab_2 = {30,40,80};
tab_3 = {num1=10, num2=20, num3=50};
tab_4 = {num1=30, num2=40, num3=80};
tab_5 = {str1="C#", str2="Lua", str3="Unity"};

setTable = {}
function setTable.Adding(tab1,tab2)
    local result = {};
    for i, v in pairs(tab1) do
        if (v==nil) then
            break;
        end
        result[i]=tab1[i]+tab2[i];
    end
    return result;
end

function setTable.Sub(tab1,tab2)
    local result = {};
    for i, v in pairs(tab1) do
        if (v==nil) then
            break;
        end
        result[i]=tab1[i] - tab2[i];
    end
    return result;
end

function setTable.ToString(tab)
    local tabResult = {}
    for i, v in pairs(tab) do
        tabResult[#tabResult+1] = v;
    end
    return table.concat(tabResult,",")
end

setTable.__add = setTable.Adding
setTable.__sub = setTable.Sub

setTable.__tostring = setTable.ToString;
setTable.__metatable = "元表不可修改";


setmetatable(tab_1,setTable);
setmetatable(tab_2,setTable);
setmetatable(tab_3,setTable);
setmetatable(tab_4,setTable);
setmetatable(tab_5,setTable);

-- resultTable = tab_1 + tab_2;
resultTable = tab_3 - tab_4;

--for i = 1, #resultTable do
--    print(resultTable[i]);
--end

--for k,v in pairs(resultTable) do
--    print(v);
--end

print(tab_1);
print(tab_5);
print(getmetatable(tab_5));
```

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

### 元表的运算符重载例子

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

### Table访问类元方法

#### __index

当访问一个table中不存在的字段时，得到的结果为nil。

这是对的，但并非完全正确。实际上，这些访问会促使解释器去查找一个叫`__index`的元方法。

如果没有这个元方法，那么访问结果就是nil，否则由这个元方法来提供最终的结果。

**子表中找不到某个属性**时，回到元表中的**__index指定的表**去找索引

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

#### __newIndex

当对一个table中不存在的索引赋值时，解释器就会查找`__newindex`元方法。如果有这个元方法，解释器就调用它，而不是执行赋值。

如果给子表的属性赋值，如果属性索引不存在，会把这个值赋值到元表的`__newindex`所指向的表中，不会修改子表

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