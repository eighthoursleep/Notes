# C#接口

多继承是指一个类从两个或多个基类派生的能力。

CLR不支持多继承（所有托管编程语言也支持不了）。CLR只是通过接口提供“缩水版”的多继承。

本文讨论：
1. 如何定义和使用接口
2. 一些指导性原则
3. 如何判断何时应该使用接口而不是基类

[TOC]

## 类和接口继承

在CLR种，任何类都肯定从一个类且只能是一个类派生，后者最终从Object类派生。这个类称为基类。

基类提供了一组方法签名和这些方法的实现。所有方法签名和方法实现都会由新的派生类继承。

接口实际只是对一组方法签名进行了统一命名。这些方法不提供任何实现。

类通过指定接口名称来继承接口，必须显式实现接口方法，否则CLR认为此类型定义无效。

C#编译器和CLR允许一个类继承多个接口。

类继承的一个重要特点时，凡是基类型实例的地方，都能使用派生类型的实例。

接口继承的一个重要特点时，凡是能使用具体接口类型的实例的地方，都能使用实现了接口的一个类型的实例。

## 定义接口

接口对一组方法签名进行统一命名，此外接口还能定义事件、无参属性和有参属性（C#的索引器）。这些本质上都是方法，只是语法上的简化。

不过，接口不能定义任何构造器方法，也不能定义任何实例字段。

虽然CLR允许接口定义静态方法、静态字段、常量和静态构造器，但符合CLS标准的接口绝不允许，因为有的编程语言不能定义或访问它们。

事实上，C#禁止接口定义任何一种这样的静态成员。

C#用interface关键字定义接口。要为接口指定名称和一组实例方法签名。例如FCL种的几个接口定义：

```c#
public interface IDisposable
{
    void Disposed();
}
public interface IEnumerable
{
    IEnumerator GetEnumerator();
}
public interface IEnumerable<T> : IEnumerable
{
    new IEnumerator<T> GetEnumerator();
}
public interface ICollection<T> : IEnumerable<T>, IEnumerable
{
    void Add(T item);
    void Clear();
    Boolean Contains(T item);
    void CopyTo(T[] array, Int32 arrayIndex);
    Boolean Remove(T[] item);
    Int32 Count {get;} //只读属性
    Boolean IsReadOnly {get;} //只读属性
}
```

在CLR看来，接口就是类型定义。即，CLR会为接口类型对象定义内部数据接口，同时可以通过反射机制来查询接口类型的功能。

和类型一样，接口可在文件范围种定义，也可嵌套在另一个类型中。

定义接口类型时，可指定你希望的任何可访问性（public, protected, internal等）。

根据约定，接口类型名称以大写字母I开头，目的时方便再源码种辨认接口类型。

CLR支持泛型接口和接口种的泛型方法。

接口定义可从另一个或多个接口”继承“。打引号是因为不是严格继承。接口继承的方式并不完全和类继承一样。

倾向于将接口继承看成是将其他接口的协定（contract）包括到新接口中。例如ICollection<T>接口定义就包含了IEnumerable<T>和IEnumerable两个接口的协定。这又以下两层含义：

1. 继承ICollection<T>接口的任何类必须实现ICollection<T>,IEnumerable<T>和IEnumerable这三个接口所定义的方法。
2. 任何代码在引用对象时，如果期待该对象的类型实现了ICollection<T>接口，可以认为该类型还实现了IEnumerable<T>和IEnumerable接口。

## 继承接口



## 关于调用接口方法的更多探讨

## 隐式和显式接口方法实现

## 泛型接口

## 泛型和接口约束

## 实现多个具有相同方法名和签名的接口

## 用显示接口方法实现来增强编译时类型安全性

## 谨慎使用显式接口方法实现

## 设计：基类还是接口？

应该设计基类还是设计接口？这个问题不能一概而论。

有以下设计规范：
1. IS-A对比CAN-DO关系（”属于“对比”能做某事“关系）
2. 易用性
3. 一致实现性
4. 版本控制