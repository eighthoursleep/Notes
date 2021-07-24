# UGUI按钮长按持续调用
date: 2020-10-04 13:37:00

给按钮添加Event Trigger组件，点击Add New Event Type添加事件类型：PointerDown、PointerUp

点击加号新增物体，将执行方法的物体拖入，选择要执行的方法。

我在开发俄罗斯方块，给向下按钮做长按功能涉及的脚本：

```c# InputByButton.cs
using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

class InputByButton : MonoBehaviour
{
    ...
    public static bool isPress = false;//是否处于长按状态
    private float Delay = 0.5f;//延迟相当于按下持续时间
    private float LastDownTime;

    private void Update()
    {	//当前时间点减去按下时的时间点，如果这段时间大于Delay，就判定为长按
        if (LastDownTime > 0 && Time.time - LastDownTime > Delay)
        {
            isPress = true;
            //Debug.Log("长按中...");
        }
        else
        {
            isPress = false;
            //Debug.Log("没有长按呢");
        }
    }
...
    public void OnDownButtonDown()//按下按钮
    {
        LastDownTime = Time.time;//记下按下时间点
    }
    public void OnDownButtonUp()//松开按钮
    {
        LastDownTime = 0;//置零
    }
...
}
```

