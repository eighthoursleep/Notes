# DarkSoulsDemo part 6 重组脚本
date: 2020-06-21 12:20:20

## 一、功能结构概况

1. PlayerManager.cs

   - 管理Update方法

   - 管理信号标示（Flag）

   - 将其他功能模块（脚本）连接到Player上

2. InputHandler.cs

   - 监测玩家输入

3. PlayerLocomotion.cs

   - 管理Player所有的基础移动功能

4. AnimationHandler.cs

   - 管理Player所有要执行的动画

   ...

## 二、脚本重组

### PlayerManager.cs

```c#
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
namespace MJ
{
    public class PlayerManager : MonoBehaviour
    {
        InputHandler inputHandler;
        Animator anim;
        CameraHandler cameraHandler;
        PlayerLocomotion playerLocomotion;

        public bool isInteracting;

        [Header("Player Flags")]
        public bool isSprinting;

        private void Awake()
        {
            cameraHandler = CameraHandler.singleton;
        }

        void Start()
        {
            inputHandler = GetComponent<InputHandler>();
            anim = GetComponentInChildren<Animator>();
            playerLocomotion = GetComponent<PlayerLocomotion>();
        }

        void Update()
        {
            float delta = Time.deltaTime;
            isInteracting = anim.GetBool("IsInteracting");

            inputHandler.TickInput(delta);
            playerLocomotion.HandleMovement(delta);
            playerLocomotion.HandleRollingAndSprinting(delta);

        }

        private void FixedUpdate()
        {
            float delta = Time.fixedDeltaTime;

            if (cameraHandler != null)
            {
                cameraHandler.FollowTarget(delta);
                cameraHandler.HandleCameraRotation(delta, inputHandler.mouseX, inputHandler.mouseY);
            }
        }

        private void LateUpdate()
        {
            inputHandler.rollFlag = false;
            inputHandler.sprintFlag = false;
        }
    }
}
```

### InputHandler.cs

```c#
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

        public bool b_Input;

        public bool rollFlag;
        public bool sprintFlag;
        public float rollInputTimer;

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
            HandleRollInput(delta);
        }

        private void MoveInput(float delta)
        {
            horizontal = movementInput.x;
            vertical = movementInput.y;
            moveAmount = Mathf.Clamp01(Mathf.Abs(horizontal) + Mathf.Abs(vertical));
            mouseX = cameraInput.x;
            mouseY = cameraInput.y;
        }

        private void HandleRollInput(float delta)
        {
            b_Input = inputActions.PlayerAction.Roll.phase == UnityEngine.InputSystem.InputActionPhase.Started;
            if (b_Input)
            {
                rollInputTimer += delta;
                sprintFlag = true;
            }
            else
            {
                if(rollInputTimer > 0 && rollInputTimer < 0.5f)
                {
                    sprintFlag = false;
                    rollFlag = true;
                }

                rollInputTimer = 0;
            }
        }
    }
}
```

### PlayerLocomotion.cs

```c#
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace MJ { 

    public class PlayerLocomotion : MonoBehaviour
    {
        PlayerManager playerManager;
        Transform cameraObject;
        InputHandler inputHandler;
        Vector3 moveDirection;

        [HideInInspector]
        public Transform myTransform;
        [HideInInspector]
        public AnimatorHandler animatorHandler;

        public new Rigidbody rigidbody;
        public GameObject normalCamera;

        [Header("Movement Stats")]
        [SerializeField]
        float walkingSpeed = 3;
        [SerializeField]
        float movementSpeed = 5;
        [SerializeField]
        float sprintSpeed = 7;
        [SerializeField]
        float rotationSpeed = 10;

        // Start is called before the first frame update
        void Start()
        {
            playerManager = GetComponent<PlayerManager>();
            rigidbody = GetComponent<Rigidbody>();
            inputHandler = GetComponent<InputHandler>();
            animatorHandler = GetComponentInChildren<AnimatorHandler>();
            cameraObject = Camera.main.transform;
            myTransform = transform;
            animatorHandler.Initialize();
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

        public void HandleMovement(float delta)
        {
            if (inputHandler.rollFlag)
                return;

            moveDirection = cameraObject.forward * inputHandler.vertical;
            moveDirection += cameraObject.right * inputHandler.horizontal;
            moveDirection.Normalize();
            moveDirection.y = 0;

            float speed = movementSpeed;

            if (inputHandler.sprintFlag && inputHandler.moveAmount > 0.5)
            {
                speed = sprintSpeed;
                playerManager.isSprinting = true;
                moveDirection *= speed;
            }
            else
            {
                if(inputHandler.moveAmount < 0.5)
                {
                    moveDirection *= walkingSpeed;
                    playManager.isSprinting = false;
                }
                else
                {
                    moveDirection *= speed;
                    playManager.isSprinting = false;
                }
                
            }

            Vector3 projectedVelocity = Vector3.ProjectOnPlane(moveDirection, normalVector);
            rigidbody.velocity = projectedVelocity;

            animatorHandler.UpdateAnimatorValues(inputHandler.moveAmount,
                0, playerManager.isSprinting);

            if (animatorHandler.canRotate)
            {
                HandleRotation(delta);
            }
        }
        
        public void HandleRollingAndSprinting(float delta)
        {
            if (animatorHandler.anim.GetBool("IsInteracting"))
                return;
            if (inputHandler.rollFlag)
            {
                moveDirection = cameraObject.forward * inputHandler.vertical;
                moveDirection += cameraObject.right * inputHandler.horizontal;
                if(inputHandler.moveAmount > 0)
                {
                    animatorHandler.PlayerTargetAnimation("Rolling", true);
                    moveDirection.y = 0;
                    Quaternion rollRotation = Quaternion.LookRotation(moveDirection);
                    myTransform.rotation = rollRotation;
                }
                else
                {
                    animatorHandler.PlayerTargetAnimation("Step_Back", true);
                }
            }
        }

        #endregion
    }
}
```

### AnimatorHandler.cs

```c#
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace MJ { 
    public class AnimatorHandler : MonoBehaviour
    {
        PlayerManager playerManager;
        public Animator anim;
        InputHandler inputHandler;
        PlayerLocomotion playerLocomotion;
        int vertical;
        int horizontal;
        public bool canRotate;

        public void Initialize()
        {
            playerManager = GetComponentInParent<PlayerManager>();
            anim = GetComponent<Animator>();
            inputHandler = GetComponentInParent<InputHandler>();
            playerLocomotion = GetComponentInParent<PlayerLocomotion>();
            vertical = Animator.StringToHash("Vertical");
            horizontal = Animator.StringToHash("Horizontal");
        }
        public void UpdateAnimatorValues(float verticalMovement, float horizontalMovement, bool isSprinting)
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

            if (isSprinting)
            {
                v = 2;
                h = horizontalMovement;
            }

            anim.SetFloat(vertical, v, 0.1f, Time.deltaTime);
            anim.SetFloat(horizontal, h, 0.1f, Time.deltaTime);

        }

        public void PlayerTargetAnimation(string targetAnim, bool isInteracting)
        {
            anim.applyRootMotion = isInteracting;
            anim.SetBool("IsInteracting", true);
            anim.CrossFade(targetAnim, 0.2f);
        }

        public void CanRotate()
        {
            canRotate = true;
        }
        public void StopRotate()
        {
            canRotate = false;
        }

        private void OnAnimatorMove()
        {
            if (playerManager.isInteracting == false)
                return;

            float delta = Time.deltaTime;
            playerLocomotion.rigidbody.drag = 0;
            Vector3 deltaPosition = anim.deltaPosition;
            deltaPosition.y = 0;
            Vector3 velocity = deltaPosition / delta;
            playerLocomotion.rigidbody.velocity = velocity;
        }
    }
}
```

## 三、可能出现的问题

以上四个脚本修改完后，播放游戏，摄像机会出现不跟随的情况。

解决方法：把Hierarchy中Player原来的CameraHandler组件删除掉，再重新添加上，重新配置Target Transform、Camera Transform、Camera Pivot Transform即可，参考《DarkSoulsDemo（二）摄像机管理器》。