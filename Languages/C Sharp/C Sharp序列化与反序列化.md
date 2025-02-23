# C#序列化与反序列化

游戏中的各种配置文件存有很多参数，比如商城的配置文件存各种道具的信息，每个道具又有各种属性如名称、说明、原价、活动、优惠价等。

但是我们直接从本地文件读取到的数据十一个很长的字符串，要将这些配置信息给我们的代码使用，还需要创建很多变量，然后逐一赋值，十分麻烦。

另一方面，如果我们要做游戏存档，需要思考要存储的各种变量，在配置文件中应该起什么名称，参数的值如何进行存储。
<!-- more -->

**序列化和反序列化就是用来解决上述麻烦的。**

1. 读取数据之后，不用手动去创建变量，然后逐一赋值。
2. 存储数据的时候不用关心倒地要怎么组织存储格式，变量名称要如何定义等
3. 前提：按照“通用的”格式进行序列化和反序列化
   - XML
   - JSON

**实际应用：**

游戏中所有**英雄的数据**

游戏中所有**道具的数据**

游戏中所有**技能的数据**

游戏中所有**XXX的数据**

以上数据在后期调整修改的变化频率较大，所以会通过**配置文件**来进行存储。

使用**反序列化接口**可以使这些**数据字典**转化为游戏中的一个个**变量**



**游戏存档**

适用于单机游戏

1. 使用序列化接口，可以使代码中要存储的数据转化为通用格式的字符串

2. 方便玩家下次登录时程序再取到这些数据，然后进行反序列化操作，拿到上一次存储的重要数据
   - 比如上一个存档中**人物的各种属性**
   - 比如上一个存档中**背包里所有道具的信息**
   - 比如上一个存档中**任务的进度**



# 按XML格式读取和存储

- XML指可拓展标记语言

- XML被设计用于结构化存储以及传输信息

## XML语法

如何描述一个XML文件？

XML是由若干个标签对构成

- 标签可以有对应内容
- 标签可以加上属性说明



XML文档必须有根元素

```xml
<root>
    <child>
        <subchild>...</subchild>
    </child>
</root>
```

所有XML元素都必须有关闭标签

```xml
<p>This is a paragraph</p>
```

XML标签对大小写敏感

```xml
<Message>这是错误的</message>
<message>这是正确的</message>
```

XML必须正确嵌套

```xml
错误例子：
<b><i>This text is bold and italic</b></i>
正确例子：
<b><i>This text is bold and italic</i></b>
```

XML的属性值须加引号

```xml
错误例子：
<note date=08/08/2008>
    <to>George</to>
    <from>John</from>
</note>
正确例子：
<note date="08/08/2008">
    <to>George</to>
    <from>John</from>
</note>
```



## 序列化与反序列化

XML序列化：将实体类转化为XML文档

XML反序列化：将XML文档转化为实体类

### 例子（XML反序列化）

通过VS2017创建一个C#控制台应用（.NET Framework）项目，取名Project_XML。

给项目添加两个类，分别取名为SkillConfig、Skill

Program.cs内容如下：

```c#
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Serialization;

namespace Project_XML
{
    class Program
    {
        static void Main(string[] args)
        {
            XMLDeserialize();
        }
        public static void XMLDeserialize()
        {
            string path = @"E:\Study with me\XMLfile\SkillConfig.xml";
            XmlSerializer xmlSerializer = new XmlSerializer(typeof(SkillConfig));

            //先读取到文件
            FileStream fileStream = new FileStream(path, FileMode.Open);
            SkillConfig skillConfig = (SkillConfig)xmlSerializer.Deserialize(fileStream);
            fileStream.Close();
            for(int i=0; i < skillConfig.SkillList.Count; i++)
            {
                Console.WriteLine(skillConfig.SkillList[i].id + " "
                    + skillConfig.SkillList[i].name + " "
                    + skillConfig.SkillList[i].damage);
            }
        }
    }
}
```

SkillConfig.cs内容如下：

```c#
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Serialization;

namespace Project_XML
{
    [XmlRootAttribute("SkillConfig")]
    public class SkillConfig
    {
        public List<Skill> SkillList = new List<Skill>();
    }
}
```

Skill.cs内容如下：

```c#
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Project_XML
{
    public class Skill
    {
        public int id;
        public string name;
        public int damage;
    }
}
```

SkillConfig.xml内容如下：

```xml
<SkillConfig>
    <SkillList>
        <Skill>
            <id>001</id>
            <name>连牙杀</name>
            <damage>50000</damage>
        </Skill>
        <Skill>
            <id>002</id>
            <name>虚空斩</name>
            <damage>60000</damage>
        </Skill>
        <Skill>
            <id>003</id>
            <name>步月流星</name>
            <damage>70000</damage>
        </Skill>
    </SkillList>
</SkillConfig>
```

运行结果如下：

![image-20200401225826422](.\\CSharp序列化与反序列化\\image-20200401225826422.png)

### 例子（XML序列化）

Program.cs修改后如下：

```c#
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Serialization;

namespace Project_XML
{
    class Program
    {
        static void Main(string[] args)
        {
            XMLSerialize();
        }

        public static void XMLSerialize()
        {
            SkillConfig skillConfig = new SkillConfig();

            Skill skillOne = new Skill();
            skillOne.id = 101;
            skillOne.name = "破天";
            skillOne.damage = 10000;

            Skill skillTwo = new Skill();
            skillTwo.id = 102;
            skillTwo.name = "流星";
            skillTwo.damage = 20000;

            Skill skillThree = new Skill();
            skillThree.id = 103;
            skillThree.name = "残月";
            skillThree.damage = 30000;

            skillConfig.SkillList.Add(skillOne);
            skillConfig.SkillList.Add(skillTwo);
            skillConfig.SkillList.Add(skillThree);

            //将以上实体类进行序列化
            //第一步：确定XML文档路径
            string path = @"E:\Study with me\XMLfile\SkillConfig3.xml";

            //第二步：构建用于序列化的对象
            XmlSerializer xmlSerializer = new XmlSerializer(typeof(SkillConfig));

            //第三步：构建文件流，写入数据
            StreamWriter streamWriter = new StreamWriter(path, false, Encoding.UTF8);

            //可选步骤：自定义命名空间
            //不建议自定义命名空间，因为没太大必要
            XmlSerializerNamespaces namespaces = new XmlSerializerNamespaces();
            namespaces.Add("", "");

            //第四步：调用序列化对象的序列化的接口
            //xmlSerializer.Serialize(streamWriter, skillConfig);
            xmlSerializer.Serialize(streamWriter, skillConfig, namespaces);
            streamWriter.Close();
            Console.WriteLine("已经序列化完毕");

        }
    }
}
```

程序运行后生成SkillConfig3.xml文档如下：

![image-20200402115338206](.\\CSharp序列化与反序列化\\image-20200402115338206.png)

### XML序列化和反序列化例子（带标签属性）

Program.cs经修改后：

```c#
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Serialization;

namespace Project_XML
{
    class Program
    {
        static void Main(string[] args)
        {
            XMLDeserialize();
            //XMLSerialize();
        }

        public static void XMLDeserialize()
        {
            //string path = @"E:\Study with me\XMLfile\SkillConfig.xml";
            string path = @"E:\Study with me\XMLfile\SkillConfig4.xml";
            XmlSerializer xmlSerializer = new XmlSerializer(typeof(SkillConfig));

            //先读取到文件
            FileStream fileStream = new FileStream(path, FileMode.Open);
            SkillConfig skillConfig = (SkillConfig)xmlSerializer.Deserialize(fileStream);
            fileStream.Close();
            for(int i=0; i < skillConfig.SkillList.Count; i++)
            {
                Console.WriteLine(skillConfig.SkillList[i].id + " "
                    + skillConfig.SkillList[i].name.attackType + " "
                    + skillConfig.SkillList[i].name.content + " "
                    + skillConfig.SkillList[i].damage);
            }
        }

        public static void XMLSerialize()
        {
            SkillConfig skillConfig = new SkillConfig();

            Skill skillOne = new Skill();
            skillOne.id = 101;
            //skillOne.name = "破天";
            skillOne.name = new Name();
            skillOne.name.attackType = "近战";
            skillOne.name.content = "破天";
            skillOne.damage = 10000;

            Skill skillTwo = new Skill();
            skillTwo.id = 102;
            //skillTwo.name = "流星";
            skillTwo.name = new Name();
            skillTwo.name.attackType = "近战";
            skillTwo.name.content = "流星";
            skillTwo.damage = 20000;

            Skill skillThree = new Skill();
            skillThree.id = 103;
            //skillThree.name = "残月";
            skillThree.name = new Name();
            skillThree.name.attackType = "近战";
            skillThree.name.content = "残月";
            skillThree.damage = 30000;

            skillConfig.SkillList.Add(skillOne);
            skillConfig.SkillList.Add(skillTwo);
            skillConfig.SkillList.Add(skillThree);

            //将以上实体类进行序列化
            //第一步：确定XML文档路径
            string path = @"E:\Study with me\XMLfile\SkillConfig4.xml";

            //第二步：构建用于序列化的对象
            XmlSerializer xmlSerializer = new XmlSerializer(typeof(SkillConfig));

            //第三步：构建文件流，写入数据
            StreamWriter streamWriter = new StreamWriter(path, false, Encoding.UTF8);

            //可选：命名空间
            //不建议自定义命名空间，因为没太大必要
            XmlSerializerNamespaces namespaces = new XmlSerializerNamespaces();
            namespaces.Add("", "");

            //第四步：调用序列化对象的序列化的接口
            //xmlSerializer.Serialize(streamWriter, skillConfig);
            xmlSerializer.Serialize(streamWriter, skillConfig, namespaces);
            streamWriter.Close();
            Console.WriteLine("已经序列化完毕");

        }
    }
}
```

Skill.cs经修改后：

```c#
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Serialization;

namespace Project_XML
{
    public class Skill
    {
        public int id;
        //public string name;
        public Name name;
        public int damage;
    }

    public class Name
    {
        //因为要对name进行拓展，加上属性
        [XmlAttribute("attackType")]
        public string attackType;

        [XmlText]
        public string content;
    }
}
```



## 成员标记

[XmlRootAttribute]：对根节点的描述，在类声明中使用

[XmlType]：对节点描述，在类声明中使用

[XmlElement]：节点下内部节点描述，如果对数组标识，是对数组单元描述

[XmlAttribute]：节点下内部属性描述

[XmlArrayItem]：数组单元项描述

[XmlArray]：数组描述

[XmlIgnore]：使该项不序列化

[XmlText]：做为节点的text文本输出

# 按Json的方式进行读取和存储

## Json是什么？

格式：

- 键值对

- 数据由逗号分隔

- 大括号保存对象

- 键值对中的值可以是一个class

- 值如果是string，需要加上双引号，如果不是则不需要

- 如果值是数组，那么需要用中括号括起来

Json的体积相比XML更小，在客户端和服务端的传输的过程中消耗资源更低，传输速度就会更快

## 怎样使用它

序列化：将实体类转化为Json文档

反序列化：将Json文档转化为实体类



如果用于网络传输

string -> 转化byte[ ]

## 例子（反序列化）

准备Skill.json文件如下：

```json
{
"name": "破天",
"id":1001,
"damage":800
}
```

用VS 2017创建一个C#控制台应用（.NET Framework）项目，取名为Project_Json。

给项目添加一个类，取名Skill。

在VS2017的解决方案资源管理器窗口的【引用】右键，选择【添加引用】，在弹出的窗口左边选择【浏览】,点击下方浏览按钮，导入文件**LitJson.dll**。（LitJson.dll可以在网上搜索下载）

![image-20200402170506743](.\\CSharp序列化与反序列化\\image-20200402170506743.png)

编辑Skill.cs如下：

```c#
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Project_Json
{
    class Skill
    {
        public int id;
        public string name;
        public int damage;
    }
}
```

编辑Program.cs如下：

```c#
using LitJson;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Project_Json
{
    class Program
    {
        static void Main(string[] args)
        {
            ToObject();
        }
        
        //反序列化
        static void ToObject()
        {
            //1.确定读取的Json文档的路径
            string path = @"E:\Study with me\JsonFile\Skill.json";

            //2.构建读取文件的流
            StreamReader streamReader = new StreamReader(path);
            string text = streamReader.ReadToEnd();

            //3.调用反序列化的API
            Skill skill = JsonMapper.ToObject<Skill>(text);

            Console.WriteLine(skill.id + " "
                + skill.name + " "
                + skill.damage);
            streamReader.Close();
        }
    }
}
```

运行程序结果如下：

![image-20200402170856833](.\\CSharp序列化与反序列化\\image-20200402170856833.png)

## 例子（序列化）

Program.cs修改后如下：

```c#
using LitJson;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Project_Json
{
    class Program
    {
        static void Main(string[] args)
        {
            ToJson();
        }
        //序列化
        static void ToJson()
        {
            //1.构建需要进行保存的数据
            Skill skill = new Skill();
            skill.id = 1001;
            skill.name = "末日";
            skill.damage = 99999;
            //2.确定保存路径
            string path = @"E:\Study with me\JsonFile\Skill2.json";

            //3.通过序列化的API获取到需要写入的文本
            string text = JsonMapper.ToJson(skill);

            //4.通过文件流进行写入操作
            StreamWriter streamWriter = new StreamWriter(path);
            streamWriter.Write(text);
            streamWriter.Close();
            Console.WriteLine("Json文档保存成功");
        }
    }
}
```

程序运行结果：

![image-20200402172427752](.\\CSharp序列化与反序列化\\image-20200402172427752.png)

# 案例：开发一个角色的背包

## 分三步开发

1. 写一个辅助类JsonHelper：

   提供序列化接口和反序列化接口，可以复用。

2. 创建实体类和本地的Json文件
3. 写管理类，提供**增删改查**功能。（内部维护的一个数据结构，通常为字典）

准备一个MyProp.json如下：

```json
{
	"props":[
		{"name":"滴石","id":1001,"use":false},
		{"name":"辉滴石","id":1002,"use":false},
		{"name":"古老的辉滴石","id":1003,"use":false},
		{"name":"元素瓶","id":1004,"use":false}
	]
}
```

用VS 2017创建个控制台应用项目，取名为Project_Warehouse。

添加引用LitJson.dll。**（注意：如果是添加最近的引用，需要勾选后再点击确定）**

添加三个类，分别取名为MyProp，MyPropManager，JsonHelper。

MyProp.cs内容如下：

```c#
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Project_Warehouse
{
    class MyProp
    {
        //我的道具列表
        public List<Prop> props = new List<Prop>();
    }
    /// <summary>
    /// 道具的实体类
    /// </summary>
    class Prop
    {
        public int id;//道具ID
        public string name;//道具名称
        public bool use;//是否使用过
    }
}
```

MyPropManager.cs内容如下：

```c#
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Project_Warehouse
{
    class MyPropManager
    {
        public Dictionary<int, Prop> props = new Dictionary<int, Prop>();
        public MyProp myProp = new MyProp();
        string path = @"E:\Study with me\JsonFile\MyProp.json";

        public void Init()
        {
            myProp = JsonHelper.ToObject<MyProp>(path);
            //通过ID查找一个物体...
            for(int i = 0; i < myProp.props.Count; i++)
            {
                if (!props.ContainsKey(myProp.props[i].id))
                {
                    props.Add(myProp.props[i].id, myProp.props[i]);
                }
            }
            Console.WriteLine("初始化结束");
        }
        
        public List<Prop> GetAll()
        {
            return myProp.props;
        }
        
        public Prop Get(int id)
        {
            if (!props.ContainsKey(id))
            {
                return null;
            }
            else
            {
                return props[id];
            }
        }
        
        public bool Add(Prop prop)
        {
            if (!props.ContainsKey(prop.id))
            {
                props.Add(prop.id, prop);
                myProp.props = props.Values.ToList();
                JsonHelper.ToJson<MyProp>(myProp, path);
                return true;
            }
            else
            {
                return false;
            }
        }
        
        public bool Remove(int id)
        {
            if (props.ContainsKey(id))
            {
                props.Remove(id);
                myProp.props = props.Values.ToList();
                JsonHelper.ToJson<MyProp>(myProp, path);
                return true;
            }
            else
            {
                return false;
            }
        }
        
        public bool Update(int id, bool use)
        {
            if (props.ContainsKey(id))
            {
                props[id].use = use;
                myProp.props = props.Values.ToList();
                JsonHelper.ToJson<MyProp>(myProp, path);
                return true;
            }
            else
            {
                return false;
            }
        }
    }
}
```

JsonHelper.cs内容如下：

```c#
using LitJson;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Project_Warehouse
{
    class JsonHelper
    {   /// <summary>
        /// 序列化
        /// </summary>
        /// <typeparam name="T">类型</typeparam>
        /// <param name="o">要序列化的对象</param>
        /// <param name="path">路径</param>
        /// <returns></returns>
        public static string ToJson<T>(T o, string path)
        {
            string text = JsonMapper.ToJson(o);
            StreamWriter streamWriter = new StreamWriter(path, false, Encoding.UTF8);
            streamWriter.Write(text);
            streamWriter.Close();
            return text;
        }
        /// <summary>
        /// 反序列化
        /// </summary>
        /// <typeparam name="T">类型</typeparam>
        /// <param name="path">路径</param>
        /// <returns></returns>
        public static T ToObject<T>(string path)
        {
            StreamReader streamReader = new StreamReader(path);
            string text = streamReader.ReadToEnd();
            streamReader.Close();
            T o = JsonMapper.ToObject<T>(text);
            return o;
        }
    }
}
```

Program.cs内容：

```c#
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Project_Warehouse
{
    class Program
    {
        static void Main(string[] args)
        {
            MyPropManager myPropManager = new MyPropManager();
            myPropManager.Init();//初始化

            //查找所有道具
            //List<Prop> props = myPropManager.GetAll();
            //for (int i = 0; i < props.Count; i++)
            //{
            //    Console.WriteLine(props[i].id + " "
            //        + props[i].name + " "
            //        + props[i].use);
            //}

            //查找单个道具
            //Prop prop = myPropManager.Get(1001);
            //Console.WriteLine("1001: " + prop.name);

            //添加物品
            //Prop prop = new Prop() { id = 1005, name = "飞镖", use = false };
            //myPropManager.Add(prop);
            //Console.WriteLine("添加【" + prop.name +"】成功");

            //删除物品
            //myPropManager.Remove(1005);

            //更新物品属性
            //myPropManager.Update(1002, true);
            //Console.WriteLine("更新属性成功");
        }
    }
}
```

## 总结

1. 所有业务模块基本均有增删查改构成

2. 模块独立化，比如本例中JsonHelper类的出现，能少写很多条调用序列化和反序列化的代码。

3. 所有的功能需求都是数学问题，即数学建模。

   - 构建一个类，包含背包的信息无非是各种字段/属性。

   - 背包的业务：增加物品、删除物品、修改物品、查找物品。

   - 初始化一定要做，否则容易出问题。