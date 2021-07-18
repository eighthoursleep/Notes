---
title: 核心C#
date: 2020-04-12 22:12:00
tags: C Sharp
toc: true
---

声明变量、变量的初始化和作用域、C#的预定义数据类型、在C#程序中指定执行流、使用命名空间组织class和type、Main()方法、使用内部注释和文档编制功能、预处理器指令、C#编程的推荐规则和约定

<!--more-->

# 1. C#基础

在C#中，语句以分号（;）结尾，用花括号（{}）把语句组合为块。单行注释以两个斜杠字符开头（//），多行注释以一个斜杠和一个星号（/\*）开头，以一个斜杠和一个星号（/\*）结尾。C#区分大小写，即myVar和MyVar是两个不同的变量。

示例：

```c#
using System;
namespace Wrox.HelloWorldApp
{
    class Program
    {
        static void Main()
        {
            Console.WriteLine("Hello, World!");
        }
    }
}
```

在示例中，前几行代码与命名空间有关（后文将提到），命名空间是把有相关类组合在一起的方式。namespace关键字声明了一个命名空间，关联其中的类。其后花括号中的左右代码都被认为是在这个命名空间中。编译器在using语句指定的命名空间中查找**没有在当前命名空间中定义但在代码中引用**的类。这类似于Java中的import语句和C++中的using namespace语句。

使用using指令的原因是要使用一个库类System.Console。using System语句允许把这个类简写为Console（System命名空间中其他类也如此）如果没有using，就必须完全限定对Console.WriteLine()方法的调用，如下所示：

```c#
System.Console.WriteLine("Hello World!");
```

使用using static声明，不仅可以打开命名空间，还可以打开类的所有静态成员。声明using static System.Console，可以调用Console类的WriteLine方法，但不使用类名：

```c#
using static System.Console;
//...
WriteLine("Hello World!");
```

标准的System命名空间包含了最常用的.NET类型。在C#中做的所有工作都依赖于.NET基类。C#没有用于输入和输出的内置关键字，而是完全依赖于.NET类。

在源代码中，声明一个类Program。但是，因为该类位于Wrox.HelloWorldApp命名空间中，所以其完整名称是Wrox.HelloWorldApp.Program。

所有C#代码都必须包含在类中。类的声明包括class关键字，其后是类名和一对花括号。与类相关的所有代码都应放在这对花括号中。

```c#
namespace Wrox.HelloWorldApp
{
    class Program
    {
```

Program类包含一个方法Main()。每个C#可执行文件（如控制台应用程序、Windows应用程序、Windows服务和Web应用程序）都必须有一个入口点——Main()方法（注意，M大写）。

```c#
static void Main()
{
```

在程序启动时调用该方法。该方法要么没有返回值（void）要么返回一个整数（int）。注意，在C#中，方法定义如下：

```
[修饰符] 返回类型 方法名([参数])
{
	//方法内容.
}
```

第一个方括号里的内容表示可选关键字。修饰符用于指定用户做定义的方法的某些特性，如可以在什么地方调用该方法。在本例中，Main()方法没有使用public访问修饰符，如果需要对Main()方法进行单元测试，可以给它使用public访问修饰符。运行库不需要使用public访问修饰符，仍可以调用方法。运行库没有创建类的实例，调用方法时，需要修饰符static。把返回类型设置为void，在本例中不包含任何参数。

最后看代码语句：

```c#
Console.WriteLine("Hello World!");
```

在本例中，只调用了System.Console类的WriteLine()方法，把一行文本写到控制台窗口上。WriteLine()是一个静态方法，在调用之前不需要实例化Console对象。



# 2. 变量

没有变量不可能写出重要的程序。

C#中使用下述语句声明变量：

```
datatype identifier
```



## 2.1 初始化变量



## 2.2 类型推断

类型推断使用var关键字。声明变量的语法有些变化：使用var关键字替代实际的类型。编译器可以根据变量的初始化值“推断”变量的类型。例如：

```c#
var someNumber = 0;
```

变成：

```c#
int someNumber = 0;
```

即使someNumber没有声明int，编译器也可以确定，只要someNumber在其作用域内，就是int类型。编译后上边两个语句是等价的。下边是另一个小例子：

```c#
using System;
namespace VariablesSample
{
    class Program
    {
        static void Main()
        {
            var name = "Bugs Bunny";
            var age = 25;
            var isRabbit = true;
            Type nameType = name.GetType();
            Type ageType = age.GetType();
            Type isRabbitType = isRabbit.GetType();
            Console.WriteLine($"name is of type {nameType}");
            Console.WriteLine($"age is of type {ageType}");
            Console.WriteLine($"isRabbit is of type {isRabbitType}");
        }
    }
}
```

程序输出如下：

![image-20200413095925128](image-20200413095925128.png)

需要遵循以下规则：

- 变量必须初始化，否则，编译器没有推断变量类型的依据。
- 初始化器不能为空。
- 初始化器必须放在表达式中。
- 不能把初始化器设置为一个对象，除非在初始化器中创建了一个新对象。

声明了变量且推断出类型后，就不能再改变变量的类型了。变量的类型确定后，对该变量进行任何赋值时，其强类型化规则必须以推断出的类型为基础。

## 2.3 变量作用域

变量的作用域是可以访问该变量的代码区域。一般情况下，确定作用域遵循以下规则:

- 只要类的局部变量在某个作用域内，其字段（也称为成员变量）也在该作用域内。
- 局部变量存在于表示声明该变量的块语句或方法结束的右花括号之前的作用域内。
- 在for、while或类似语句中声明的局部变量存在于该循环体内。

### 1. 局部变量的作用域冲突

大型程序常常在不同部分为不同的变量使用相同的变量名。只要变量的作用域是程序的不同部分，就不会有问题，也不会产生多义性。但要注意，同名的局部变量不能在同一作用域内声明两次。例如，不能使用下面的代码：

```c#
int x = 20;
// some more code
int x = 30;
```

考虑以下代码示例：

```c#
using System;
namespace VariableScopeSample
{
    class Program
    {
        private int j;

        static int Main()
        {
            for (int i = 0; i < 10; i++)
            {
                Console.WriteLine(i);
            }  // i goes out of scope here
               // We can declare a variable named i again, because
               // there's no other variable with that name in scope
            for (int i = 9; i >= 0; i--)
            {
                Console.WriteLine(i);
            }  // i goes out of scope here.
            return 0;
        }
    }
}
```

这段代码很简单，使用两个for循环打印0~9的数字，再逆序打印0~9的数字。重要的是在同一个方法中，代码中的变量i声明了两次。可以这么做的原因是i在两个相互独立的循环内部声明，所以每个变量i对于各自的循环来说是局部变量。

下面是另一个例子：

```c#
using System;
namespace VariableScopeSample2
{
    class Program
    {
        static int Main(string[] args)
        {
            int j = 20;
            for (int i = 0; i < 10; i++)
            {
                // int j = 30; // Can't do this — j is still in scope
                Console.WriteLine(j + i);
            }
            return 0;
        }
    }
}

```

如果试图编译它，会产生如下错误：

```
error CS0136: 无法在此范围中声明名为“j”的局部变量或参数，
因为该名称在封闭局部范围中用于定义局部变量或参数
```



### 2. 字段和局部变量的作用域冲突





## 2.4 常量

顾名思义，常量是其值在使用过程（生命周期）中不会发生变化的变量。在声明和初始化变量时，在变量的 前面加上关键字const,就可以把该变量指定为一个常量： 

```c#
const int a = 100; // This value cannot be changed.
```

常量具有如下特点：	'

- 常量必须在声明时初始化。指定了其值后，就不能再改写了。

- 常量的值必须能在编译时用于计算。因此，不能用从变量中提取的值来初始化常量。如果需要这么做,
  应使用只读字段。

- 常量总是隐式静态的。但注意，不必（实际上，是不允许）在常量声明中包含修饰符static。
  在程序中使用常量至少有3个好处：

  - 由于使用易于读取的名称（名称的值易于理解）替代了较难读取的数字和字符串，常量使程序变得更易于
    阅读。

  - 常量使程序更易于修改。例如，在C#程序中有一个SalesTax常量，该常量的值为6%。如果以后销售
    税率发生变化，把新值赋给这个常量，就可以修改所有的税款计算结果，而不必査找整个程序去修改
    税率为0.06的每个项。
  - 常量更容易避免程序出现错误。如果在声明常量的位置以外的某个地方将另一个值赋给常量，编译器
    就会标记错误。



# 3. 预定义数据类型



### 3.1 值类型和引用类型



## 3.2 .NET类型



## 3.3 预定义的值类型



## 3.4 预定义的引用类型







# 4. 程序流控制



# 5. 命名空间



# 6. Main()方法



# 7. 使用注释

 

# 8. C#预处理器指令



# 9. C#编程准则



 # 10. 总结

