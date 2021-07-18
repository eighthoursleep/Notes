---
title: C#调用Lua：解析Lua脚本
date: 2020-07-07 19:30:46
tags:
- C Sharp
- Lua
categories: xLua
toc: true
---

Lua解析器、Lua文件加载重定向、Lua解析器管理器

<!--more-->

# Lua解析器

在Assets/Scripts/CSharpCallLua下编写脚本，并作为组件添加到场景中任意物体上：

```c# LuaExample.cs
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using XLua;//引用命名空间

public class LuaExample : MonoBehaviour
{
    // Start is called before the first frame update
    void Start()
    {
        //Lua解析器，可以再Unity中执行Lua语句
        LuaEnv env = new LuaEnv();
        //执行Lua脚本
        env.DoString("print('Hello, world !')");
        //执行Lua脚本（多脚本执行，require关键字）
        //默认寻找脚本的路径，是在Resources文件夹下
        //估计是使用Resources.Load加载，因此*.lua文件无法识别，需要加上后缀.txt或.bytes
        env.DoString("require('Main')");
        //手动释放的对象，垃圾回收。帧更新中定时执行或者切换场景时执行
        env.Tick();
        //销毁Lua解析器
        env.Dispose();
    }
}
```

在Assets/Resources下新建一个Lua脚本，并在后缀加上`.txt`

```lua Main.lua
print("第一个Unity调用的脚本程序")
```

- 引用xlua，`using XLua`
- 提供的方法：
  - DoString：传入要执行的Lua语句
  - Tick：回收垃圾、一般定时执行
  - Dispose：销毁
- 默认将Lua脚本放在`Resources`文件夹下，且加上后缀.txt才会被识别

# Lua文件加载重定向

在Assets/Scripts/CSharpCallLua下修改脚本：

```c# Loader.cs
using System.Collections;
using System.Collections.Generic;
using System.IO;
using UnityEngine;
using XLua;

public class Loader : MonoBehaviour
{
    // Start is called before the first frame update
    void Start()
    {
        LuaEnv env = new LuaEnv();
        //xLua提供了一个路径重定向的方法
        //当我们执行Lua语言require时，相当于执行一个Lua脚本，自动执行传入的函数
        env.AddLoader(MyCustomLoader);

        env.DoString("require('MainLua')");
    }
    //自动执行
    byte[] MyCustomLoader(ref string filePath)
    {
        //通过函数的逻辑加载Lua文件
        //传入的参数是require执行的Lua脚本
        string path = Application.dataPath + "/Lua/" + filePath + ".lua";
        Debug.Log(filePath);
        //有路径就加载文件
        //C#提供的文件读写类File
        if (File.Exists(path))//判断文件是否存在
        {
            return File.ReadAllBytes(path);
        }
        else
        {
            Debug.Log("MyCustomLoader重定向失败，文件名为" + filePath);
        }
        return null;
    }
}
```

在Assets/Lua下编写一个Lua脚本

```lua MainLua.lua
print("hello there.")
```

# Lua解析器管理器

将Assets/Lua下的MainLua.lua加上.txt后缀

然后在Assets/CSharpCallLua下编写脚本：

```c# LuaMgrTest.cs
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class LuaMgrTest : MonoBehaviour
{
    // Start is called before the first frame update
    void Start()
    {
        LuaMgr.GetInstance().Init();
        LuaMgr.GetInstance().DoLuaFile("MainLua");
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
        //luaEnv.AddLoader(MyCustomLoader);
        luaEnv.AddLoader(MyCustomABLoader);
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
    /// 执行Lua语句
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
