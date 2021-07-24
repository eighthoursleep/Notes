---
title: C#类内部内容全解
date: 2020-06-29 18:51:54
tags: C Sharp
toc: true
---

类内部九个内容的建立和访问方式

<!--more-->

# 字段

```
class ClassName
{
	public type data;
}

ClassName c = new ClassName();
c.data;
```

# 成员方法

```
class ClassName
{
	public type MethodName(){}
}

ClassName c = new ClassName();
c.MethodName();
```

# 成员属性

```
class ClassName
{
	type data;
	public type Data()
	{
		set
		{
			this.data = value;
		}
		get
		{
			value = data;
		}
	}
}

ClassName c = new ClassName();
c.Data;
```



# 对象构造

```
class ClassName
{
	public ClassName(){}
}

new ClassName();
```

# 析构

```
class ClassName
{
	~ClassName(){}
}

垃圾回收前自动调起。
```

# 静态字段

```
class ClassName
{
	public static type data;
}

ClassName.data;
```

# 静态方法

```
class ClassName
{
	public static type MethodName(){}
}

ClassName.MethodName();
```

# 静态构造

```
class ClassName
{
	static ClassName(){}
}

使用类就立即执行。
```

# 类属性

```
class ClassName
{
	static type data;
	public static type Data()
	{
		set
		{
			data = value;
		}
		get
		{
			value = data;
		}
	}
}

ClassName.Data;
```

