# UGUI

[TOC]

## UI元素创建与画布



- UI元素由游戏对象构成，因此可以放置在场景内
- 场景内的UI由负责渲染UI元素的画布和事件系统控制
- Rect Transform控制UI元素的位置和大小



### UI元素的创建



#### 画布

画布时附加了Canvas组件的游戏对象。

画布控制对UI元素界面的渲染。

通常渲染所有UI元素只需要一个画布即可。若UI覆盖在其他UI上显示时，可以配置多个画布。此外，还能在一个画布的子元素中嵌套画布。

#### UI元素的渲染顺序

按照Hierarchy面板的排列顺序渲染。从上到下，从父到子。

更改渲染顺序不仅可以通过鼠标操作，还可以通过脚本实现。

使用Transform类的SetAsFirstSibling方法、SetAsLastSibling方法、SetSiblingIndex方法。

#### 画布的渲染模式和属性

##### Screen Space - Overlay模式

无论画布位于场景内的何处，都会渲染覆盖整个画面。

随着画面的大小、分辨率的改变，画布的大小也会随之自动调整。

###### Pixel Perfect

勾选这个属性后，画布内的UI元素的像素渲染统一。即使放置在像素不一致的位置也不会模糊，可以显示得很清晰。

追求更高性能时，可以考虑设置Pixel Perfect属性为OFF。

##### Screen Space - Camera模式

在该模式下，画布被放置在指定摄像机前的一个给定距离内，通过该摄像机进行渲染。

摄像机的设置为影响UI元素的呈现效果。如果摄像机的Projection属性设置为Perspective的话，UI元素会被渲染为略带透明效果（根据摄像机的Field of View属性的值而变化）。

随着画面的大小、分辨率的改变，或者摄像机的视口发生变化的话，画布也会相应地自动调整大小、位置和朝向，以正面面对摄像机。

###### Render Camera

指定渲染画布的摄像机

###### Plane Distance

设置从画布到摄像机的距离

###### Sorting Layer

指定画布的渲染层级。控制包含2D脚本在内的2D图形渲染顺序的结构。与图形元素距摄像机的距离（z坐标）无关。

###### Order in Layer

设置画布Sorting Layer内的渲染顺序。值越小越先悬案，值越大越后渲染。

##### World Space模式

可以与场景内的其他游戏对象一样处理。画布的尺寸不是由画面的尺寸决定，而是通过Rect Transform组件定义。

画布内的UI元素和场景内的其他游戏对象，按照3D空间上的位置关系渲染。适用于将UI元素作为场景的一部分来处理。

###### Event Camera

指定处理事件的摄像机。