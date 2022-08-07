# UGUI优化

## 基本概念

1. 所有的UI都是由网格绘制的
2. 什么是drawcall
3. 像素分辨率、填充率，什么是overdraw
4. 批处理

Unity Scene窗口Wireframe模式可以看到网格。
Text每个字符由单独1个面片（2个三角形）构成。

CPU准备一次数据，GPU绘制一次图形，每次绘制过程是一次【drawcall】。

【填充率】：某个像素在绘制过程中被绘制了多少次。

【overdraw】：屏幕上某个区域的像素因为两个物体的重叠，被重复绘制。

【batching】：把可以合并网格的UI合并，达到减少drawcall的目的

两个mesh需要两次drawcall来绘制

mesh合并可以降低drawcall


## Canvas和Graphic的基本关联

Canvas的作用是把当前所有UI图形描绘到屏幕上。

通过看源码可知，Canvas是封装的C++类，通过C++实现内部方法。

Canvas会将子节点首先进行一个批处理（能合并的合并），最后发送渲染指令到Unity


脏标记

### 几个重要的类

Graphic、MaskableGraphic、LayoutRebuilder、ILayoutElement、CanvasUpdateRegistry

### 两种遮罩的实现区别

RectMask2D、IClips

Mask、Stencilxxx函数

### 深度



## 透明物体的渲染



## 网格重建的执行逻辑

1. Rebatch，合批的时候造成的消耗，同一个canvas下有元素变动，都会执行rebatch
2. Rebuild，针对单个UI的重绘，Canvas.buildbatch，计算哪些元素需要rebuild.



### 重建方法的细节





