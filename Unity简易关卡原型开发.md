---
title: Unity简易关卡原型开发
date: 2020-02-07 17:03:06
update: 2020-2-13 15:50:05
tags: Unity
---

- 编写鼠标交互脚本
- 使用NavMesh组件实现角色移动

...

<!--more-->

Unity版本：Unity 2018.4.13c1

# 一、准备工作

在一个新建的场景下新建一个Cube，调成Cube的大小，使之成为一个扁平面（Scale参考值：x=50，y=0.36，z=50），重命名为“Floor”，重置Floor的位置到（0，0，0）。

在Floor上方新建一个Capsule,调整大小致合适。

在Floor上方新建一个Cube,调整大小致门板的样子，重命名为“Door”

在场景里新建一个空Object，命名为“MouseManager”。

在项目面板的Assets文件夹下新建一个Materials文件夹，在其中新建一个材质，取名为Gray。将Gray的Inspector面板的MainMaps下把颜色设置成灰色。拖拽Gray致Floor上。

调整角度到可以同时看到Door、Capsule、Floor和环境的合适位置后，选中Main Camera，使用快捷键【Ctrl + Shift + F】将摄像机快速调整到满足当前观察视角的位置。

完成后如下图：

![image-20200207172113295](image-20200207172113295.png)

在Assets文件夹下新建一个名叫“Cursors”的文件夹，导入png图片素材如下图：

![image-20200207172929532](image-20200207172929532.png)

# 二、编写鼠标交互脚本

在项目面板的Assets文件夹下新建一个名叫“Scripts”的文件夹，在其中新建一个C#脚本文件，取名为MouseManager

打开MouseManager.cs，编写代码并确定无错误后保存如下：

```c#
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class MouseManager : MonoBehaviour
{
    //which objects are clickable
    public LayerMask clickableLayer;
    
    //Swap cursors per object
    public Texture2D pointer;//Normal Pointer
    public Texture2D target;//Cursors for clickable objects like world
    public Texture2D doorway;//Cursors for doorways
    public Texture2D combat;//Cursors for combat sections

    // Update is called once per frame
    void Update()
    {
        RaycastHit hit;
        if(Physics.Raycast(Camera.main.ScreenPointToRay(Input.mousePosition), out hit, 50, clickableLayer.value))
        {
            bool door = false;
            if(hit.collider.gameObject.tag == "Doorway")
            {
                Cursor.SetCursor(doorway, new Vector2(16, 16), CursorMode.Auto);
                door = true;                
            }
            else
            {
                Cursor.SetCursor(target, new Vector2(16, 16), CursorMode.Auto);                
            }
        }
        else
        {
            Cursor.SetCursor(pointer, Vector2.zero, CursorMode.Auto);
        }
    }
}
```

回到Unity编辑器，选中MouseManager，在Inspector面板点击【Add Component】按钮，搜索到MouseManager后单击添加。

把Cursors文件夹下的png素材拖拽到Mouse Manager组件如下图：

![image-20200207174110820](image-20200207174110820.png)

点击Inspector面板上方的Layers下拉按钮，点击Edit Layers

![image-20200207174357668](image-20200207174357668.png)

点开Layers，在User Layers 9填写”Clickable“

![image-20200207174606366](image-20200207174606366.png)

在Hierachy面板选中MouseManager，在Inspector面板的MouseManager组件下的Clickable Layer选项点击下拉，把默认的Nothing改选成Clickable

![image-20200207174838667](image-20200207174838667.png)

点击播放按钮验证效果。当鼠标移动到Floor上时，鼠标样式为target，当鼠标移动到Door上时，鼠标样式为doorway，当鼠标移动到周围环境时，鼠标样式为pointer。

# 三、使用MavMesh组件实现鼠标点击移动

接上一篇鼠标交互

将路径Unity Fundamentals Source Assets\NaMeshComponents-Master下的两个文件夹Gizmos和NavMeshComponents拖拽复制到Unity编辑器项目面板Assets文件夹下。

在Hierachy面板新建一个空Object命名为"NavMesh Surface"，点击NavMesh Surface，在Inspector面板点击Add Component，选择NavMeshSurface。

点击Inspector面板上方的Layers下拉按钮，选择Edit Layers，在User Layer 10填上Player。

点击Cupsule，在Inspector面板将Layer设置为Player。

回到NavMeshSurface的Inspector面板，在NavMeshSurface组件下方，Agent Type默认Humanoid，Include Layers取消勾选Player

点击Bake按钮创建一层附在Floor上的蓝色NavMesh表面

![image-20200209104045071](image-20200209104045071.png)

在Door的Inspector面板添加NavMeshObstacle组件，默认Carve勾选。产生的效果是Capsule无法通过Door，即视Door为一个障碍。

添加NavMeshModifier组件，取消勾选Ingnore From Build。

回到NavMesh Surface的Inspector面板，再次点击Bake。

如果此时向上平移Door，原本Door下方的黑色矩形将消失，视为“门开启”，Capsule可以通过。

选中Capsule，添加组件NavMeshAgent，Agent Type默认Humanoid。

在项目面板Scripts文件夹下新建一个C#脚本文件，取名“PlayerController”。

打开脚本文件，编写代码如下，确认无报错后保存。

```c#
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.AI;

public class PlayerController : MonoBehaviour
{
    //private Animator anim;
    private NavMeshAgent agent;
    // Use this for initializtion
    void Awake() {
      //  anim = GetComponent<Animator>();
      agent = GetComponent<NavMeshAgent>();
    }
}
```

打开之前写的MouseManager.cs，修改代码如下：

```c#
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Events;

public class MouseManager : MonoBehaviour
{
    //what objects are clickable
    public LayerMask clickableLayer;
    
    //Swap cursers per object
    public Texture2D pointer;//Normal Pointer
    public Texture2D target;//Cursers for clickable objects like world
    public Texture2D doorway;//Cursers for doorways
    public Texture2D combat;//Cursers for combat sections
    public EventVector3 OnclickEnviroment; 

    // Update is called once per frame
    void Update()
    {
        RaycastHit hit;
        if(Physics.Raycast(Camera.main.ScreenPointToRay(Input.mousePosition), out hit, 50, clickableLayer.value))
        {
            bool door = false;
            if(hit.collider.gameObject.tag == "Doorway")
            {
                Cursor.SetCursor(doorway, new Vector2(16, 16), CursorMode.Auto);
                door = true;                
            }
            else
            {
                Cursor.SetCursor(target, new Vector2(16, 16), CursorMode.Auto);                
            }
            if(Input.GetMouseButton(0))
            {
                OnclickEnviroment.Invoke(hit.point);
            }
        }
        else
        {
            Cursor.SetCursor(pointer, Vector2.zero, CursorMode.Auto);
        }
    }
}

[System.Serializable]
public class EventVector3 : UnityEvent<Vector3>{ }
```

回到Unity编辑器，MouseManager的Inpspector面板的MouseManager组件多出了Onclick Enviroment(Vector3)。

从Hierarchy面板拖拽Capsule到None(Object)，点击No function下拉框，勾选NavMeshAgent下的destination。

![image-20200209165155270](image-20200209165155270.png)

点击播放后，鼠标单击Floor上任意位置，Capsule移动跟随。

在Capsule的Inspector面板的NavMeshAgent组件下的Steering部分可以修改移动速度(Speed)、角速度(Angular Speed)、加速度(Acceleration)、制动距离(Stopping Distance)、自动刹车(Auto Braking)。

![image-20200209170725519](image-20200209170725519.png)

# 四、玩家互动行为实现

修改MouseManager.cs如下：

```c#
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Events;

public class MouseManager : MonoBehaviour
{
    //what objects are clickable
    public LayerMask clickableLayer;
    
    //Swap cursers per object
    public Texture2D pointer;//Normal Pointer
    public Texture2D target;//Cursers for clickable objects like world
    public Texture2D doorway;//Cursers for doorways
    public Texture2D combat;//Cursers for combat sections
    public EventVector3 OnclickEnviroment;

    // Update is called once per frame
    void Update()
    {
        RaycastHit hit;
        if(Physics.Raycast(Camera.main.ScreenPointToRay(Input.mousePosition), out hit, 50, clickableLayer.value))
        {
            bool door = false;
            bool item = false;
            if(hit.collider.gameObject.tag == "Doorway")
            {
                Cursor.SetCursor(doorway, new Vector2(16, 16), CursorMode.Auto);
                door = true;                
            }
            else if(hit.collider.gameObject.tag == "Item")
            {
                Cursor.SetCursor(combat, new Vector2(16, 16), CursorMode.Auto);
                item = true;
            }
            else
            {
                Cursor.SetCursor(target, new Vector2(16, 16), CursorMode.Auto);                
            }
            if(Input.GetMouseButton(0))
            {
                if(door)
                {
                    Transform doorway = hit.collider.gameObject.transform;
                    OnclickEnviroment.Invoke(doorway.position);
                    Debug.Log("DOOR");
                }
                else if(item)
                {
                    Transform itemPos = hit.collider.gameObject.transform;
                    OnclickEnviroment.Invoke(itemPos.position);
                    Debug.Log("ITEM");
                }
                else
                {
                    OnclickEnviroment.Invoke(hit.point);   
                }
                
            }
        }
        else
        {
            Cursor.SetCursor(pointer, Vector2.zero, CursorMode.Auto);
        }
    }
}

[System.Serializable]
public class EventVector3 : UnityEvent<Vector3>{ }
```

回到Unity编辑器，在Floor上新建一个Cube。

将其Layer设置成Clickable，点击Untagged按钮，选择Add Tag，点击加号按钮，填写“Item”，保存。

![image-20200209185228053](image-20200209185228053.png)

点击播放，当鼠标点击Door后，Unity编辑器控制台打印消息“DOOR”，当鼠标点击Cube后，控制台打印消息消息“ITEM”。

![image-20200209190218401](image-20200209190218401.png)

# 五、NPC原型设计

在Scripts文件夹下新建两个C#脚本文件，分别命名为“NPCController.cs”，“PlayerController.cs”。

NPCController.cs代码如下：

```c#
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.AI;

public class NPCController : MonoBehaviour
{
    public float patrolTime = 10f;
    public float aggroRange = 10f;
    public Transform[] waypoints;

    private int index;
    private float speed, agentSpeed;
    private Transform player;

    private Animator anim;
    private NavMeshAgent agent;

    private void Awake() {
        anim= GetComponent<Animator>();
        agent =GetComponent<NavMeshAgent>();
        if(agent != null) { agentSpeed = agent.speed; }
        player = GameObject.FindGameObjectWithTag("Player").transform;
        index = Random.Range(0, waypoints.Length);

        InvokeRepeating("Tick", 0 , 0.5f);

        if(waypoints.Length > 0)
        {
            InvokeRepeating("Patrol", 0, patrolTime);
        }
    }
    void Patrol()
    {
        index= index == waypoints.Length - 1 ? 0 : index + 1;  
    }
    void Tick()
    {
        agent.destination = waypoints[index].position;
    }
}


```

PlayerController.cs代码如下：

```c#
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.AI;

public class PlayerController : MonoBehaviour
{
    //private Animator anim;
    private NavMeshAgent agent;
    // Use this for initializtion
    void Awake() {
      //  anim = GetComponent<Animator>();
      agent = GetComponent<NavMeshAgent>();
    }
}

```

复制Capsule一个，移到Door旁边，重命名为NPC，原来的Capsule命名为Player。

给NPC添加NPCController组件，PlayerController组件虽然暂时用不上，但可以先添加到Player上。

在Hierarchy面板新建一个空Object Waypoint (1)，在Inspector面板修改图标颜色，操作如下图。

![image-20200213125222589](image-20200213125222589.png)

复制Waypoint (1)，粘贴自动生成一个Waypoint (2)。把两个Waypoint平移到Floor上方便观察的位置。

选中NPC，点击Inspector面板的锁定面板按钮，同时选中Hierarchy面板的Waypoint (1)、Waypoint (2)拖拽到NPC的NPCController组件下的Waypoints

![image-20200213130047903](image-20200213130047903.png)

拖拽Waypoint过来后：

![image-20200213130137382](image-20200213130137382.png)

解除NPC的Inspector面板锁定，保存场景，点击Play播放。

我们发现NPC会先自己移动到Waypoint (1)，过了几秒后自己移动到Waypoint (2)，然后回到Waypoint (1)，循环往复。

# 六、NPC跟踪玩家角色

修改NPCController.cs的Tick函数如下：

```c#
void Tick()
{
    agent.destination = waypoints[index].position;
    agent.speed = agentSpeed / 2;
    if(player != null && Vector2.Distance(transform.position, player.position) < aggroRange)
    {
        agent.destination = player.position;
        agent.speed = agentSpeed;
    }
}
```

保存后回到Unity编辑器，把NPC的NavMeshAgent组件下的Steering>StoppingDistance设为1.5。

保存场景后点击播放按钮，我们发现，当鼠标点击Floor后，Player移动，NPC跟随在后。