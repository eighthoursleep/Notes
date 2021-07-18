---
title: Transform组件
date: 2020-07-12 21:09:42
tags: Unity
toc: true
---

Position、Rotation、Scale、Translate()、Rotate()、Rotate()、LookAt()、Transform维护父子关系

<!--more-->

## 位置（Position）



## 旋转（Rotation）

### 欧拉角

### 四元数（Quaternion）

四元数使用四个数来表示方位，因此得名。用三个数表达3D方位，一定会导致万向锁问题。一个四元数包含一个标量分量和一个3D向量分量。通常标量分量用w表示，向量分量用v或分开的x,y,z表示。关于四元数详细介绍可以百度。

在Unity中所有用到模型旋转的，其底层都是由四元数实现。它可以精确计算模型旋转的角度。Quaternion基于附属的表示并不容易被直观理解，因此没有必要访问或修改单个Quaternion组件（x,y,z,w），只需同各国Transform的rotation来实现旋转，或者构造新的旋转，如在两个旋转之间平滑地插值。

eulerAngles属性返回表示旋转的欧拉角度。表示旋转的角度，顺序依次绕z轴旋转euler.z度，绕x轴旋转euler.x度，绕y轴旋转euler.y度。

在Unity 3D中，四元数的乘法操作由两种：

1. **四元数相乘**，旋转操作融合。

2. **四元数与向量相乘**，就是对向量进行旋转。

## 缩放（Scale）



## Translate方法



## Rotate方法



## Rotate方法



## LookAt方法



## Transform维护父子关系