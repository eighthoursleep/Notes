---
title: C#调用Lua：全局变量和全局函数的获取
date: 2020-07-07 20:04:46
tags:
- C Sharp
- Lua
categories: xLua
toc: true
---

全局变量获取、全局函数获取

<!--more-->

# 全局变量获取

Assets/Lua/Main.lua

```lua Main.lua
print("Main Lua File Starts.")
require("Test")
```

Assets/Lua/Test.lua

```lua Test.lua
testNumber = 996
testBool = true
testFloat = 3.4
testString = "RTX3090"
-- C#无法访问Lua脚本中的local变量
local testLocal = 2020
print("hello, you are in Test.lua now.")
```

```c# AccessVariable.cs
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class AccessVariable : MonoBehaviour
{
    // Start is called before the first frame update
    void Start()
    {
        LuaMgr.GetInstance().Init();
        LuaMgr.GetInstance().DoLuaFile("Main");
        //使用Lua解析器LuaEnv中的Global属性
        int i = LuaMgr.GetInstance().Global.Get<int>("testNumber");
        Debug.Log("testNumber: " + i);
        //修改Lua脚本中Global属性
        LuaMgr.GetInstance().Global.Set("testNumber",965);
        i = LuaMgr.GetInstance().Global.Get<int>("testNumber");
        Debug.Log("testNumber_Change: " + i);

        bool b = LuaMgr.GetInstance().Global.Get<bool>("testBool");
        Debug.Log("testBool: " + b);

        float f = LuaMgr.GetInstance().Global.Get<float>("testFloat");
        Debug.Log("testFloat: " + f);
        //虽然Lua中只有Number这一种数值类型，但我们可以根据具体的值，用对应的C#变量类型来存储   
        double d = LuaMgr.GetInstance().Global.Get<double>("testFloat");
        Debug.Log("testDouble: " + d);

        string s = LuaMgr.GetInstance().Global.Get<string>("testString");
        Debug.Log("testString: " + s);
    }
}
```

```c# LuaMgr.cs
using System.Collections;
using System.Collections.Generic;
using System.IO;
using UnityEngine;
using XLua;
/// <summary>
/// Lua管理器提供Lua解析器，保证解析器的唯一性
/// </summary>
public class LuaMgr : BaseManager<LuaMgr>
{
    LuaEnv luaEnv;
    /// <summary>
    /// 获取Lua的_G
    /// </summary>
    public LuaTable Global
    {
        get
        {
            return luaEnv.Global;
        }
    }
    /// <summary>
    /// 初始化
    /// </summary>
    public void Init()
    {
        if (luaEnv != null)
            return;
        luaEnv = new LuaEnv();
        luaEnv.AddLoader(MyCustomLoader);
        //luaEnv.AddLoader(MyCustomABLoader);
    }
    //自动执行
    private byte[] MyCustomLoader(ref string filePath)
    {
        string path = Application.dataPath
            + "/Lua/" + filePath + ".lua";
        if (File.Exists(path))
        {
            return File.ReadAllBytes(path);
        }
        else
        {
            Debug.Log("MyCustomLoader重定向失败，文件名位" + filePath);
        }
        return null;
    }
    //Lua脚本会放在AB包中
    //最终我们会通过加载AB包再加载其中的Lua脚本资源并执行
    //AB包中如果要加载文本，后缀还是有一定的限制，因为*.lua不能被识别
    //打包时要把Lua文件后缀加上.txt
    private byte[] MyCustomABLoader(ref string filePath)
    {
        /*
        Debug.Log("进入AB包加载，重定向函数");
        //从AB包中加载文件
        //加载AB包
        string path = Application.streamingAssetsPath + "/lua";
        AssetBundle ab = AssetBundle.LoadFromFile(path);

        //加载Lua文件
        TextAsset tx = ab.LoadAsset<TextAsset>(filePath + ".lua");
        //加载Lua文件里的byte数组
        return tx.bytes;
        */
        //通过AB包管理其加载Lua脚本资源
        TextAsset lua = ABMgr.GetInstance().LoadRes<TextAsset>("lua",filePath + ".lua");
        if (lua != null)
            return lua.bytes;
        else
            Debug.Log("MyCustomABLoader重定向失败，文件名为：" + filePath);
        return null;
    }
    /// <summary>
    /// 传入Lua脚本文件名
    /// </summary>
    /// <param name="fileName">Lua脚本文件名</param>
    public void DoLuaFile(string fileName)
    {
        string str = string.Format("require('{0}')", fileName);
        DoString(str);
    }
    /// <summary>
    /// 执行Lua
    /// </summary>
    /// <param name="str"></param>
    public void DoString(string str)
    {
        if (luaEnv == null)
        {
            Debug.Log("解析器未初始化");
            return;
        }
        luaEnv.DoString(str);
    }
    /// <summary>
    /// 释放垃圾
    /// </summary>
    public void Tick()
    {
        if (luaEnv == null)
        {
            Debug.Log("解析器未初始化");
            return;
        }
        luaEnv.Tick();
    }
    /// <summary>
    /// 销毁解析器
    /// </summary>
    public void Dispose()
    {
        if (luaEnv == null)
        {
            Debug.Log("解析器未初始化");
            return;
        }
        luaEnv.Dispose();
        luaEnv = null;
    }
}
```

```c# BaseManager.cs
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class BaseManager<T> where T:new()
{
    private static T instance;

    public static T GetInstance()
    {
        if (instance == null)
            instance = new T();
        return instance;
    }
}
```

> LUA: Main Lua File Starts.
>
> LUA: hello, you are in Test.lua now.
>
> testNumber: 996
>
> testNumber_Change: 965
>
> testBool: True
>
> testFloat: 3.4
>
> testDouble: 3.4
>
> testString: RTX3090

# 全局函数获取

```lua Test.lua
testFloat = 3.4
testString = "RTX3090"
-- C#无法访问Lua脚本中的local变量
local testLocal = 2020
-- 无参无返回
testFun  = function()
	print("无参无返回值")
end
-- 有参有返回
testFun2 = function(a)
	print("有参有返回")
	return a
end
-- 多返回
testFun3 = function(a)
	print("多返回值")
	return a,996,618,false,"what's up?"
end
-- 变长参数
testFun4 = function(a, ...)
	print("变长参数")
	print(a)
	local arg = {...}
	for k,v in pairs(arg) do
		print(k,v)
		-- v = v * 1111
	end
end
```

```C# AccessFunction.cs
using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Events;
using XLua;

public delegate void CustomCall();

[CSharpCallLua]//该特性在XLua命名空间中，添加该特性后请在编辑器菜单栏Xlua|Generate Code生成代码
public delegate int CustomCall2(int a);
[CSharpCallLua]
public delegate int CustomCall3(int a, out int b, out int c, out bool d, out string e);
[CSharpCallLua]
public delegate int CustomCall4(int a, ref int b, ref int c, ref bool d, ref string e);
[CSharpCallLua]
public delegate int CustomCall5(string a,params object[] args);//变长参数的类型根据实际情况来定

public class AccessFunction : MonoBehaviour
{
    // Start is called before the first frame update
    void Start()
    {
        LuaMgr.GetInstance().Init();
        LuaMgr.GetInstance().DoLuaFile("Main");
        //无参无返回函数的获取
        //委托
        CustomCall call = LuaMgr.GetInstance().Global.Get<CustomCall>("testFun");
        call();
        //Unity自带委托
        UnityAction ua = LuaMgr.GetInstance().Global.Get<UnityAction>("testFun");
        ua();
        //C#提供的委托
        Action ac = LuaMgr.GetInstance().Global.Get<Action>("testFun");
        ac();
        //xLua提供的获取函数的方式，尽量少用
        LuaFunction lf = LuaMgr.GetInstance().Global.Get<LuaFunction>("testFun");
        lf.Call();
        
        //有参有返回
        CustomCall2 call2 = LuaMgr.GetInstance().Global.Get<CustomCall2>("testFun2");
        Debug.Log("有参有返回：" + call2(666));
        //C#自带的泛型委托
        Func<int,int> func = LuaMgr.GetInstance().Global.Get<Func<int, int>>("testFun2");
        Debug.Log("有参有返回：" + func(233));
        //Xlua提供
        LuaFunction lf2 = LuaMgr.GetInstance().Global.Get<LuaFunction>("testFun2");
        Debug.Log("有参有返回：" + lf2.Call("awsl")[0]);
        
        //多返回值
        //使用out和ref接收
        CustomCall3 call3 = LuaMgr.GetInstance().Global.Get<CustomCall3>("testFun3");
        int b;
        int c;
        bool d;
        string e;
        Debug.Log("第一个返回值：" + call3(2077, out b, out c, out d, out e));
        Debug.Log("剩下的返回值：" + b + " - " + c + " - " + d + " - " + e);
     
        CustomCall4 call4 = LuaMgr.GetInstance().Global.Get<CustomCall4>("testFun3");
        int b2 = 10;//使用ref需要初始化
        int c2 = 20;
        bool d2 = true;
        string e2 = null;
        Debug.Log("第一个返回值：" + call4(4399, ref b2, ref c2, ref d2,ref e2));//ref接收
        Debug.Log("剩下的返回值："+ b2 + " - " + c2 + " - " + d2 + " - " + e2);
        //Xlua
        LuaFunction lf3 = LuaMgr.GetInstance().Global.Get<LuaFunction>("testFun3");
        object[] objs = lf3.Call(9999);
        for (int i = 0; i < objs.Length; i++)
        {
            Debug.Log("第" + (i+1) + "个返回值是：" + objs[i]);
        }
        //变长参数
        CustomCall5 call5 = LuaMgr.GetInstance().Global.Get<CustomCall5>("testFun4");
        call5("RTX3090",3080,3070,3060,"AMD YES",true,3.141592653);

        LuaFunction lf4 = LuaMgr.GetInstance().Global.Get<LuaFunction>("testFun4");
        lf4.Call("GTX1660Super", 1660, 1650, 1080, 1070, 1060, "Mi 10 Ultra", false, 3.1415926);
    }
}
```

>LUA: Main Lua File Starts.
>
>LUA: 无参无返回值
>
>LUA: 无参无返回值
>
>LUA: 无参无返回值
>
>LUA: 无参无返回值
>
>LUA: 有参有返回
>
>有参有返回：666
>
>LUA: 有参有返回
>
>有参有返回：233
>
>LUA: 有参有返回
>
>有参有返回：awsl
>
>LUA:多返回值
>
>第一个返回值：2077
>
>剩下的返回值：996 - 618 - False - what's up?
>
>LUA: 多返回值
>
>第一个返回值: 4399
>
>剩下的返回值：996 - 618 - False - what‘s up?
>
>LUA: 多返回值
>
>第1个返回值是：9999
>
>第2个返回值是：996
>
>第3个返回值是：618
>
>第4个返回值是：False
>
>第5个返回值是：what's up?
>
>LUA: 变长参数
>
>LUA: RTX3090
>
>LUA: 1 3080
>
>LUA: 2 3070
>
>LUA: 3 3060
>
>LUA: 4 AMD YES
>
>LUA: 5 true
>
>LUA: 6 3.141592653
>
>LUA: 变长参数
>
>LUA: GTX1660Super
>
>LUA: 1 1660
>
>LUA: 2 1650
>
>LUA: 3 1080
>
>LUA: 4 1070
>
>LUA: 5 1060
>
>LUA: 6 Mi 10 Ultra
>
>LUA: 7 false
>
>LUA: 8 3.1415926

- 无参无返回：自定义委托、Action、UnityAction、LuaFunction
- 有参有返回：自定义委托、Func、LuaFunction
- 多返回：自定义委托（out、ref）、LuaFunction
- 变长参数：自定义委托、LuaFunction

