# C#事件

[TOC]

定义了事件成员的类型允许类型（或类型的实例）通知其他对象发生了特定的事情。

定义了事件成员的类型能提供以下功能：
1. 方法能登记它对事件的关注。
2. 方法能注销它对事件的关注。
3. 事件发生时，登记了的方法将收到通知。

类型之所以能提供事件通知功能，是因为类型维护了一个已登记方法的列表。事件发生后，类型将通知列表中所有已登记的方法。

CLR事件模型以委托为基础。

委托是调用回调方法的一种类型安全的方式。对象凭借回调方法接收它们订阅的通知。

## 设计公开事件的类型

### 第1步：定义类型来荣安所有需要发送给事件通知接收者的附加信息

事件引发时，引发事件的对象可能希望向接收事件的对象传递一些附加信息。

这些附加信息需要封装到它自己的类中，该类通常包含一组私有字段，以及一些用于公开这些字段的只读公共属性。

根据约定，这种类应该从System.EventArgs派生，而且类名以EventArgs结束。

例子：

```c#
internal class NewMailEventArgs : EventArgs
{
    private readonly String m_from, m_to, m_subject;
    public NewMailEventArgs(String from, String to, String subject)
    {
        m_from = from;
        m_to = to;
        m_subject = subject;
    }
    public String From{get{return m_from;}}
    public String To{get{return m_to;}}
    public String Subject{get{return m_subject;}}
}
```

### 第2步：定义事件成员

事件成员使用C#关键字event定义。

每个事件成员都要指定以下内容：
1. 可访问性标识符（几乎肯定是public,这样其他代码才能访问该事件成员）；
2. 委托类型，指出要调用的方法的原型；
3. 以及名称（可以是任何有效的标识符）。

```c#
internal class MailManager
{
    public event EventHandler<NewMailEventArgs> NewMail;
    ...
}
```

泛型System.EventHandler委托类型的定义如下：
```c#
public delegate void EventHandler<TEventArgs>(Object sender, TEventArgs e);
```
所以方法原型必须具有以下形式：
```c#
void MethodName(Object sender, NewMailEventArgs e)
```
要求sender是Object而非MailManager是因为继承，和可能出现的类型转换。

将sender参数的类型定义为Object的另一个原因是灵活性。它使委托能由多个类型使用，只要类型提供了一个会传递NewMailEventArgs对象的事件。

此外，事件模式要求委托定义和回调方法将派生自EventArgs的参数命名为e。这个要求唯一的作用就是加强事件模式的一致性，使开发人员更容易学习和实现这个模式。能自动生成源代码的工具比如Visual Studio也知道将参数命名为e。

最后，事件模式要求所有事件处理程序的返回类型都是void。这很有必要，因为引发事件后可能要调用好几个回调方法，但没办法获得所有方法的返回值。

将返回值类型定为void，就不允许回调（方法）返回值。

### 第3步：定于负责引发事件的方法来通知事件的登记对象

按照约定，类要定义一个受保护的虚方法。

引发事件时，类及其派生类中的代码会调用该方法。方法只获取一个参数，即一个NewMailEventArgs对象，其中包含了传给接收通知的对象的信息。方法的默认实现只是检查一下是否有对象登记了对事件的关注。如果有，就引发事件来通知事件的登记对象。
```c#
internal class MailManager
{
    ...
    //如果类是密封的，该方法要声明为私有和非虚
    protected virtual void OnNewMail(NewMailEventArgs e)
    {
        //出于线程安全的考虑，现在将对委托字段的引用复制到一个临时变量中
        EventHandler<NewMailEventArgs> temp = Volative.Read(ref NewMail);
        if(temp != null) temp(this, e);
        ...
    }
}
```

## 编译器如何实现事件

## 合计监听事件的类型

## 显示实现事件