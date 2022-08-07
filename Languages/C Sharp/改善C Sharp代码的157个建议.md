# 改善C#代码的157个建议



## 基本语言要素



### 正确操作字符串

从2个方面规避性能开销：

1. 确保尽量少的装箱
2. 避免分配额外的内存空间

```c#
String str1 = "str1" + 9;//运行时会完成一次装箱行为
String str2 = "str2" + 9.ToString();//没有发生装箱行为
```

整形的`ToString`方法原型：

```c#
public override String ToString()
{
    return Number.FormatInt32(m_value, null, NumberFormatInfo,CurrentInfo);
}
```

`Number.FormatInt32`方法是一个非托管方法，原型如下：

```c#
[MethodImpl(MethodImplOptions.InternalCall), SecurityCritical]
public static extern string FormatInt32(int value, string format, NumberFormatInfo info);
```

该方法通过直接操作内存来完成从`int`到`string`的转换，效率比装箱高很多。

所以再使用其他值引用类型到字符串的转换并完成拼接时，应当避免使用操作符`+`来完成，而应当使用值引用类型提供的`ToString`方法。

指导原则：**在自己编写的代码中，应当尽可能地避免编写不必要的装箱代码。**

**注意：**装箱之所以会带来性能损耗，因为它需要完成以下3个步骤：

1. 为值类型在托管堆中分配内存。除了值类型本身所分配的内存外，内存总量还要加上类型对象指针和同步块索引所占用的内存。
2. 将值类型的值复制到新分配的堆内存中。
3. 返回已经成为引用类型的对象的地址。
