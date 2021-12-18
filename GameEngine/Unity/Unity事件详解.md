# Unity事件详解

Unity Event这一概念本身不复杂，但由于其他很多相近易混淆的概念，如Event System（事件系统）、Delegate（委托）、C# Event等，让Unity事件原本的概念变得模糊不清。 

在这些相近的概念中，**Unity事件**只是**C#委托的一个简单包装**而已，但它比较常用，也比较易用。

## Unity事件实例

这种将逻辑代码插入其他不相关逻辑的方式有很多缺点。

首先，与常规软件不同，游戏逻辑的关联性有时是很怪异的，在看似不相关的地方也会产生关联。例如，敌人AI会根据主角的当前动作做出反应。敌人AI与主角行动本应是不相关的两个模块，一方面不应该把敌人AI的代码插入主角行动的函数中，另一方面敌人AI又确实需要在主角行动的时刻立即做出反应。这时就在逻辑简洁性与模块清晰性中出现了两难的选择。

其次，随着游戏功能的增多，在某些特殊的时刻会添加越来越多的逻辑。例如，在玩家角色升级的特殊时刻，特效、音乐、任务和成就等系统都可能需要立即处理与升级有关的逻辑。玩家角色升级本来 是一段很简单的代码，但随着系统的增加，每个系统都要在升级处插一行代码，从而让玩家角色的核心脚本变得臃肿不堪。

这时可以使用Unity事件进行改进，在满足扩展性的同时，让代码稳定下来，不再频繁修改。

## Unity事件的多参数形式

Unity事件不仅可以通过AddListener方法添加订阅函数，也可以 通过RemoveListener方法删除订阅函数。事件支持多次添加同一个订 阅函数，添加几次就会调用几次。这种设计虽然灵活，但有时也会造 成不小心订阅了很多次的情况。

如果订阅的函数需要参数，Unity事件也可以支持。Unity事件默 认支持0~4个参数的函数，而且每个参数类型都是任意的（泛型），足 以满足常规使用。但有个麻烦之处是，泛型的UnityEvent是抽象类 （abstract class），不能直接作为变量类型，需要用继承的方式定 义事件类型。如下面的代码中，MyEvent1是一种事件类型，参数为1个Vector3。

```c#
using System;
using UnityEngine;
using UnityEngine.Events;
// 1个参数的事件
[Serializable] // 加Serializable是为了在编辑器面板上可见
public class MyEvent1 : UnityEvent<Vector3> { }
// 3个参数的事件
[Serializable]
public class MyEvent3 : UnityEvent<int, int, string> { }
public class UnityEventTest : MonoBehaviour
{
    public MyEvent1 TestEvent1; // 不用写new，public事件会被Unity初始化
    public MyEvent3 TestEvent3;
    // 1个参数的测试函数F1
    void F1(Vector3 pos)
    {
        Debug.Log("F1 " + pos);
    }
    //3个参数的测试函数F3
    void F3(int a, int b, string s)
    {
        Debug.LogFormat("F3 {0} {1} {2}", a, b, s);
    }

    private void Start()
    {
        TestEvent1.AddListener(F1);
        TestEvent3.AddListener(F3);
        // 可以用Lambda表达式写
        TestEvent3.AddListener( (int a, int b, string s) => {
                                   Debug.Log("Lambda "+ a + b + s);
                               });

        TestEvent1.Invoke(new Vector3(3, 5, 6));
        TestEvent3.Invoke(8, 7, "Hello");
        // 删除了订阅者F3后，下次Invoke就不会调用F3函数了
        TestEvent3.RemoveListener(F3);
        TestEvent3.Invoke(8, 7, "world");
    }
}
```

只要调用事件的Invoke，那么调用之前 通过AddEventListener订阅的函数都会被调用，也包括匿名函数。

**订阅事件的函数参数必须与事件要求的完全一致。**例如，订阅事件TestEvent1的函数必须是参数为Vector3、返回值为void 的函数，而这是由类型MyEvent1决定的。事件TestEvent3同理，要求 订阅函数的3个参数依次为int、int和string类型。

UnityEvent多种参数的形式只是为了方便实现具有1~4个参数的事件。具体如何用好这些事件，还是要根据具体需求来决定。

## Unity事件与委托

说到Unity事件，就不得不提到UnityAction，而UnityAction仅仅是C#语法中的委托而已。

让人困惑的是，要实现事件订阅和调用机制，仅使用委托的语法就足够了，根本不需要用到Unity事件。

要弄清这些概念之间的关系，还得要回到C#语法的基础特性——委托。

```c#
using UnityEngine;

delegate void MyFunc1();
delegate int MyFunc2(int a);

public class TestD elegate : MonoBehaviour
{
    void Start() {
        MyFunc1 f1;
        f1 = F;
        MyFunc2 f2;
        f2 = G;

        f1();
        f2(3);
    }

    void F() {
        Debug.Log("F");
    }

    int G(int i) {
        Debug.Log("G" + i);
        return 0;
    }
}
```

以上代码的Start函数先定义了变量f1和f2，让f1指向函数F，f2 指向函数G。调用f1相当于执行F，调用f2相当于执行G。

而这两个变量的类型十分特殊，它们可以指向函数。这种“指向 函数的变量类型”非常特别，无法用class或struct定义，只能使用 delegate语法定义。也就是上文代码中开头的两行，定义了MyFunc1和 MyFunc2两种函数类型。其中MyFunc1代表返回值为void、参数为空的 函数；MyFunc2代表返回值为int型、参数为1个int型值的函数。

让变量能指向函数，是现代编程语言都比较重视的一项功能。例 如，常用编程语言Lua和Python，都把函数看作“第一类对象”，让函 数对象与普通对象有着平起平坐的地位，函数可以被变量引用，也可以被装到容器中，还可以被当作变量传递。

函数可以作为普通对象使用，这种语法特性非常有用，有助于实现函数式编程。C#作为一种年轻的编程语言，自然也会对这种有用的 特性提供支持，而让C#能够灵活使用函数的关键在于委托语法。

委托语法用类似定义函数的语法，定义了一种“函数类型”。每 个委托的定义，必须清楚定义这类函数的参数数量、参数类型以及返 回值类型。如上文例子中的MyFunc1和MyFunc2就是两种函数类型。

有了函数类型，就可以定义该类型的变量。这种变量称为委托变 量，委托变量可以指向类型符合的函数。除此之外，委托变量也可以通过参数传递或添加到容器。总而言之，普通变量支持的基本操作， 委托变量也都支持。

```c#
...
void Start()
{
    // 将函数用作参数传递
    CallFunc(F, G, 9);

    // 列表，每个元素都是函数的引用
    List<MyFunc1> funcs = new List<MyFunc1>();
    // 添加F到列表两次
    funcs.Add(F);
    foreach (MyFunc1 f in funcs)
    {
        f();
    }
}

void CallFunc(MyFunc1 f, MyFunc2 g, int n)
{
    Debug.Log("间接调用函数");
    f();
    g(n);
}
```

1. 委托作为事件使用

函数类型的变量能指向一个函数，调用该变量相当于调用函数。 而更神奇的是，函数类型的变量能同时指向多个函数，调用它就能依 次调用多个函数。

```c#
int GA(int i) {
    Debug.Log("GA " + i);
    return 0;
}
int GB(int i) {
    Debug.Log("GB " + i);
    return 0;
}
int GC(int i) {
    Debug.Log("GC " + i);
    return 0;
}

void Start()
{
    MyFunc2 g = null;
    g += GA;
    g += GB;
    g += GC;
    // 依次调用GA、GB、GC
    g(3);

    // 再加一次GA、去掉GC
    g += GA;
    g -= GC;
    g(5);
}
```

普通的函数类型变量g完全可以代替UnityEvent， AddListener相当于`+=`运算符，RemoveListener相当于`-=`运算 符。

2. 委托与事件的关系

UnityAction是事先定义好的一种委托，也就是一种函数类型。 UnityAction支持多个泛型参数，可以方便地与UnityEvent搭配使用。

```c#
namespace UnityEngine.Events
{
    public delegate void UnityAction();
    public delegate void UnityAction<T0>(T0 arg0);
    public delegate void UnityAction<T0, T1>(T0 arg0, T1 arg1);
    public delegate void UnityAction<T0, T1, T2>(T0 arg0, T1 arg1, T2 arg2);
    public delegate void UnityAction<T0, T1, T2, T3>(T0 arg0, T1 arg1, T2 arg2, T3 arg3);
}

```

弄清委托的用法，对了解和掌握函数式程序设计很有帮助。函数 式程序设计思想在很多地方都可以用到，如列表的Sort方法支持传入函数，可以实现对任意类型对象以任意标准排序。

虽然从原理上看，委托可以代替UnityEvent，但在开发时应当尽量使用UnityEvent，因为这样不仅符合惯例，而且可以获得更多便 利。