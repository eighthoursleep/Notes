# Lua协同程序



## 什么是协同程序？

Lua所支持的协程全称协同式多线程（collaborative multithreading）。

Lua为每个coroutine提供一个独立的运行线路，然而与多线程不同的地方是，coroutine只有在**显式调用`yield`函数后才被挂起(协程暂停)，同一时间内只有一个协程在运行。**



## 与真正的多线程的区别

线程与协程的主要区别在于，一个具有多线程的程序可以同时运行几个线程，而协同程序却需要被彼此协作的运行。

即多个协程在任意时刻只能运行一个协程，只有当正在运行的协程显式的要求挂起时，它的执行才会暂停。

```lua
cot = coroutine.create( -- 创建协程
    function() -- 协程的本质是一个线程对象
        for i = 1, 10 do
            print("协同一：", i);
            if i == 5 then
                coroutine.yield(); -- 线程挂起
            end
        end
    end
)

print("cot type = ",type(cot));
coroutine.resume(cot); -- 启动协程
print("wait!")
coroutine.resume(cot);
```

> lua.exe metaTable.lua
> cot type = 	thread
> 协同一：	1
> 协同一：	2
> 协同一：	3
> 协同一：	4
> 协同一：	5
> wait!
> 协同一：	6
> 协同一：	7
> 协同一：	8
> 协同一：	9
> 协同一：	10

## 基本语法

- 创建协同：

  - `coroutine.create()`创建一个新的协同程序，唯一的参数是该协同程序的主函数。返回其句柄（thread类型对象），不会立即启动该协同程序。

  - `coroutine.wrap()`同样创建一个新的协同程序，不同在于它不返回协程本身，而是返回一个函数。
  - `create`与`wrap`的优缺点：
    - `wrap`函数比`create`函数更易使用。它提供了一个对于协同程序编程实际所需的功能，即一个可以唤醒协同程序的函数。但也缺乏灵活性，无法检查wrap所创建的协同程序的状态，此外，也无法检测出运行时的错误。

- 启动协同：

  - `coroutine.resume()`启动或再次启动一个协同程序，并将其状态由挂起改为运行。

- 检查协同状态：

  - `coroutine.status()`检查协同程序的状态，挂起**suspended**、运行**running**、死亡**dead**、正常**normal**。

- 挂起协同：

  - `coroutine.yield()`使协程暂停执行且让出执行权。此时协程让出执行权后，对应的最近`coroutine.resume()`函数会立即返回。

```lua
cot1 = coroutine.create(
    function()
        for i = 1, 5 do
            print("协同1：", i);
            if i == 3 then
                coroutine.yield(); -- 线程挂起
            end
        end
    end
)
cot2 = coroutine.create(
    function()
        for i = 1, 5 do
            print("协同2: ",i);
        end
    end
)

print("cot type = ",type(cot1));
coroutine.resume(cot1); -- 启动协程
print("wait!")
print("cot1 status: ",coroutine.status(cot2))
coroutine.resume(cot2);
print("cot1 status: ",coroutine.status(cot1))
print("cot1 status: ",coroutine.status(cot2))
coroutine.resume(cot1);
print("cot1 status: ",coroutine.status(cot1))
```

> cot type = 	thread
> 协同1：	1
> 协同1：	2
> 协同1：	3
> wait!
> cot2 status: 	suspended
> 协同2: 	1
> 协同2: 	2
> 协同2: 	3
> 协同2: 	4
> 协同2: 	5
> cot1 status: 	suspended
> cot2 status: 	dead
> 协同1：	4
> 协同1：	5
> cot1 status: 	dead

```lua
cot1 = coroutine.wrap( -- 使用wrap创建协程
    function(info)
        print("info : ",info);
        for i = 1, 5 do
            print("协同1：", i);
            if i == 3 then
                coroutine.yield(); -- 线程挂起
            end
        end
    end
)

print(type(cot1));
cot1();
```

> function
> info : 	nil
> 协同1：	1
> 协同1：	2
> 协同1：	3

```lua
cot1 = coroutine.create(
    function()
        for i = 1, 5 do
            print("协同1: ",i);
            if i==3 then
                print(coroutine.status(cot1))
                print(coroutine.running()) -- 当前协同是否在运行
            end
            coroutine.yield();
        end
    end
)

coroutine.resume(cot1);
coroutine.resume(cot1);
coroutine.resume(cot1);

print(coroutine.status(cot1));
print(coroutine.running());
```

> 协同1: 	1
> 协同1: 	2
> 协同1: 	3
> running
> thread: 00A0D620
> suspended
> nil

## 带参协同

```lua
function simpleCot(num)
    print("num = ",num);
end

function multiParaCot(cor, ...)
    print(coroutine.status(cor),...);
end

cot = coroutine.create(simpleCot);
cot2 = coroutine.create(multiParaCot);

coroutine.resume(cot,250);
coroutine.resume(cot2,cot2,"hello",666,998);
```

> num = 	250
> running	hello	666	998

## 多个协同同时执行逻辑

综合运用协同的api(创建、挂起、状态控制等)，完成多个协同之间同时完成工作的任务。

**多个协同程序在任意时刻只能运行一个协同程序。**

```lua
state_a = "running" -- 控制变量
state_b = "running"

cor_a = coroutine.create(
    function()
        for i = 1, 10 do
            print("mission 1 : ",i);
            if i%2==0 then
                coroutine.yield();
            end
        end
        print("mission 1 end.");
        print(coroutine.status(cor_a));
        state_a = "end"
    end
)

cor_b = coroutine.create(
    function()
        for i = 1, 10 do
            print("mission 2 : ",i);
            if i%3==0 then
                coroutine.yield(); -- 线程挂起
            end
        end
        print("mission 2 end.");
        print(coroutine.status(cor_b));
        state_b = "end"
    end
)

while(state_a ~= "end" or state_b ~= "end") do
    if coroutine.status(cor_a)=="suspended" then -- 启动协同a
        coroutine.resume(cor_a);
    end
    if coroutine.status(cor_b)=="suspended" then -- 启动协同b
        coroutine.resume(cor_b);
    end
end

print(coroutine.status(cor_a)); -- 查看协同的最后状态
print(coroutine.status(cor_b));
```

> mission 1 : 	1
> mission 1 : 	2
> mission 2 : 	1
> mission 2 : 	2
> mission 2 : 	3
> mission 1 : 	3
> mission 1 : 	4
> mission 2 : 	4
> mission 2 : 	5
> mission 2 : 	6
> mission 1 : 	5
> mission 1 : 	6
> mission 2 : 	7
> mission 2 : 	8
> mission 2 : 	9
> mission 1 : 	7
> mission 1 : 	8
> mission 2 : 	10
> mission 2 end.
> running
> mission 1 : 	9
> mission 1 : 	10
> mission 1 end.
> running
> dead
> dead

## 带参协同之间的状态管理

在一个协同里不能直接启动另一个协同，必须先挂起当前执行的协同，再在协同外部启动。

```lua
local corA = coroutine.create(
    function(cor)
        print("in corA, corA status : ",coroutine.status(cor));
        coroutine.yield(); -- 挂起协同A
    end
)
local corB = coroutine.create(
    function(cor)
        print("in corB, corA status : ",coroutine.status(cor));
    end
)

print("corA init status : ",coroutine.status(corA));
print("corB init status : ",coroutine.status(corB));

coroutine.resume(corA,corA);
coroutine.resume(corB,corA);
```

> corA init status : 	suspended
> corB init status : 	suspended
> in corA, corA status : 	running
> in corB, corA status : 	suspended

## yield返回数值

在挂起协同的时候，`yield`都是没有参数的。

当挂起正在调用的协程的执行，传递给`yield`的参数会转为`resume`的额外返回值。即这里的yield参数，可以作为启动本协程的返回数值使用。

```lua
local cot = coroutine.create(
    function()
        coroutine.yield("Hello",648);
    end
)

result,value1,value2 = coroutine.resume(cot);
print(result,value1,value2);
```

> true	Hello	648

## 生成者与消费者经典案例

使用协程实现“生产者-消费者”的协同合作任务。

使用`yield`带参数的方式，可以把结果返回到协同（再次）启动的语句（即`resume`处），最终实现在模拟多线程环境下，实现对象的生成与对象消费的分离开发，实现低耦合。

“生产者-消费者”模式是并发、多线程编程中经典的设计模式，生成者与消费者通过**分离的执行工作解耦**，**简化了开发**模式，生产者与消费者可以以**不同的速度生产和消费数据**。

```lua
function GetNumber()
    local num = 0;
    return function()
        num = num + 1;
        return num;
    end
end

local getNum = GetNumber(); -- 得到一个返回函数
print(type(getNum))

cot_Production = coroutine.create( -- 生产者
    function()
        while(true) do
            local num = getNum(); -- 得到一个迭代器函数返回的具体数值
            -- local num = GetNumber(); -- 得到的是函数不是具体数值
            print(num);
            coroutine.yield(num);
        end
    end
)

function Revieve() -- 接收函数
    local status,value = coroutine.resume(cot_Production);
    return value;
end

function Consumer(printNum) -- 消费者
    for i = 1, printNum do
       local revieveValue = Revieve();
        print("revieve value : ",revieveValue);
    end
end

Consumer(10);
```

> function
> 1
> revieve value : 	1
> 2
> revieve value : 	2
> 3
> revieve value : 	3
> 4
> revieve value : 	4
> 5
> revieve value : 	5
> 6
> revieve value : 	6
> 7
> revieve value : 	7
> 8
> revieve value : 	8
> 9
> revieve value : 	9
> 10
> revieve value : 	10



```lua
-- 协程的创建
fun = function()
	print(123)
end
-- 常用方式：coroutine.create(函数名)，返回的是线程对象
co = coroutine.create(fun)
--协程的本质是一个线程对象
print(type(co))
-- 第二种方式：coroutine.wrap(函数名),返回的是函数
co2 = coroutine.wrap(fun)
co3 = coroutine.wrap(function()
	print(456)
end)
print(type(co2))
print(type(co3))
-- 协程的运行
-- 第一种方式：coroutine.resume(协程对象)，对应通过create创建的协程
coroutine.resume(co)
-- 第二种方式：直接调用函数，对应通过wrap创建的协程
co2()
print("------------分割线-------------")
-- 协程的挂起
fun2 = function()
	local i = 1
	while true do
		print(i)
		i = i + 1
		coroutine.yield(i)-- 协程的挂起函数
		-- 如果需要返回值，可将返回值填在yield里
	end
end
co3 = coroutine.create(fun2)
coroutine.resume(co3)
coroutine.resume(co3)
coroutine.resume(co3)
-- 默认第一个返回值：协程是否启动成功
-- 第二个返回值：yield里的返回值
isOK,temp = coroutine.resume(co3)
print(isOK,temp)
isOK,temp = coroutine.resume(co3)
print(isOK,temp)

co4 = coroutine.wrap(fun2)
co4()
co4()
-- 这种方式调用协程，只返回yield里的变量
print("返回：" .. co4())
print("返回：" .. co4())
print("------------分割线-------------")
-- 协程的状态
-- coroutine.status(协程对象)
-- dead 结束
-- suspended 暂停
-- running 进行中
print(coroutine.status(co3)) -- co3被挂起，执行完一次暂停
print(coroutine.status(co)) -- co没有被挂起，执行完就结束了
print("------------分割线-------------")
fun3 = function()
	local i = 1
	while true do
		print(i)
		i = i + 1
		print(coroutine.status(co4)) -- 在协程进行中打印协程状态
		print(coroutine.running()) -- 打印运行中的协程的编号
		coroutine.yield(i)-- 协程的挂起函数
		-- 如果需要返回值，可将返回值填在yield里
	end
end
co4 = coroutine.create(fun3)
co5 = coroutine.create(fun3)

coroutine.resume(co4)
coroutine.resume(co4)
coroutine.resume(co4)
print("------------分割线-------------")
print(coroutine.running()) -- 打印运行中的协程的编号
coroutine.resume(co5)
coroutine.resume(co5)
```

> thread
> function
> function
> 123
> 123
> ------------分割线-------------
> 1
> 2
> 3
> 4
> true	5
> 5
> true	6
> 1
> 2
> 3
> 返回：4
> 4
> 返回：5
> ------------分割线-------------
> suspended
> dead
> ------------分割线-------------
> 1
> running
> thread: 00B6DAE8
> 2
> running
> thread: 00B6DAE8
> 3
> running
> thread: 00B6DAE8
> ------------分割线-------------
> nil
> 1
> suspended
> thread: 00B6DE98
> 2
> suspended
> thread: 00B6DE98
> [Finished in 0.1s]