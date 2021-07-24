---
title: DarkSoulsDemo（八）武器
date: 2020-06-21 23:35:20
tags: Unity
toc: true
categories: DarkSoulsDemo with Unity
---

关键词：脚本控制、预制体

<!--more-->

本文出自：[Create DARK SOULS in Unity ► EP. 8 WEAPON ITEMS](https://www.youtube.com/watch?v=7IbW2dxxrf4)

文中用到的武器模型SM_Wep_Sword_01和角色模型Chr_FantasyHero_Preset_35出自：[Polygon Fantasy Hero Characters](https://assetstore.unity.com/packages/3d/characters/humanoids/polygon-modular-fantasy-hero-characters-143468)

# 一、自制Item类、Weapon类的建立与使用

新建一个脚本Item.cs，编写代码：

```c#
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
namespace MJ
{
    public class Item : ScriptableObject
    {
        [Header("Item Information")]
        public Sprite itemIcon;
        public string itemName;
    }
}
```

新建一个脚本Weapon.cs，编写代码：

```c#
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
namespace MJ
{
    [CreateAssetMenu(menuName = "Item/Weapon Item")]
    public class WeaponItem : Item
    {
        public GameObject modelPrefabs;
        public bool isUnarmed;
    }
}
```

将武器模型SM_Wep_Sword_01转为预制体并命名为Sword_01，这个过程会弹出一个对话框，选则Original Prefabs，删掉场景中的SM_Wep_Sword_01或Sword_01。再Assets下新建一个Data文件夹，将Prefabs文件夹拖入其中，再Data文件夹下新建一个Items文件夹，再Item文件夹里再建一个Weapons文件夹，再Assets/Data/Items/Weapons下新建一个Weapon Item，取名为Sword。

![image-20200622200205776](image-20200622200205776.png)

选中Weapon Item Sword，填写物品名称，配置模型预制体

![image-20200622200828590](image-20200622200828590.png)

# 二、写脚本管理武器

在Assets文件夹下新建一个脚本WeaponHolderSlot.cs，编写代码如下：

```c#
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
namespace MJ
{
    public class WeaponHolderSlot : MonoBehaviour
    {
        public Transform parentOverride;
        public bool isLeftHandSlot;
        public bool isRightHandSlot;

        public GameObject currentWeaponModel;

        public void UnLoadWeapon()
        {
            if(currentWeaponModel != null)
            {
                currentWeaponModel.SetActive(false);
            }
        }
        public void UnloadWeaponAndDestroy()
        {
            if (currentWeaponModel != null)
            {
                Destroy(currentWeaponModel);
            }
        }

        public void LoadWeaponModel(WeaponItem weaponItem)
        {
            UnloadWeaponAndDestroy();

            if(weaponItem== null)
            {
                UnLoadWeapon();
                return;
            }

            GameObject model = Instantiate(weaponItem.modelPrefabs) as GameObject;
            if(model != null)
            {
                if(parentOverride != null)
                {
                    model.transform.parent = parentOverride;
                }
                else
                {
                    model.transform.parent = transform;
                }

                model.transform.localPosition = Vector3.zero;
                model.transform.localRotation = Quaternion.identity;
                model.transform.localScale = Vector3.one;
            }

            currentWeaponModel = model;
        }
    }
}
```

回到Unity编辑器，展开场景中角色预制体找到他的右手，挂上WeaponHolderSlot.cs，并做如下配置。

![image-20200622204709884](image-20200622204529289.png)

给Hand_L新建一个空物体，取名为Left Hand Override，给Hand_L添加组件Weapon Holder Slot (Script)，将Left Hand Override拖拽到Parent Override，勾选Is Left Hand Slot。

![image-20200622205319261](image-20200622205319261.png)

新建脚本WeaponSlotManager.cs，编写脚本如下：

```c#
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
namespace MJ
{
    public class WeaponSlotManager : MonoBehaviour
    {
        WeaponHolderSlot leftHandSlot;
        WeaponHolderSlot rightHandSlot;

        private void Awake()
        {
            WeaponHolderSlot[] weaponHolderSlots = GetComponentsInChildren<WeaponHolderSlot>();
            foreach(WeaponHolderSlot weaponSlot in weaponHolderSlots)
            {
                if (weaponSlot.isLeftHandSlot)
                {
                    leftHandSlot = weaponSlot;
                }else if (weaponSlot.isRightHandSlot)
                {
                    rightHandSlot = weaponSlot;
                }
            }
        }

        public void LoadWeaponOnSlot(WeaponItem weaponItem, bool isLeft)
        {
            if (isLeft)
            {
                leftHandSlot.LoadWeaponModel(weaponItem);
            }
            else
            {
                rightHandSlot.LoadWeaponModel(weaponItem);
            }
        }
    }
}
```

将WeaponSlotManager.cs作为组件添加到Player预制体上

![image-20200622210431368](image-20200622210431368.png)

新建脚本PlayerInventory.cs，编写代码如下：

```c#
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
namespace MJ
{
    public class PlayerInventory : MonoBehaviour
    {
        WeaponSlotManager weaponSlotManager;

        public WeaponItem rightWeapon;
        public WeaponItem leftWeapon;

        private void Awake()
        {
            weaponSlotManager = GetComponentInChildren<WeaponSlotManager>();
        }

        private void Start()
        {
            weaponSlotManager.LoadWeaponOnSlot(rightWeapon, false);
            weaponSlotManager.LoadWeaponOnSlot(leftWeapon, true);
        }
    }
}
```

将PlayerInventory.cs作为组件添加到Player，配置Right Weapon和Left Weapon

![image-20200622211028449](image-20200622211028449.png)

# 三、自制含Pivot的武器预制体

右键Hierarchy中的预制体Sword创建一个空物体，然后右键预制体Sword，选择Unpack Prefabs Completely完全解包预制体，然后把GameObject从Sword子项中拖出，重命名为Sword_01，建立子项空物体，重命名为Weapon Pivot，再将Sword拖到Weapon Pivot子项。

![image-20200622211800792](image-20200622211800792.png)

![image-20200622212526990](image-20200622212526990.png)

将Sword_01转为预制体，删除场景中的Sword_01。在项目窗口里选中Sword_01，点击Open Prefabs按钮进入预制体编辑场景。展开Hierarchy里的Sword_01，选中Weapon Pivot，修改其Transform|Scale为（100，100，100）。

![image-20200623094957165](image-20200623094957165.png)

![image-20200623095242480](image-20200623095242480.png)

点击Scenes返回SampleScene。

![image-20200623095430004](image-20200623095430004.png)

播放游戏，可以看到Sword_01附在角色手上，但位置有点奇怪，我们可以暂停游戏来进行修正。

# 四、修正武器位置

在场景中点击选中右手上的剑，在Hierarchy里将自动选中Sword_01|Weapon Pivot|Sword，选中Sword Pivot，调整位置至合理，然后右键Sword Pivot|Transform复制组件。

![image-20200623101003337](image-20200623101003337.png)

然后停止播放游戏，选中项目窗口里的预制体Sword_01，点击Open Prefabs，选中WeaponPivot，粘贴组件。

![image-20200623101314973](image-20200623101314973.png)

播放游戏，暂停游戏调整左手剑的位置，但这次我们调的是Left Hand Override的Transform，调整好后复制组件。

![image-20200623103347735](image-20200623103347735.png)

停止游戏，找到Left Hand Override，粘贴组件。

好现在播放游戏，角色手上剑的位置都基本正常了。

![image-20200623103852052](image-20200623103852052.png)

![image-20200623103905159](image-20200623103905159.png)

# 五、脚本汇总

## Item.cs

```c#
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
namespace MJ
{
    public class Item : ScriptableObject
    {
        [Header("Item Information")]
        public Sprite itemIcon;
        public string itemName;
    }
}
```

## Weapon.cs

```c#
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
namespace MJ
{
    [CreateAssetMenu(menuName = "Item/Weapon Item")]
    public class WeaponItem : Item
    {
        public GameObject modelPrefabs;
        public bool isUnarmed;
    }
}
```

## WeaponHolderSlot.cs

```c#
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
namespace MJ
{
    public class WeaponHolderSlot : MonoBehaviour
    {
        public Transform parentOverride;
        public bool isLeftHandSlot;
        public bool isRightHandSlot;

        public GameObject currentWeaponModel;

        public void UnLoadWeapon()
        {
            if(currentWeaponModel != null)
            {
                currentWeaponModel.SetActive(false);
            }
        }
        public void UnloadWeaponAndDestroy()
        {
            if (currentWeaponModel != null)
            {
                Destroy(currentWeaponModel);
            }
        }

        public void LoadWeaponModel(WeaponItem weaponItem)
        {
            UnloadWeaponAndDestroy();

            if(weaponItem== null)
            {
                UnLoadWeapon();
                return;
            }

            GameObject model = Instantiate(weaponItem.modelPrefabs) as GameObject;
            if(model != null)
            {
                if(parentOverride != null)
                {
                    model.transform.parent = parentOverride;
                }
                else
                {
                    model.transform.parent = transform;
                }

                model.transform.localPosition = Vector3.zero;
                model.transform.localRotation = Quaternion.identity;
                model.transform.localScale = Vector3.one;
            }

            currentWeaponModel = model;
        }
    }
}
```

## WeaponSlotManager.cs

```c#
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
namespace MJ
{
    public class WeaponSlotManager : MonoBehaviour
    {
        WeaponHolderSlot leftHandSlot;
        WeaponHolderSlot rightHandSlot;

        private void Awake()
        {
            WeaponHolderSlot[] weaponHolderSlots = GetComponentsInChildren<WeaponHolderSlot>();
            foreach(WeaponHolderSlot weaponSlot in weaponHolderSlots)
            {
                if (weaponSlot.isLeftHandSlot)
                {
                    leftHandSlot = weaponSlot;
                }else if (weaponSlot.isRightHandSlot)
                {
                    rightHandSlot = weaponSlot;
                }
            }
        }

        public void LoadWeaponOnSlot(WeaponItem weaponItem, bool isLeft)
        {
            if (isLeft)
            {
                leftHandSlot.LoadWeaponModel(weaponItem);
            }
            else
            {
                rightHandSlot.LoadWeaponModel(weaponItem);
            }
        }
    }
}
```

## PlayerInventory.cs

```c#
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
namespace MJ
{
    public class PlayerInventory : MonoBehaviour
    {
        WeaponSlotManager weaponSlotManager;

        public WeaponItem rightWeapon;
        public WeaponItem leftWeapon;

        private void Awake()
        {
            weaponSlotManager = GetComponentInChildren<WeaponSlotManager>();
        }

        private void Start()
        {
            weaponSlotManager.LoadWeaponOnSlot(rightWeapon, false);
            weaponSlotManager.LoadWeaponOnSlot(leftWeapon, true);
        }
    }
}
```

