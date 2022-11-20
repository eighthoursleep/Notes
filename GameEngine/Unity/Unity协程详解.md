# Unity协程详解

[TOC]

定时创建或销毁物体，可以使用Invoke方法。但是大量使用Invoke()方法的代码比较难编写，而且难以理解。Unity提供了“协程” 这一概念，专门处理复杂的定时逻辑。

下面的代码实现了一个简单的计时器，每隔2秒就会在Console窗口 中显示当前游戏经历的时间：

```c#
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
public class TestCoroutine : MonoBehaviour
{

    void Start()
    {
        // 开启一个协程，协程函数为Timer
        StartCoroutine(Timer());
    }
    // 协程函数
    IEnumerator Timer()
    {
        // 不断循环执行，但是并不会导致死循环
        while (true)
        {
            Debug.Log(Time.time);
            // 等待2秒
            yield return new WaitForSeconds(2);
        }
    }
}
```

`StartCoroutine`方法开启了一 个新的协程函数`Timer()`，这个协程函数返回值必须是`IEnumerator`。`Timer`函数中由于`while(true)`的存在，会永远运行下去。`Timer()`函数每 当运行到`yield return`语句，就会暂时休息，而`new WaitForSeconds(2)`会控制休息的时间为2秒，2秒后又接着执行后面的内容。

换个角度看Timer()函数，它创造了一个优雅的、可以方便地控制执 行时间的程序结构，不再需要使用Invoke()那种烦琐的延迟调用方法。 任何需要定时执行的逻辑都可以通过在循环体中添加代码，或是再添加 一个新的协程函数来实现。不必担心开设过多协程对效率的影响，只要 不在协程函数中做很复杂的操作，那么创建协程本身对运行效率的影响 非常有限。

## 协程是线程吗

从实用角度看协程：协程函数与其他每帧执行的函数互不影响； 用协程编写延时逻辑、异步逻辑非常方便。

如果在Update函数中编写一个死循环，会造成运行游戏时整个Unity编辑器卡死的后果。而协程函数可以与Update函数并行不悖，如果在协程函数中编写一个死循环仍会导致编辑器卡死。说明，**协程函数并不是一个独立的执行单元**，它与`Update`、`FixedUpdate`和`LateUpdate`等函数一 样，被Unity依次执行。一旦一个函数发生死循环，就会阻碍整个游戏 的运行。简而言之，**协程不是线程**。

使用`WaitForSeconds`方法可以让协程延迟执行。 但假如延迟的时间设为0，协程依然有最小的执行间隔时间——1帧的时间。无论协程函数怎么编写，它执行的频率都不会超过Update被调 用的频率。

协程非常像是另一个自定义的Update函 数，只不过可以方便地使用延时逻辑。

但是Start和Update其实也是支持协程式调用的，如以下代码：

```c#
using System.Collections;
using UnityEngine;
public class HelloCoroutine : MonoBehaviour
{
    IEnumerator Start()
    {
        Debug.Log(1);
        yield return new WaitForSeconds(1);
        Debug.Log(2);
        yield return new WaitForSeconds(1);
        Debug.Log(3);
    }
}
```

以上代码让Start方法也具备了延时执行的功能，而且不需要用`StartCoroutine`启动。

Start方法并不是主动调用的，而是被Unity引擎识别并调用的。 这里把Start方法的返回值从void改为了IEnumerator（迭代器），也同样被Unity识别了。

所谓的协程，可能只是 Unity提供的一种便利写法而已。

## 迭代器

虽然协程是Unity提供的，但yield关键字明显是C#语法的一部分。

实际上，`IEnumerator`和`yield`配合，实现了一种语法机制，叫作 “**可重入函数**”。用通俗的话来说，可重入函数就是可以中断，过一会儿接着执行的函数。

一般的函数从被调用开始，必须一直执行到返回为止，下一次调 用也一定是从头开始，而且上一次执行时的局部变量也不会被保存。 而协程函数则可以在`yield`处中断，下一次调用时可以接着上次中断的 地方继续执行，而且所有的局部变量都不会重置，会保存上一次中断时的状态。

在C#中，常用的foreach语法就离不开迭代器的支持。例如，遍历字典这种常规操作，也需要让字典具有可迭代的特性才可以实现。

```c#
using System.Collections.Generic;
using UnityEngine;
public class MyIter : MonoBehaviour
{
    IEnumerator<int> HelloWorld()
    {
        transform.position = new Vector3(1, 0, 0);
        yield return 233;

        transform.position = new Vector3(2, 0, 0);
        yield return 234;

        transform.position = new Vector3(3, 0, 0);
        yield return 666;
    }

    void Start()
    {
        IEnumerator<int> e = HelloWorld();
        while (true)
        {
            if (!e.MoveNext())
            {
                break;
            }
            Debug.Log("yield返回值："+e.Current);
            Debug.Log("物体当前位置："+transform.position);
        }
    }
}
```

HelloWorld函数是一个可重入函数，初次执行它会在第一个`yield`处中断，返回值是一个`IEnumerator`对象，上述程序把它保存在变量`e`中。每次调用`e.MoveNext()`方法会让函数继续执行到下一个`yield`处。执行到最后一个`yield`之后时，函数就彻底执行完毕，`MoveNext()`函数返回false。

每次执行一步时，还可以从变量e中获取到中断时的返回值，即`e.Current`。

## 协程的延时执行原理

对上边的例子做一些改动，引入定时功能：

```c#
using System.Collections.Generic;
using UnityEngine;
public class MyIter : MonoBehaviour
{
    IEnumerator<int> HelloWorld()
    {
        transform.position = new Vector3(1, 0, 0);
        yield return 1;

        transform.position = new Vector3(2, 0, 0);
        yield return 2;

        transform.position = new Vector3(3, 0, 0);
        yield return 1;
    }

    IEnumerator<int> e;
    float helloTime = 0;
    void Start()
    {
        e = HelloWorld();
    }

    void Update()
    {
        if (e != null)
        {
            if (Time.time > helloTime)
            {
                if (!e.MoveNext())
                {
                    // 协程结束了
                    e = null;
                    return;
                }
                Debug.Log("yield返回值："+e.Current);
                // 把返回值当作延迟的时间
                helloTime = Time.time + e.Current;
            }
        }
    }
}
```

Start函数将变量e初始化为HelloWorld迭代器，它是迭代器执行的起始（很像协程启动函数StartCoroutine）。之后每一帧Update执 行时，都要检查当前是否过了helloTime所设定的时间，如果设定的时间已过，则执行一次迭代器函数，并且将中断返回值作为下一次延时的秒数。当迭代器函数彻底结束以后，就将e赋值为空，未来不再执行迭代器函数。实现了“协程”的启动、延时和关闭功能。

有一个不太让人满意的地方是，延时是通过外部计时实现的，而非迭代器函数自身控制延时。接下来将修改至更贴切的模拟延时的方法：

```c#
using System.Collections.Generic;
using UnityEngine;
public class MyIter: MonoBehaviour
{
    IEnumerator<int> HelloWorld()
    {
        // 局部变量的值会被保留
        float helloTime = 0;
        transform.position = new Vector3(1, 0, 0);
        // 延时1秒
        helloTime = Time.time + 1;
        while (Time.time < helloTime)
        {
            yield return 1;
        }

        transform.position = new Vector3(2, 0, 0);
        // 延时2秒
        helloTime = Time.time + 2;
        while (Time.time < helloTime)
        {
            yield return 2;
        }

        transform.position = new Vector3(3, 0, 0);
        helloTime = Time.time + 1;
        while (Time.time < helloTime)
        {
            yield return 3;
        }
    }

    IEnumerator<int> e;
    void Start()
    {
        e = HelloWorld();
    }

    void Update()
    {
        if (e != null)
        {
            if (!e.MoveNext())
            {
                Debug.Log("协程结束了");
                // 协程结束了
                e = null;
                return;
            }
            //Debug.Log("e.Current : " + e.Current);
        }
    }
}
```

Update每帧都调用协程函数，而协程 函数自身会用循环控制运行的进度，如果时间不到就立即中断，最终 实现了定时运行的效果。而且，计时用的变量helloTime也定义在协程 之内，充分利用了迭代器保存局部变量的值的特性。

虽然Unity引擎不是开源的，但它的C#代码部分已经被官方公布。可惜的是，实现协程的源代码也只有一部分可以在这个代码仓 库中找到。

## 协程与递归

**如果协程函数在 执行过程中调用其他迭代器函数，应该如何编写？运行顺序是怎样 的？**

直接用C#编写递归迭代器调用比较有难度，但Unity封装的协程已 经很好地解决了这个问题。

下文的例子展示了利用递归输出从10到1的 方法，每两次输出之间停顿0.3秒。

```c#
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CoRecur : MonoBehaviour
{
    void Start()
    {
        StartCoroutine(Loop(10));
    }

    IEnumerator Loop(int n)
    {
        yield return new WaitForSeconds(0.3f);
        Debug.Log("Loop:" + n + " Time:" + Time.time);
        if (n == 1)
        {
            yield break;
        }
        yield return Loop(n - 1);
    }
}

```

调用其他协程函数时，也应当使用yield return语法。只有这样才能让内层、外层函数的中断逻辑联系起来， 也才能让被调用函数的延时方法也生效。

下文展示了两个函数互相进行递归调用，从1输出到10的例子

```c#
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
public class CoRecur : MonoBehaviour
{
    void Start()
    {
        StartCoroutine(LoopA(10));
    }

    IEnumerator LoopA(int n)
    {
        Debug.Log("LoopA, n: " + n);
        if (n == 0)
        {
            yield break;
        }
        yield return LoopB(n - 1);
        yield return new WaitForSeconds(0.3f);
        Debug.Log("LoopA:" + n + " Time:" + Time.time);
    }

    IEnumerator LoopB(int n)
    {
        Debug.Log("LoopB, n: " + n);
        if (n == 0)
        {
            yield break;
        }
        yield return LoopA(n - 1);
        yield return new WaitForSeconds(0.3f);
        Debug.Log("LoopB:" + n + " Time:" + Time.time);
    }
}
```

递归是从10到1，但输出Log则是从1到10。