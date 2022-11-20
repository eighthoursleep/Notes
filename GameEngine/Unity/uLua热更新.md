# uLua热更新
date: 2020-08-06 08:51:05

[TOC]

关键文件：LuaInterface.dll

# 什么是热更新？

游戏上线后，玩家下载第一个版本，在运营过程中，如果需要更换UI显示，或者修改游戏的逻辑，这个时候，如果不使用热更新，就需要重新打包，然后让玩家重新下载（浪费流量和时间，体验不好）。

热更新可以在不重新下载客户端的情况下，更新游戏内容。

热更新一般应用在手机网游上。

**为什么C#脚本不可以直接更新？**

C#是一门编程语言，它运行之前需要进行编译为dll等文件，而这个编译的过程在移动平台无法完成，所以当我们游戏的逻辑更改，C#代码发生改变的时候，我们就需要重新在开发环境下编译然后重新打包，再让玩家下载最新的版本。

这个体验极差，包下载需要时间长，而且很多资源不需要更新，但也得重新重新下载，浪费流量。

**热更新有哪些实现方式?**

1. Lua脚本编写游戏UI或者其他逻辑，Lua是一个精悍小巧的脚本语言，可以跨平台运行解析，而且不需要编译的过程；
2. 使用C# Light；
3. 使用C# 反射技术。

**什么是AssetBundle？**

Unity提供的一个资源更新技术。通过AssetBundle，我们可以更新游戏UI，可以把脚本或者其他代码当成资源打包成AssetBundle然后更新到客户端。在所有的热更新技术中都需要AssetBundle。

**如何利用Lua进行热更新？**

在游戏客户端嵌入Lua解析器，通过这个解析器，可以运行最新的Lua脚本，然后我们把控制游戏逻辑的代码都写成Lua脚本。

**Lua解析技术有哪些？**

[uLua](ulua.org)、[NLua](nlua.org)、UniLua、sLua、xLua

**如何学习热更新技术？**

1. 学习Lua编程；
2. 学习通过LuaInterface和luanet进行Lua和C#的交互通信；
3. 学习使用AssetBundle进行资源更新；
4. 学习uLua SimpleFramework，用uS创建自己的热更新游戏。



LuaInterface包括两个核心库：LuaInterface.dll、Luanet.dll。

通过LuaInterface，我们可以完成Lua和C#（CLR）之间的互相调用。

# 在C#中执行访问Lua代码

[下载LuaInterface](http://files.luaforge.net/releases/luainterface/luainterface/1.5.3/luainterface-1.5.3.zip)，下好后解压，将Built文件夹下的LuaInterface.dll、luanet.dll拖拽复制到VS2017的项目中，

```C# Program.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LuaInterface;

namespace Project_LuaInterface
{
    class Program
    {
        static void Main(string[] args)
        {
            Lua lua = new Lua();//创建Lua解析器
            lua["num"] = 34;//定义一个num
            Console.WriteLine(lua["num"]);
            Console.ReadKey();
        }
    }
}
/*
Lua lua = new Lua();//创建Lua解析器
lua["num"] = 2;//定义一个num
lua["str"] = "a string";//定义一个字符串
lua.newTable("tab");//创建一个表 tab = {}*/
```



```c#
Lua lua = new Lua();
lua.DoString("num = 3");
lua.DoString("str = \'mj\'");
Object[] values = lua.DoString("return num,str");
foreach (var item in values)
{
	Console.WriteLine(item);
}
/*执行结果：
3
mj
*/
```



```c#
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LuaInterface;

namespace Project_LuaInterface
{
    class Program
    {
        static void Main(string[] args)
        {
            Lua lua = new Lua();//创建Lua解析器
            lua.DoFile("MyLua.lua");
        }
    }
}
```

MyLua.lua文件：（如果报异常，把编码改为ASCII试试）

```lua
num = 2
str = "mj"
print(num,str)
```

在热更新中，只需要写好解析Lua脚本，然后C#代码不需要变动，只需修改Lua脚本就好。通过Lua脚本控制游戏逻辑。

# Lua和C#中类型的对应

| Lua      | C#                    |
| :------- | :-------------------- |
| nil      | null                  |
| string   | System.String         |
| number   | System.Double         |
| boolean  | System.Boolean        |
| table    | LuaInterface.LuaTable |
| function | LuaInterface.LuaTable |

# 把一个C#方法注册进Lua的一个全局方法

```c#
//把一个类中的普通方法注册进去
lua.RegisterFunction("NormalMethod",obj,obj.GetType().GetMethod("NormalMethod"));
lua.DoString("NormalMethod()");
//把一个类的静态方法注册进去
lua.RegisterFunction("StaticMethod",null,typeof(ClassName).GetMethod("StaticMethod"));
lua.DoString("StaticMethod");
```



