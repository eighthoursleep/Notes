# 第2章 C#技术要点

## 2.1 Unity3D中C#的底层原理

## 2.2 List底层源码剖析

## 2.3 Dictionary底层源码剖析

## 2.4 浮点数的精度问题

## 2.5 委托、事件、装箱、拆箱

### 2.5.1 委托与事件

### 2.5.2 装箱与拆箱

## 2.6 排序算法

## 2.6.1 快速排序算法

## 2.6.2 最大最小堆排序

## 2.6.3 其他排序算法

## 2.7 各类搜索算法

## 2.7.1 搜索算法概述

## 2.7.2 二分查找算法

## 2.7.3 二叉树、二叉查找树、平衡二叉树、红黑树、B树

## 2.7.4 四叉树搜索算法

## 2.7.5 八叉树搜索算法

## 2.8 业务逻辑优化技巧

## 2.8.1 使用List和Dictionary时提高效率

## 2.8.2 巧用struct

struct是值类型。
struct传递靠复制，而非靠引用（指针）
可以通俗认为struct靠内存复制实现传递（通过对齐字节规则循环多次复制内存）
传递struct是在不断克隆数据

struct对性能优化的好处：

一、
如果函数中的某个局部变量是struct, struct的值类型变量分配的内存在栈上，栈是连续内存。
在函数调用结束后，栈的回收快速简单（只要将尾指针置零就行，非真正意义的释放内存）。
这样既不会产生内存碎片，又不需要内存垃圾回收，CPU读取数据对连续内存也非常友好、高效。

二、
struct数组对提高内存访问速度有帮助。
因为struct是值类型，struct数组的内存与值类型都是连续的。
class数组只是引用（指针）变量空间连续。

在CPU读取数据时，连续内存可以帮助提高CPU的缓存命中率。
CPU在读取内存时会把大块内容放入缓存，当下次读取时，先从缓存中查找，如果命中，则不需要再向内存读取数据（缓存比内存快100倍），非连续内存的缓存命中率比较低，CPU的缓存命中率高低很影响CPU的效率。

不是所有struct都能提高缓存命中率，如果struct太大，超过了缓存复制的数据块，则缓存不再起作用，因为复制进去的数据只有1个甚至半个struct。

很多架构抛弃了struct，彻底使用原值类型（int[],bool[],byte[],float[]等）连续空间的方式来提高CPU的缓存命中。
即把所有数值都几何起来用数组的形式存放，而再具体对象上则值存放一个索引值，当需要存取时都通过索引来操作数组。

## 2.8.3 尽可能地使用对象池

## 2.8.4 字符串导致的性能问题

## 2.8.5 字符串的隐藏问题

## 2.8.6 程序运行原理