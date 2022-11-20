# MonoBehaviour类
date: 2020/06/25 12:23:00

[TOC]

所有的Unity组件都是MonoBehaviour的子类。脚本里自定义的类如果继承MonoBehaviour则可以通过组件的方式挂载到物体上，且这个类不能直接用new关键字生成一个对象。

## Awake方法

Awake方法是一个初始化方法。

- 当脚本实例被载入时被调用，在所有对象被初始化之后调用。
- （播放游戏时加载场景中的物体，物体上的脚本组件会被实例化，场景初始化时先加载完物体再给物体加载组件。因此如果执行到Awake，说明场景中所有物体均加载完。）
- 场景初始化时，每个GameObject上的Awake以随机的顺序被调用。
- 游戏中，脚本组件加载时调用。
- 最先被调用。（和其他方法相比）
- 在整个脚本生命周期里只被调用一次。
- 即使脚本没有enable也可以执行。
- 最适合用于初始化当前不依赖其他物体的的物体的属性或变量
- 如果要初始化的物体的属性依赖于其他物体的属性或变量，则将这个物体的属性初始化写到Start方法里。因为Start方法在所有的Awake方法执行完后才被调用。

### 例子

```c# Test.cs
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Test : MonoBehaviour
{
    private void Awake()
    {
        Debug.Log("Test Awake is loading ... ");
        //添加MyTest组件
        var c = gameObject.AddComponent<MyTest>();
        Debug.Log("Test Awake is finished !");
    }

    void Start()
    {
        Debug.Log("Start Method is called !");
    }

    void Update()
    {
        if (Input.GetKeyDown(KeyCode.Q))
        {
            MyAddComponent();
        }
    }
    void MyAddComponent()
    {	//按下Q键添加MyTest2组件
        var c = gameObject.AddComponent<MyTest2>();
    }
}
public class MyTest : MonoBehaviour
{
    private void Awake()
    {
        Debug.Log("MyTest Awakes !!!");
    }
}
public class MyTest2 : MonoBehaviour
{
    private void Awake()
    {
        Debug.Log("2333");
    }
}
```

![image-20200712210028284](MonoBehaviour类/image-20200712210028284.png)

## Start方法

- 在Awake方法，OnEnable方法，OnApplicationPause方法，OnApplicationFocus方法执行完后被调用。（仅在Update方法第一次被调用前调用，即开始渲染前执行。）
- 可以通过Start方法按需延迟初始化代码，因为Awake总在Start之前执行。
- 在一个脚本周期里只执行一次。（在Behaviour的生命周期里只被调用一次。）
- 只有在脚本enable时才执行。
- 最适合用于初始化当前需要依赖其他物体的物体的属性/变量

在物体被实例化和初始化后，首先执行Awake方法，然后如果物体时enable的，立刻执行OnEnable方法，然后依次执行OnApplicationPause方法，OnApplicationFocus方法。

OnApplicationFocus方法执行完后，游戏第一个渲染帧创建，此时执行Start方法。

## 例子

在一个场景里创建一个空物体，然后挂上这个脚本Test.cs，然后播放游戏。

接着不勾选Test (Script)组件播放游戏，然后再在播放中勾选Test (Script)组件，再取消勾选，再勾选。

```c# Test.cs
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Test : MonoBehaviour
{
    private void Awake()
    {
        Debug.Log("Awake Method is called !");
    }
    private void OnApplicationFocus(bool focus)
    {
        Debug.Log("OnApplicationFocus Method is called ! " + focus);
    }
    private void OnApplicationPause(bool pause)
    {
        Debug.Log("OnApplicationPause Method is called ! " + pause);
    }
    private void OnEnable()
    {
        Debug.Log("OnEnable Method is called !");
    }
    private void OnDisable()
    {
        Debug.Log("OnDisable Method is called !");
    }
    void Start()
    {
        Debug.Log("Start Method is called !");
    }
}

```

![image-20200709222106738](MonoBehaviour类/image-20200709222106738.png)

![image-20200709223152382](MonoBehaviour类/image-20200709223152382.png)



在场景的第一帧创建后执行刷新和循环渲染。

Awake方法和Start方法是用于初始化的方法。它们在第一帧确定了物体的初始状态，而更新（update）方法用于在接下来的连续不断的帧里更新状态。更新方法只在脚本enable条件下执行。

## OnEnable方法、OnDisable方法

- 在Awake方法执行完后立即被调用
- 还会在脚本每一次被enable时被调用
- 最适合用于在脚本在任何时候被enable时，重置物体的属性/变量，或者执行一些代码语句。



OnEnable方法用于在物体变为被激活（enable）和脚本有效时（active）被调用。

OnDisable方法在运行状况变为Disabled时。

OnDisable方法在物体被销毁时被调用，因此可以用于清理功能代码。

当脚本在编译完成时重载，这时OnDisable方法被调用，随后是载入完成的OnEnable方法。

下边是OnDisable和OnEnable方法的应用

```c# PrintOnOff.cs
using UnityEngine;

[ExecuteInEditMode]
public class PrintOnOff : MonoBehaviour
{
    void OnDisable()
    {
        Debug.Log("PrintOnDisable: script was disabled");
    }
    
    void OnEnable()
    {
        Debug.Log("PrintOnEnable: script was enabled");
    }
    
    void Update()
    {
#if UNITY_EDITOR
        Debug.Log("Editor causes this Update");
#endif
    }
}
```

将PrintOnOff.cs拖到场景中某个物体上，播放游戏。

控制台首先打印

```
 PrintOnDisable: script was enabled
```

然后持续打印

```
 Editor causes this Update
```

当我们在Heirarchy里取消勾选该物体时，控制台先停止打印**“  Editor causes this Update ”**，再打印

```
PrintOnDisable: script was disabled
```

当我们勾选该物体时，控制台打印

```
 PrintOnDisable: script was enabled
 Editor causes this Update
 Editor causes this Update
 ...
```

当我们在物体里仅取消勾选或勾选Print On Off (Script)组件时，效果同上。

**注意：OnEnable、OnDisable均不可以作为协程**

## OnApplicationPause方法



## OnApplicationFocus方法



## OnApplicationQuit方法



## Update方法

- 连续帧每帧执行一次，依赖游戏帧率（从计算到渲染算一帧）
- 帧率单位为FPS（Frames Per Second，帧每秒）
- 如果游戏运行帧率为30FPS，则Update方法每秒被调用30次
- 如果游戏运行帧率为60FPS，则Update方法每秒被调用60次
- 如果游戏运行帧率为100FPS，则Update方法每秒被调用100次
- 最适合用于有规律的更新比如：移动不具物理效果的物体，简单计时器，接收用户输入等。
- 更新间隔时间会变化。

## FixUpdate方法

- 经过固定时间（固定帧数）后调用（默认0.02秒）
- 怎么修改设置？Edit|Project Setting|Time|Fixed Time Step
- 最适合用于有规律的更新比如：调节带物理效果的对象（如Rigidbody）。（比如给物体施加力让它运动，或用转矩转动某个物体）

## LateUpdate方法

- 在每一次Update方法执行完后调用一次
- 最适用于追踪当前物体（game object）或其他物体的刷新（update）

## Update方法、FixedUpdate方法

- Update方法处理渲染帧（Render Frames），FixedUpdate方法处理物理帧（Physics Frames）。

- Update方法以帧率速度运行（FPS），FixedUpdate方法按固定频率运行。
- Update方法属于物理插值，FixedUpdate方法默认频率为50Hz。
- Update方法使用Time.deltaTime，FixedUpdate方法使用Time.fixedDeltaTime。

## DeltaTime



## FixDeltaTime

