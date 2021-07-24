---
title: Lua垃圾回收
date: 2020-07-07 18:04:46
tags: Lua
widgets: null
---

涉及时间、数学运算、路径

关键字：collectgarbage(命令)

<!--more-->

```lua
-- 垃圾回收
test = {id = 1, name = "123123"}
-- 关键字：collectgarbage(命令)
print(collectgarbage("count")) -- count命令，计算占用内存大小（单位：KB），返回值 * 1024，就可以得到具体的内存占用字节数
-- Lua中的机制和C#中垃圾回收机制很类似，解除羁绊，就变垃圾
test = nil
-- 进行垃圾回收，理解有点像C#的GC
collectgarbage("collect") -- collect命令，进行一次完整的垃圾回收
print(collectgarbage("count"))

-- Lua中，有自动定时进行垃圾回收
-- 在Unity热更新开发中，尽量不要使用自动垃圾回收
```

> 20.4326171875
> 19.259765625