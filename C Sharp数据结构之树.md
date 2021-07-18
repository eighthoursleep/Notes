---
title: C#数据结构之树
date: 2020-05-01 22:03:40
tags: C Sharp
categories: 数据结构
toc: true
---

树的实现方式、树的遍历、二叉树

<!--more-->

# 最基本的树

用C#实现一个最基本的树，需要声明两个类，一个描述节点，一个描述整棵树

## 节点

```c#
public class TreeNode<T>
{
    public T Data { get; set; }
    public TreeNode<T> Parent { get; set; }
    public List<TreeNode<T>> Children { get; set; }
    public int GetHeight()
    {
        int height = 1;
        TreeNode<T> current = this;
        while (current.Parent != null)
        {
            height++;
            current = current.Parent;
        }
        return height;
    }
}
```

## 树

```c#
public class Tree<T>
{
	public TreeNode<T> Root { get; set; }
}
```

## 例1 一棵由整数构成的树

![image-20200924091112268](image-20200924091112268.png)

下边的代码只涉及了上图中的灰色节点

```c# Program.cs
using System;

namespace BasicTree
{
    public class Program
    {
        public static void Main()
        {
            Tree<int> tree = new Tree<int>();
            tree.Root = new TreeNode<int>() { Data = 100 };
            tree.Root.Children = new List<TreeNode<int>>
            {
                new TreeNode<int>() { Data = 50, Parent = tree.Root },
                new TreeNode<int>() { Data = 1, Parent = tree.Root },
                new TreeNode<int>() { Data = 150, Parent = tree.Root }
            };
            tree.Root.Children[2].Children = new List<TreeNode<int>>()
            {
                new TreeNode<int>() { Data = 30, Parent = tree.Root.Children[2] }
            };
        }
    }
}
```

```c# Tree.cs
using System.Collections.Generic;

namespace BasicTree
{
    public class Tree<T>
    {
        public TreeNode<T> Root { get; set; }
    }
    public class TreeNode<T>
    {
        public T Data { get; set; }
        public TreeNode<T> Parent { get; set; }
        public List<TreeNode<T>> Children { get; set; }
        public int GetHeight()
        {
            int height = 1;
            TreeNode<T> current = this;
            while (current.Parent != null)
            {
                height++;
                current = current.Parent;
            }
            return height;
        }
    }
}
```

## 例2 公司结构

下图描绘了一个开发团队的组成结构：

![image-20200924131214653](image-20200924131214653.png)

在上图的树结构中，每个节点存储多个字段，实现方式如下：（没有写完所有的节点）

```c# Program.cs
using System;
using System.Collections.Generic;

namespace BasicTree
{
    class Program
    {
        static void Main(string[] args)
        {
            Tree<Person> company = new Tree<Person>();
            company.Root = new TreeNode<Person>()
            {
                Data = new Person(100, "Marcin Jamro", "CEO"),
                Parent = null
            };
            company.Root.Children = new List<TreeNode<Person>>()
            {
                new TreeNode<Person>()
                {
                    Data = new Person(1, "John Smith", "Head of Development"),
                    Parent = company.Root
                },
                new TreeNode<Person>()
                {
                    Data = new Person(50, "Mary Fox", "Head of Research"),
                    Parent = company.Root
                },
                new TreeNode<Person>()
                {
                    Data = new Person(150, "Lily Smith", "Head of Sales"),
                    Parent = company.Root
                }
            };
            company.Root.Children[2].Children = new List<TreeNode<Person>>()
            {
                new TreeNode<Person>()
                {
                    Data = new Person(30, "Anthony Black", "Sales Specialist"),
                    Parent = company.Root.Children[2]
                }
            };
        }
    }
}
```

```c# Person.cs
namespace BasicTree
{
    public class Person
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Role { get; set; }
        public Person() { }
        public Person(int id, string name, string role)
        {
            Id = id;
            Name = name;
            Role = role;
        }
    }
}
```

# 二叉树

在[二叉树](https://en.wikipedia.org/wiki/Binary_tree)中，每个节点的子节点不能超过两个。因此两个子节点又区分地称为左节点和右节点。

![image-20200924135741178](image-20200924135741178.png)

## 树的遍历方式

- 前序遍历（pre-order）：“根左右”

- 中序遍历（in-order）：“左根右”

- 后序遍历（post-order）：“左右根”

![image-20200924142527178](image-20200924142527178.png)

## 节点实现

```c#
public class BinaryTreeNode<T> : TreeNode<T>
{
    public BinaryTreeNode() => Children = new List<TreeNode<T>>() { null, null };
    public BinaryTreeNode<T> Left
    {
        get { return (BinaryTreeNode<T>)Children[0]; }
        set { Children[0] = value; }
    }
    public BinaryTreeNode<T> Right
    {
        get { return (BinaryTreeNode<T>)Children[1]; }
        set { Children[1] = value; }
    }
}
```

## 树的实现

```C#
public class BinaryTree<T>
{
    public BinaryTreeNode<T> Root { get; set; }
    public int Count { get; set; }
}
```

## 树的遍历

```C#
//前序遍历
private void TraversePreOrder(BinaryTreeNode<T> node, List<BinaryTreeNode<T>> result)
{
    if (node != null)
    {
        result.Add(node);
        TraversePreOrder(node.Left, result);
        TraversePreOrder(node.Right, result);
    }
}
//中序遍历
private void TraverseInOrder(BinaryTreeNode<T> node, List<BinaryTreeNode<T>> result)
{
    if (node != null)
    {
        TraverseInOrder(node.Left, result);
        result.Add(node);
        TraverseInOrder(node.Right, result);
    }
}
//后续遍历
private void TraversePostOrder(BinaryTreeNode<T> node, List<BinaryTreeNode<T>> result)
{
    if (node != null)
    {
        TraversePostOrder(node.Left, result);
        TraversePostOrder(node.Right, result);
        result.Add(node);
    }
}
//遍历方式三选一
public List<BinaryTreeNode<T>> Traverse(TraversalEnum mode)
{
    List<BinaryTreeNode<T>> nodes = new List<BinaryTreeNode<T>>();
    switch (mode)
    {
        case TraversalEnum.PREORDER: TraversePreOrder(Root, nodes); break;
        case TraversalEnum.INORDER: TraverseInOrder(Root, nodes); break;
        case TraversalEnum.POSTORDER: TraversePostOrder(Root, nodes); break;
    }
    return nodes;
}
//遍历方式枚举
public enum TraversalEnum
{
	PREORDER, INORDER, POSTORDER
}
//获取树的高度
public int GetHeight()
{
    int height = 0;
    foreach (BinaryTreeNode<T> node in Traverse(TraversalEnum.PREORDER))
    {
        height = Math.Max(height, node.GetHeight());
    }
    return height;
}
```

## 例1 简易拷问

![image-20200924144320515](image-20200924144320515.png)

```c# BinaryTree.cs
using System.Collections.Generic;

namespace BasicTree
{
    public class Tree<T>
    {
        public TreeNode<T> Root { get; set; }
    }
    public class TreeNode<T>
    {
        public T Data { get; set; }
        public TreeNode<T> Parent { get; set; }
        public List<TreeNode<T>> Children { get; set; }
        public int GetHeight()
        {
            int height = 1;
            TreeNode<T> current = this;
            while (current.Parent != null)
            {
                height++;
                current = current.Parent;
            }
            return height;
        }
    }
}
```

```c# QuizItem.cs
namespace BasicTree
{
    public class QuizItem
    {
        public string Text { get; set; }
        public QuizItem(string text) => Text = text;
    }
}
```

```c# Program.cs
using System;
using System.Collections.Generic;

namespace BasicTree
{
    class Program
    {
        static void Main(string[] args)
        {
            BinaryTree<QuizItem> tree = GetTree();
            BinaryTreeNode<QuizItem> node = tree.Root;
            while (node != null)
            {
                if (node.Left != null || node.Right != null)
                {
                    Console.Write(node.Data.Text);
                    switch (Console.ReadKey(true).Key)
                    {
                        case ConsoleKey.Y:
                            WriteAnswer(" Yes");
                            node = node.Left;
                            break;
                        case ConsoleKey.N:
                            WriteAnswer(" No");
                            node = node.Right;
                            break;
                    }
                }
                else
                {
                    WriteAnswer(node.Data.Text);
                    node = null;
                }
            }
        }
        /// <summary>
        /// 获取QuizItem二叉树
        /// </summary>
        /// <returns>QuizItem二叉树根节点</returns>
        private static BinaryTree<QuizItem> GetTree()
        {
            BinaryTree<QuizItem> tree = new BinaryTree<QuizItem>();
            tree.Root = new BinaryTreeNode<QuizItem>()
            {
                Data = new QuizItem("Do you have experience in developing applications ? "),
                Children = new List<TreeNode<QuizItem>>()
                {
                    new BinaryTreeNode<QuizItem>()
                    {
                        Data = new QuizItem("Have you worked as a developer for more than 5 years ? "),
                        Children = new List<TreeNode<QuizItem>>()
                        {
                            new BinaryTreeNode<QuizItem>()
                            { Data = new QuizItem("Apply as a senior developer!")},
                            new BinaryTreeNode<QuizItem>()
                            { Data = new QuizItem("Apply as a middle developer!")}
                        }
                    },
                    new BinaryTreeNode<QuizItem>()
                    {
                        Data = new QuizItem("Have you completed the university?"),
                        Children = new List<TreeNode<QuizItem>>()
                        {
                            new BinaryTreeNode<QuizItem>()
                            { Data = new QuizItem("Apply for a junior developer!")},
                            new BinaryTreeNode<QuizItem>()
                            {
                                Data = new QuizItem("Will you find sometime during the semester?"),
                                Children = new List<TreeNode<QuizItem>>()
                                {
                                    new BinaryTreeNode<QuizItem>()
                                    {
                                        Data = new QuizItem("Apply for our long-time internship program!")
                                    },
                                    new BinaryTreeNode<QuizItem>()
                                    {
                                        Data = new QuizItem("Apply for summer internship program!")
                                    }
                                }
                            }
                        }
                    }
                }
            };
            tree.Count = 9;
            return tree;
        }
        /// <summary>
        /// 控制台打印结果
        /// </summary>
        /// <param name="text">返回绿色文本消息</param>
        private static void WriteAnswer(string text)
        {
            Console.ForegroundColor = ConsoleColor.DarkGreen;
            Console.WriteLine(text);
            Console.ForegroundColor = ConsoleColor.Gray;
        }
    }
}
```