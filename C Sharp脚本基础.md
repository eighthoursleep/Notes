---
title: C#脚本基础
date: 2020-01-17 16:34:55
tag: C Sharp
toc: true
---

脚本结构、基础语法、数据类型

<!--more-->

# 一、开发环境

IDE：Visual Studio 2017

新建项目途径：

​	其他语言 > Visual C# > Windows桌面 > 空项目(.NET Framework)或者控制台应用。

![image-20200219123758165](image-20200219123758165.png)

# 二、脚本结构

一个C#脚本文件包含以下部分：

- 命名空间声明（Namespace declaration）
- 一个类（Class）
- 类方法
- 类属性
- 一个Main方法
- 语句（Statements）、表达式（Expressions）
- 注释

在解决方案资源管理器窗口中右键项目名称”CSProject1“，点击“添加“ > ”新建项“，选择“类” > 修改默认类名为”HelloWorld“，点击”添加“按钮。至此，我们创建了一个名叫”HelloWorld“的类，即HelloWorld.cs文件。

在代码编辑器中编写代码如下：

```c# HelloWorld.cs
using System;
namespace CSProject1
{
    class HelloWorld
    {
        static void Main(string[] args)
        {
            /*My first C Sharp Script.*/
            Console.WriteLine("Hello World !");
            Console.ReadKey();
        }
    }
}
```

运行后：

Hello World !


解释：

**using** 关键字用于在程序中包含命名空间。 一个程序可以包含多个 **using** 语句。

下一行是 **namespace** 声明。一个 **namespace** 里包含了一系列的类。*CSProject1*命名空间包含了类 *HelloWorld*。

下一行是 **class** 声明。类 *HelloWorld* 包含程序使用的**数据**和**方法声明**。类一般包含多个方法。方法定义了类的行为。在这里，*HelloWorld* 类只有一个 **Main** 方法。

下一行定义了 **Main** 方法，是所有 C# 程序的 **入口点**。**Main** 方法说明当执行时，类将做什么动作。

下一行 /\*...\*/ 将会被编译器忽略，且它会在程序中添加额外的**注释**。

Main 方法通过语句**Console.WriteLine("Hello World"); **指定它的行为。

*WriteLine* 是一个定义在 *System* 命名空间中的 *Console* 类的一个方法。该语句将消息 "Hello, World!"显示在命令提示符窗口上。

最后一行 **Console.ReadKey();** 是针对 VS.NET 用户的。这使得程序会等待一个按键的动作，防止程序从 Visual Studio .NET 启动时屏幕会快速运行并关闭。

以下几点值得注意：

- C# 对英文字母大小写敏感。
- 所有的语句和表达式必须以分号（;）结尾。
- 程序的执行从 Main 方法开始。
- 与 Java 不同的是，文件名可以不同于类的名称。

另一种编译执行C#程序的方式：

- 打开一个文本编辑器，添加上面提到的代码。
- 保存文件为 **helloworld.cs**。
- 打开命令提示符工具，定位到文件所保存的目录。
- 键入 **csc helloworld.cs** 并按下 enter 键来编译代码。
- 如果代码没有错误，命令提示符会进入下一行，并生成 **helloworld.exe** 可执行文件。
- 接下来，键入 **helloworld** 来执行程序。

若提示无法识别 **csc** 命令，需配置环境变量（Window10)

找到桌面上的“此电脑”图标，右键单击，并在弹出的菜单中点击 “属性” --"高级系统设置"--"环境变量"--"系统变量"，找到变量 **Path**， 添加一个路径 **C:\Windows\Microsoft.NET\Framework64\v4.0.30319\\**

注意：多个路径使用分号(;)隔开，Windows其他版本追加在后面即可。

# 三、基本语法

先上例子：

```c# ExecuteRectangle.cs
using System;
namespace RectangleApplication
{
    class Rectangle
    {
        double length;// 成员变量
        double width;// 成员变量
        public void Acceptdetails()//成员函数
        {
            length = 4.5;    
            width = 3.5;
        }
        public double GetArea()//成员函数
        {
            return length * width;
        }
        public void Display()//成员函数
        {
            Console.WriteLine("Length: {0}", length);
            Console.WriteLine("Width: {0}", width);
            Console.WriteLine("Area: {0}", GetArea());
        }
    }
   
    class ExecuteRectangle//实例化Retangle类的类，它包含Main方法
    {
        static void Main(string[] args)
        {
            Rectangle r = new Rectangle();
            r.Acceptdetails();
            r.Display();
            Console.ReadLine();
        }
     
    }
}
```

编译并执行后，结果如下：
> Length: 4.5
> Width: 3.5
> Area: 15.75

1. using关键字：用于在程序中包含命名空间，一个程序可以包含多个using语句。

   在任何C#程序中的第一条语句都是：**using System;**

2. class关键字：用于声明一个类。

3. 注释：用于解释代码，编译器会忽略被注释的条目。单行注释用 **//** ，多行注释用 **/\***开始，**/\***结束。

4. 成员变量：变量的类的属性或数据成员，用于存储数据。

5. 成员函数：在类内声明的函数。函数使一系列执行指定任务的语句。

6. 实例化一个类：上边例子中的类ExecuteRectangle。

7. 标识符：用于来识别类、变量、函数或任何其它用户定义的项目。

   在 C# 中，**类的命名必须遵循如下基本规则：**

   - 标识符必须以**字母**、**下划线**或 **@** 开头，后面可以跟一系列的字母、数字、下划线、@。
   - 标识符中的第一个字符不能是数字。
   - 标识符必须不包含任何嵌入的空格或符号，比如 ? - +! # % ^ & * ( ) [ ] { } . ; : " ' / \。
   - 标识符不能是 C# 关键字。除非它们有一个 @ 前缀。 例如，@if 是有效的标识符，但 if 不是，因为 if 是关键字。
   - 标识符必须区分大小写。大写字母和小写字母被认为是不同的字母。
   - 不能与C#的类库名称相同。

8. C#关键字：C# 编译器预定义的保留字。

   这些关键字不能用作标识符，但是，如果您想使用这些关键字作为标识符，可以在关键字前面加上 @ 字符作为前缀。

   在 C# 中，有些关键字在代码的上下文中有特殊的意义，如 get 和 set，这些被称为上下文关键字（contextual keywords）。

   下表列出了 C# 中的保留关键字（Reserved Keywords）和上下文关键字（Contextual Keywords）：

| **保留关键字** |        |       |        |        |       |        |
| ------------- | ------ | ----- | ------ | ------ | ----- | ------ |
| abstract      |  as    | base  | bool   | break  | byte  | case   |
|  catch  | char   | checked  | class   | const | continue | decimal |
| default | delegate | do | double  | else | enum | event |
| explicit  | extern| false | finally | fixed  | float  | for |
| foreach | goto | if | implicit | in  | in (generic modifier) | int |
| interface |internal | is | lock | long | namespace | new |
| null | object | operator | ou | out (generic modifier) | override | params |
| private | protected | public | readonly | ref | return | sbyte |
| sealed  | short | sizeof | stackalloc | static | string | struct  |
| switch  | this | throw | true  | try | typeof | uint  |
| ulong  | unchecked | unsafe | ushort | using | virtual | void  |
| volatile | while |  |  |   |   |    |
| **上下文关键字** | | | | | | |
| add   | alias | ascending | descending | dynamic  | from  | get |
| global  | group | into | join | let | orderby | partial (type) |
| partial (method) | remove | select  | set   |      |     |       |

# 四、数据类型

在 C# 中，变量分为以下几种类型：

- 值类型（Value types）
- 引用类型（Reference types）
- 指针类型（Pointer types）

1. 值类型

   值类型变量可以直接分配给一个值。它们是从类 **System.ValueType** 中派生的。

   值类型直接包含数据。比如 **int、char、float**。

   如需得到一个类型或一个变量在特定平台上的准确尺寸，可以使用 **sizeof** 方法。表达式 *sizeof(type)* 产生以字节为单位存储对象或类型的存储尺寸。

2. 引用类型

   引用类型不包含存储在变量中的实际数据，但它们包含对变量的引用。

   换句话说，它们指的是一个内存位置。使用多个变量时，引用类型可以指向一个内存位置。如果内存位置的数据是由一个变量改变的，其他变量会自动反映这种值的变化。**内置的**引用类型有：**object**、**dynamic** 和 **string**。

   **对象（Object）类型** 是 C# 通用类型系统（Common Type System - CTS）中所有数据类型的终极基类。Object 是 System.Object 类的别名。所以对象（Object）类型可以被分配任何其他类型（值类型、引用类型、预定义类型或用户自定义类型）的值。但是，在分配值之前，需要先进行类型转换。

   当一个值类型转换为对象类型时，称为 **装箱**；当一个对象类型转换为值类型时，称为 **拆箱**。

   ```c#
   int num1 = 2019;
   object obj = num1;//整型数据转换为了对象类型（装箱）
   //拆箱：之前由值类型转换而来的对象类型再转回值类型。
   int num2 = 2018;
   object obj = num2;//先装箱,只有装过箱的数据才能拆箱
   int num3 = （int）obj;//再拆箱
   ```

   **动态（Dynamic）类型**变量可以存储任何类型的值。这些变量的类型检查是在运行时发生的。

   声明动态类型的语法：

   ```c#
   dynamic <variable_name> = value;
   ```

   例如：

   ```c#
   dynamic d = 20;
   ```

   动态类型与对象类型相似，但是对象类型变量的类型检查是在编译时发生的，而动态类型变量的类型检查是在运行时发生的。

   **字符串（String）类型** 允许您给变量分配任何字符串值。字符串类型是 System.String 类的别名。它是从对象（Object）类型派生的。字符串类型的值可以通过两种形式进行分配：引号和 @引号。

   例如：

   ```c#
   String str = "baidu.com";
   ```

   一个 @引号字符串：

   ```c#
   @"baidu.com";
   ```

   C# string 字符串的前面可以加 @（称作"逐字字符串"）将转义字符（\）当作普通字符对待，比如：

   ```c#
   string str = @"C:\Windows";
   ```

   等价于：

   ```c#
   string str = "C:\\Windows";
   ```

   @ 字符串中可以任意换行，换行符以及缩进空格都计算在字符串长度之内。

   ```c#
   string str = @"<script type=""text/javascript"">
       <!--
       -->
   </script>";
   ```

   用户自定义引用类型有：class、interface 或 delegate。

3. 指针类型

   C# 中的指针与 C 或 C++ 中的指针有相同的功能。

   声明指针类型的语法例如：

   ```c#
   char* cptr;
   int* iptr;
   ```

# 五、C#类型转换

显式类型转换：即强制类型转换，需要强制转换运算符，会导致数据丢失。

隐式类型转换：C#默认的以安全的方式进行的转换，不会导致数据丢失。

显示类型转换例子：

```c# ExplicitConversion.cs
using System;

namespace TypeConversionApplication
{
    class ExplicitConversion
    {
        static void Main(string[] args)
        {
            double d = 2345.6789;
            int i;
            i = (int)d;
            Console.WriteLine(d);
            Console.Readkey();
        }
    }
}
```

输出结果：
> 2345


C# 提供的内置类型转换方法：

|     方法名     | 转换类型后的类型                                |
| :------------: | :---------------------------------------------- |
| **ToBoolean**  | 布尔型                                          |
|   **ToByte**   | 字节类型                                        |
|   **ToChar**   | 单个 Unicode 字符类型                           |
| **ToDateTime** | 把类型（整数或字符串类型）转换为 日期-时间 结构 |
| **ToDecimal**  | 把浮点型或整数类型转换为十进制类型              |
|  **ToDouble**  | 双精度浮点型                                    |
|  **ToInt16**   | 16 位整数类型                                   |
|  **ToInt32**   | 32 位整数类型                                   |
|  **ToInt64**   | 64 位整数类型                                   |
|  **ToSbyte**   | 有符号字节类型                                  |
|  **ToSingle**  | 小浮点数类型                                    |
|  **ToString**  | 字符串类型                                      |
|   **ToType**   | 指定类型                                        |
|  **ToUInt16**  | 16 位无符号整数类型                             |
|  **ToUInt32**  | 32 位无符号整数类型                             |
|  **ToUInt64**  | 64 位无符号整数类型                             |

不同类型转换为字符串类型的例子：

```c# StringConversion.cs
using System;

namespace TypeConversionApplication
{
    class StringConversion
    {
        static void Main(string[] args)
        {
            int i = 75;
            float f = 53.005f;
            double d = 2345.6789;
            bool b = true;

            Console.WriteLine(i.ToString());
            Console.WriteLine(f.ToString());
            Console.WriteLine(d.ToString());
            Console.WriteLine(b.ToString());
            Console.ReadKey();
        }
    }
}
```

# 六、C#基本变量类型

一个变量只不过是一个供程序操作的存储区的名字，变量类型决定了变量的内存大小和布局。

C# 中提供的基本的值类型大致可以分为以下几类：

| 类型       | 举例                                                       |
| :--------- | :--------------------------------------------------------- |
| 整数类型   | sbyte、byte、short、ushort、int、uint、long、ulong 和 char |
| 浮点型     | float 和 double                                            |
| 十进制类型 | decimal                                                    |
| 布尔类型   | true 或 false 值，指定的值                                 |
| 空类型     | 可为空值的数据类型                                         |

C# 允许定义其他值类型的变量，比如 **enum**，也允许定义引用类型变量，比如 **class**。

**System** 命名空间中的 **Console** 类提供了一个函数 **ReadLine()**，用于接收来自用户的输入，并把它存储到一个变量中。

例如：

```
int num;
num = Convert.ToInt32(Console.ReadLine());
```

函数 **Convert.ToInt32()** 把用户输入的数据转换为 int 数据类型，因为 **Console.ReadLine()** 只接受字符串格式的数据。

# 七、C#常量

**整数常量**可以是十进制、八进制或十六进制的常量。前缀指定基数：0x 或 0X 表示十六进制，0 表示八进制，没有前缀则表示十进制。

整数常量也可以有后缀，可以是 U 和 L 的组合，其中，U 和 L 分别表示 unsigned 和 long。后缀可以是大写或者小写，多个后缀以任意顺序进行组合。

这里有一些整数常量的实例：

```c#
212         /* 合法 */
215u        /* 合法 */
0xFeeL      /* 合法 */
078         /* 非法：8 不是一个八进制数字 */
032UU       /* 非法：不能重复后缀 */
```

以下是各种类型的整数常量的实例：
```c#
85         /* 十进制 */
0213       /* 八进制 */
0x4b       /* 十六进制 */
30         /* int */
30u        /* 无符号 int */
30l        /* long */
30ul       /* 无符号 long */
```

**浮点常量**是由整数部分、小数点、小数部分和指数部分组成。您可以使用小数形式或者指数形式来表示浮点常量。

这里有一些浮点常量的实例：

```c#
3.14159       /* 合法 */
314159E-5L    /* 合法 */
510E          /* 非法：不完全指数 */
210f          /* 非法：没有小数或指数 */
.e55          /* 非法：缺少整数或小数 */
```

使用小数形式表示时，必须包含小数点、指数或同时包含两者。使用指数形式表示时，必须包含整数部分、小数部分或同时包含两者。有符号的指数是用 e 或 E 表示的。

**字符串常量**是括在双引号 **""** 里，或者是括在 **@""** 里。字符串常量包含的字符与字符常量相似，可以是：普通字符、转义序列和通用字符

使用字符串常量时，可以把一个很长的行拆成多个行，可以使用空格分隔各个部分。

这里是一些字符串常量的实例。下面所列的各种形式表示相同的字符串。

```c#
string a = "hello, world";                  // hello, world
string b = @"hello, world";               // hello, world
string c = "hello \t world";               // hello     world
string d = @"hello \t world";               // hello \t world
string e = "Joe said \"Hello\" to me";      // Joe said "Hello" to me
string f = @"Joe said ""Hello"" to me";   // Joe said "Hello" to me
string g = "\\\\server\\share\\file.txt";   // \\server\share\file.txt
string h = @"\\server\share\file.txt";      // \\server\share\file.txt
string i = "one\r\ntwo\r\nthree";
string j = @"one
two
three";
```

常量是使用 **const** 关键字来定义的 。定义一个常量的语法如下：

```c#
const <data_type> <constant_name> = value;
```

下面的代码演示了如何在程序中定义和使用常量：

```c# SampleClass.cs
using System;

public class ConstTest {
    class SampleClass
    {
        public int x;//属性变量
        public int y;//属性变量
        public const int c1 = 5;//属性常量
        public const int c2 = c1 + 5;//属性常量
        public SampleClass(int p1,int p2)//构造方法
        {
            x = p1;
            y = p2;
        }
    }
    static void Main()
    {
        SampleClass mC = new SampleClass(11, 22);
        Console.WriteLine("x = {0}, y = {1}", mC.x, mC.y);
        Console.WriteLine("c1 = {0}, c2 = {1}", SampleClass.c1, SampleClass.c2);
    }
}
```
输出结果：
> x = 11, y = 22
> c1 = 5, c2 = 10


# 八、运算符

- 算术运算符：+、-、*、/、%、++、--
- 关系运算符：==、!=、>、<、>=、<=
- 逻辑运算符：&&、||、!
- 位运算符：&、|、^(异或)、~(非)
- 赋值运算符：=、+=、-=、*=、/=、%=、<<=(左移且赋值)、>>=、&=、^=、|=

其他一些重要的运算符。

| 运算符   | 描述                                   | 实例                                                         |
| :------- | :------------------------------------- | :----------------------------------------------------------- |
| sizeof() | 返回数据类型的大小。                   | sizeof(int)，将返回 4.                                       |
| typeof() | 返回 class 的类型。                    | typeof(StreamReader);                                        |
| &        | 返回变量的地址。                       | &a; 将得到变量的实际地址。                                   |
| *        | 变量的指针。                           | *a; 将指向一个变量。                                         |
| ? :      | 条件表达式                             | 如果条件为真 ? 则为 X : 否则为 Y                             |
| is       | 判断对象是否为某一类型。               | If( Ford is Car) // 检查 Ford 是否是 Car 类的一个对象。      |
| as       | 强制转换，即使转换失败也不会抛出异常。 | Object obj = new StringReader("Hello"); StringReader r = obj as StringReader; |

下表将按**运算符优先级**从高到低列出各个运算符，具有较高优先级的运算符出现在表格的上面，具有较低优先级的运算符出现在表格的下面。在表达式中，较高优先级的运算符会优先被计算。

| 类别       | 运算符                            | 结合性   |
| :--------- | :-------------------------------- | :------- |
| 后缀       | () [] -> . ++ - -                 | 从左到右 |
| 一元       | + - ! ~ ++ - - (type)* & sizeof   | 从右到左 |
| 乘除       | * / %                             | 从左到右 |
| 加减       | + -                               | 从左到右 |
| 移位       | << >>                             | 从左到右 |
| 关系       | < <= > >=                         | 从左到右 |
| 相等       | == !=                             | 从左到右 |
| 位与 AND   | &                                 | 从左到右 |
| 位异或 XOR | ^                                 | 从左到右 |
| 位或 OR    | \|                                | 从左到右 |
| 逻辑与 AND | &&                                | 从左到右 |
| 逻辑或 OR  | \|\|                              | 从左到右 |
| 条件       | ?:                                | 从右到左 |
| 赋值       | = += -= *= /= %=>>= <<= &= ^= \|= | 从右到左 |
| 逗号       | ,                                 | 从左到右 |

# 九、C# 判断、循环

判断语句

| 语句             | 描述                                                         |
| :--------------- | :----------------------------------------------------------- |
| if 语句          | 一个 **if 语句** 由一个布尔表达式后跟一个或多个语句组成。    |
| if...else 语句   | 一个 **if 语句** 后可跟一个可选的 **else 语句**，else 语句在布尔表达式为假时执行。 |
| 嵌套 if 语句     | 您可以在一个 **if** 或 **else if** 语句内使用另一个 **if** 或 **else if** 语句。 |
| switch 语句      | 一个 **switch** 语句允许测试一个变量等于多个值时的情况。     |
| 嵌套 switch 语句 | 您可以在一个 **switch** 语句内使用另一个 **switch** 语句。   |

 **条件运算符 ? :**，可以用来替代 **if...else** 语句。它的一般形式如下：

```c#
Exp1 ? Exp2 : Exp3;
```

其中，Exp1、Exp2 和 Exp3 是表达式。请注意，冒号的使用和位置。

? 表达式的值是由 Exp1 决定的。如果 Exp1 为真，则计算 Exp2 的值，结果即为整个 ? 表达式的值。如果 Exp1 为假，则计算 Exp3 的值，结果即为整个 ? 表达式的值。

**循环类型**

| 循环类型          | 描述                                                         |
| :---------------- | :----------------------------------------------------------- |
| while 循环        | 当给定条件为真时，重复语句或语句组。它会在执行循环主体之前测试条件。 |
| for或foreach 循环 | 多次执行一个语句序列，简化管理循环变量的代码。               |
| do...while 循环   | 除了它是在循环主体结尾测试条件外，其他与 while 语句类似。    |
| 嵌套循环          | 您可以在 while、for 或 do..while 循环内使用一个或多个循环。  |

foreach循环例子：

```c# ForeachTest.cs
using System;

namespace ForeachTestApplication
{
    public class ForeachTest {
        static void Main(String[] args)
        {
            int[] array = new int[]{2080, 2070, 2060, 1660, 1650};
            foreach ( int element in array)
            {
                Console.WriteLine(element);
            }
            Console.WriteLine();

            //原理类似foreach的for循环
            for(int i=0;i < array.Length; i++)
            {
                Console.WriteLine(array[i]);
            }
            Console.WriteLine();
            //加入计数器
            int count = 0;
            foreach (int item in array)
            {
                count++;
                Console.WriteLine(count+" : "+item);
            }
            Console.WriteLine("The length of this array is "+count);
        }
    }
}
```

程序输出结果：

2080
2070
2060
1660
1650

2080
2070
2060
1660
1650

1 : 2080
2 : 2070
3 : 2060
4 : 1660
5 : 1650
The length of this array is 5

# 十、封装

**封装** 被定义为"把一个或多个项目封闭在一个物理的或者逻辑的包中"。在面向对象程序设计方法论中，封装是为了防止对实现细节的访问。

抽象和封装是面向对象程序设计的相关特性。抽象允许相关信息可视化，封装则使开发者*实现所需级别的抽象*。

C# 封装根据具体的需要，设置使用者的访问权限，并通过 **访问修饰符** 来实现。

一个 **访问修饰符** 定义了一个类成员的范围和可见性。C# 支持的访问修饰符如下所示：

- public：所有对象都可以访问；
- private：对象本身在对象内部可以访问；
- protected：只有该类对象及其子类对象可以访问
- internal：同一个程序集的对象可以访问；
- protected internal：访问限于当前程序集或派生自包含类的类型。

# 十一、C#方法

当定义一个方法时，从根本上说是在声明它的结构的元素。在 C# 中，定义方法的语法如下：

```
<Access Specifier> <Return Type> <Method Name>(Parameter List)
{
   Method Body
}
```

下面是方法的各个元素：

- **Access Specifier**：访问修饰符，这个决定了变量或方法对于另一个类的可见性。
- **Return type**：返回类型，一个方法可以返回一个值。返回类型是方法返回的值的数据类型。如果方法不返回任何值，则返回类型为 **void**。
- **Method name**：方法名称，是一个唯一的标识符，且是大小写敏感的。它不能与类中声明的其他标识符相同。
- **Parameter list**：参数列表，使用圆括号括起来，该参数是用来传递和接收方法的数据。参数列表是指方法的参数类型、顺序和数量。参数是可选的，也就是说，一个方法可能不包含参数。
- **Method body**：方法主体，包含了完成任务所需的指令集。

**按引用传递参数**

引用参数是一个对变量的**内存位置的引用**。当按引用传递参数时，与值参数不同的是，它不会为这些参数创建一个新的存储位置。引用参数表示与提供给方法的实际参数具有相同的内存位置。

在 C# 中，使用 **ref** 关键字声明引用参数。下面的实例演示了这点：

```c# NumberManipulator.cs
using System;
namespace CalculatorApplication
{
   class NumberManipulator
   {
      public void swap(ref int x, ref int y)
      {
         int temp;

         temp = x; /* 保存 x 的值 */
         x = y;    /* 把 y 赋值给 x */
         y = temp; /* 把 temp 赋值给 y */
       }
   
      static void Main(string[] args)
      {
         NumberManipulator n = new NumberManipulator();
         /* 局部变量定义 */
         int a = 100;
         int b = 200;

         Console.WriteLine("在交换之前，a 的值： {0}", a);
         Console.WriteLine("在交换之前，b 的值： {0}", b);

         /* 调用函数来交换值 */
         n.swap(ref a, ref b);

         Console.WriteLine("在交换之后，a 的值： {0}", a);
         Console.WriteLine("在交换之后，b 的值： {0}", b);
 
         Console.ReadLine();

      }
   }
}
```

当上面的代码被编译和执行时，它会产生下列结果：

> 在交换之前，a 的值：100
> 在交换之前，b 的值：200
> 在交换之后，a 的值：200
> 在交换之后，b 的值：100

**按输出传递参数**

return 语句可用于只从函数中返回一个值。但是，可以使用 **输出参数** 来从函数中返回两个值。输出参数会把方法输出的数据赋给自己，其他方面与引用参数相似。

下面的实例演示了这点：

```c# NumberManipulator.cs
using System;

namespace CalculatorApplication
{
   class NumberManipulator
   {
      public void getValue(out int x )
      {
         int temp = 5;
         x = temp;
      }
   
      static void Main(string[] args)
      {
         NumberManipulator n = new NumberManipulator();
         /* 局部变量定义 */
         int a = 100;
         
         Console.WriteLine("在方法调用之前，a 的值： {0}", a);
         
         /* 调用函数来获取值 */
         n.getValue(out a);

         Console.WriteLine("在方法调用之后，a 的值： {0}", a);
         Console.ReadLine();

      }
   }
}
```

当上面的代码被编译和执行时，它会产生下列结果：

> 在方法调用之前，a 的值： 100
> 在方法调用之后，a 的值： 5

提供给输出参数的变量不需要赋值。当需要从一个参数没有指定初始值的方法中返回值时，输出参数特别有用。请看下面的实例，来理解这一点：

```c# NumberManipulator.cs
using System;

namespace CalculatorApplication
{
   class NumberManipulator
   {
      public void getValues(out int x, out int y )
      {
          Console.WriteLine("请输入第一个值： ");
          x = Convert.ToInt32(Console.ReadLine());
          Console.WriteLine("请输入第二个值： ");
          y = Convert.ToInt32(Console.ReadLine());
      }
   
      static void Main(string[] args)
      {
         NumberManipulator n = new NumberManipulator();
         /* 局部变量定义 */
         int a , b;
         
         /* 调用函数来获取值 */
         n.getValues(out a, out b);

         Console.WriteLine("在方法调用之后，a 的值： {0}", a);
         Console.WriteLine("在方法调用之后，b 的值： {0}", b);
         Console.ReadLine();
      }
   }
}
```

当上面的代码被编译和执行时，它会产生下列结果（取决于用户输入）：

> 请输入第一个值：
> 7
> 请输入第二个值：
> 8
> 在方法调用之后，a 的值： 7
> 在方法调用之后，b 的值： 8
