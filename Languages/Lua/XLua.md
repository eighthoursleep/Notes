# XLua



## 前导问题

### 为什么需要XLua

XLua是腾讯开源的新一代Lua解决方案。

1. 在易用性上有一定的突破。

   1. Unity全平台补丁技术，可以运行时把C#实现（方法、操作符、属性、事件、构造函数等）替换为Lua实现。
   2. 自定义struct，枚举在Lua和C#之间传递无C#的GC。
   3. 编辑器下无需生成代码开发更轻量。

2. 热补丁技术

   1. 开发只用C#
   2. 运行也只用C#，性能可以秒杀Lua
   3. 出问题了采用Lua改掉C#出问题的部分。下次整体更新时换回正确的C#方式，能做到不重启程序修复bug。

3. 最大优势

   1. 项目一直用C#开发，在发现有bug的地方，编写Lua脚本进行单独修复即可。无需像之前的部分Lua框架解决方案，一直要求项目中必须同时写两种语言。

      （即：热更部分Lua，核心不变部分用C#）

### 热更新的基本原理

**C#脚本不能直接热更新的原因：**

下载的图片与模型都没有问题，如果是Unity逻辑代码，无论是以前的Mono AOT还是后面的il2cpp，都是编译成native code，IOS下是运行不起来的。

**解决方法：**

不用native code，改为解释执行。包括XLua在内所有热更新就是这个思路来实现。

### XLua的特色

**易用性：**

编辑器下无需生成代码，且支持所有特性。

**扩展性：**

XLua对于C#中支持的大量第三方开发库（例如JSON文件解析的rapidjson C#库），提供接口、教程，在不修改XLua代码的前提下，开发者可以自己加入库。

**高性能：**

**技术实现的细节：**

1. 泛型。
2. 委托事件的封装。
3. 无缝支持生成代码以及反射。

### XLua安装与编写HelloWorld

下载地址：https://github.com/Tencent/xLua

解压将Assets文件夹下的Plugins和XLua文件夹复制到项目的Assets文件夹下即可。

代码示例：

```c#
using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using XLua;

public class HelloWord : MonoBehaviour
{
    LuaEnv env = null;//XLua的环境核心类
    //定义Lua脚本
    private string strLua = "print('Hello XLua!')";
    //定义调用Unity系统类
    private string strLua2 = "CS.UnityEngine.Debug.Log('Hello xlua.')";
    private void Start()
    {
        env = new LuaEnv();
        env.DoString(strLua);
        env.DoString(strLua2);
    }

    private void OnDestroy()
    {
        env.Dispose();//释放env
    }
}
```



## Lua文件加载方式



### 直接执行字符串方式

LuaEnv全局环境，`DoString()`方法，执行字符串最为简单。直观，但不建议商用。



### 加载Lua文件

#### 使用TextAsset方式加载文件

```c#
TextAsset textAsset = Resource.Load<TextAsset>("HelloWorld.lua");
LuaEnv env = new LuaEnv();
env.DoString(textAsset.text);
```

在项目的Resources文件夹下新建一个HelloWorld.lua.text文件，里边写Lua代码。

#### Require函数加载（常用方式）

`require`就是一个个的调用Loader，查找出匹配的Lua文件，然后执行该文件。

**注意事项：**

1. 因为`Resource`只支持有限的后缀，放`Resource`下的Lua文件需要加上`.txt`后缀。
2. 使用Lua开发项目推荐的方式是：整个程序就一个`DoString("require 'YourLuaFile'")`，然后在`YourLuaFile.lua`中加载其他脚本。

```c#
env = new LuaEnv();
env.DoString("require 'HelloWorld'");//不用加.lua后缀。
```

**require的缺点：**

不能自定义路径。

### 自定义Loader文件

在XLua加自定义loader很简单，只涉及一个接口：

```c#
public void LuaEnv.AddLoader(CustomLoader loader);
public delegate byte[] CustomLoader(ref string filepath);//回调方法
```

通过AddLoader可以注册个回调，该回调参数是字符串，lua代码里头调用require时，参数将会自动传给回调，回调中就可以根据这个参数去加载指定文件，如果需要支持调试，需要把filepath修改为真实路径传出。

```c#
using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.IO;
using XLua;

public class RunLuaByMyLoader : MonoBehaviour
{
    private LuaEnv env;

    private void Start()
    {
        env = new LuaEnv();
        env.AddLoader(MyLoader);//添加自定义Loader
        env.DoString("require 'MyLua'");
    }

    //回调方法，自定义lua文件路径
    private byte[] MyLoader(ref string fileName)
    {
        byte[] returnData = null;
        string luaPath = Application.dataPath + "/Scripts/LuaScripts/" + fileName + ".lua";
        //读取指定路径的Lua文件内容
        string strLuaContent = File.ReadAllText(luaPath);
        //数据类型转换
        returnData = System.Text.Encoding.UTF8.GetBytes(strLuaContent);
        return returnData;
    }

    private void OnDestroy()
    {
        env.Dispose();
    }
}

```

### 不同Lua文件的加载方式分析

使用Require方式加载Lua文件，必须放置在Resource特殊目录下，否则查找不到无法加载。

自定义Loader可以进一步扩展前边两种方法，可以按照自己的方式进行加载和执行Lua代码。

（即：可以把`*.lua`文件放置到任意合法文件夹在，且lua文件不用后缀增加txt标识。）

`require`本质是按照既定的查找顺序，找到需要的Lua程序，否则返回nil，然后报错。



## C#调用Lua



### 获取全局基本数据类型

访问`LuaEnv.Global`即可，里边有个模板Get方法，可指定返回的类型。

```c#
luaenv.Global.Get<int>("a");
luaenv.Global.Get<string>("b");
```

示例：

```c#
using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using XLua;

public class CallLuaByVarible : MonoBehaviour
{
    private LuaEnv env;

    private void Start()
    {
        env = new LuaEnv();
        env.DoString("require 'SimpleLua'");
        string str = env.Global.Get<string>("str");
        int num = env.Global.Get<int>("num");
        //int numLocal = env.Global.Get<int>("numLocal");//会报错，不可以直接获取局部变量
        float numFloat = env.Global.Get<float>("numFloat");
        bool isFirstTime = env.Global.Get<bool>("isFirstTime");
        Debug.Log(str);
        Debug.Log(num);
        Debug.Log(numFloat);
        Debug.Log(isFirstTime);
    }

    private void OnDestroy()
    {
        env.Dispose();
    }
}
```

Assets/Resource/SimpleLua.lua.txt的内容：

```lua
str = "global varible";
local numLocal = 20;
num = 10;
numFloat = 88.8;
isFirstTime = true;
```

Unity运行结果：

> global varible
> 10
> 88.8
> True



### 访问全局table

#### 方式1：映射到普通class或struct

定义一个class，有对应于table的字段的public属性，而且有无参数构造函数即可，比如对于`{f1=100,f2=100}`可以定义一个包含`public int f1;`、`public int f2;`的class。

这种方式下XLua会帮你new一个实例，并把对应的字段复制过去。table的属性可以多语言或者少于class的属性。可以嵌套其他复杂类型。

**注意：**

这个过程是**值拷贝**，如果class比较复杂代价会比较大（比较消耗性能）。而且修改class的字段值不会同步到table，反过来也不会。此方式可以通过把类型加到GCPotimize生成降低开销。

```c#
using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using XLua;

public class CallLuaTable : MonoBehaviour
{
    private LuaEnv env;

    private void Start()
    {
        env = new LuaEnv();
        env.DoString("require 'SimpleLua'");
        Language language = env.Global.Get<Language>("language");
        Debug.Log(language.str1);
        Debug.Log(language.str2);
        Debug.Log(language.str3);
        
        language.str1 = "ccccc";//c#这边已经修改
        env.DoString("print(language.str1)");//但是lua没有改，说明是值拷贝。
        
    }
    private void OnDestroy()
    {
        env.Dispose();
    }
    //定义内部类，只供CallLuaTable类访问
    public class Language
    {
        public string str1;
        public string str2;
        public string str3;
    }
}
```

SimpleLua.lua.txt：

```lua
language = {
	str1 = "c#",
	str2 = "c++",
	str3 = "lua"
}
```

运行后：

> c#
> c++
> lua
> LUA: c#

#### 方式2：映射到一个interface（推荐，映射复杂表）

这种方式依赖于生成代码，如果i没有生成代码会抛出InvalidCastException异常），代码生成器会生成整个interface实例。如果get一个属性，生成代码会get对应的table字段，如果set属性也会设置对应的字段。甚至可以通过interface的方法访问Lua函数。

**注意：**

1. 接口需要添加特性标签`[CSharpCallLua]`，否则无法生成实例代码。
2. 为引用拷贝，适合用在复杂表，一般商业项目推荐使用本方法。

```c#
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using XLua;

public class CallLuaTableByInterface : MonoBehaviour
{
    private LuaEnv env;

    private void Start()
    {
        env = new LuaEnv();
        env.DoString("require 'SimpleLua'");
        ILanguage language = env.Global.Get<ILanguage>("language");
        Debug.Log(language.str1);
        Debug.Log(language.str2);
        Debug.Log(language.str3);
        language.str1 = "ccccc";//引用拷贝，修改str1生效
        env.DoString("print(language.str1)");
    }
    private void OnDestroy()
    {
        env.Dispose();
    }
    //定义内部接口，只供CallLuaTable类访问，需要特性标签
    [CSharpCallLua]
    public interface ILanguage
    {
        string str1 { get; set; }
        string str2 { get; set; }
        string str3 { get; set; }
    }
}
```

点击菜单栏XLua | Generate Code，生成代码，如果之前已经生成过且运行报错了，请先点击Clear Generated Code。

运行结果：

> c#
> c++
> lua
> LUA: ccccc

访问Lua复杂表示例：

```c#
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using XLua;

public class CallLuaComplexTableByInterface : MonoBehaviour
{
    private LuaEnv env;

    private void Start()
    {
        env = new LuaEnv();
        env.DoString("require 'SimpleLua'");
        IPlayer player = env.Global.Get<IPlayer>("player");
        Debug.Log(player.name);
        Debug.Log(player.age);
        Debug.Log(player.id);
        player.Speak();
        player.Walk();
        Debug.Log(player.Calculation(10,20));

    }
    private void OnDestroy()
    {
        env.Dispose();
    }
    //定义内部类，只供CallLuaTable类访问
    [CSharpCallLua]
    public interface IPlayer
    {
        string name { get; set; }
        int age { get; set; }
        string id { get; set; }
        
        void Speak();
        void Walk();
        int Calculation(int num1, int num2);
    }
}
```

SimpleLua.lua.txt内容如下：

```text
player = {
    name = "Aldia",
    age = 20,
    id = "001",
    Speak = function()
        print("hahahahaha");
    end,
    Walk = function(this) -- this可以换成其他命名，表示当前对象
        print(string.format("%s is walking",this.name));
    end,
    Calculation = function(this,num1,num2)
        return this.age + num1 + num2;
    end
}
```

运行后：

> Aldia
> 20
> 001
> LUA: hahahahaha
> LUA: Aldia is walking
> 50



#### 方式3：by value，映射到字典类List类（推荐，映射简单表）

这种方式更轻量，映射到`Dictionary<>`、`List<>`（适合用在简单表）不想定义class或者inteface的话，可以考虑这种方式，前提table下key和value的类型都是一致的。

**优点**：编写简单，效果不错。

**缺点**：无法映射Lua中的复杂table，无法映射函数。

```c#
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using XLua;

public class CallLuaTableByDictionary : MonoBehaviour
{
    private LuaEnv env;

    private void Start()
    {
        env = new LuaEnv();
        env.DoString("require 'SimpleLua'");
        Dictionary<string,object> language = env.Global.Get<Dictionary<string,object>>("language");
        foreach (string key in language.Keys)
        {
            Debug.Log(string.Format("Key : {0}, Value: {1}",key,language[key]) );
        }
    }
    private void OnDestroy()
    {
        env.Dispose();
    }
}
```

SimpleLua.lua.txt：

```text
language = {
	str1 = "c#",
	str2 = "c++",
	str3 = "lua"
}
```

运行结果：

> Key : str3, Value: lua
> Key : str2, Value: c++
> Key : str1, Value: c#

映射到List示例：

```c#
using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using XLua;

public class CallLuaByList : MonoBehaviour
{
    private LuaEnv env;

    private void Start()
    {
        env = new LuaEnv();
        env.DoString("require 'SimpleLua'");
        List<string> names = env.Global.Get<List<string>>("names");
        foreach (string name in names)
        {
            Debug.Log(name);
        }
    }
}
```

SimpleLua.lua.txt内容：

```text
names = {"Alice","Jessie","Mark","Leo"};
```

运行结果：

> Alice
> Jessie
> Mark
> Leo



#### 方式4：by ref，映射到LuaTable类（不推荐）

**好处**：不需要生成代码，不需要标记，功能强大，使用方便。

**坏处**：效率低下，比interface还慢一个数量级，比如没有类型检查。

因为效率比较低，所以不推荐常用，适合用在一些较为复杂且使用频率很低的情况下，一般不推荐使用。

```c#
using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using XLua;

public class CallLuaTableByLuaTable : MonoBehaviour
{
    private LuaEnv env;
    void Start()
    {
        env = new LuaEnv();
        env.DoString("require 'SimpleLua'");
        LuaTable playerTable = env.Global.Get<XLua.LuaTable>("player");
        Debug.Log(playerTable.Get<string>("name"));
        Debug.Log(playerTable.Get<int>("age"));
        Debug.Log(playerTable.Get<string>("id"));
        LuaFunction speak = playerTable.Get<LuaFunction>("Speak");
        speak.Call(); //委托
        LuaFunction walk = playerTable.Get<LuaFunction>("Walk");
        walk.Call(playerTable);
        LuaFunction calculation = playerTable.Get<LuaFunction>("Calculation");
        object[] objs = calculation.Call(playerTable,10,50);
        print(objs[0]);
    }

    private void OnDestroy()
    {
        env.Dispose();
    }
}
```

SimpleLua.lua.txt内容：

```text
player = {
    name = "Aldia",
    age = 20,
    id = "001",
    Speak = function()
        print("hahahahaha");
    end,
    Walk = function(this)
        print(string.format("%s is walking",this.name));
    end,
    Calculation = function(this,num1,num2)
        return this.age + num1 + num2;
    end
}
```

运行结果：

> Aldia
> 20
> 001
> LUA: hahahahaha
> LUA: Aldia is walking
> 80



### 访问全局的function



#### 方式1：映射到delegate（推荐）

**优点**：性能好，类型安全。

**缺点**：（含有`out`、`ref`关键字delegate）要生成代码，否则异常InvalidCaseException。

**delegate怎么声明？**：对于function的每个参数就声明一个输入类型的参数。

**多返回值的情况怎么处理？**，从左往右映射到C#的输出参数，输出参数包括返回值，`out`参数，`ref`参数。

**参数、返回值的类型支持哪些？**各种复杂类型都支持，用`out`、`ref`修饰的，可以返回另外一个delegate。

**注意**：

1. 含有`out`、`ref`关键字的委托，需要添加特性标签`[CSharpCallLua]`。

2. 委托引用后，退出LuaEnv前需要释放委托引用，否则Lua报错。

3. 对Unity与C#中的复杂类型API，必须加入XLua的配置文件，经过生成代码后才能正确应用。

   例如：`Action<int,int,int>`、`Func<int,int,int>`等

```c#
using System;
using System.Collections.Generic;
using UnityEngine;
using XLua;

public class CallLuaFunctionByDelegate : MonoBehaviour
{
    public delegate void DelegateAdd(int num1, int num2);
    [CSharpCallLua]
    public delegate void DeleAdd(int num1, int num2, out int result1, out int result2, out int result3);
    [CSharpCallLua]
    public delegate void DeleRefAdd(ref int num1, ref int num2, out int result);
    
    private LuaEnv env = null;
    private Action action = null;
    private DelegateAdd action2 = null;
    
    private Action<int,int,int> action4 = null;
    private Func<int,int,int> func = null;
    
    private DeleAdd action5 = null;
    private DeleRefAdd action6 = null;
    private void Start()
    {
        env = new LuaEnv();
        env.DoString("require 'SimpleLua'");
        action = env.Global.Get<Action>("MyFunction1");
        action2 = env.Global.Get<DelegateAdd>("MyFunction2");
        action4 = env.Global.Get<Action<int,int,int>>("MyFunction4");
        func = env.Global.Get<Func<int,int,int>>("MyFunction3");
        
        action5 = env.Global.Get<DeleAdd>("MyFunction5");
        
        action6 = env.Global.Get<DeleRefAdd>("MyFunction5");
        
        action();
        action2(11,22);
        action4(11,99,20);
        int result = func(33, 55);
        Debug.Log(string.Format("num1 + num2 = {0}", result));

        int output1 = 0;
        int output2 = 0;
        int output3 = 0;
        action5(100, 200, out output1, out output2, out output3);
        Debug.Log(string.Format("output1 = {0}, output2 = {1}, output3 = {2}",output1,output2,output3));
        
        int num1 = 600;
        int num2 = 66;
        int output = 0;
        action6(ref num1, ref num2, out output);
        Debug.Log(string.Format("num1 = {0}, num2 = {1}, output = {2}",num1,num2,output));
    }

    // Update is called once per frame
    private void OnDestroy()
    {
        action = null;
        action2 = null;
        action4 = null;
        func = null;
        action5 = null;
        action6 = null;
        env.Dispose();
    }
}
```

SimpleLua.lua.txt内容：

```text
function MyFunction1()
    print("function 1");
end

function MyFunction2(num1,num2)
    print(string.format("function 2, num1 + num2 = %d",num1 + num2));
end

function MyFunction3(num1, num2)
    print("function 3");
    return num1 + num2;
end

function MyFunction4(num1, num2, num3)
    print(string.format("function 4, num1 + num2 - num3 = %d",num1 + num2 - num3));
end

function MyFunction5(num1, num2)
    local result = num1 + num2;
    print("function 5 return multiple values");
    return num1,num2,result;
end
```

> LUA: function 1
> LUA: function 2, num1 + num2 = 33
> LUA: function 4, num1 + num2 - num3 = 90
> LUA: function 3
> num1 + num2 = 88
> LUA: function 5 return multiple values
> output1 = 100, output2 = 200, output3 = 300
> LUA: function 5 return multiple values
> num1 = 600, num2 = 66, output = 666



#### 方式2：映射到LuaFunction（不推荐）

**优点**：无需生成代码。

**缺点**：性能不高。

LuaFunction有变参的Call函数，可以传任意类型，任意个数的参数，返回值是object的数组，对应于Lua的多个返回值。

```c#
using System;
using UnityEngine;
using XLua;

public class CallLuaFunctionByLuaFunction : MonoBehaviour
{
    public delegate void DelegateAdd(int num1, int num2);
    private LuaEnv env = null;

    private void Start()
    {
        env = new LuaEnv();
        env.DoString("require 'SimpleLua'");
        LuaFunction myFunction1 = env.Global.Get<LuaFunction>("MyFunction1");
        LuaFunction myFunction2 = env.Global.Get<LuaFunction>("MyFunction2");
        LuaFunction myFunction3 = env.Global.Get<LuaFunction>("MyFunction3");
        LuaFunction myFunction5 = env.Global.Get<LuaFunction>("MyFunction5");
        
        myFunction1.Call();
        myFunction2.Call(10,20);
        object[] objs = myFunction3.Call(30,50);
        Debug.Log("result = " + objs[0]);
        object[] objs2 = myFunction5.Call(30, 100);
        Debug.Log(string.Format("num1 = {0}, num2 = {1}, result ={2}",objs2[0],objs2[1],objs2[2]));
    }

    private void OnDestroy()
    {
        env.Dispose();
    }
}
```

SimpleLua.lua.txt内容：

```text
function MyFunction1()
    print("function 1");
end

function MyFunction2(num1,num2)
    print(string.format("function 2, num1 + num2 = %d",num1 + num2));
end

function MyFunction3(num1, num2)
    print("function 3");
    return num1 + num2;
end

function MyFunction4(num1, num2, num3)
    print(string.format("function 4, num1 + num2 - num3 = %d",num1 + num2 - num3));
end

function MyFunction5(num1, num2)
    local result = num1 + num2;
    print("function 5 return multiple values");
    return num1,num2,result;
end
```

> LUA: function 1
> LUA: function 2, num1 + num2 = 30
> LUA: function 3
> result = 80
> LUA: function 5 return multiple values
> num1 = 30, num2 = 100, result = 130



#### 官方建议

1. 访问Lua全局数据，特别是table以及function，代价比较大，建议尽量少做。

   比如在初始化时要调用Lua函数获取一次（映射到delegate）后，保存下来，后续直接调用该delegate即可。table也类似。

2. 如果Lua实现的部分都以delegate和interface的方式提供，使用方可以完全和XLua解耦合。

   由一个专门的模块负责XLua的初始化以及delegate、interface的映射，然后把这些delegate和interface设置到要用到它们的地方。



## Lua调用C#

脚本准备：

```c#
using System.Collections.Generic;
using UnityEngine;
using XLua;
public class LuaCallCSharpBase : MonoBehaviour
{
    private LuaEnv env = null;
    void Start()
    {
        env = new LuaEnv();
        env.DoString("require 'LuaCallCSharp'");
    }

    private void OnDestroy()
    {
        env.Dispose();
    }
}

```

准备一个LuaCallCSharp.lua.txt用于写Lua代码。

### Lua访问C#静态属性与方法

#### 基本方法

使用CS开头，实例化类。

在C#这样new一个对象：

```c#
var newGameObj = new UnityEngine.GameObject();
```

对应到Lua:

```lua
local newGameObj = CS.UnityEngine.GameObject();
```

#### 基本规则

1. Lua里没有new关键字。
2. 所有C#相关的都放在CS下，包括构造函数，静态成员函数、方法。

如果有多个构造函数：

XLua支持重载，比如要调用GameObject的带一个string参数的构造函数，这么写：

```lua
local newGameObj = CS.UnityEngine.GameObject("helloworld");
```

**小技巧**：

如果需要经常访问的类，可以先用局部比那零引用后访问，除了减少敲代码时间，还提高性能。

即，Lua写查找与得到组件等方式，推荐与C#中一样，尽量把查找得到的组件进行缓存，节省系统开销。

```text
local newGameObj = CS.UnityEngine.GameObject(); -- 在场景中新建物体
newGameObj.name = "NewGameObject"; -- 给新建的物体改名字

local textObj = CS.UnityEngine.GameObject.Find("MainTitle"); -- 查找并获取物体（点号访问属性方法）
textObj.name = "CenterTitle";

local txtCom = textObj:GetComponent("UnityEngine.UI.Text"); -- 获取组件（冒号访问实例方法）
txtCom.text = "Hello Unity World !";
```

### Lua访问C#常用方式

#### 方式1：访问成员属性与方法

1. **(推荐)使用冒号**`:`表示成员方法的调用。它自动完成把当前对象作为一个参数，传入方法。
2. **使用点号**`.`表示静态属性与方法的调用。它需要手动往方法中传递当前对象。

```c#
using UnityEngine;

public class TestClassBase
{
    public string TestBaseClassName = "TestClassName";

    public TestClassBase()
    {
        Debug.Log("TestClassBase Constructor");
    }

    public void ShowTestBaseClassInfo()
    {
        Debug.Log("ShowTestBaseClassInfo");
    }
}
```

```c#
using UnityEngine;

public class TestClass : TestClassBase
{
    public string TestClassName = "TestClassName";

    public TestClass()
    {
        Debug.Log("TestClass Constructor");
    }
    
    public void ShowTestClassInfo()
    {
        Debug.Log("ShowTestClassInfo");
    }
}
```

```text
local testClass = CS.TestClass;
local testObj = testClass(); -- 自动调用父类与子类的构造函数

testObj:ShowTestClassInfo();
-- testObj.ShowTestClassInfo(); -- 语法错误，会报错。
testObj.ShowTestClassInfo(testObj); -- 点号调用要把自身手动传入
```

运行结果：

> TestClassBase Constructor
> TestClass Constructor
> ShowTestClassInfo
> ShowTestClassInfo



#### 方式2：访问父类属性与方法

XLua支持通过派生类访问基类的静态属性、静态方法、成员属性、成员方法。

```text
local testClass = CS.TestClass;
local testObj = testClass();

testObj:ShowTestBaseClassInfo();
print(testObj.TestBaseClassName);
print(testObj.TestClassName);
```

> TestClassBase Constructor
> TestClass Constructor
> ShowTestClassInfo
> ShowTestBaseClassInfo
> LUA: TestClassBaseName
> LUA: TestClassName

#### 方式3：访问重载方法

XLua支持方法的重载，但为“有限重载”。直接通过不同的参数类型进行重载函数的访问。

”有限重载“指，Lua区分不了浮点型和整型的参数，按方法的定义先后顺序重载。

**注意**：

XLua只一定程度上支持重载函数的调用，因为Lua的类型远远不如C#丰富，存在一对多的情况。

比如C#的int, float, double都对应Lua的number。

```c#
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class TestClass : TestClassBase
{
    public string TestClassName = "TestClassName";

    public TestClass()
    {
        //Debug.Log("TestClass Constructor");
    }
    
    public void ShowTestClassInfo()
    {
        Debug.Log("ShowTestClassInfo");
    }
    public void ShowTestClassInfo(float num1, float num2)
    {
        Debug.Log("show FLOAT-" + num1.ToString() + "-" + num2.ToString());
    }
    public void ShowTestClassInfo(int num1, int num2)
    {
        Debug.Log("show INT-" + num1.ToString() + "-" + num2.ToString());
    }
    public void ShowTestClassInfo(string str)
    {
        Debug.Log(GetType() + " " + str);
    }

    public void ShowNum(int num1, int num2)
    {
        Debug.Log("show int num-" + num1.ToString() + "-" + num2.ToString());
    }

    public void ShowNum(float num1,float num2)
    {
        Debug.Log("show float num-" + num1.ToString() + "-" + num2.ToString());
    }
}
```

```text
local testClass = CS.TestClass;
local testObj = testClass();

testObj:ShowTestClassInfo();
testObj:ShowTestClassInfo("hahahahahahaha");
testObj:ShowTestClassInfo(64.8, 9.96);
testObj:ShowTestClassInfo(648, 996);
testObj:ShowNum(2022, 1995);
testObj:ShowNum(20.22, 19.95);
```

> ShowTestClassInfo
> TestClass hahahahahahaha
> show FLOAT-64.8-9.96
> show FLOAT-648-996
> show int num-2022-1995
> show int num-0-0



### Lua调用C#中带参数方法

#### 方式1：C#中可变参数方法

```c#
void VariableParamsFunc(int a, params string[] strs)
```

```lua
testObj:VariableParamsFunc(5,'hello','john')
```

实例：

```c#
using UnityEngine;

public class TestClass : TestClassBase
{
	public int MyMethod(int num1, int num2, params string[] strArr)
    {
        string strTotal = "";
        foreach (string str in strArr)
        {
            strTotal += str;
        }
        Debug.Log(strTotal);
        return num1 + num2;
    }
}
```

```text
local testClass = CS.TestClass;
local testObj = testClass();

local result = testObj:MyMethod(11,22,"battle","field","2042");
print("num1 + num2 = "..result);
```

> battlefield2042
> LUA: num1 + num2 = 33

#### 方式2：C#结构体做为参数

Lua使用一个表来映射C#的结构体。

```c#
using UnityEngine;

public struct MyStruct
{
    public string strX;
    public string strY;
}

public class TestClass : TestClassBase
{
	public void Method2(MyStruct myStruct)
    {
        Debug.Log(string.Format("X : {0}, Y : {1}", myStruct.strX, myStruct.strY));
    }
}
```

```text
local testClass = CS.TestClass;
local testObj = testClass();

myStructTable = {strX = "c#", strY = "lua"};
testObj:Method2(myStructTable);
```

> X : c#, Y : lua

#### 方式3：C#接口做为参数

**注意**：接口需要接入标记：`[CSharpCallLua]`，Lua使用一个表，来映射C#的接口。

```c#
using UnityEngine;

[CSharpCallLua]
public interface PlayerInterface
{
    int PlayerDamage { get; set; }
    int PlayerLevel { get; set; }
    void PlayerInit();
}

public class TestClass : TestClassBase
{
    public void Method3(PlayerInterface pInterface)
    {
        pInterface.PlayerInit();
        Debug.Log(pInterface.PlayerLevel);
        Debug.Log(pInterface.PlayerDamage);
    }
}
```

```text
local testClass = CS.TestClass;
local testObj = testClass();

player = {
    PlayerDamage = 10000,
    PlayerLevel = 99,
    PlayerInit = function()
        print("player init complete!");
    end
}
testObj:Method3(player);
```

> LUA: player init complete!
> 99
> 10000



#### 方式4：C#委托做为参数

委托需要加入标记：`[CSharpCallLua]`，Lua使用一个函数，来映射C#的委托。

```c#
using UnityEngine;

[CSharpCallLua]
public delegate void MyDelegate(int num);

public class TestClass : TestClassBase
{
    public void Method4(MyDelegate myDelegate)
    {
        myDelegate.Invoke(88);
    }
}
```

```text
local testClass = CS.TestClass;
local testObj = testClass();

myDelegate = function(num)
    print("num = "..num);
end
testObj:Method4(myDelegate);
```

> LUA: num = 88



### Lua接收C#方法返回的多个结果数值

**基本规则**：参数的输入输出属性（out, ref）

1. C#的普通参数算一个输入形参，ref修饰的算一个输入形参，out不算，然后从左往右对应Lua调用的实参列表。
2. Lua调用返回值处理规则：C#函数的返回值（如果有的话）算一个返回值，out算一个返回值，ref算一个返回值，然后从左往右对应Lua的多返回值。

```c#
using UnityEngine;

[CSharpCallLua]
public delegate void MyDelegate(int num);

public class TestClass : TestClassBase
{
    public int Method5(int num1, ref int num2, out int num3)
    {
        num2 += num1;
        num3 = 2000;
        return num3 - num1 - num2;
    }
}
```

```
local testClass = CS.TestClass;
local testObj = testClass();

local result1,result2,result3 = testObj:Method5(100, 200);
print(string.format("result1 = %d, result2 = %d, result3 = %d",result1,result2,result3));
```

> LUA: result1 = 1600, result2 = 300, result3 = 2000



### Lua如何调用C#泛型方法(⭐)

**基本规则：**

Lua不直接支持C#的泛型方法，但可以通过扩展方法功能进行封装后调用。

使用扩展方法就是在C#中不改变原始类的基础上，使用一种机制可以无限扩展这个类功能的机制。

原始类：A，扩展类：Ext_A

注意：

1. 扩展方法类，必须是静态类，且扩展方法也必须是静态的。方法的参数中必须要有被扩展类作为其中一个参数，此参数前面必须有this关键字修饰。
2. Lua直接调用扩展方法，需要给“泛型类”、“扩展方法类”，都加入特性标记（`[XLua.LuaCallCSharp]`）。

```c#
using System;
using XLua;

[LuaCallCSharp]
public class TestGeneric
{
    public T GetMax<T>(T num1, T num2) where T : IComparable
    {
        if (num1.CompareTo(num2) > 0)
        {
            return num1;
        }
        else
        {
            return num2;
        }
    }
}
```

```c#
using XLua;

[LuaCallCSharp]
public static class Extent_TestGeneric
{
    public static int GetMax_Extent(this TestGeneric gen,int num1, int num2)
    {
        if (num1 > num2)
        {
            return num1;
        }
        else
        {
            return num2;
        }
    }
}
```

```text
local testGeneric = CS.TestGeneric;
local testGenericObj = testGeneric();
local result = testGenericObj:GetMax_Extent(100, 10086);
print(result);
```

> LUA: 10086

C#内也可以自己调用扩展方法：

```c#
using UnityEngine;

[CSharpCallLua]
public delegate void MyDelegate(int num);

public class TestClass : TestClassBase
{
    public void TestGenericMethod()
    {
        TestGeneric tg = new TestGeneric();
        int result = tg.GetMax_Extent(10, 90);
        Debug.Log(result);
    }
}
```

> 90

### Lua调用C#其他知识点

#### 参数带默认值的方法

与C#调用有默认值参数的函数一样，如果所给的实参少于形参，则会用默认值补上。



#### 枚举类型

枚举值就像枚举类型下的静态类型一样。

```lua
testObj:EnumTestFunc(CS.TestEnum.E1)
```



### Lua调用C#的经验

1. Lua调用C#，需要在XLua中生成“适配代码”，则在这个类打入一个`[LuaCallCSharp]`标签。
2. 如果Lua调用C#的系统API，则无法拿到源代码，无法打入标签。此时用“静态列表”方式解决。

```c#
public static List<T> myModule_LuaCallCSharp_List = new List<T>()
{
    typeof(GameObject),
    typeof(Dictionary<string,int>),
}
```

把以上代码放入一个静态类中即可。

3. 实际中，Lua调用C#比较多。

   XLua的优点体现的没有必要每次改的时候，都生成代码。主要原理是依赖于编译器环境下，利用反射来动态生成代码接口。

4. 在标有`[XLua.LuaCallCSharp]`的C#类中，添加新的方法后，如果是生成了代码类，则必须重新生成或者删除，否则XLua用以前生成的，进行注册查询，会出现Lua异常。