---
title: C#面试题：链表怎么逆序？
date: 2020-07-08 11:43:18
tags: C Sharp
toc: true
categories:
- 面试
---

关键词：链表的存储特点，就地逆序，递归法，插入法

<!--more-->

# 链表的存储特点

可以用任意一组存储单元来存储单链表中的数据元素（存储单元可以是不连续的），而且，除了存储每个数据元素a<sub>n</sub>以外，还必须存储指示其直接后继元素的信息，这两部分信息组成的数据元素a<sub>n</sub>的<u>存储映像</u>称为**节点**。

当节点只包含其后继节点的信息的链表，被称为**单链表**，链表的第一个节点被称为**头结点**。

对于单链表，可以分为有头结点的单链表和无头结点的单链表。

头结点的数据域可以不存储任何信息，也可以存放如线性表长度等附加信息，头结点的指针域存储数据开始节点的存储位置。

**注意**：C#中没有指针的概念，而是通过引用来实现的。在代码中，通过引用来建立节点之间的关系。

头结点的**作用**：

1. 在插入新节点或删除节点时，我们都会修改前一个节点的指针域。若链表没有头结点，则在删除第一个数据节点，或在其前边插入新节点时，需要特殊处理。有头结点可以规避特殊处理。
2. 对空链表和非空链表的处理一样。

单链表实例：

```c#
class LNode
{
    int data;	//数据域
    LNode next;	//下一个节点的引用
}
```

# 如何实现链表的逆序

题目：给定一个带头结点的单链表，请将其逆序。如果单链表为head->1->2->3->4->5->6->7，则逆序后为head->7->6->5->4->3->2->1

## 方法一：就地逆序

```c# Program.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Project_LinkedList
{
    class Program
    {
        static void Main(string[] args)
        {
            LNode head = GenerateLinkedList(8);
            Console.Write("逆序前：");
            PrintLinkedList(head);
            InverseOrder(head);
            Console.Write("逆序后：");
            PrintLinkedList(head);
        }
        /// <summary>
        /// 生成单链表
        /// </summary>
        /// <param name="length">长度</param>
        /// <returns>单链表的头结点</returns>
        static LNode GenerateLinkedList(int length)
        {
            LNode head = new LNode();   //创建头结点
            head.next = null;
            head.data = length;
            LNode currentNode = head;   //当前节点
            LNode tmp = null;   //待插入节点
            for (int i = 0; i < length; i++)
            {
                tmp = new LNode();
                tmp.data = i;
                tmp.next = null;
                currentNode.next = tmp;
                currentNode = tmp;
            }
            return head;
        }
        /// <summary>
        /// 打印单链表
        /// </summary>
        /// <param name="head">单链表的头结点</param>
        static void PrintLinkedList(LNode head)
        {
            LNode currentNode = head.next;
            for (int i = 0; i < head.data; i++)
            {
                Console.Write(currentNode.data + "  ");
                currentNode = currentNode.next;
            }
            Console.WriteLine();
        }
        /// <summary>
        /// 逆序函数
        /// </summary>
        /// <param name="head">单链表的头结点</param>
        static void InverseOrder(LNode head)
        {
            if (head == null || head.next == null)
                return;

            LNode pre, cur, next;   //前驱，当前，后继
            cur = head.next;//cur占领第一个数据节点
            next = cur.next;//next占领下一个（保存接下来的节点）
            cur.next = null;//第一个数据节点变为新链表最后一个节点
            pre = cur;//pre走到cur的位置（保存上一个的节点）
            cur = next;//cur走到next的位置（转移阵地）

            while (cur.next != null)
            {
                next = cur.next;//先让next往前一步（保存接下来的节点）
                cur.next = pre;//逆序（指针改方向）
                pre = cur;//pre走到当前的位置（保存上一个的节点）
                cur = next;//cur走到next的位置（转移阵地）
            }
            cur.next = pre;//将旧链表的最后一个节点指向它的前一个几点（最后的逆序）
            head.next = cur;//当前cur正好在新链表的第一个数据节点，让头结点head指向它结束整个逆序工作。
        }
    }
    class LNode
    {
        public int data;
        public LNode next;
    }
}
```

这种方法只需要对链表进行一次遍历，时间复杂度为O(n)，n为链表长度。需要常数个额外变量来保存当前节点的前驱和后继，因此空间复杂度为O(1)。

## 方法二：递归法

```c# Program.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Project_LinkedList
{
    class Program
    {
        static void Main(string[] args)
        {
            LNode head = GenerateLinkedList(8);
            Console.Write("逆序前：");
            PrintLinkedList(head);
            InverseOrder(head);
            Console.Write("逆序后：");
            PrintLinkedList(head);
        }
        /// <summary>
        /// 生成单链表
        /// </summary>
        /// <param name="length">长度</param>
        /// <returns>单链表的头结点</returns>
        static LNode GenerateLinkedList(int length)
        {
            LNode head = new LNode();   //创建头结点
            head.next = null;
            head.data = length;
            LNode currentNode = head;   //当前节点
            LNode tmp = null;   //待插入节点
            for (int i = 0; i < length; i++)
            {
                tmp = new LNode();
                tmp.data = i;
                tmp.next = null;
                currentNode.next = tmp;
                currentNode = tmp;
            }
            return head;
        }
        /// <summary>
        /// 打印单链表
        /// </summary>
        /// <param name="head">单链表的头结点</param>
        static void PrintLinkedList(LNode head)
        {
            LNode currentNode = head.next;
            for (int i = 0; i < head.data; i++)
            {
                Console.Write(currentNode.data + "  ");
                currentNode = currentNode.next;
            }
            Console.WriteLine();
        }
        /// <summary>
        /// 逆序函数
        /// </summary>
        /// <param name="head">单链表的头结点</param>
        static void InverseOrder(LNode head)
        {
            if (head == null || head.next == null)
                return;

            LNode firstNode = head.next;
            LNode newHead = Inverse(firstNode);//逆序
            head.next = newHead;
        }
        static LNode Inverse(LNode head)
        {
            if (head == null || head.next == null)
                return head;

            LNode newHead = Inverse(head.next);//递归法找到旧链表最后一个节点作为新链表的第一个数据节点
            head.next.next = head;//子链表递归逆序
            head.next = null;//原来的指针指置为空
            return newHead;
        }
    }
    class LNode
    {
        public int data;
        public LNode next;
    }
}
```



## 方法三：插入法

```c# Program.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Project_LinkedList
{
    class Program
    {
        static void Main(string[] args)
        {
            LNode head = GenerateLinkedList(8);
            Console.Write("逆序前：");
            PrintLinkedList(head);
            InverseOrder(head);
            Console.Write("逆序后：");
            PrintLinkedList(head);
        }
        /// <summary>
        /// 生成单链表
        /// </summary>
        /// <param name="length">长度</param>
        /// <returns>单链表的头结点</returns>
        static LNode GenerateLinkedList(int length)
        {
            LNode head = new LNode();   //创建头结点
            head.next = null;
            head.data = length;
            LNode currentNode = head;   //当前节点
            LNode tmp = null;   //待插入节点
            for (int i = 0; i < length; i++)
            {
                tmp = new LNode();
                tmp.data = i;
                tmp.next = null;
                currentNode.next = tmp;
                currentNode = tmp;
            }
            return head;
        }
        /// <summary>
        /// 打印单链表
        /// </summary>
        /// <param name="head">单链表的头结点</param>
        static void PrintLinkedList(LNode head)
        {
            LNode currentNode = head.next;
            for (int i = 0; i < head.data; i++)
            {
                Console.Write(currentNode.data + "  ");
                currentNode = currentNode.next;
            }
            Console.WriteLine();
        }
        /// <summary>
        /// 逆序函数
        /// </summary>
        /// <param name="head">单链表的头结点</param>
        static void InverseOrder(LNode head)
        {
            if (head == null || head.next == null)
                return;

            LNode cur = head.next.next;//从第二个数据节点开始
            head.next.next = null;//第一个数据节点的下一个节点引用置为空
            LNode next = null;
            while(cur != null)
            {
                next = cur.next;//保存cur的下一个节点
                cur.next = head.next;//cur的下一个节点指向head的下一个
                head.next = cur;//head的下一个指向cur
                cur = next;//cur转到下一个
            }
        }
    }
    class LNode
    {
        public int data;
        public LNode next;
    }
}

```

