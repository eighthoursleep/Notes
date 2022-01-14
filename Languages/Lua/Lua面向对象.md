# Lua面向对象



**面向对象、类都是基于表、元表来实现。**

Table是主要的数据结构机制，可以作为其他数据结构的基础。

```lua
Person={}

Person["Name"] = "Aldia"
Person.Gender = "Male"

function Person:PersonInfo()
    print(string.format("name : %s, Gender : %s",self.Name,self.Gender))
end

Person:PersonInfo();
```

> name : Aldia, Gender : Male

## 继承

使用元表`__index`实现继承机制。

```lua
Person={}

Person["Name"] = "Aldia"
Person.Gender = "Male"
Person.Country = "China"

function Person:PersonInfo()
    print(string.format("name : %s, Gender : %s",self.Name,self.Gender))
end

local Child = {}
Child.Name = "Jessie"
Child.Gender = "Female"

function Child:Speak()
    print(string.format("%s comes from %s.",self.Name,self.Country));
end

setmetatable(Child,{__index=Person})

print(Child.Name)
Child:PersonInfo()
Child:Speak()
```

> Jessie
> name : Jessie, Gender : Female
> Jessie comes from China.

进一步优化Lua继承机制：

通过“父类”定义特殊函数，实现方法覆盖的机制

```lua
Person={}

Person["Name"] = ""
Person.Gender = ""
Person.Country = "China"

function Person:PersonInfo()
    print(string.format("NAME : %s, GENDER : %s",self.Name,self.Gender))
end

function Person:New(name,gender) -- 定义获取子类实例的方法
    local child = {}; -- 定义返回的子类
    self.__index = self;
    setmetatable(child,self);
    child.Name = name;
    child.Gender = gender;
    return child; -- 返回的子类
end

local Student = {}
Student = Person:New("Jessie","Female");

print(Student.Name);
Student:PersonInfo(); -- 没有就调用父类方法

function Student:PersonInfo() -- 方法覆盖
    print("Student info:");
    print(string.format("name: %s, gender : %s",self.Name,self.Gender));
end
Student:PersonInfo(); -- 调用子类方法
```

> Jessie
> NAME : Jessie, GENDER : Female
> Student info:
> name: Jessie, gender : Female

使用_G根据字符串创建一个新的表（类）

```lua
Object = {}
Object.id = 1
-- 冒号会自动调用这个函数的对象，作为第一个参数传入的写法
function Object:new( ... )
	-- self代表默认传入的第一个参数
	-- 对象就是变量
	-- 返回的内容本质上是表对象
	local obj = {}
	-- 当找自己的变量找不到时就会去找元表中__index指向的内容
	self.__index = self
	setmetatable(obj,self)
	return obj
end

function Object:Test()
	print("My TestId is " .. self.id)
end

local myObj = Object:new()
print(myObj)
print(myObj.id)
myObj:Test()
-- 对空表中，声明一个新的属性，叫id
myObj.id = 2
print(Object.id)
myObj:Test()

print("---------------继承的实现------------------")
function Object:subClass(className) -- 接收子类名
	-- _G是总表，所有声明的全局标量，都以键值对的形式存在其中
	_G[className] = {} -- 创建按接收到的表名创建空表
	-- 写相关继承的规则
	-- 用到元表
	local obj = _G[className]
	self.__index = self
	setmetatable(obj, self) -- 设置父子关系
end

Object:subClass("Person") -- 子类名
print(Person)
print(Person.id)

 -- Person:subClass("Person")
local p1 = Person:new() -- 创建一个Person的实例
print("p1.id : " .. p1.id)
p1.id = 100
print("p1.id : " .. p1.id)
p1:Test() -- 调用Object的Test的方法

Object:subClass("Monster") -- 创建一个子类Monster
local m1 = Monster:new() -- 创建一个Monster的实例
print("m1.id : " .. m1.id)
m1.id = 200
print("m1.id : " .. m1.id)
m1:Test() -- 调用Object的Test的方法
```

> table: 00C997D0
> 1
> My TestId is 1
> 1
> My TestId is 2
> ---------------继承的实现------------------
> table: 00C996B8
> 1
> p1.id : 1
> p1.id : 100
> My TestId is 100
> m1.id : 1
> m1.id : 200
> My TestId is 200

## 封装

- 表是实现类的一种形式
- 实现new方法，本质上是通过元表和__index创建了一个空表
- 修改创建的对象的属性是在为这个空表对象新建一个成员变量

```lua
Object = {}
Object.id = 1
-- 冒号会自动调用这个函数的对象，作为第一个参数传入的写法
function Object:new( ... )
	-- self代表默认传入的第一个参数
	-- 对象就是变量
	-- 返回的内容本质上是表对象
	local obj = {}
	-- 当找自己的变量找不到时就会去找元表中__index指向的内容
	self.__index = self
	setmetatable(obj,self)
	return obj
end

function Object:Test()
	print(self.id)
end

local myObj = Object:new()
print(myObj)
print(myObj.id)
myObj:Test()
-- 对空表中，声明一个新的属性，叫id
myObj.id = 2
print(Object.id)
myObj:Test()
```

> table: 00A69790
> 1
> 1
> 1
> 2

- 表是实现类的一种形式

- 用表实现new方法本质上是创建了一个空表
- 修改创建的对象的属性变量时，是在为这个空表对象新建一个成员属性（变量）

## 多态

- 什么是多态？相同的方法名，子类有不同的处理逻辑
- 怎么实现多态？直接重写这个方法
  - 如果要保留父类方法的执行逻辑
    1. 加入自定义base属性
    2. subClass方法中赋值
  - 注意：通过base调用父类方法时，使用点而非冒号，然后传入自身作为第一个参数进入父类函数内部

```lua
Object = {}
Object.id = 1
-- 冒号会自动调用这个函数的对象，作为第一个参数传入的写法
function Object:new( ... )
	-- self代表默认传入的第一个参数
	-- 对象就是变量
	-- 返回的内容本质上是表对象
	local obj = {}
	-- 当找自己的变量找不到时就会去找元表中__index指向的内容
	self.__index = self
	setmetatable(obj,self)
	return obj
end

function Object:Test()
	print("My TestId is " .. self.id)
end

local myObj = Object:new()
print(myObj)
print(myObj.id)
myObj:Test()
-- 对空表中，声明一个新的属性，叫id
myObj.id = 2
print(Object.id)
myObj:Test()

print("---------------继承的实现------------------")
function Object:subClass(className) -- 接收子类名
	-- _G是总表，所有声明的全局标量，都以键值对的形式存在其中
	_G[className] = {} -- 创建按接收到的表名创建空表
	-- 写相关继承的规则
	-- 用到元表
	local obj = _G[className]
	self.__index = self
	-- 子类定义一个base属性代表父类
	obj.base = self
	setmetatable(obj, self) -- 设置父子关系
end

Object:subClass("Person") -- 子类名
print(Person)
print(Person.id)

 -- Person:subClass("Person")
local p1 = Person:new() -- 创建一个Person的实例
print("p1.id : " .. p1.id)
p1.id = 100
print("p1.id : " .. p1.id)
p1:Test() -- 调用Object的Test的方法

Object:subClass("Monster") -- 创建一个子类Monster
local m1 = Monster:new() -- 创建一个Monster的实例
print("m1.id : " .. m1.id)
m1.id = 200
print("m1.id : " .. m1.id)
m1:Test() -- 调用Object的Test的方法

print("-----------------多态的实现----------------------")
-- 相同行为，不同表象，就是多态
-- 形同方法，不同执行逻辑，就是多态
Object:subClass("GameObject")
GameObject.posX = 0;
GameObject.posY = 0;

function GameObject:Move()
	self.posX = self.posX + 1
	self.posY = self.posY + 1
	print(self.posX)
	print(self.posY)
end

GameObject:subClass("Player")
function Player:Move()
    -- self.base:Move()
    -- 目前这种写法有坑，不同对象使用的成员变量居然是相同的成员，而非对象自己的    
	-- 这里的base指的是GameObject表
	-- 这种方式调用相当于把基类GameObject表作为第一个参数传入方法中
    -- 但我们要传入的是Player
	-- 因此如果需要执行父类逻辑，我们不要直接用冒号调用，要避免把基类表传入到方法中
	-- 应该通过.调用，然后手动传入self作为第一个参数
	
	self.base.Move(self) -- 正确写法
end

local p1 = Player:new()
p1:Move()
local p2 = Player:new()
p2:Move()
p1:Move()
```

> table: 006D9398
> 1
> My TestId is 1
> 1
> My TestId is 2
> ---------------继承的实现------------------
> table: 006D9370
> 1
> p1.id : 1
> p1.id : 100
> My TestId is 100
> m1.id : 1
> m1.id : 200
> My TestId is 200
> -----------------多态的实现----------------------
> 1
> 1
> 1
> 1
> 2
> 2

## 综合例子

```lua
-- 面向对象的实现
-- 所有对象的基类 Object
-- 封装
Object = {}
-- 实例化方法
function Object:new()
	local obj = {}
	-- 给空对象设置元表，以及 __index
	self.__index = self
	setmetatable(obj,self)
	return obj
end

-- 继承
function Object:subClass(className)
	-- 根据名字生成一张表，即生成一个类
	_G[className] = {}
	local obj = _G[className]
	-- 设置自己的“父类”
	obj.base = self
	-- 给子类设置元表 以及 __index
	self.__index = self
	setmetatable(obj,self)
end
-- 声明一个新的子类
Object:subClass("GameObject")
-- 成员变量
GameObject.posX = 0
GameObject.posY = 0
-- 成员方法
function GameObject:Move()
	self.posX = self.posX + 1
	self.posY = self.posY + 1
end
-- 实例化对象使用
local obj = GameObject:new()
print("obj = (" .. obj.posX .. ", " .. obj.posY .. ")")
obj:Move()
obj:Move()
print("obj = (" .. obj.posX .. ", " .. obj.posY .. ")")

local obj2 = GameObject:new()
print("obj2 = (" .. obj2.posX .. ", " .. obj2.posY .. ")")
obj2:Move()
obj2:Move()
print("obj2 = (" .. obj2.posX .. ", " .. obj2.posY .. ")")

-- 多态
print("----------分割线--------------------")
-- 声明一个新的类,继承GameObject
GameObject:subClass("Player")
function Player:Move()
	-- base调用父类方法，用点调用传入自身
	self.base.Move(self)
end

-- 实例化Player对象
local p1 = Player:new()
print("p1 = (" .. p1.posX .. ", " .. p1.posY ..")")
p1:Move()
print("p1 = (" .. p1.posX .. ", " .. p1.posY ..")")

local p2 = Player:new()
print("p2 = (" .. p2.posX .. ", " .. p2.posY ..")")
p2:Move()
print("p2 = (" .. p2.posX .. ", " .. p2.posY ..")")
```

> obj = (0, 0)
> obj = (2, 2)
> obj2 = (0, 0)
> obj2 = (2, 2)
> ----------分割线--------------------
> p1 = (0, 0)
> p1 = (1, 1)
> p2 = (0, 0)
> p2 = (1, 1)