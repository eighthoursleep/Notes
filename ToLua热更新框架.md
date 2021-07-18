---
title: ToLua热更新框架
date: 2020-08-08 08:51:05
tags: Lua
widgets: null
categories: 热更新
---

[ToLua](https://github.com/topameng/tolua)是Unity静态绑定Lua的一个解决方案，它通过C#中集成Lua的插件，可以自动生成用于Lua中访问Unity的绑定代码，并把C#中的常量、变量、函数、属性、类以及枚举暴露给Lua。

<!--more-->

下载ToLua后，解压将Assets文件夹和Unity5.x文件夹都复制到项目文件夹里。



Assets文件夹里的文件列表：

1. Editor文件夹下Custom/CustomSettings.cs自定义配置文件，用于定义哪些类作为静态类型，哪些类需要导出，哪些附加委托需要导出等
2. Source文件夹中有Generate文件夹以及LuaConst.cs脚本，Generate中主要是生成用于交互的绑定代码warp脚本，LuaConst.cs是一些lua路径等配置文件
3. ToLua文件夹中有如下文件：
   1. BaseType：一些基础类型的绑定代码。
   2. Core：提供一些核心功能，包括封装的LuaFunction、LuaTable、LuaThread、LuaState、LuaEvent、调用ToLua原生代码等。
   3. Examples：ToLua示例
   4. Misc：杂项，包括LuaClient、LuaCoroutine（协程）、LuaLooper（用于tick）、LuaResLoader（用于加载Lua文件）
   5. Reflection：反射相关
4. Lua文件夹用于存放Lua脚本



Lua调用C#的例子：

在路径Assets/Scripts下新建一个TestLua.cs，编写脚本如下：

```c# TestLua.cs
using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class TestLua : MonoBehaviour
{
    public static string PrintString()
    {
        return "Hello Lua !";
    }
}
```

打开Assets/Editor/Custom/CustomSettings.cs，在

```c#
public static BindType[] customTypeList =
    {...
```

的结尾添加语句：

```c#
_GT(typeof(TestLua)),
}
```

以此添加要导出注册到lua的TestLua类型。

回到Unity编辑器，点击菜单栏|Lua|Clear wrap files清理Wrap文件，然后在弹出的重新注册对话框中选择“确定”重新产生Wrap文件，此时可以看到Assets/Source/Generate下多了一个TestLuaWrap.cs文件。

在路径Assets/Lua下新建一个Test.lua，编写脚本如下：

```lua
local h = TestLua.PrintString();
print(h);
```

在路径Assets/Scripts下新建一个Main.cs，编写脚本如下：

```c# Main.cs
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using LuaInterface;

public class Main : MonoBehaviour
{
    LuaState lua = null;//声明一个Lua虚拟机
    void Start()
    {
        new LuaResLoader();
        lua = new LuaState();//创建虚拟机
        lua.Start();//开启虚拟机
        LuaBinder.Bind(lua);//绑定数据
        lua.DoFile("Test.lua");//执行Lua脚本
    }
}
```

将Main.cs作为组件添加到Main Camera上，然后播放游戏，可以看到控制台打印了"Hello Lua !"。



接下来是一个带有玩家输入的例子：

在场景中新建一个平面（Plane），在平面上新建一个小球（Sphere）

新建个Controller.lua，编写脚本：

```lua Controller.lua
Controller = {} -- 新建一个Controller对象
local this = Controller
local GameObject = UnityEngine.GameObject
local Input = UnityEngine.Input
local Rigidbody = UnityEngine.Rigidbody
local Color = UnityEngine.Color

local Sphere
local rigi
local force

function this.Start()
    Sphere = GameObject.Find("Sphere")
    Sphere : GetComponent("Renderer").material.color = Color(1,0.1,1)
    Sphere : AddComponent(typeof(Rigidbody))
    rigi = Sphere : GetComponent("Rigidbody")

    force = 5
end

function this.Update()
    local h = Input.GetAxis("Horizontal")
    local v = Input.GetAxis("Vertical")
    rigi : AddForce(Vector3(h,0,v) * force)
end
```

修改Main.cs如下：

```C# Main.cs
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using LuaInterface;

public class Main : MonoBehaviour
{
    LuaState lua = null;//声明一个Lua虚拟机
    LuaFunction luaFunc = null;//声明一个Lua函数

    void Start()
    {
        new LuaResLoader();
        lua = new LuaState();//创建虚拟机
        lua.Start();//开启虚拟机
        LuaBinder.Bind(lua);//绑定数据
        lua.DoFile("Controller.lua");//执行Lua脚本
        CallFunc("Controller.Start");
    }

    void Update()
    {
        CallFunc("Controller.Update");
    }

    void CallFunc(string func)//调用Lua方法
    {
        luaFunc = lua.GetFunction(func);//获取Lua方法
        luaFunc.Call();//执行Lua方法
    }
}
```

播放游戏，我们可以通过WASD控制小球的移动。

在这个例子中，对小球的控制逻辑是在Lua脚本里完成的，C#脚本只是调用和执行而已。