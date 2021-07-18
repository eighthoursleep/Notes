---
title: C#面向对象基础（五）多态
date: 2020-06-29 12:57:50
tags: C Sharp
toc: true
categories: 面向对象
---

关键词：编译时多态、运行时多态、重载和覆盖的区别

<!--more-->

# 概念

**多态（polymorphism）**：即一个名字具有多种语义。
在面向对象中指一个方法可以有多种实现版本。

**类的多态**表现为**方法的多态**。
**方法的多态**：**重载（overload）**和**覆盖（override）**。

**重载**：
同一个“类”中，**方法同名**，参数列表不同：个数不同、类型不同、次序不同
**注意：返回值类型不同无法构成重载！**

**覆盖（重写）**

1. 这种语法出现在**父子类**中。
2. **父类的方法**用**virtual**修饰一下形成虚方法或者用**abstract**修饰成为抽象方法。
3. **子类的方法**务必和父类的方法同名，且用**override**关键字修饰一下
4. 其他部分保持一致（访问修饰符 修饰符 返回值类型 参数列表）

## 静态联编（静态多态性）
**重载**的方法由于参数列表不同，编译时就可以确定到底执行哪种方法的代码，因此重载又称为**编译时多态**。

## 动态联编（动态多态性）
**重写/覆盖**的方法由于参数列表相同，编译时无法确定到底执行哪个（父/子）方法，运行时依据内存的对象的实际类型去确定执行哪个（父/子）方法，因此重写/覆盖又称为**运行时多态**。

**调用原则：“是谁的对象就调用谁的方法。”**

## 重载和覆盖的区别

1. 从方法声明角度（格式）：

   重载的两个函数参数列表不同；
   覆盖的两个方法参数列表和返回值类型相同。

2. 从所处位置角度（位置）：

   重载的两个方法在同一个类中；
   覆盖的两个方法在有继承关系的两个类中。

3. 从方法调用角度（调用）：

   重载的方法被同一个对象通过不同的参数调用；
   覆盖的方法被不同对象使用相同参数调用。

4. 从多态时机角度（特性）：

   重载是编译时多态；
   覆盖是运行时多态。

# 例子

## 重载例子

一个类的多个构造方法

## 覆盖例子（virtual与override）

```c# Program.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectPolymorphism
{
    class Program
    {
        static void Main(string[] args)
        {
            TestMage();
        }
        public static void TestMage()
        {
            Attack(new Mage());
            Attack(new DestructionMage());
            Attack(new Mage());

        }
        public static void Attack(Mage m)
        {
            m.CastSpell();
        }
    }
    class Mage
    {
        public virtual void CastSpell()
        {
            Console.WriteLine("fire ball!");
        }
    }
    class DestructionMage : Mage
    {
        public override void CastSpell()
        {
            Console.WriteLine("FIRE STORM!!!");
        }
    }
}
```

![image-20200629133510033](image-20200629133510033.png)

# 总结

1. 方法是代码复用的重要手段。
2. 控制好代码被访问的程度，可以加强代码的安全性。
3. 封装、继承、多态是面向对象的基本特征。
4. 封装特性通过访问权限的设定将类的实现细节隐藏，提供接口供外部访问。
5. 继承和组合是类的基本关系，是软件复用的重要方法。（一个类内部之间的关系——组合，多个类之间如果存在关系——继承）
6. 多态是面向对象的重要标志。（没有多态就得一直写if，is，as）