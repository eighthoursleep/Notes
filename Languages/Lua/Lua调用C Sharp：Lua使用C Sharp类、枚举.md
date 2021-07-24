---
title: Lua调用C#：Lua使用C#类、枚举
date: 2020-07-08 11:11:46
tags:
- C Sharp
- Lua
categories: xLua
toc: true
---

Lua使用C#类、枚举

<!--more-->

# Lua使用C#类

Lua没有办法直接访问C#，一定是先从C#调用Lua脚本后才把核心逻辑交给Lua。

```lua Main.lua
print("Access Main.lua File.")
require("AccessClass")
```

Lua调用C#类格式：

`CS.命名空间.类名`

`CS.UnityEngine.类名`

没有命名空间：`CS.类名`

实例化对象：`CS.命名空间.类名()`

声明/访问静态方法和静态变量：`CS.命名空间.类名.方法或变量`

声明/访问成员变量：`实例化的对象.变量名`

声明/访问成员方法：`实例化的对象.方法名`

技巧：

- 可以取别名：`别名 = CS.命名空间.类名`
- xLua不支持无参泛型函数，所以我们使用AddComponent(Type)
- xLua提供了一个`typeof`方法，用于获取对象的Type

```lua AccessClass.lua
print("Access AccessClass.lua file.")
-- CS.命名空间.类名
-- Unity的类例如GameObject Transform等等 => CS.UnityEngine.类名
-- CS.UnityEngine.GameObject

-- 通过C#中的类，实例化一个对象,Lua中没有new，直接类名加括号实例化
-- 默认调用，相当于是无参构造
local obj1 = CS.UnityEngine.GameObject()
local obj2 = CS.UnityEngine.GameObject("Sword")

-- 为了方便使用以及节约性能，用全局变量来存储C#中的类
-- 相当于取了一个别名
GameObject = CS.UnityEngine.GameObject
local obj3 = GameObject("Shield")

-- 类中的静态对象，可以直接使用“.”来调用
local obj4 = GameObject.Find("Sword")

-- 得到对象中的成员变量，直接“对象.*”即可
print(obj4.transform.position)
Debug = CS.UnityEngine.Debug
Debug.Log(obj4.transform.position)

-- 如果使用对象中的成员方法，一定要加冒号
Vector3 = CS.UnityEngine.Vector3
obj4.transform:Translate(Vector3.right)
Debug.Log(obj4.transform.position)

-- 自定义类使用方法相同，只是命名空间不同
local t = CS.Test()
t:Speak("test说话")

local t2 = CS.MyGame.Test2()
t2:Speak("test2说话")

-- 继承了Mono的类，不能直接new
local obj5 = GameObject("加脚本测试")
-- 通过GameObject的AddComponent添加脚本
-- xLua提供了一个重要方法"typeof"得到类的Type
-- xLua中不支持无参泛型函数，所以要使用另一个重载
obj5:AddComponent(typeof(CS.LuaAccessCSharp))
```

```c# Main.cs
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Main : MonoBehaviour
{
    // Start is called before the first frame update
    void Start()
    {
        LuaMgr.GetInstance().Init();
        LuaMgr.GetInstance().DoLuaFile("Main");
    }
}
```

```c# LuaAccessCSharp.cs
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class LuaAccessCSharp : MonoBehaviour
{
}
public class Test
{
    public void Speak(string str)
    {
        Debug.Log("Test1 : " + str);
    }
}
namespace MyGame
{
    public class Test2
    {
        public void Speak(string str)
        {
            Debug.Log("Test2 : " + str);
        }
    }
}
```

> LUA: Access Main.lua File.
>
> LUA: Access AccessClass.lua File.
>
> LUA: (0.0, 0.0, 0.0): 0
>
> (0.0, 0.0, 0.0)
>
> (1.0, 0.0, 0.0)
>
> Test1: test说话
>
> Test2: test2说话

# Lua使用C#枚举

枚举的使用和类的使用一样，但不存在实例化

`CS.命名空间.枚举名.枚举成员`

`枚举.__CastFrom(数字或者字符串)`

```lua Main.lua
print("Access Main.lua File.")
require("AccessEnum")
```

```lua AccessEnum.lua
print("Access AccessEnum.lua file.")
-- 枚举的调用规则和类的调用规则一样
-- CS.命名空间.枚举名.枚举成员

-- Unity自带枚举
PrimitiveType = CS.UnityEngine.PrimitiveType
GameObject = CS.UnityEngine.GameObject
local obj = GameObject.CreatePrimitive(PrimitiveType.Cube)
-- 自定义枚举
State = CS.State
local c = State.Idle
print(c)
-- 枚举转换相关：
-- 数值转枚举
local a = State.__CastFrom(1)
print(a)
-- 字符串转枚举
local b = State.__CastFrom("Atk")
print(b)
```

```c# LuaAccessCSharp.cs
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class LuaAccessCSharp : MonoBehaviour
{
}
/// <summary>
/// 自定义枚举
/// </summary>
public enum State
{
    Idle, Move, Atk,
}
```

> LUA: Access Main.lua File
>
> LUA: Access AccessEnum.lua file
>
> LUA: Idle: 0
>
> LUA: Move: 1
>
> LUA: Atk: 2