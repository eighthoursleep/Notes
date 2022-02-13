# UGUI优化



## 基本概念

1. 所有的UI都是由网格绘制而来的
2. 什么是drawcall
3. 像素分辨率、填充率，什么是overdraw
4. 批处理

Canvas和Graphic的基本关联

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





