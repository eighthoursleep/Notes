---
title: DarkSoulsDemo（一）角色行走
date: 2020-06-17 18:50:01
tags: Unity
categories: DarkSoulsDemo with Unity
---

关键词：移动、Input System插件、混合树

<!--more-->

本篇出自：https://www.youtube.com/watch?v=LOC5GJ5rFFw

## 一、资源导入

本篇用到的资源链接：

动画：https://drive.google.com/drive/folders/1j2HicZMabg4h2Oe8ocxGNuKBHY5kzFJA

模型：https://drive.google.com/drive/folders/1X6DLqSsLT2EAIYpcZGYL-Z93hYOo2sxa

动画资源文件：Idle.anim、Run.anim、Sprint.anim、Walk.anim。

FBX文件：LowPolyMan.fbx

用Unity 2019.3.4f1Personal新建一个3D项目，导入上述资源，给场景SampleScene新建一个3D物体Plane。在Assets/Materials下新建一个材质（Material）取名为Floor_MAT。选中Floor_MAT，在Inspector点击Main Maps|Albedo选择Default-Checker-Gray(Texture 2D)。修改Tiling|X为5，Y为1。然后从项目窗口将Floor_MAT拖拽到场景中的Plane上。

在Hierarchy新建一个空的GameObject，重命名为Player。从项目窗口将LowPolyMan.fbx拖拽到Player，成为其子项。将场景中的LowPolyMan也重命名为Player。

新建两个脚本PlayerLocomotion.cs、InputHandler.cs。

## 二、Input System

打开Packages Manager，安装Input System，如果没找到可以点击Advanced|Show preview packages。

![image-20200618204104291](image-20200618204104291.png)

安装过程中会弹出对话窗口，点击Yes。安装完后Unity编辑器将自动重启。

在项目窗口右键，选中Create|Input Action。

![image-20200618204357104](image-20200618204357104.png)

重命名为PlayerControls，这个将控制控制器的输入。选中PlayerControls，在Inspector勾选Generate C# Class，点击Apply。

![image-20200618204651632](image-20200618204651632.png)

这时，PlayerControls.cs会被自动创建，我们双击打开PlayerControls（Input Action）。

点击加号添加一个Action Maps，命名为Player Movement，添加两个Action，分别命名为Movement、Camera。修改Movement的属性Action|Action Type为Pass Through，Control Type为Vector 2

![image-20200618205504866](image-20200618205504866.png)

![image-20200618214052176](image-20200618214052176.png)

删掉Movement下的\<No Binding\>（右键选择Delete），点击Movementy同行右边的加号，选择Add 2D Vector Composite。

![image-20200618205756335](image-20200618205756335.png)

重命名为WASD，设置它的属性Composite|Composite Type为2D Vector，Mode为Analog

![image-20200618205956087](image-20200618205956087.png)

设置WASD下的四个动作如下，

![image-20200618213926007](image-20200618213926007.png)

![image-20200618210207321](image-20200618210207321.png)

![image-20200618213731388](image-20200618213731388.png)

![image-20200618213821839](image-20200618213821839.png)

选择Camera下的\<No Binding>，设置Path为Right Stick [Gamepad]，添加Processor Stick Deadzone。

![image-20200618214330830](image-20200618214330830.png)

![image-20200618214529084](image-20200618214529084.png)

在Camera下添加Binding，设置Path为Delta[Mouse]，添加属性Normalize Vector 2。

![image-20200618214645347](image-20200618214645347.png)

![image-20200618214755135](image-20200618214755135.png)

![image-20200618215016354](image-20200618215016354.png)

然后关闭窗口，在弹出的对话框中选择Save。

然后打开Project Setting，选中Input System Package，点击Create settings asset按钮，修改Default Hold Time为0。

![image-20200618215441893](image-20200618215441893.png)

## 三、给角色添加碰撞体组件和刚体组件

给Player添加胶囊碰撞体组件，设置属性Radus为0.3，Height为2。

![image-20200618215824983](image-20200618215824983.png)

添加Rigidbody组件，勾选Constraints Freeze Rotation X、Y、Z。

![image-20200618220003141](image-20200618220003141.png)

## 四、编写脚本实现角色转向

然后用VS2017打开InputHandler.cs，编写脚本如下：

```c# InputHandler.cs
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace MJ { 
    public class InputHandler : MonoBehaviour
    {
        public float horizontal;
        public float vertical;
        public float moveAmount;
        public float mouseX;
        public float mouseY;

        PlayerControls inputActions;

        Vector2 movementInput;
        Vector2 cameraInput;

        public void OnEnable()
        {
            if(inputActions == null)
            {
                inputActions = new PlayerControls();
                inputActions.PlayerMovement.Movement.performed += inputActions => movementInput = inputActions.ReadValue<Vector2>();
                inputActions.PlayerMovement.Camera.performed += i => cameraInput = i.ReadValue<Vector2>();
            }

            inputActions.Enable();
        }

        private void OnDisable()
        {
            inputActions.Disable();
        }

        public void TickInput(float delta)
        {
            MoveInput(delta);
        }

        private void MoveInput(float delta)
        {
            horizontal = movementInput.x;
            vertical = movementInput.y;
            moveAmount = Mathf.Clamp01(Mathf.Abs(horizontal) + Mathf.Abs(vertical));
            mouseX = cameraInput.x;
            mouseY = cameraInput.y;
        }
    }
}
```

然后用VS2017打开PlayerLocomotion.cs，编写脚本如下：

```c# PlayerLocomotion.cs
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace MJ { 

    public class PlayerLocomotion : MonoBehaviour
    {
        Transform cameraObject;
        InputHandler inputHandler;
        Vector3 moveDirection;

        [HideInInspector]
        public Transform myTransform;

        public new Rigidbody rigidbody;
        public GameObject normalCamera;

        [Header("Stats")]
        [SerializeField]
        float movementSpeed = 5;
        [SerializeField]
        float rotationSpeed = 10;

        // Start is called before the first frame update
        void Start()
        {
            rigidbody = GetComponent<Rigidbody>();
            inputHandler = GetComponent<InputHandler>();
            animatorHandler = GetComponentInChildren<AnimatorHandler>();
            cameraObject = Camera.main.transform;
            myTransform = transform;
        }
        
        public void Update()
        {
            float delta = Time.deltaTime;

            inputHandler.TickInput(delta);

            moveDirection = cameraObject.forward * inputHandler.vertical;
            moveDirection += cameraObject.right * inputHandler.horizontal;
            moveDirection.Normalize();
            moveDirection.y = 0;

            float speed = movementSpeed;
            moveDirection *= speed;

            Vector3 projectedVelocity = Vector3.ProjectOnPlane(moveDirection, normalVector);
            rigidbody.velocity = projectedVelocity;
        }

        #region Movement
        Vector3 normalVector;
        Vector3 targetPostion;

        private void HandleRotation(float delta)
        {
            Vector3 targetDir = Vector3.zero;
            float moveOverride = inputHandler.moveAmount;

            targetDir = cameraObject.forward * inputHandler.vertical;
            targetDir += cameraObject.right * inputHandler.horizontal;

            targetDir.Normalize();
            targetDir.y = 0;

            if(targetDir == Vector3.zero)
            {
                targetDir = myTransform.forward;
            }
            float rs = rotationSpeed;
            Quaternion tr = Quaternion.LookRotation(targetDir);
            Quaternion targetRotation = Quaternion.Slerp(myTransform.rotation, tr, rs * delta);

            myTransform.rotation = targetRotation;
        }
        #endregion
    }
}
```

回到Unity编辑器，将InputHandler.cs和PlayerLocomotion.cs添加到Player

![image-20200618220941129](image-20200618220941129.png)

播放游戏，通过WASD我们可以控制角色在平面上“滑行”。

如果在按W/S键的时候角色往天上移动，则需要将Main Camera放置在能够平视角色的位置上（通过Ctrl+Shift+F设置位置）。

接下来添加脚本来控制动画。

新建脚本AnimatorHandler.cs，编写脚本如下：

```c# AnimatorHandler.cs
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace MJ { 
    public class AnimatorHandler : MonoBehaviour
    {
        public Animator anim;
        int vertical;
        int horizontal;
        public bool canRotate;

        public void Initialize()
        {
            anim = GetComponent<Animator>();
            vertical = Animator.StringToHash("Vertical");
            horizontal = Animator.StringToHash("Horizontal");
        }
        public void UpdateAnimatorValues(float verticalMovement, float horizontalMovement)
        {
            #region Vertical
            float v = 0;

            if(verticalMovement > 0 && verticalMovement < 0.55f)
            {
                v = 0.5f;
            }else if(verticalMovement > 0.55f)
            {
                v = 1;
            }else if(verticalMovement < 0 && verticalMovement > -0.55f)
            {
                v = -0.5f;
            }else if(verticalMovement < -0.55f)
            {
                v = -1;
            }
            else
            {
                v = 0;
            }
            #endregion

            #region Horizontal
            float h = 0;

            if(horizontalMovement > 0 && horizontalMovement < 0.55f)
            {
                h = 0.5f;
            }else if(horizontalMovement > 0.55f)
            {
                h = 1;
            }else if(horizontalMovement < 0 && horizontalMovement > -0.55f)
            {
                h = -0.5f;
            }else if(verticalMovement < -0.55f)
            {
                h = -1;
            }
            else
            {
                h = 0;
            }
            #endregion

            anim.SetFloat(vertical, v, 0.1f, Time.deltaTime);
            anim.SetFloat(horizontal, h, 0.1f, Time.deltaTime);

        }

        public void CanRotate()
        {
            canRotate = true;
        }
        public void StopRotate()
        {
            canRotate = false;
        }
    }
}
```

打开PlayerLocomotion.cs，添加AnimatorHandler类型公共变量animatorHandler：

```c# PlayerLocomotion.cs
...
		[HideInInspector]
        public Transform myTransform;
		//↓↓↓声明变量animatorHandler
        [HideInInspector]
        public AnimatorHandler animatorHandler;

        public new Rigidbody rigidbody;
...
```

在Start方法添加语句获取AnimatorHandler组件以及调用animatorHandler的初始化方法。

```c# PlayerLocomotion.cs
void Start()
{
    rigidbody = GetComponent<Rigidbody>();
    inputHandler = GetComponent<InputHandler>();
    //↓↓↓获取AnimatorHandler组件，这里用GetComponentInChildren是因为该组件是属于Player的子项Player的
    animatorHandler = GetComponentInChildren<AnimatorHandler>();
...
    //调用animatorHandler的初始化方法
    animatorHandler.Initialize();
}
```

在Update方法里添加语句实现转向判断

```c# PlayerLocomotion.cs
void Update(){
    ...
	if (animatorHandler.canRotate)
    {
        HandleRotation(delta);
    }
}
```

保存修改后的脚本，回到Unity编辑器，将AnimatorHandler.cs添加到Player的子项Player，勾选Can Rotate。

![image-20200618223109582](image-20200618223109582.png)

播放游戏，想在控制角色移动，角色会转向。

### 实际遇到的问题：

1. 发现角色没有转向，原因是没有勾选Can Rotate。
2. 按W/S键时，角色没有转向，原因是这条语句漏写了。

```c# PlayerLocomotion.cs
private void HandleRotation(float delta)
{
...
    targetDir = cameraObject.forward * inputHandler.vertical;
    ...
```

## 五、加入动画

在Assets/Animator下新建一个Animator Controller，命名为Humanoid，将其拖拽添加到场景中Player|Player|Animator|Controller，双击Humanoid打开并进入Animtor窗口。

![image-20200618224129014](image-20200618224129014.png)

点击Parameters标签，点击加号添加两个Float类型参数Horizontal、Vertical。

然后回到Layers标签，在Base Layer新建混合树，重命名为Locomotion。

![image-20200618225000001](image-20200618225000001.png)

双击进入Locomotion，将Blend Tree的混合模式设为2D Freeform Cartesian，设置参数Horizontal、Vertical，在Motion列表添加三个动作域，并分别做如下配置。

![image-20200618225850260](image-20200618225850260.png)

如果动画预览窗口里没有显示正确的模型，从项目窗口中拖入LowPolyMan.fbx即可。

打开PlayerLocomotion.cs，在Update方法添加如下语句：

```c# PlayerLocomotion.cs
public void Update()
{
...
    animatorHandler.UpdateAnimatorValues(inputHandler.moveAmount, 0);
	...
```

保存脚本，回到Unity编辑器，设置Player|Player|Animator|Avatar为LowPolyManAvatar。

![image-20200618231441712](image-20200618231441712.png)

播放游戏。此时角色的移动带有跑动动画。

![image-20200618230923858](image-20200618230923858.png)

### 实际遇到的问题：

1. 角色没有跑动，原因：
   1. LowPolyMan模型没有设置Rig|Animation Type为Humanoid。
   2. Player|Player|Animator|Avatar为”None“。
   3. 在Animator设置Float型参数Vertical时，错写成“vertical”。

2. 角色跑动的时候会“闪现、乱窜“，原因是勾选了Apply Root Motion。

![image-20200618231814491](image-20200618231814491.png)

## 六、脚本汇总

```c# InputHandler.cs
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace MJ { 
    public class InputHandler : MonoBehaviour
    {
        public float horizontal;
        public float vertical;
        public float moveAmount;
        public float mouseX;
        public float mouseY;

        PlayerControls inputActions;

        Vector2 movementInput;
        Vector2 cameraInput;

        public void OnEnable()
        {
            if(inputActions == null)
            {
                inputActions = new PlayerControls();
                inputActions.PlayerMovement.Movement.performed += inputActions => movementInput = inputActions.ReadValue<Vector2>();
                inputActions.PlayerMovement.Camera.performed += i => cameraInput = i.ReadValue<Vector2>();
            }

            inputActions.Enable();
        }

        private void OnDisable()
        {
            inputActions.Disable();
        }

        public void TickInput(float delta)
        {
            MoveInput(delta);
        }

        private void MoveInput(float delta)
        {
            horizontal = movementInput.x;
            vertical = movementInput.y;
            moveAmount = Mathf.Clamp01(Mathf.Abs(horizontal) + Mathf.Abs(vertical));
            mouseX = cameraInput.x;
            mouseY = cameraInput.y;
        }
    }
}
```

```c# PlayerLocomotion.cs
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace MJ { 

    public class PlayerLocomotion : MonoBehaviour
    {
        Transform cameraObject;
        InputHandler inputHandler;
        Vector3 moveDirection;

        [HideInInspector]
        public Transform myTransform;
        [HideInInspector]
        public AnimatorHandler animatorHandler;

        public new Rigidbody rigidbody;
        public GameObject normalCamera;

        [Header("Stats")]
        [SerializeField]
        float movementSpeed = 5;
        [SerializeField]
        float rotationSpeed = 10;

        // Start is called before the first frame update
        void Start()
        {
            rigidbody = GetComponent<Rigidbody>();
            inputHandler = GetComponent<InputHandler>();
            animatorHandler = GetComponentInChildren<AnimatorHandler>();
            cameraObject = Camera.main.transform;
            myTransform = transform;
            animatorHandler.Initialize();
        }
        public void Update()
        {
            float delta = Time.deltaTime;

            inputHandler.TickInput(delta);

            moveDirection = cameraObject.forward * inputHandler.vertical;
            moveDirection += cameraObject.right * inputHandler.horizontal;
            moveDirection.Normalize();
            moveDirection.y = 0;

            float speed = movementSpeed;
            moveDirection *= speed;

            Vector3 projectedVelocity = Vector3.ProjectOnPlane(moveDirection, normalVector);
            rigidbody.velocity = projectedVelocity;

            animatorHandler.UpdateAnimatorValues(inputHandler.moveAmount, 0);

            if (animatorHandler.canRotate)
            {
                HandleRotation(delta);
            }
        }

        #region Movement
        Vector3 normalVector;
        Vector3 targetPostion;

        private void HandleRotation(float delta)
        {
            Vector3 targetDir = Vector3.zero;
            float moveOverride = inputHandler.moveAmount;

            targetDir = cameraObject.forward * inputHandler.vertical;
            targetDir += cameraObject.right * inputHandler.horizontal;

            targetDir.Normalize();
            targetDir.y = 0;

            if(targetDir == Vector3.zero)
            {
                targetDir = myTransform.forward;
            }
            float rs = rotationSpeed;
            Quaternion tr = Quaternion.LookRotation(targetDir);
            Quaternion targetRotation = Quaternion.Slerp(myTransform.rotation, tr, rs * delta);

            myTransform.rotation = targetRotation;
        }
        #endregion
    }
}
```

```c# AnimatorHandler.cs
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace MJ { 
    public class AnimatorHandler : MonoBehaviour
    {
        public Animator anim;
        int vertical;
        int horizontal;
        public bool canRotate;

        public void Initialize()
        {
            anim = GetComponent<Animator>();
            vertical = Animator.StringToHash("Vertical");
            horizontal = Animator.StringToHash("Horizontal");
        }
        public void UpdateAnimatorValues(float verticalMovement, float horizontalMovement)
        {
            #region Vertical
            float v = 0;

            if(verticalMovement > 0 && verticalMovement < 0.55f)
            {
                v = 0.5f;
            }else if(verticalMovement > 0.55f)
            {
                v = 1;
            }else if(verticalMovement < 0 && verticalMovement > -0.55f)
            {
                v = -0.5f;
            }else if(verticalMovement < -0.55f)
            {
                v = -1;
            }
            else
            {
                v = 0;
            }
            #endregion

            #region Horizontal
            float h = 0;

            if(horizontalMovement > 0 && horizontalMovement < 0.55f)
            {
                h = 0.5f;
            }else if(horizontalMovement > 0.55f)
            {
                h = 1;
            }else if(horizontalMovement < 0 && horizontalMovement > -0.55f)
            {
                h = -0.5f;
            }else if(verticalMovement < -0.55f)
            {
                h = -1;
            }
            else
            {
                h = 0;
            }
            #endregion

            anim.SetFloat(vertical, v, 0.1f, Time.deltaTime);
            anim.SetFloat(horizontal, h, 0.1f, Time.deltaTime);

        }

        public void CanRotate()
        {
            canRotate = true;
        }
        public void StopRotate()
        {
            canRotate = false;
        }
    }
}

```

