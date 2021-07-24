---
title: C#调用Lua：table映射到接口、LuaTable
date: 2020-07-08 10:00:46
tags:
- C Sharp
- Lua
categories: xLua
toc: true
---

table映射到接口、LuaTable

<!--more-->

# table映射到接口

```lua Test.lua
testClass = {
	testInt = 2,
	testBool = true,
	testFloat = 1.89,
	testString = "R U OK ?",
	testFun = function()
		print("boy ♂ next ♂ door")
	end,
}
```

```c# AccessInterface.cs
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Events;
using XLua;

[CSharpCallLua]
public interface ICSharpAccessInterface
{   //用属性接收,接口中的属性可多可少
    int testInt { get; set; }
    bool testBool { get; set; }
    float testFloat { get; set; }
    float testFloatNew { get; set; }
    string testString { get; set; }
    UnityAction testFun { get; set; }
}

public class AccessInterface : MonoBehaviour
{
    void Start()
    {
        LuaMgr.GetInstance().Init();
        LuaMgr.GetInstance().DoLuaFile("Main");

        ICSharpAccessInterface obj = LuaMgr.GetInstance().Global.Get<ICSharpAccessInterface>("testClass");
        Debug.Log(obj.testInt
            + " - " + obj.testBool
            + " - " + obj.testFloat
            + " - " + obj.testString);
        Debug.Log("testFloatNew: " + obj.testFloatNew);
        obj.testFun();

        obj.testInt = 999999;//拷贝到接口上的是引用，不是值
        ICSharpAccessInterface obj2 = LuaMgr.GetInstance().Global.Get<ICSharpAccessInterface>("testClass");
        Debug.Log("Change integer result：" + obj2.testInt);
    }
}
```

> LUA: Main Lua File Starts.
>
> 2 - True - 1.89 - R U OK ?
>
> testFloatNew: 0
>
> LUA: boy ♂ next ♂ door
>
> Change integer result：999999

- table中的成员变量用接口的属性去接收，多了少了都无所谓
- 接口前要加CSharpCallLua特性，并点击菜单栏Xlua|Generate Code来生成C#代码
- 如果接口的结构有变动，要先清除再生成
- table映射到接口是在拷贝引用，改变接口对象的值可以影响到Lua脚本中的表的成员

# table映射到LuaTable

```lua Test.lua
testClass = {
	testInt = 2,
	testBool = true,
	testFloat = 1.89,
	testString = "R U OK ?",
	testFun = function()
		print("boy ♂ next ♂ door")
	end,
}
```

```c# AccessLuaTable.cs
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using XLua;

public class AccessLuaTable : MonoBehaviour
{
    void Start()
    {
        LuaMgr.GetInstance().Init();
        LuaMgr.GetInstance().DoLuaFile("Main");
        //不建议使用LuaTable和LuaFunction，因为效率低
        //而且是引用对象
        LuaTable table = LuaMgr.GetInstance().Global.Get<LuaTable>("testClass");
        Debug.Log(table.Get<int>("testInt")
            + " - " + table.Get<bool>("testInt")
            + " - " + table.Get<float>("testFloat")
            + " - " + table.Get<string>("testString"));
        table.Get<LuaFunction>("testFun").Call();
        table.Set("testInt",10086);

        LuaTable table2 = LuaMgr.GetInstance().Global.Get<LuaTable>("testClass");
        Debug.Log("Change testInt to : " + table2.Get<int>("testInt"));

        table.Dispose();//用完LuaTable要销毁
        table2.Dispose();//否则占内存
    }
}
```

> LUA: Main Lua File Starts.
>
> 2 - True - 1.89 - R U OK ?
>
> LUA: boy ♂ next ♂ door
>
> Change testInt to : 10086

- 通过LuaTable Xlua提供给我们的类 来获取Lua中的表，通过Get和Set来获取和修改变量
- 引用拷贝
- 用完了要通过Dispose方法销毁
- 不建议使用，因为效率低，占内存