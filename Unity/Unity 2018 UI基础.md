---
title: Unity 2018 UI基础
date: 2020-02-19 19:17:46
tags: Unity
toc: true
---

- 三种画布的添加
- 不同分辨率的屏幕
- 文本组件

<!--more-->

Unity版本：Unity 2018.4.13c1 Personal

Interface Type 交互界面类型

- Diegetic(剧情的，故事内的)：存档点
- Spatial(受空间条件限制的)：高亮任务NPC或其他玩家，或玩家自己
- Meta：有写摄像机玩家察觉不到，但开发者知道
- Non-Diegetic ：打分面板

Canvas Type画布类型

- Screen Space Overlay：在场景顶层，HUD，用于标识角色状态等信息
- Screen Space Camera：
- World Space：

Interface Type Use Canvas Type

- Overlay用于做No-diegetic UI

- Camera用于做No-diegetic & diegetic UI

- World用于做diegetic UI

**What is HUD ?**

HUD - Head-Up Display

HUD或状态条是游戏UI中视觉传达玩家信息的一种交互方式。



**导入资源包**

新建好项目后，导入ui-fundamentals-2018.unitypackage，进入Scenes文件件，双击打开UIScene

# 一、三种画布的添加

## 1. Overlay

新建一个新场景，菜单栏GameObject > UI > Canvas，在其组件Canvas > Render Mode选中Screen Space - Overlay。

在Canvas下新建一个Cube，但我们却无法在Game视窗看到Cube，无论Cube调整到多大。这就是Overlay型画布。我们可以看见在其上边放置的二维图片，文本，和一些可以互动的东西比如按钮，而三维模型无法看到。

接着我们在Cube下新建一个UI > Button，通过Game视窗，我们看到一个显示在画布上的按钮。

想要看到那个Cube，需要将其放置在摄像机的视野中，我们将Cube位置重置，接着将Cube向Z轴正方向移动5个单位长度，使其正好在Main Camera正前方，此时我们得以在Game视窗中看到Cube，注意这个Cube不在画布上。

![image-20200321191703903](C:\Users\WMJ\AppData\Roaming\Typora\typora-user-images\image-20200321191703903.png)

## 2. Camera

我们将Carves的Render Mode改成Screen Space - Camera，此时Render Camera没有指定，我们将Main Camera拖拽过去添加上。这时候我们发现Game视窗下的按钮消失了，我们选中Main Camera，将其Camera > Clipping Planes Far由原来的10改成100或1000此时我们又看到了button，或者不改变摄像机的可视范围，将Canves的Plane Distance(平面距离)改为5，即把画布移到摄像机的可视范围内，也同样在Game视窗中显示button。

![image-20200321202535660](C:\Users\WMJ\AppData\Roaming\Typora\typora-user-images\image-20200321202535660.png)

## 3. World Space

我们将Canves的Render Mode改为World Space。将Cube拖拽到Main Camera的子系。

接下来我们将按钮Y方向旋转一定角度。

![image-20200321203804848](C:\Users\WMJ\AppData\Roaming\Typora\typora-user-images\image-20200321203804848.png)

![image-20200321203711010](C:\Users\WMJ\AppData\Roaming\Typora\typora-user-images\image-20200321203711010.png)

再看Game视窗，可以看到倾斜的按钮

![image-20200321204017725](C:\Users\WMJ\AppData\Roaming\Typora\typora-user-images\image-20200321204017725.png)



# 二、不同的分辨率的屏幕

## 1. 高分辨率PC游戏



## 2. HTML5网页大小



## 3. 移动设备横屏与竖屏

File > Build Settings，默认是选择PC平台

# 三、文本组件

打开UIStart场景，选中03-Responsive，在菜单栏GameObject下选择UI > Text