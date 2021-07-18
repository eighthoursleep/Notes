---
title: C#调用Lua：table映射到List、Dictionary、类
date: 2020-07-08 9:00:46
tags:
- C Sharp
- Lua
categories: xLua
toc: true
---

table映射到List、Dictionary、类

<!--more-->

# table映射到List、Dictionary

- 没有自定义索引的表映射到List，自定义索引的表映射到Dictionary。

- 数据类型不确定就用object类型接收。
- 只拷贝值，不拷贝引用。

```lua Test.lua
-- 映射到List
mixList = {"123","456",true,955,10000}

-- 映射到Dictionary
mixDict = {
	[3] = 23333,
	[true] = 3.4,
	[false] = "R U OK ?",
	["ok"] = true,
}
```

在Assets/Scripts/CSharpCallLua下编写脚本并运行

```c# ListAndDictionary.cs
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ListAndDictionary : MonoBehaviour
{
    // Start is called before the first frame update
    void Start()
    {
        LuaMgr.GetInstance().Init();
        LuaMgr.GetInstance().DoLuaFile("Main");

        List<object> mixList = LuaMgr.GetInstance().Global.Get<List<object>>("mixList");
        string str = null;
        foreach (object obj in mixList)
        {
            str += obj + " - ";
        }
        Debug.Log(str);

        Dictionary<object, object> mixDict = LuaMgr.GetInstance().Global.Get<Dictionary<object, object>>("mixDict");
        str = null;
        foreach (object key in mixDict.Keys)
        {
            str += mixDict[key] + " - ";
        }
        Debug.Log(str);
        foreach (KeyValuePair<object, object> item in mixDict)
        {
            Debug.Log(item.Key + " --- " + item.Value);
        }
    }
}
```

> LUA: Main Lua File Starts.
>
> 123 - 456 - True - 955 - 10000 - 
>
> R U OK ? - 3.4 - True - 23333 - 
>
> False --- R U OK ?
>
> True --- 3.4
>
> ok --- True
>
> 3 --- 23333

# table映射到类

- 声明一个自定义类，其中成员变量命名要和Lua中表的自定义索引一致，可少可多，无非是忽略。

- 只拷贝值，不会改变Lua脚本中的表
- 支持嵌套

``` lua Test.lua
testClass = {
	testInt = 2,
	testBool = true,
	testFloat = 1.89,
	testString = "R U OK ?",
	testFun = function()
		print("boy ♂ next ♂ door")
	end,
	testInClass = {
		testInt = 3
	}
}
```

```c# AccessClass.cs
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Events;

public class AccessClass : MonoBehaviour
{
    // Start is called before the first frame update
    void Start()
    {
        LuaMgr.GetInstance().Init();
        LuaMgr.GetInstance().DoLuaFile("Main");

        AccessLuaClass obj = LuaMgr.GetInstance().Global.Get<AccessLuaClass>("testClass");
        Debug.Log(obj.testInt
            + " - " + obj.testBool
            + " - " + obj.testFloat
            + " - " + obj.testString);
        Debug.Log("嵌套：" + obj.testInClass.testInt);
        obj.testFun();
    }
}

public class AccessInClass
{
    public int testInt;
}

public class AccessLuaClass
{
    //在类中声明成员变量，名字要和Lua脚本里的一致
    //类型是公共的，因为私有和保护没法赋值
    //如果变量比Lua脚本中的少，就忽略
    //如果变量比Lua脚本中的多，不会赋值也不会忽略
    public int testInt;
    public bool testBool;
    public float testFloat;
    public string testString;
    public UnityAction testFun;
    public void Test()
    {
    }
    public int i;
    public AccessInClass testInClass;
}
```

> LUA: Main Lua File Starts.
>
> 2 - True - 1.89 - R U OK ?
>
> 嵌套：3
>
> LUA: boy ♂ next ♂ door