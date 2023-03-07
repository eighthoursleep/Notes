# C#泛型

泛型是CLR和编程语言提供的一种特殊机制，它支持另一种形式的代码重用，即“算法重用”。

CLR允许创建泛型引用类型、泛型值类型、泛型接口、泛型委托，不允许创建泛型枚举类型。

泛型为开发人员提供了以下优势：
1. **源代码保护**：不需要访问算法的源代码。
2. **类型安全**：编译器和CLR能理解开发人员的意图，并保证指定的数据类型兼容的对象能用于算法。
3. **更清晰的代码**：由于编译器强制类型安全，所以减少了源代码中必须进行的强制类型转换次数。
4. **更佳的性能**：没有泛型时，要定义产常规化算法，它的所有成员都要定义成操作Object数据类型。要用这个算法操作值类型的实例，CLR必须在调用算法的成员之前对值类型实例进行装箱。装箱造成在托管堆上进行内存分配，造成更频繁的垃圾回收。现在创建一个泛型算法来操作一种具体值类型，值类型实例能以传值方式传递，CLR不需要执行任何装箱操作。因为不需要进行强制类型转换，CLR无需验证转型是否类型安全，提高了代码运行速度。

[TOC]

## 一、FCL中的泛型

泛型最明显的应用，就是集合类。

FCL在System.Collections.Generic和System.Collections.ObjectModel命名空间中提供了多个泛型集合类。

System.Collections.Concurrent命名空间提供了线程安全的泛型集合类。

微软建议使用泛型集合类，不建议使用非泛型集合类，出于以下考虑：
1. 类型安全性、更清晰的代码、更佳的性能。
2. 更好的对象模型。

System.Array类（所有数组类型的基类）提供了大量静态泛型方法，如：

AsReadOnly, BinarySearch, ConvertAll, Exists, Find, FindAll, FindIndex, FindLast, FindLastIndex, ForEach, IndexOf, LastIndexOf, Resize, Sort, TrueForAll等。

例子：
```c#
public static void Main()
{
    //创建并初始化一个字节数组
    Byte[] byteArray = new Byte[]{5,1,4,2,3};
    //调用Byte[]排序算法
    Array.Sort<Byte>(byteArray);
    //调用Byte[]二分搜索算法
    Int32 i = Array.BinarySearch<Byte>(byteArray, 1);
    Console.WriteLine(i);//显示“0”
}
```

## 二、泛型基础结构

### 开放类型和封闭类型

具有泛型类型参数的类型仍然是类型，CLR同样会为它创建内部的类型对象。

具有泛型类型参数的类型称为**开放类型**。

CLR禁止构造开放类型的任何实例。这类似与CLR禁止构造接口类型实例。

代码引用泛型类型时，可指定一组泛型类型实参。

为所有类型参数都传递实际的数据类型，类型就成为**封闭类型**。

CLR允许构造封闭类型的实例。然而，代码引用泛型类型的时候，可能会留下一些泛型类型实参未指定。这会在CLR中创建新的开放类型对象，而且不能创建该类型的实例。

例子：

```c#
using System;
using System.Collections.Generic;

//一个部分指定的开放类型
internal sealed class DictionaryStringKey<TValue>: Dictionary<String, TValue>{}

public static class Program
{
    public static void Main()
    {
        Object o = null;
        //Dictionary<,>是开放类型，有2个类型参数
        Type t = typeof(Dictionary<,>);
        //尝试创建该类的实例（失败）
        o = CreateInstance(t);
        Console.WriteLine();
        //DictionaryStringKey<>是开放类型，有1个类型参数
        t = typeof(DictionaryStringKey<>);
        //尝试创建该类型的实例（失败）
        o = CreateInstance(t);
        Console.WriteLine();
        //DictionaryStringKey<Guid>是封闭类型
        t = typeof(DictionaryStringKey<Guid>);
        //尝试创建该类型的一个实例（成功）
        o = CreateInstance(t);
        //证明它确实能够工作
        Console.WriteLine("对象类型 >>>" + o.GetType());
    }
    private static Object CreateInstance(Type t)
    {
        Object o = null;
        try{
            o = Activator.CreateInstance(t);
            Console.Write("已创建{0}的实例。", t.toString());
        }
        catch (ArgumentException e){
            Console.WriteLine(e.Message);
        }
        return o;
    }
}
```

注意，因为CLR会在类型对象内部分配类型的静态字段。因此每个封闭类型都有自己的静态字段。

假如List<T>定义了任何静态字段，这些字段不会再一个List<DateTime>和一个List<String>之间共享；每个封闭类型对象都有自己的静态字段。

假如泛型类型定义了静态构造器，那么针对每个封闭类型，这个构造器都会执行一次。

泛型类型定义静态构造器的目的是保证传递的类型实参满足特定条件。

例子：
```c#
internal sealed class GenericTypeThatRequiresAnEnum<T>
{
    static GenericTypeThatRequiresAnEnum()
    {
        if(!typeof(T).IsEnum)
        {
            throw new ArgumentException("T must be an enumerated type");
        }
    }
}
```

CLR提供了名未约束的功能，可以更好地指定有效的类型实参。但是约束无法将类型实参限制未“仅枚举类型”。因此上例需要用静态构造器来保证是一个枚举类型。

### 泛型类型和继承

泛型类型仍然是类型，所以能从其他任何类型派生。

使用泛型类型并指定类型实参时，实际是在CLR中定义一个新的类型对象，新的类型对象从泛型类型派生自的那个类型派生。

例子：
List<T>从Object派生，所以List<String>和List<Guid>也从Object派生。
DictionaryStringKey<TValue>从Dictionary<String, TValue>派生，所以DictionaryStringKey<Guid>也从Dictionary<String, Guid>派生。

指定类型实参不影响继承层次结构。

考虑下边链表的例子：
```c#
internal sealed class Node<T>
{
    public T m_data;
    public Node<T> m_next;
    public Node(T data): this(data, null){}
    public Node(T data, Node<T> next)
    {
        m_data = data;
        m_next = next;
    }
    public override String ToString()
    {
        return m_data.ToString() + ((m_next != null)) ? m_next.ToString() : String.Empty);
    }
}

...

private static void SameDataLinkedList()
{
    Node<Char> head = new Node<Char>('C');
    head = new Node<Char>('B', head);
    head = new Node<Char>('A', head);
    Console.WriteLine(head.ToString()); //显示“ABC”
}
```
在这个链表包含的节点中，所有数据项都必须具有相同的类型（或派生类）。

不能使用Node类来创建这样一个链表：其中一个元素包含Char值，另一个包含DateTime值，再另一个包含String值。当然如果到处都用Node<Object>，确实可以做到，但会丧失编译时类型安全性，而且值类型会被装箱。

刚好的办法时定义非泛型Node基类，再定义泛型TypedNode类（用Node作为基类）。这样就可以创建一个链表，每个节点都可以是一种具体的数据类型（不能是Object）,同时获得编译时的类型安全性，并防止值类型装箱。

例如：
```c#
internal class Node
{
    protected Node m_next;
    public Node(Node next)
    {
        m_next = next;
    }
}
internal sealed class TypeNode<T>:Node
{
    public T m_data;
    public TypedNode(T data): this(data, null){}
    public TypedNode(T data, Node next): base(next)
    {
        m_data = data;
    }
    public override String ToString()
    {
        return m_data.ToString() + ((m_next != null) ? m_next.ToString() : String.Empty);
    }
}

...

private static void DifferentDataLinkedList()
{
    Node head = new TypedNode<Char>('.');
    head = new TypedNode<DateTime>(DateTime.Now. head);
    head = new TypedNode<String>("Today is ", head);
    Console.WriteLine(head.ToString());
}
```

### 泛型类型同一性

有人处于简化的考虑定义了一个新的非泛型类：
```c#
internal sealed class DateTimeList: List<DateTime>{

}

...

DateTimeList dtl = new DateTimeList();
```
绝对不要单纯出于增强源码可读性的目的定义一个新类。

这样做会丧失类型的同一性和相等性。

```c#
Boolean sameType = (typeof(List<DateTime>) == typeof(DateTimeList));
```
上述代码运行时，sameType会被初始化未false。因为比较的是两个不同类型的对象。

意味着，如果方法的原型接受一个DateTimeList，那么不可以将一个List<DateTime>传给它。

如果方法的原型接受一个List<DateTime>，那么可以将一个DateTimeList传给它，因为DateTimeList从List<DateTime>派生。

幸好，C#允许使用简化的语法来引用泛型封闭类型，同时不影响类型的相等性。这个语法要求在源文件顶部使用传统的using指令，例如：
```c#
using DateTimeList = System.Collections.Generic.List<System.DateTime>;
```

using指定实际定义的是名未DateTimeList的符号。

代码编译时，编译器将代码中出现的所有DateTimeList替换成System.Collections.Generic.List<System.DateTime>。在这种情况下，执行下边的代码，sameType会被初始化为true。
```c#
Boolean sameType = (typeof(List<DateTime>) == typeof(DateTimeList));
```
### 代码爆炸

使用泛型类型参数的方法在进行JIT编译时，CLR获取方法的IL，用指定的类型实参替换，然后创建恰当的本机代码。这是泛型的重要特点。

但这么做有一个缺点：CLR腰围每种不同的方法/类型组合生成本机代码。我们将这个现象称为“代码爆炸”。它可能造成应用程序的工作国际显著增大，从而损害性能。

幸好，CLR内建了一些优化措施能缓解代码爆炸。

首先，假如为特定的类型实参调用了一个方法，以后再用相同的类型实参调用这个方法，CLR只会为这个方法/类型组合编译一次代码。

所以，如果一个程序集使用List<DateTime>，一个完全不同的程序集（加载到同一个AppDomain中）也使用List<DateTime>，CLR只为List<DateTime>编译一次方法。这样就显著缓解了代码爆炸。

CLR还有另一个优化，它认为所有引用类型实参都完全相同，所以代码能够共享。

例如，CLR为List<String>的方法编译的代码可直接用于List<Stream>的方法，因为String和Stream均为引用类型。

事实上，对于任何引用类型，都会使用相同的代码。CLR之所以能执行这个优化，是因为所有引用类型的实参或变量实际只是指向堆上对象的指针，而所有对象指针都以相同的方式操纵。

但是，假如某个类型实参时值类型，CLR必须专门为哪个值类型生成本机代码。因为值类型的大小不定。

即使两个值类型大小一样（比如Int32和UInt32，都是32位），CLR仍然无法共享代码，因为可能要用不同的本机CPU指令来操纵这些值。

## 三、泛型接口

没有泛型接口，每次用得非泛型接口来操纵值类型都会发生装箱，而且失去编译时的类型安全性。严重制约泛型类型的应用范围。

因此CLR提供对泛型接口的支持。引用类型或值类型可指定类型实参实现泛型接口。也可保持类型实参的未指定状态实现泛型接口。

例子：
```c#
public interface IEnumerator<T>: IDisposable, IEnumerator{
    T Current{get;}
}

internal sealed class Triangle : IEnumerator<Point>{
    private Point[] m_vertices;
    public Point Current{get{...}}
    ...
}

internal sealed class ArrayEnumerator<T> : IEnumerator<T>{
    private T[] m_array;
    public T Current{get{...}}
    ...
}
```


## 四、泛型委托

CLR支持泛型委托，目的时保证任何类型的对象都能以类型安全的方式传给回调方法。

此外，泛型委托允许值类型实例在传给回调方法时不进行任何装箱。

如果定义的委托类型指定了类型参数，编译器会定义委托类的方法，用指定的类型参数替换方法的参数类型和返回类型。

例如，下边这样定义的泛型委托：
```c#
public delegate TReturn CallMe<TReturn, TKey, TValue>(TKey key, TValue value);
```
编译器会将它转换成：
```c#
public sealed class CallMe<TReturn, TKey, TValue>: MulticastDelegate{
    public CallMe(Object object, IntPtr method);
    public virtual TReturn Invoke(TKey key, TValue value);
    public virtual IAsyncResult BeginInvoke(TKey key, TValue value, AsyncCallback callback, Object object);
    public virtual TReturn EndInvoke(IAsyncResult result);
}
```

## 五、委托和接口的逆变和协变泛型类型实参



## 六、泛型方法

## 七、泛型和其他成员

## 八、可验证性和约束