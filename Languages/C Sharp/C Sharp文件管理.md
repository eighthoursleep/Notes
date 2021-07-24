---
title: C#文件管理
date: 2020-04-03 17:40:00
tag: C Sharp
toc: true
---

- 目的和作用
- 通过File类对文件进行操作
- 通过FileStream类操作文件
- 通过StreamReader和StreamWriter读写文件
- 通过FileInfo类访问文件信息
- 通过DirectoryInfo类文件夹进行操作

<!-- more -->

# 目的和作用

为了像word、excel等帮软件一样，可以将一些数据保存到计算机中，方便下次使用。在游戏开发中，比如：

1. 商城的配置
2. 关卡的配置
3. 装备的配置
4. 技能的配置

...

无外乎两个操作：**读取**、**保存**



# 通过File类对文件进行操作

首先需要知道读取哪一个文件，即要知道文件所在路径。读取到的内容赋值到string类型变量。

**File.Exists**判断文件是否存在。

**File.ReadAllText**读取文件中所有的内容。

文本文件如果有**中文**，需要将**编码设置为UTF-8**。读取的时候，我们要传递第二个参数**Encoding.UTF-8**。

**File.AppendAllText**可以把文本追加到我们的目标对象上。

**Environment.NewLine**表示回车换行符。

“\r\n”表示回车换行符。

**File.WriteAllText**这个操作是将目标对象中的内容替换掉。

通过**File.Create**创建文件。创建的时候，如果文件已存在，则覆盖已存在文件。

通过**File.Delete**删除文件。



## 例1（文件读取、文件修改）

准备文本文件如下：

```
英雄ID 名称 类型 价格 拥有法力 法力值 生命值 攻击力
int string int int bool float float float
ID Name Type Price HaveMP HP MP Attack
1001 双持 2 4500 FALSE 2250 0 275
1002 钳工 1 5000 FALSE 2250 0 212
1003 毁法 2 6000 TRUE 2750 0 215
```

用VS 2017创建一个C#控制台应用（.NET Framework）项目，取名Project_File。

编辑Program.cs如下：

```c# Program.cs
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Project_File
{
    class Program
    {
        static void Main(string[] args)
        {
            //转义符 \r \n @\
            string path = @"E:\Study with me\TextFile\Save.txt";
            //判断文件是否存在
            if (File.Exists(path))
            {
                Console.WriteLine("找到文件");
                //读取文件
                string text = File.ReadAllText(path, Encoding.UTF8);
                Console.WriteLine(text);
               
                //写入数据到文件
                string writeText = "\n"+"1004 影刺 2 9500 FALSE 4000 0 200";
                //File.WriteAllText(path, writeText);//新文本取代整个旧文本
                File.AppendAllText(path, writeText);//在原来的文本末尾添加新文本
            }
            else
            {
                Console.WriteLine("文件不存在");
            }
        }
    }
}
```

运行程序后，在控制台界面打印原来的文本，打开查看Save.txt发现成功添加了一行新文本

![image-20200403183858701](image-20200403183858701.png)

![image-20200403184037485](image-20200403184037485.png)



## 例2（文件创建、文件删除）

编辑Program.cs如下：

```c# Program.cs
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Project_File
{
    class Program
    {
        static void Main(string[] args)
        {
            string path = @"E:\Study with me\TextFile\Save2.txt";
            if (File.Exists(path))
            {
                File.Delete(path);
                Console.WriteLine("文件Save2.txt已删除");
            }
            else
            {
                File.Create(path);
                Console.WriteLine("文件Save2.txt已创建");
            }
        }
    }
}
```

运行程序后，创建文本文件Save2.txt，再次运行，Save2.txt被删除。



# 通过FileStream类操作文件

构建FileStream对象

Encoding.UTF-8.GetBytes可以将一个字符串转换为byte[ ]

Encoding.UTF-8.GetString可以将byte[ ]字节数组转换为string

写入stream.Write

读取stream.Read

关闭操作流 stream.Close

无论读取还是写入，最终都是需要byte[ ]操作

Win7系统注意：读取到的文本前边多出一个问号。解决办法：

使用Notepad++打开记事本，然后转化为UTF-8无BOM格式即可。

BOM（Byte Order Mark）是为UTF-16和UTF-32准备的，用于标记字节序（byte order）。微软在UTF-8中使用BOM是因为这样可以把UTF-8和ASCII等编码明确区分开，但这样的文件在Windows系统之外的操作系统里会带来问题。[UTF-8]和[带BOM的UTF-8]的区别是有无BOM，即文件开头有没有U+FEFF。



## 例子

通过VS 2017创建C#控制台应用项目Project_FileStream，编辑Program.cs如下：

```c# Program.cs
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Project_FileStream
{
    class Program
    {
        static void Main(string[] args)
        {
            string path = @"E:\Study with me\TextFile\Save.txt";
            FileStream fileStream = new FileStream(path, FileMode.OpenOrCreate);

            byte[] data = new byte[fileStream.Length];
            while (true)
            {
                int length = fileStream.Read(data, 0, data.Length);
                if(length == 0)
                {
                    Console.WriteLine("读取完毕");
                    break;
                }
            }
            Console.WriteLine(Encoding.UTF8.GetString(data));
            fileStream.Close();

            FileStream writeStream = new FileStream(path, FileMode.Open);
            string text = "\n1005 幻刺 2 6000 TRUE 2350 5000 220";
            byte[] writeData = Encoding.UTF8.GetBytes(text);
            //写入到文本里

            //要写入的位置进行赋值
            //写入的位置决定了我们写入的数据是从哪里开始
            writeStream.Position = writeStream.Length;
            writeStream.Write(writeData, 0, writeData.Length);
            writeStream.Close();
        }
    }
}
```

程序运行后，在控制台打印Save.txt里的旧信息，关闭控制台后打开Save.txt发现成功添加了新的一行信息。

![image-20200403200834154](image-20200403200834154.png)

![image-20200403200902781](image-20200403200902781.png)



# 通过StreamReader和StreamWriter读写文件

**ReadToEnd**读取之后直接返回字符串。

**Write/WriteLine**也可以直接传递字符串来进行写入。

在构建StreamWriter实例时，如需追加数据需要传递第二个参数，否则覆盖。填true导致追加，默认false导致覆盖。

**Close**关闭流，释放占用的内存空间。

如果流没有关闭，然后已经写入了数据，那么再次写入，就是从上次的末尾来进行写入，读取从上次读取到的位置继续读取。

## 例1（StreamReader读文件）

通过VS 2017创建控制台应用项目Project_StreamReaderWrite，编辑Program.cs如下：

```c# Program.cs
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Project_StreamReaderWrite
{
    class Program
    {
        static void Main(string[] args)
        {
            string path = @"E:\Study with me\TextFile\Save.txt";
            StreamReader streamReader = new StreamReader(path);
            Console.WriteLine(streamReader.ReadToEnd());
            streamReader.Close();
        }
    }
}
```

运行程序结果如下：

![image-20200403220142996](image-20200403220142996.png)



## 例2（StreamWriter写文件）

修改Program.cs：

```c# Program.cs
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Project_StreamReaderWrite
{
    class Program
    {
        static void Main(string[] args)
        {
            string path = @"E:\Study with me\TextFile\Save.txt";
            string text = "\n1006 双手 1 7000 FALSE 3350 0 230";
            //追加数据需要传递第二个参数，否则覆盖。true表示追加，默认false表示覆盖。
            StreamWriter streamWriter = new StreamWriter(path, true);
            streamWriter.WriteLine(text);
            streamWriter.Close();
        }
    }
}
```

运行程序后Save.txt成功添加了一行：

![image-20200403220724294](image-20200403220724294.png)



# 通过FileInfo类访问文件信息

封装文件的一些属性：

- 完整路径
- 名称
- 创建日期
- 最近访问日期
- 大小（byte）
- 是否只读
- 是否存在
- 创建文件
- 删除文件

游戏开发中的应用：

1. 验证文件是否合法
2. 比较文件是否与服务器的版本一致（热更新）



## 例1（通过FileInfo创建和删除文件）

用VS 2017新建一个控制台应用项目，取名Project_FileInfo，编辑Program.cs如下：

```c# Program.cs
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Project_FileInfo
{
    class Program
    {
        static void Main(string[] args)
        {
            string path = @"E:\Study with me\TextFile\Save3.txt";
            FileInfo fileInfo = new FileInfo(path);
            if (fileInfo.Exists)
            {
                fileInfo.Delete();
            }
            else
            {
                fileInfo.Create();
            }
        }
    }
}
```

运行后，成功在指定目录创建了Save3.txt，再次运行则Save3.txt被删除。



## 例2（通过FileInfo读取文件的属性）

修改Program.cs如下：

```c# Program.cs
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Project_FileInfo
{
    class Program
    {
        static void Main(string[] args)
        {
            string path = @"E:\Study with me\TextFile\Save.txt";
            FileInfo fileInfo = new FileInfo(path);
            if (fileInfo.Exists)
            {
                Console.WriteLine(fileInfo.FullName);
                Console.WriteLine(fileInfo.CreationTime);
                Console.WriteLine(fileInfo.LastAccessTime);
                Console.WriteLine(fileInfo.IsReadOnly);
                Console.WriteLine(fileInfo.Length);
                Console.WriteLine(fileInfo.Name);
            }
            else
            {
                fileInfo.Create();
            }
        }
    }
}
```

运行后控制台打印了Save.txt的文件属性，如下图：

![image-20200403222757115](image-20200403222757115.png)



# 通过DirectoryInfo类文件夹进行操作

- 创建文件夹、子文件夹
- 删除空文件夹
- 获取文件夹的一些属性
- 文件夹是否存在



## 例1（通过DirectoryInfo创建与删除文件夹）

通过VS 2017创建一个控制台应用项目Project_DirectoryInfo，编辑Program.cs如下：

```c# Program.cs
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Project_DirectoryInfo
{
    class Program
    {
        static void Main(string[] args)
        {
            string path = @"E:\Study with me\TextFile\Skyrim";
            DirectoryInfo directoryInfo = new DirectoryInfo(path);
            if (!directoryInfo.Exists)
            {
                Console.WriteLine("Skyrim件夹不存在");
                Console.WriteLine("Skyrim文件夹创建中...");
                directoryInfo.Create();
                Console.WriteLine("Skyrim文件夹已创建");
            }
            else
            {
                Console.WriteLine("Skyrim文件夹已存在");
                Console.WriteLine("Skyrim文件夹删除中...");
                directoryInfo.Delete();//文件夹为空文件夹时删除，否则出现异常
                Console.WriteLine("Skyrim文件夹已删除");
            }
        }
    }
}
```

运行程序后，在指定路径成功创建了Skyrim文件夹，再次运行删除Skyrim文件夹。



## 例2（通过DirectoryInfo访问文件夹属性）

编辑Program.cs如下：

```c# Program.cs
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Project_DirectoryInfo
{
    class Program
    {
        static void Main(string[] args)
        {
            string path = @"E:\Study with me\TextFile\Skyrim";
            DirectoryInfo directoryInfo = new DirectoryInfo(path);
            if (!directoryInfo.Exists)
            {
                Console.WriteLine("文件夹不存在");
                Console.WriteLine("文件夹创建中...");
                directoryInfo.Create();
                Console.WriteLine("文件夹已创建");
            }
            else
            {
                Console.WriteLine(directoryInfo.FullName);
                Console.WriteLine(directoryInfo.Name);
                Console.WriteLine(directoryInfo.CreationTime);
                Console.WriteLine(directoryInfo.LastAccessTime);
                //访问所在盘符
                Console.WriteLine(directoryInfo.Root);
                //创建子文件夹Data
                directoryInfo.CreateSubdirectory("Data");
            }
        }
    }
}
```

运行程序后，成功在控制台打印Skyrim文件夹的属性信息，并成功创建了子文件Data。

![image-20200403224939892](image-20200403224939892.png)