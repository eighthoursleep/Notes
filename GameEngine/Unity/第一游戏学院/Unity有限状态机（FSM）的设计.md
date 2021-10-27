# Unity有限状态机（FSM）的设计
date: 2020-08-10 12:13:00

## 一、有限状态机的介绍

**什么是行为？**

现实生活中，比如吃饭、睡觉、打游戏等。在游戏中，角色可以寻路移动、攻击、死亡、复活、跳舞等。

**这些状态的代码应该怎么设计？**

如果以switch语句或if ... else ... 的方式进行编码，判断不同状态，执行不同的指令。

这样做会导致所有状态都写在一个脚本里，维护修改不方便。

所以每个状态都由一个脚本来管理，然后再写一个管理类来负责状态的切换。

**每个状态都有相同的特性**：

- 进入状态
- 状态更新中
- 退出状态

可以写一个基类，提供3个接口，用于给所有状态进行集成，然后实现。

用抽象方法和重写也可以，这样做更方便实际的游戏开发，可以把共同的逻辑先写在基类里，但有点违背FSM的设计初衷，需要开发者灵活选择。

**管理类**：

- 提供FSM初始化接口
- 提供状态切换的接口
- 其他

## 二、各个状态的基类和管理类（例子）

定义状态的脚本：

```c# FSMState.cs
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public enum FSMState
{
    None,//空
    Idle,//闲置
    Move,//走动
    Skill,//施放技能
    Dead,//死亡
    Relive,//复活
}
```

定义基类的脚本：

```c# EntityFSM.cs
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class EntityFSM
{
    public Transform transform;
    public PlayerFSM fsm;//状态机管理类
    //进入状态
    public virtual void Enter()
    {
        AddListener();
    }
    //状态更新中
    public virtual void Update()
    {

    }
    //退出状态
    public virtual void Exit()
    {
        RemoveListener();
    }
    //监听事件
    public virtual void AddListener()
    {

    }
    //移除监听的事件
    public virtual void RemoveListener()
    {

    }
}
```

角色的FSM管理类：

```c# PlayerFSM.cs
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PlayerFSM : MonoBehaviour
{
    Dictionary<FSMState, EntityFSM> playerState = new Dictionary<FSMState, EntityFSM>();
    FSMState currentState = FSMState.None;

    public void Awake()
    {
        Init();
    }

    public void Init()
    {
        //playerState.Add(FSMState.Idle, new PIdle(transform, this));
        playerState[FSMState.Idle] = new PIdle(transform,this);
        playerState[FSMState.Move] = new PMove(transform,this);
        ToNext(FSMState.Idle);
    }
    public void Update()
    {
        if(Input.GetKeyDown(KeyCode.A))
        {
            ToNext(FSMState.Move);
        }
        playerState[currentState].Update();
    }
    public void ToNext(FSMState nextState)
    {
        if (currentState != FSMState.None)
        {
            playerState[currentState].Exit();
        }
        playerState[nextState].Enter();
        currentState = nextState;
    }
}
```

玩家闲置状态：

```c# PIdle.cs
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
public class PIdle : EntityFSM
{
    public PIdle(Transform transform, PlayerFSM fsm)
    {
        this.transform = transform;
        this.fsm = fsm;
    }
    public override void AddListener()
    {
        base.AddListener();
    }
    public override void Enter()
    {
        base.Enter();
    }
    public override void Exit()
    {
        base.Exit();
    }
    public override void RemoveListener()
    {
        
    }
}
```

玩家移动状态：

```c# PMove.cs
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PMove : EntityFSM
{
    public PMove(Transform transform, PlayerFSM fsm)
    {
        this.transform = transform;
        this.fsm = fsm;
    }
    public override void AddListener()
    {
        base.AddListener();
    }

    public override void Enter()
    {
        base.Enter();
        Debug.Log("进入移动状态");
    }

    public override void Exit()
    {
        base.Exit();
        Debug.Log("退出移动状态");
    }

    public override void RemoveListener()
    {
        base.RemoveListener();
    }

    public override void Update()
    {
        base.Update();
    }
}
```