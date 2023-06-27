# C#基元类型、引用类型和值类型

[TOC]

## 编程语言的基元类型

基元类型（primitive type）：编译器直接支持的数据类型。

基元类型直接映射到Framework类库（FCL）中存在的类型。

以下代码都能正确编译，并生成完全相同的IL：
```c#
int a = 0;//最方便的语法
System.Int32 a = 0;//方便的语法
int a = new int();//不方便的语法
System.Int32 a = new System.Int32();//最不方便的语法
```

只要是符合公共语言规范（CLS）的类型，其他语言都提供了类似的基元类型。不符合CLS的类型语言就不一定支持了。

C#基元类型与对应的FCL类型
| C#基元类型 | FCL类型 | 符合CLS | 说明 |
|--|--|--|--|
| sbyte | System.SByte | 否 | 有符号8位值 |
| byte | System.Byte | 是 | 无符号8位值 |
| short | System.Int16 | 是 | 有符号16位值 |
| ushort | System.UInt16 | 否 | 无符号16位值 |
| int | System.Int32 | 是 | 有符号32位值 |
| uint | System.UInt32 | 否 | 无符号32位值 |
| long | System.Int64 | 是 | 有符号64位值 |
| ulong | System.UInt64 | 否 | 无符号64位值 |
| char | System.Char | 是 | 16位Unicode字符（不像非托管C++中那样代表一个8位值） |
| float | System.Single | 是 | IEEE32位浮点值 |
| douible | System.Double | 是 | IEEE64位浮点值 |
| bool | System.Boolean | 是 | true/false值 |
| decimal | System.Decimal | 是 | 128位高精度浮点值，常用于不容许舍入误差的金融计算。128位中，1位是符号，96位是值本身（N），8位是比例因子（k）。decimal实际值是+-N*10^k，其中-28 <= k <= 0。其余位没有使用 |
| string | System.String | 是 | 字符数组 |
| object | System.Object | 是 | 所有类型的基类型 |
| dynamic | System.Object | 是 | 对于CLR，dynamic和object完全一致。但C#编译器允许使用简单的语法让dynamic变量参与动态调度 |

从另一个角度，可以认为C#编译器自动假定所有源代码文件都添加了以下using指令
```c#
using sbyte = System.SByte;
using byte = System.Byte;
using short = System.Int16;
using ushort = System.UInt16;
using int = System.Int32;
using uint = System.UInt32;
```

C#编译器非常熟悉基元类型，会在编译代码时应用自己的特殊规则，识别常见的编程模式，并生成必要的IL。

C#编译器支持与类型转换、字面值以及操作符有关的模式。

例子：两个没有派生关系的基元类型之间可以发生转换
```c#
Int32 i = 5;
Int64 l = i;//从Int32隐式转型位Int64
Single s = i;//从Int32隐式转型位Single
Byte b = (Byte)i;//从Int32显式转型位Byte
Int16 v = (Int16)s;//从Single显式转型位Int16
```

只有在转换“安全”的时候，C#才允许隐式转型。这里的“安全”是指不会发生数据丢失的情况。

如果不安全，C#要求显式转型。“不完全”意味着丢失精度或数量级。

注意，不同编译器可能生成不同代码来处理转型。例如，值位6.8的Single转型位Int32，有的编译器生成代码对其向下取整，转为6。其他编译器可能结果向上取整为7。

C#总是对结果向下取整。



## 引用类型和值类型

## 值类型的装箱与拆箱

### 使用接口更改已装箱值类型中的字段

### 对象相等性和同一性

## 对象哈希码

## dynamic基元类型