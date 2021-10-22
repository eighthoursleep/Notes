---
title: C#数据结构之二叉查找树
date: 2020-05-01 23:03:40
toc: true
tags: C Sharp
categories: 数据结构
---

二叉树查找树的实现、怎么查找节点、插入节点、删除节点

<!--more-->

# 二叉查找树（Binary Search Tree，BST）

遍历二叉树的时间复杂度是O(n)。如果我们要查找二叉树上的某一个具体节点，但树上的所有节点的值毫无规律，我们可能要遍历整棵树，这时耗费的时间随着节点数增多线性增长。

如果我们查找一个点但不希望遍历整棵树，未来减少不必要的操作，我们可以给二叉树加上严格的规定，让节点的值存在某种规律，于是出现了[**二叉查找树**](https://en.wikipedia.org/wiki/Binary_search_tree )。

**二叉查找树**对树上的任一节点的值有两个严格规定：

- 大于它的左子树上的所有节点值；
- 小于它的右子树上的所有节点值。

这样一来我们可以将要查的节点值与当前节点比较，判断接下来该进入左子树还是右子树。例如：

![image-20200925143941281](image-20200925143941281.png)

**节点类**实现上，在二叉树节点类的基础上做了修改（添加了二叉树父节点属性和获取高度方法）：

```c#
public class BinaryTreeNode<T> : TreeNode<T>
{
    public BinaryTreeNode() => Children = new List<TreeNode<T>>() { null, null };
    public new BinaryTreeNode<T> Parent { get; set; }
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
    public new int GetHeight()
    {
        int height = 1;
        BinaryTreeNode<T> current = this;
        while (current.Parent != null)
        {
            height++;
            current = current.Parent;
        }
        return height;
    }
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
```

因为二叉查找**树**上的节点在查找访问时，需要比较大小，因此BinarySearchTree类除了继承BinaryTree类，还需继承`IComparable`接口，即：

```c#
public class BinarySearchTree<T> : BinaryTree<T> where T : IComparable
{
}
public class BinaryTree<T>
{
    public BinaryTreeNode<T> Root { get; set; }
    public int Count { get; set; }
}
```

接下来我们向BinarySearchTree类里实现处理节点的三个方法——查找、插入、删除。

# 查找节点

```c#
public bool Contains(T data)
{
    BinaryTreeNode<T> node = Root;
    while (node != null)
    {
        int result = data.CompareTo(node.Data);
        if (result == 0)
        {
            return true;
        }
        else if (result < 0)
        {
            node = node.Left;
        }
        else
        {
            node = node.Right;
        }
    }
    return false;
}
```

# 插入节点

```c#
public void Add(T data)
{
    BinaryTreeNode<T> parent = GetParentForNewNode(data);
    BinaryTreeNode<T> node = new BinaryTreeNode<T>(){ Data = data, Parent = parent };
    if (parent == null)
    {
        Root = node;
    }
    else if (data.CompareTo(parent.Data) < 0)
    {
        parent.Left = node;
    }
    else
    {
        parent.Right = node;
    }
    Count++;
}
/// <summary>
/// 为新节点查找父母节点
/// </summary>
/// <param name="data">待添加节点</param>
/// <returns>返回合适的节点</returns>
private BinaryTreeNode<T> GetParentForNewNode(T data)
{
    BinaryTreeNode<T> current = Root;
    BinaryTreeNode<T> parent = null;
    while (current != null)
    {
        parent = current;
        int result = data.CompareTo(current.Data);
        if (result == 0)
        {
            throw new ArgumentException(
                $"The node {data} already exists.");
        }
        else if (result < 0)
        {
            current = current.Left;
        }
        else
        {
            current = current.Right;
        }
    }
    return parent;
}
```

# 删除节点

```c#
/// <summary>
/// 删除节点（已封装）
/// </summary>
/// <param name="data">节点的值</param>
public void Remove(T data)
{
    Remove(Root, data);//传入树的根节点
}
/// <summary>
/// 删除节点
/// </summary>
/// <param name="node">树的根节点</param>
/// <param name="data">待删除节点的值</param>
private void Remove(BinaryTreeNode<T> node, T data)
{
    if (node == null)
    {
        throw new ArgumentException(
            $"The node {data} does not exist.");
    }
    else if (data.CompareTo(node.Data) < 0)
    {
        Remove(node.Left, data);
    }
    else if (data.CompareTo(node.Data) > 0)
    {
        Remove(node.Right, data);
    }
    else
    {
        if (node.Left == null && node.Right == null)//如果是叶子，直接赋值为null
        {
            ReplaceInParent(node, null);
            Count--;
        }
        else if (node.Right == null)//如果只有左子树，左子树的根节点替换被删节点
        {
            ReplaceInParent(node, node.Left);
            Count--;
        }
        else if (node.Left == null)//如果只有右子树，右子树的根节点替换被删节点
        {
            ReplaceInParent(node, node.Right);
            Count--;
        }
        else //如果左右子树都存在，从右子树里找最小的节点的值来覆盖被删的值，然后删掉接班者的引用
        {
            BinaryTreeNode<T> successor = FindMinimumInSubtree(node.Right);
            node.Data = successor.Data;
            Remove(successor, successor.Data);
        }
    }
}
/// <summary>
/// 替换父母节点
/// </summary>
/// <param name="node">被替换节点</param>
/// <param name="newNode">替换值</param>
private void ReplaceInParent(BinaryTreeNode<T> node, BinaryTreeNode<T> newNode)
{
    if (node.Parent != null)
    {
        if (node.Parent.Left == node)
        {
            node.Parent.Left = newNode;
        }
        else
        {
            node.Parent.Right = newNode;
        }
    }
    else
    {
        Root = newNode;
    }
    if (newNode != null)
    {
        newNode.Parent = node.Parent;
    }
}
/// <summary>
/// 查找最小节点
/// </summary>
/// <param name="node">根节点的引用</param>
/// <returns>返回最小节点的引用</returns>
private BinaryTreeNode<T> FindMinimumInSubtree(BinaryTreeNode<T> node)
{
    while (node.Left != null)
    {
        node = node.Left;
    }
    return node;
}
```

首先接查待删除节点是否为空，然后通过条件分支语句判断`data.CompareTo(node.Data)`和递归调用Remove方法找到待删除节点。找到后，需要面临以下4种情况中的1种：

- 待删除的节点是叶子节点；
- 待删除的节点只有左子树；
- 待删除的节点只有右子树；
- 待删除的节点的左右子树都存在。

如果待删除的节点是**叶子**节点，直接**替换为空**。

如果待删除的节点**只有左子树**，**左子树**的根节点**替换**之。

![image-20200925171506574](image-20200925171506574.png)

如果待删除的节点**只有右子树**，**右子树**的根节点**替换**之。

如果待删除的节点的**左右**子树**都存在**，从右子树里找最小节点来替换（先是值的覆盖，然后再将这个接班者的引用替换为空（这个接班的一定是叶子节点））。

![image-20200925171717124](image-20200925171717124.png)

上述的所有**替换**，因为涉及父母节点，需要**判断**是**替换后**是成为父母节点的**左孩子还是右孩子**。

至于查找最小节点，只需循环访问左子树的左子树，最后返回叶子。

# 例1 二叉查找树可视化
