---
title: Unity用户输入管理
date: 2020-04-22 21:41:00
tag: Unity
---

虚拟轴、获取键盘事件、获取鼠标事件、移动设备输入

<!--more-->

# 一、虚拟轴

使用API：**Input.GetAxis()**，参数：轴的名称

根据当前输入实时变更，所以使用的时候应该去持续获得更新的值，否则得到的结果是不准确的

使用范围：较多应用在对角色的控制上

## 例子

我们可以在菜单栏|Edit|Project Settings...|Input Manager里查看有关玩家输入的设置

![image-20200423165430439](image-20200423165430439.png)

新建一个Test.cs，将其作为组件添加到一个物体上比如一个Capsule。，编辑Test.cs如下：

```c#
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Test : MonoBehaviour
{
    // Update is called once per frame
    void Update()
    {
        float horizontal = Input.GetAxis("Horizontal");
        float vertical = Input.GetAxis("Vertical");
        if(horizontal != 0)
        {
            transform.position = new Vector3(transform.position.x + (horizontal * 0.1f),
                transform.position.y,
                transform.position.z);
        }
        if (vertical != 0)
        {
            transform.position = new Vector3(transform.position.x,
                transform.position.y,
                transform.position.z + (vertical * 0.1f));
        }
    }
}
```

播放游戏，我们可以通过按键盘的上下左右方向键或WASD控制Capsule的前后左右平移。

要控制Capsule的转向，我们还可以**修改Test.cs的Update方法**如下：

```c#
void Update()
    {
        float horizontal = Input.GetAxis("Horizontal");
        float vertical = Input.GetAxis("Vertical");
        if(horizontal != 0)
        {
            //transform.position = new Vector3(transform.position.x + (horizontal * 0.1f),
            //    transform.position.y,
            //    transform.position.z);
            transform.eulerAngles = new Vector3(transform.eulerAngles.x,
                transform.eulerAngles.y + horizontal,
                transform.eulerAngles.z);

        }
        if (vertical != 0)
        {
            transform.position = new Vector3(transform.position.x,
                transform.position.y,
                transform.position.z + (vertical * 0.1f));

        }
    }
```

播放游戏，我们可以通过左右方向键或AD键控制Capsule的水平转向。

# 二、获取键盘事件

使用API：

**Input.GetKey**，某个键是否被持续按下；

**Input.GetKeyDown**，某个键是否被按下；

**Input.GetKeyUp**，某个键是否被弹起。

可以传递小写的键的名称作为参数，也可以传递一个**KeyCode**的值，返回值属于布尔类型。

使用范围：

需要根据玩家按下键盘上某个键才能触发的事件上，比如说技能释放，需要等待用户按下技能键的时候进行释放，由或者说按下ESC键呼出系统菜单等。



## 例子

编辑Test.cs如下：

```c#
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Test : MonoBehaviour
{
    // Update is called once per frame
    void Update()
    {
        if (Input.GetKey(KeyCode.A))//或者Input.GetKey("a")
        {
            Debug.Log("A键被按下了");
        }
        if (Input.GetKeyDown(KeyCode.Q))//或者Input.GetKeyDown("q")
        {
            Debug.Log("Q键被按下了");
        }
        if (Input.GetKeyUp(KeyCode.W))//或者Input.GetKeyUp("w")
        {
            Debug.Log("W键被放开了");
        }
    }
}
```

播放游戏，当我们按A键时，每一帧控制台都会识别A键被按下然后打印信息，按住A键则控制台持续打印消息；当我们按下Q键时，只在按下的那一帧识别并只打印一次消息，即按一次打印一次。按住W键，只有在松开时控制台才打印消息。



# 三、获取鼠标事件

使用的API：

**Input.GetMouseButtonDown**，当按键按下；

**Input.GetMouseButtonUp**，当按键抬起；

**Input.GetMouseButton**，当按键被持续按下。

参数：0代表左键，1代表右键，2代表中键

鼠标位置获取：**Input.mousePosition**

适用范围：鼠标事件使用范围较广，比如左键点击地面，让角色移动过去，右键敌人发动攻击等。



## 例子

编辑Test.cs如下：

```c#
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Test : MonoBehaviour
{
    // Update is called once per frame
    void Update()
    {
        GameObject Capsule = GameObject.Find("Capsule");
        if (Input.GetMouseButtonDown(0))
        {
            Capsule.transform.localScale = new Vector3(2, 2, 2);
        }
        if (Input.GetMouseButtonUp(1))
        {
            Capsule.transform.localScale = new Vector3(1, 1, 1);
        }
        if (Input.GetMouseButton(2))
        {
            Capsule.transform.localScale += new Vector3(0.5f, 0.5f, 0.5f);
        }
    }
}
```

播放游戏，当我们按下鼠标左键时，Capsule体积变为为2倍，当我们按住鼠标右键，松开时Capsule体积变为的1倍，当我们按住鼠标中键时，Capsule的体积持续放大。

我们将Capsule删掉，在将场景视图变为2D，在场景中新建一个Image，Test.cs添加到Main Camera上，编辑Test.cs如下：

```c#
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Test : MonoBehaviour
{
    bool isDown = false; 
    // Update is called once per frame
    void Update()
    {      
        if (Input.GetMouseButtonDown(0))
        {
            isDown = true;   
        }
        if (Input.GetMouseButtonUp(0))
        {
            isDown = false;
        }
        if (isDown)
        {
            GameObject image = GameObject.Find("Image");
            image.transform.position = Input.mousePosition;
        }
    }
}
```

播放游戏，当鼠标按住左键，Image会跳变到鼠标所在位置，移动鼠标，Image跟随移动，松开鼠标左键，Image停止跟随。



# 四、移动设备输入

使用的API：

Input.touchCount，最后一帧有多少根手指触碰到了，不同设备能追踪到的数量不同，iPhone一般最多支持五根手指。

Input.touches存储每根手指状态的数组，可以通过索引来访问每根手指的一些信息。常用信息有：

fingerid：触碰的唯一索引

position：这根手指当前所在的屏幕位置

deltaPosition：自上一帧以来，这根手指屏幕位置变化



## 例子

编辑Test.cs如下：

```c#
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class Test : MonoBehaviour
{
    Text text;
    void Start()
    {
        text = GameObject.Find("Text").GetComponent<Text>();
    }
    // Update is called once per frame
    void Update()
    {
        if(Input.touchCount > 1)
        {
            text.text = "当前有：" + Input.touchCount
            + "根手指触碰" + Input.touches[0].fingerId
            + "当前手指所在的位置是：" + Input.touches[0].position
            + "上一帧到当前帧的变化" + Input.touches[0].deltaPosition;
        } 
    }
}
```

打包成apk，