---
title: C#排序
date: 2020-07-02 18:04:22
toc: true
tags: C Sharp
categories: 算法
---

冒泡排序、选择排序、插入排序、希尔排序、快速排序

<!--more-->

# 一、算法概念简述

程序 = 算法 + 数据结构 + 程序设计方法 + 语言工具和环境
做任何事情都有一定的顺序。为解决一个问题而采取的方法和步骤，称为算法。

**排序的目标**：
获得有序序列以供便捷操作数据。

**排序策略**：
计算机不能像人那样通览所有数据，只能依据两两比较的结果来解决排序问题这个步骤是重复的：

1. 比较两个数据项；
2. 交换两个数据项或复制其中一个。

每种具体排序算法的实现细节不同。

# 二、冒泡排序

冒泡排序运行起来非常慢，但在概念上排序算法中最简单的，在刚开始研究排序时也是一种很好的排序算法。

> 最经典、最容易想到、最弱智、最低效的方案。

**算法描述**：

1. 比较两个数据项；
2. 如果左边的数据项大，交换两个数据项；
3. 向右移动位置重置1、2步。

**编码关键点**：

1. 需要冒泡的趟数；
2. 如何控制两两比较；
3. 如何优化不和已冒泡的最大值进行比较。

## 例1

```c# Program.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectSort
{
    class Program
    {
        static void Main(string[] args)
        {
            int[] array = { 17, 2, 23, 15, 6, 8 };
            BubbleSort(array);
            foreach (var item in array)
            {
                Console.WriteLine(item);
            }
        }
        //冒泡排序
        public static void BubbleSort(int[] array)
        {	//控制趟数
            for (int i = 0; i < array.Length - 1; i++)
            {	//
                for (int j = 0; j < array.Length - 1 - i; j++)
                {
                    if(array[j] > array[j + 1])
                    {
                        //交换数据
                        Swap(ref array[j], ref array[j + 1]);
                    }
                }
            }
        }

        public static void Swap(ref int number01, ref int number02)
        {
            int temp = number01;
            number01 = number02;
            number02 = temp;
        }
    }
}
```

![image-20200702183132754](image-20200702183132754.png)

# 三、选择排序

选择排序改进了冒泡排序，冒泡排序比较完就交换，而选择排序则是选出最小的才交换。

**算法描述**：

1. 扫描整个序列；
2. 从中挑出最小的数据项；
3. 将最小的数据项放置到合适的位置。



## 例1

```c# Program.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectSort
{
    class Program
    {
        static void Main(string[] args)
        {
            int[] array = { 17, 2, 23, 15, 6, 8 };
            SelectSort(array);
            foreach (var item in array)
            {
                Console.WriteLine(item);
            }
        }

        public static void SelectSort(int[] array)
        {
            for (int i = 0; i < array.Length - 1; i++)
            {
                int min = i;
                for (int j = i+1; j < array.Length; j++)
                {
                    if(array[min] > array[j])
                    {
                        min = j;
                    }
                }
                if(min != i)
                {
                    Swap(ref array[min], ref array[i]);
                }
            }
        }
        public static void Swap(ref int number01, ref int number02)
        {
            int temp = number01;
            number01 = number02;
            number02 = temp;
        }
    }
}
```

结果同“ 二、冒泡排序|例1 ”。

# 四、插入排序

插入排序是简单排序里最好的一种，但是稍微麻烦一些。

**算法描述**：

1. 假设部分有序（一般设第一个数据项为第一部分）；
2. 其他输入依次插入之前的有序序列。

若序列基本有序，此排序算法最优。

**要注意为待插入元素找到合适位置。**

## 例1

```c# Program.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectSort
{
    class Program
    {
        static void Main(string[] args)
        {
            int[] array = { 17, 2, 23, 15, 6, 8 };
            //BubbleSort(array);
            //SelectSort(array);
            InsertSort(array);
            foreach (var item in array)
            {
                Console.WriteLine(item);
            }
        }
        //插入排序
        public static void InsertSort(int[] array)
        {
            for (int i = 1; i < array.Length; i++)
            {	//1 -> (array.Length - 1)
                int temp = array[i];//待插入数据保存到temp
                int index = i;//寻找插入位置
                while (index !=0 && array[index-1] > temp)
                {
                    array[index] = array[index - 1];
                    index--;
                }
                //找到插入位置插入数据
                array[index] = temp;
            }
        }
    }
}
```

结果同“ 二、冒泡排序|例1 ”。

## 例2

```c# Program.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectSort
{
    class Program
    {
        static void Main(string[] args)
        {
            int[] array = { 17, 2, 23, 15, 6, 8 };
            InsertSort2(array);
            foreach (var item in array)
            {
                Console.WriteLine(item);
            }
        }
        //插入排序2
        public static void InsertSort2(int[] array)
        {
            for (int i = 1; i < array.Length; i++)
            {
                for (int j = i-1; j >= 0; j--)
                {
                    if(array[j] > array[j+1])
                    {
                        Swap(ref array[j], ref array[j + 1]);
                    }
                    else
                    {
                        break;//如果第i-1个比当前第i个小，就没必要继续判定i-1，i-2,...了。
                    }
                }
            }
        }
        public static void Swap(ref int number01, ref int number02)
        {
            int temp = number01;
            number01 = number02;
            number02 = temp;
        }
    }
}
```

结果同“ 二、冒泡排序|例1 ”。

# 五、希尔排序

希尔排序ShellSort也称“ 缩小增量排序 ”，是一种基于插入排序的一种改进，同样分成两部分。

例子：准备待排数组[6, 2, 4, 1, 5, 9]

首先选取关键字，例如关键字是3和1（第一步分为三组，第二步分为一组），那么待排数组分成了以下三种虚拟组：

[6, 1], [2, 5], [4, 9]。

以3为倍数的数字下分成一组

## 例1

```c# Program.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectSort
{
    class Program
    {
        static void Main(string[] args)
        {
            int[] array = { 17, 2, 23, 15, 6, 8 };
            ShellSort(array);
            foreach (var item in array)
            {
                Console.WriteLine(item);
            }
        }
        //Shell排序
        public static void ShellSort(int[] array)
        {
            for (int group = array.Length/2; group > 0; group /= 2)
            {
                for (int i = group; i < array.Length; i++)
                {
                    for (int j = i - group; j >= 0; j-= group)
                    {
                        if (array[j] > array[j + group])
                        {
                            Swap(ref array[j], ref array[j + group]);
                        }
                        else
                        {
                            break;
                        }
                    }
                }
            }
        }
        public static void Swap(ref int number01, ref int number02)
        {
            int temp = number01;
            number01 = number02;
            number02 = temp;
        }
    }
}
```

结果同“ 二、冒泡排序|例1 ”。

# 六、快速排序

快速排序是高级排序例最流行的一种，大多数情况下都是最快的。

**算法描述**：

1. 把序列**划分**为两个部分：左边较小的部分和右边较大的部分；
2. 调用自己的左边排序；
3. 调用自己的右边排序。

**注意**算法描述和递归的应用。

## 例1

```c# Program.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectSort
{
    class Program
    {
        static void Main(string[] args)
        {
            int[] array = { 17, 2, 23, 15, 6, 8 };
            QuickSort(array,0,array.Length-1);
            foreach (var item in array)
            {
                Console.WriteLine(item);
            }
        }
        //快速排序
        /// <summary>
        /// 为序列的某一部分进行划分
        /// </summary>
        /// <param name="array">完整序列</param>
        /// <param name="start">部分序列开始的位置</param>
        /// <param name="end">部分序列结束的位置</param>
        public static void QuickSort(int[] array, int start, int end)
        {   //划分
            if(start < end)
            {
                int s = start;
                int e = end;
                bool IsSwap = false;

                while(s < e)
                {
                    if(array[s] > array[e])
                    {
                        Swap(ref array[s], ref array[e]);
                        IsSwap = !IsSwap;
                    }
                    if(IsSwap)
                    {
                        s++;
                    }
                    else
                    {
                        e--;
                    }
                }
                //为划分完成后的左半部分再次进行划分
                QuickSort(array, start, e - 1);
                //为划分完成后的右半部分再次进行划分
                QuickSort(array, s + 1, end);
            }
        }
        public static void Swap(ref int number01, ref int number02)
        {
            int temp = number01;
            number01 = number02;
            number02 = temp;
        }
    }
}
```

结果同“ 二、冒泡排序|例1 ”。

# 七、运行时间检测





# 八、总结与简单比较

选择排序虽然把交换次数降到了最低，但比较次数仍然很大，当数据量很小并且交换数据相对于比较数据更加耗时的情况下可以选择使用选择排序。

**大多数情况下**，如果**数据量较小**或者序列基本有序的情况下，插入排序是**三种简单算法**的最好选择。

如果**数据量过大**，应考虑**快速排序**。

冒泡排序时排序算法里效率最低的，但是最简单最稳定。

插入排序是最常用的简单排序算法。

如果具有相同关键字的数据项序列，在排序过后它们的顺序不变，这样的算法就是稳定的。

其他算法还有许多：归并排序、基数排序、堆排序等等。