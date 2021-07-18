---
title: Lua协同程序
date: 2020-01-30 17:04:46
toc: true
tags: Lua
---

多变量赋值，多返回值，三目运算符

协程的创建，协程的运行，协程的挂起，协程的状态

<!--more-->

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