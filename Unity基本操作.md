---
title: Unity基本操作
date: 2020-01-16 12:52:05
tags: Unity
---

基本操作

<!--more-->

1. 新建场景

   File>New Scene（或快捷键Ctrl+N）, 默认名“Untitled”, Ctrl+S保存到Yourproject/Assets/Scenes下(没有Scenes就新建一个)

2. 基于3D物体的创建

   1. Hierachy面板：层级面板，用于显示当前场景中有哪些资源。在这些面板中可以往场景中添加资源。

      在该面板右键创建物体

      操作物体的快捷键：

      Q：切换到视角拖拽

      W：切换到物体平移

      E：切换到物体旋转

      R：切换到物体缩放

   2. Project/Console面板：Project选项卡可以管理Assets、Packages；Console选项卡可以查看控制台信息

3. Assets下导入素材

   在Project>Assets下右键，Import Packages>Custom Packages，素材可以从官网（https://assetstore.unity.com ）搜索下载（官方免费素材例子：Free Rocks、Standard Assets）

   导入后，选择需要的文件，拖拽到Hierachy面板即可加入场景

4. 游戏导出

   File>Build Settings, 在弹出的窗口里点击【Add Open Scenes】添加场景

   点击【Build】，选择导出路径并确认即可

5. 项目目录结构

   - Assets：资源文件夹
   - Library：库文件夹
   - Logs
   - Packages
   - ProjectSettings：存放项目设置文件
   - Temp：存放临时文件

6. 鼠标功能

   鼠标左键：选中场景中的物体

   鼠标中键：单击，视野聚焦到选中物体；拖拽，平移场景的观察角度；滚动，拉远拉近

   鼠标右键：旋转场景的观察角度

   Alt + 鼠标左键：旋转观察角度

   Alt + 鼠标右键：拉远拉近

   双击Hierachy面板中的物体：视野聚焦到双击选中的物体

7. Inspector面板

   1. Transform组件(变换组件)

      Position：物体在直角坐标系中的位置，默认（0,0,0）

      Rotation：物体的旋转角度

      Scale：物体的缩放，默认（1,1,1）

      点击小齿轮>Reset：归零

      坐标系切换按钮：

      ![image-20200116150251601](image-20200116150251601.png)

      - 自身坐标系：Local
      - 世界坐标系：Global

      摄像机两种模式切换：

      ![image-20200116151440021](image-20200116151440021.png)

      Persp：透视模式，近大远小

      ISO：正交模式，远近一样大（多用于2D模型）

   2. Mesh Filter组件（网格过滤器）：指定mesh（物体的几何形状），物体的形状由网格决定

      ![image-20200116152627574](image-20200116152627574.png)

   3. Mesh Renderer组件（网格渲染器）：从网格过滤器中获得几何体的形状然后进行渲染

8. Prefab预制体

   1. 父子关系：移动父物体，子物体会跟着移动

      在Hierarchy面板中，任意两个物体都可以建立父子关系

   2. 预制体：Prefab，预先准备好的物体，可以重复使用和利用，例如手枪中的子弹

   3. 管理预制体：在Assets中建立“Prefabs”文件夹，用于管理预制体

   4. 创建预制体：直接将Hierarchy面板中的物体拖拽到Project面板的Assets中，即可创建一个预制体。预制体文件的后缀是".prefab"

   5. 使用预制体：将预制体直接拖拽到Hierarchy面板或Scene面板，都可以在场景中创建一个相应的物体

   6. 预制体与非预制体的区别：

      1. 在Hierarchy面板中，非预制体颜色是白色，预制体颜色是蓝色

      2. 在Inspector面板中，预制体比非预制体多了一个“Prefab”选项

         ![image-20200116155034563](image-20200116155034563.png)
      
   7. 预制体的好处：编辑其中一个，在Inspector>Prefab，“Apply”一下，所有的全部改变

9. Material(材质)：用来更改物体的颜色质地等属性

   新建材质：在Assets文件夹下创建Materials文件夹，在Materials文件夹下右键>Create>Material

   运用举例：

   1. 创建3个Cube预制体，在Materials文件夹下新建一个叫“Black”的材质，在Inspector>Main Maps设置颜色成黑色

   ![image-20200116160725130](image-20200116160725130.png)

   2. 在Hierarchy面板选中其中一个Cube预制体，将"Black"材质拖拽到Inspector>Mesh Renderer>Materials>Element 0，Cube的颜色变为黑色。

   3. 如果要把其他两个Cube预制体也变成黑色，则在Inspector>Prefabs下点击Overrides旁的小三角，选择Apply All即可

      ![image-20200116161610854](image-20200116161610854.png)

   4. 如果此时在改变其中一个Cube预制体的材质，其他两个也会跟着一起改变