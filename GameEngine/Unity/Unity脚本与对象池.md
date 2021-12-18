# Unity脚本与对象池

对象池技术是一种朴素的优化技巧，专门用于优化场景中大量物体频繁创建和销毁时的性能问题。

## 为什么要使用对象池

**在很多类型的游戏中都会创建和销毁大量同样类型的物体。**例如，飞行射击游戏中有大量子弹，某些动作游戏中有大量敌人，还有游戏中反复出现和消失的粒子特效等。

而创建和销毁物体本身属于比较消耗资源的操作，**创建时不仅需要引擎的处理**，而且还会**分配大量内存**，这些**内存在物体销毁时还需要回收**，这给虚拟机带来了**垃圾回收的压力**。

也就是说，场景中的物体数量较多不一定是对性能影响最大的因素。**影响最大的因素**有可能是**一段时间内有太多物体创建和销毁**。例如，在飞行射击类游戏中，每秒有许多子弹创建，稍后又有同样多的 子弹因击中敌人或距离过远而销毁。而无论多么简单的物体，在其创建和销毁的过程中都会消耗一定的资源。对象池优化所针对的正是这 一类问题。

对象池技术的思想非常简单。例如，某种物体需要大量创建和销毁，那么就**事先把它创建完成**，放在玩家看不到的地方或**隐藏起来**。 在需要创建的时候，直接从事先创建的物体中**取出即可**，而**销毁的时候也不会真的销毁，只是放回了原处**。这种**统一管理大量物体的“池子”**，就叫**对象池**。



## 简易对象池实例

先思考最简单的情况：一个对象池只管理同一种物体（如同一种 子弹或同一种粒子）。对象池作为一个脚本组件，挂在场景中的一个 空物体上以便编辑。而“池子”中的多个物体可以作为它的子物体， 方便管理。

对象池中的大量物体，如果用一个容器管理，则用C#的队列 （Queue）最合适。

```c#
using System.Collections.Generic;
using UnityEngine;
// 只存放一种类型物体的简单对象池
public class SimplePool : MonoBehaviour
{
    // 私有字段加SerializeField，可以在编辑器中编辑，但其他脚本不可访问
    [SerializeField]
    private GameObject _prefab;

    // 队列，与List类似的容器，先进先出
    private Queue<GameObject> _pooledInstanceQueue = new Queue<GameObject>();

    // 通过对象池创建物体
    public GameObject Create()
    {
        if ( _pooledInstanceQueue.Count > 0)
        {
            // 如果队列中有，直接取出一个
            GameObject go = _pooledInstanceQueue.Dequeue();
            go.SetActive(true);
            return go;
        }
        // 如果队列空了，就创建一个
        return Instantiate( _prefab);
    }

    // 通过对象池销毁物体
    public void Destroy(GameObject go)
    {
        // 将不再使用的物体放回队列
        _pooledInstanceQueue.Enqueue(go);
        go.SetActive(false);
        // 为方便管理，所有的物体都以对象池为父物体
        go.transform.SetParent(gameObject.transform);
    }
}
```

1. 一开始，队列是空的。
2. 需要创建对象时，调用`Create()`方法。如果队列为空，那么以`_prefab`为模板创建一个物体，并返回给调用者。
3. 如果初始阶段一直创建物体，队列会一直为空，每次都会创建新的物体。这时对象池的功能没有完全发挥出来。
4. 当物体不再使用时，外部也必须调用对象池的`Destroy()`方 法，而不能直接销毁物体。对象池会将这个物体放入队列回收，隐藏 它，并设置它为对象池的子物体。
5. 下一次再用`Create()`方法创建物体时，发现对象池队列长度大于0，因此直接从队列中取出第一个物体返回即可。
6. 之后只要队列不为空，就不需要实际创建物体，对象池的作用就完全发挥出来了。

## 对象池测试方法

### 编写测试脚本

1. 创建一个空物体并命名为pool，挂载之前的对象池脚本SimplePool。

2. 创建一个球体作为子弹，并挂载脚本Bullet。该脚本的用途是让 子弹远离原点移动，超出一定范围则销毁自身。根据是否设置了对象 池pool，决定是否通过对象池销毁。其脚本内容如下：

   ```c#
   using UnityEngine;
   public class Bullet : MonoBehaviour
   {
       // 对象池的引用，创建Bullet 的脚本负责设置它
       public SimplePool pool;
   
       void Update()
       {
           // 每一帧，朝远离原点的方向移动
           Vector3 dir = transform.position - Vector3.zero;
           transform.position += dir.normalized * 5.0f * Time.deltaTime;
           // 离原点一定距离以后就销毁
           if (Vector3.Distance(transform.position, Vector3.zero) >= 17)
           {
               // 如果设置有对象池，则用对象池回收
               if (pool)
               {
                   pool.Destroy(gameObject);
               }
               else
               {
                   // 如果没有pool，就直接销毁
                   Destroy(gameObject);
               }
           }
       }
   }
   ```

3. 将挂载了Bullet脚本的子弹做成预制体。

4. 创建一个空物体并命名为Spawner，用于生成子弹。挂载Spawner 脚本，其内容如下：

   ```c#
   using System.Collections;
   using System.Collections.Generic;
   using UnityEngine;
   public class Spawner : MonoBehaviour
   {
       // 是否使用对象池
       public bool usePool = true;
       // 预制体
       public GameObject prefab;
   
       SimplePool pool;
       private void Start()
       {
           pool = GameObject.Find("Pool").GetComponent<SimplePool>();
       }
       void Update()
       {
           if (Input.GetButtonDown("Jump"))
           {
               for (int i=0; i<1000; i++) // 每次创建1000个子弹
               {
                   GameObject go;
                   if (usePool)
                   {
                       // 通过对象池创建
                       go = pool.Create();
                       // 对Bullet脚本组件设置pool，用于销毁
                       go.GetComponent<Bullet>().pool = pool;
                   }
                   else
                   {
                       // 通过对象池创建
                       go = Instantiate(prefab);
                       // 不通过对象池销毁，也需要设置
                       go.GetComponent<Bullet>().pool = null;
                   }
                   go.transform.position = Random.onUnitSphere * 5;
                   go.transform.parent = transform;
               }
           }
       }
   }
   ```

5. 确认Spawner脚本和对象池脚本都设置了子弹预制体，创建物体时会用到。

### 测试方法

以上脚本可以切换是否使用对象池，主开关在Spawner脚本上。 Spawner脚本有一个Use Pool选项，代表是否启用对象池，如图13-1所 示。如果启用，则在子弹的创建和回收时都通过对象池进行；如果不 启用，则使用常规的创建和销毁方法。

运行游戏，按下空格键，就可以创建大量物体了。

Game窗口的右上方有一个Stats（统计）按钮，单击它可以打开一 个性能统计界面，从而可以看到游戏帧率等统计信息。从统计信息中 可以大致看出游戏运行时的性能表现，但对于分析对象池效果来说这 些信息过于简单，不足以体现优化前后的效果。

## 性能分析器

选择主菜单中的Window→Analysis→Profiler即可打开Profiler 窗口。

Profiler的主体有很多个曲线图区域，可以向下滚动。它包含了 CPU、渲染、内存、音频、视频、物理、2D物理、网络消息、网络操 作、UI、UI细节和全局光照12个大类。

与对象池优化 密切相关的主要是Memory（内存）区域和CPU Usage（CPU使用率）区域。

单击Profiler界面左侧的小图标，则会在显示/隐藏之间切换。这 里为了简单清晰起见，关闭内存图表中除GC Alloc（垃圾回收的分 配）以外的所有Tag，以及CPU Usage表中除Garbage Collector（垃圾收集器）以外的Tag。

接下来可以在打开Profiler窗口时运行游戏，在游戏稳定运行后按空格键创建大量物体。

首先，关闭对象池功能，按1~2次空格键，待子弹消失后再按1~2 次空格键。这个步骤多重复几次，就能得到不使用对象池时反复创建 和销毁大量物体的性能数据，得到数据后暂停游戏即可。

在测试时会明显发现，不使用对象池，CPU的垃圾收集器在某些时 刻会有一个非常明显的峰值，该峰值占用了6毫秒以上的时间（具体数 值与硬件环境有关），从而对性能造成了显著影响。而开启对象池机 制以后，这个尖峰几乎消失了。

可以进一步观察内存数据，定量分析内存的分配。找到内存表中 GC Allocations Per Frame的峰值，可以单击图表查看详细数据。注 意，由于第1次物体的创建并不会被对象池优化，因此重点放在第2次 弹幕发射之后的内存变化上。

多次测试可以得到比较准确的数据。

关闭对象池，每次生成1000个子弹。在游戏稳定后，每次生成子 弹时出现一次内存分配的峰值，总的分配量在170KB左右。

开启对象池，每次生成1000个子弹。在游戏稳定后，每次生成子 弹时出现一个不明显的峰值，总的分配量在50KB左右。

从中可以看出，使用对象池能极大缓解创建物体时所造成的大量 内存分配或回收的情况。但由于物体本身的渲染和脚本依然存在，计 算和渲染的压力依然也存在，因此使用对象池并非是一劳永逸的优化 方法，开发者还是要根据实际情况，组合使用各种各样的优化技巧。

## 支持多种物体的对象池

### 思路和数据结构

在简单的对象池中，用一个队列作为池子就够用了。在这里由于 有更多类型的物体，因此用一个字典管理多个队列，每个队列保存一 类物体，即字典嵌套队列。

```c#
Dictionary<int, Queue<GameObject>> m _ Pool;
```

字典的键代表着一类物体，这里可以用一个小技巧——通过`gameObject.GetInstanceID`获取一个物体的数字ID。

**物体的ID**

如果查看各种类型的继承关系，会发现脚本的MonoBehavior类 继承自组件类Component，而无论是组件还是游戏物体，最终都继承 自物体类Object。（这里指的是`UnityEngine.Object`，而不是C#类型`System.Object`。）

也就是说，Unity中的大部分对象都是`UnityEngine.Object`，而 每个Object都有一个整数ID，可以通过`GetInstanceID`获得它。

每个正在使用中的物体ID都是唯一的，但销毁物体后ID就失效 了，失效的ID可能会被新创建的物体使用。在本例中可以放心使用 预制体的ID，因为预制体本身是不会销毁的，不存在ID重复的问题。

将对象池类命名为ObjPool，它的数据结构定义如下：

```c#
public class ObjPool : MonoBehaviour
{
    private Dictionary<int, Queue<GameObject>> m _ Pool = new Dictionary<int, Queue<GameObject>>();
    private Dictionary<GameObject, int> m _ OutObjs = new Dictionary<GameObject, int>();
}
```

可以看到，除了对象池本身用字典管理外，还需要一个“离开对象池的物体”——`m_OutObjs`容器，专门用来记录离开的物体。也就是 说，保存在池子中的物体都在`m_Pool`容器中，而离开对象池的物体要 从`m_Pool`包含的队列中删除，并在`m_OutObjs`容器中做好记录，以便归还时使用。

`m_OutObjs`字典直接采用游戏物体对象作为键。将游戏物体对象作为键实际上是把游戏物体的引用（或理解为地址）作为键，它和物体ID是类似的，正在使用中的物体地址不会重复。

### 具体实现

首先是创建物体的思路，它是对象池的主要逻辑。

1. 创建物体时，提供参数prefab。首先把prefab转化为物体种 类ID，特别地，如果`m_Pool`中没有这个ID的键，就需要添加一个全新 的类型（在字典中添加元素，键为这个ID，值为新的队列）。
2. 如果同类物体有现成的，就取出一个。
3. 如果同类物体没有现成的，就直接用预制体创建一个新的物体。
4. 在将物体返回之前，要注意在`m_OutObjs`中做好记录。

其次是销毁物体的思路。

1. 一定要先判断销毁的物体是否存在于`m_OutObjs`字典中，如 果不存在，就表示这个物体不是从对象池里取出去的，应该报告一个错误或警告。
2. 把物体从`m_OutObjs`中删除，添加到`m_Pool`中。

```c#
using System.Collections.Generic;
using UnityEngine;
public class ObjPool : MonoBehaviour
{
    // 物体的池子，用字典表示。键为种类ID，值是同类物体的队列
    // 以预制体的ID作为每个种类的标识ID
    private Dictionary<int, Queue<GameObject>> m_Pool = new Dictionary<int, Queue<GameObject>>();
    // 记录所有离开对象池的物体。键是物体引用，值是种类ID
    // 离开对象池的物体会从m_Pool中离开，但是要记录在m_OutObjs字典里
    private Dictionary<GameObject, int> m_OutObjs = new Dictionary<GameObject, int>();
    // 创建物体，预制体由调用者自备
    public GameObject Create(GameObject prefab)
    {
        // 以预制体的物体ID，作为该类型物体的ID
        int id = prefab.GetInstanceID();
        // 尝试从对象池中获取这个物体
        GameObject go = _GetFromPool(id);
        if (go == null)
        {
            // 取不到物体，就根据预制体创建物体
            go = Instantiate<GameObject>(prefab);
            // 如果初次遇到这类物体，需要新添加一个类型
            if (!m_Pool.ContainsKey(id))
            {
                m_Pool.Add(id, new Queue<GameObject>());
            }
        }

        // 标记新创建的物体离开了对象池
        m_OutObjs.Add(go, id);
        return go;
    }

    // 销毁（回收）物体
    public void Destroy(GameObject go)
    {
        // 判断该物体是不是通过对象池创建
        if (!m_OutObjs.ContainsKey(go))
        {
            Debug.LogWarning(" 回收的物体并不是对象池创建的！" + go);
            return;
        }

        // 该物体属于哪个种类
        int id = m_OutObjs[go];

        go.transform.parent = transform;
        go.SetActive(false);

        // 加入队列，并且去掉离开的标记
        m_Pool[id].Enqueue(go);
        m_OutObjs.Remove(go);
    }

    // 私有函数，从对象池中根据类型ID取出物体。如果类型不存在或者物体暂时用完了，返回null
    private GameObject _GetFromPool(int id)
    {
        if (!m_Pool.ContainsKey(id) || m_Pool[id].Count == 0)
        {
            return null;
        }
        GameObject obj = m_Pool[id].Dequeue();
        obj.SetActive(true);
        return obj;
    }
}
```

此对象池满足了管理多种物体的需要，且具有以下两种实用化功能。 

1. 有时对象池的使用者可能忘记通过对象池销毁物体，可以通过调试查看`m_OutObjs`的内容，分析有哪些物体没有归还给对象池。

2. 如果一个物体不是通过对象池创建的，但又通过对象池销毁，则会输出警告信息。

