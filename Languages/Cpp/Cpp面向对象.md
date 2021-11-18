# Cpp面向对象

前置基础概念：

1. 变量（variables）、类型（types, ex: int, float, char, struct ...）、作用域（scope）、循环（loops）、流程控制（flow control, ex: if-else, switch-case）；

2. 知道一个程序需要编译、连接才能被执行；
3. 知道如何编译和链接（如何建立一个可运行程序）。

正规的、大气的编程习惯：

1. 良好的方式写Cpp Class（基于对象，Object Based）
   - 没有指针成员的类（例如：Complex）
   - 有指针成员的类（例如：String）
2. Class之间的关系（面向对象，Object Oriented）
   - 继承（inheritance）
   - 复合（composition）
   - 委托（delegation）

## Cpp演化

B（1969） -> C（1972） -> Cpp（1983，new C -> C with -> Cpp）

与Cpp相似的语言：Java，C#

Cpp 98 (1.0)

Cpp 03 (TR1, Technical Report 1)

Cpp 11 (2.0)

Cpp 14

使用新特性的开发人员不多

学语言分两部分：语言、标准库

基于对象的设计（Object Based）：面对的是单一class的设计

面向对象的设计（Object Oriented）：面对的是多重classes的设计，classes和classes之间的关系。



## 头文件与类的声明

### Cpp代码的基本形式

- 头文件：`.h`文件，声明类

- 源文件：

  ex.main()

  引用标准库要用尖括号：`#include <iostream.h>`

  引用自己的头文件要用双引号：`#include "yourheadfile.h"`

- 标准库：也是头文件

### 输出形式

```cpp
#include <iostream>
using namespace std;
int main()
{
    ...
	cout << "i=" << i << endl;
    ...
    return 0;
}
```

### 头文件中的防卫式声明

```cpp
//yourheadfile.h
#ifndef __YOURHEADFILE__
#define __YOURHEADFILE__

...
    
#endif
```

```cpp
//yourCode.cpp
#include <iostream>
#include "yourheadfile.h"
using namespace std;

int main()
{
    ...
    return 0;
}
```

### 头文件的布局

```cpp
//complex.h
#ifndef __COMPLEX__
#define __COMPLEX__
#include <cmath>

//前置声明
class ostream;
class complex;

complex& ___doapl(complex* ths, const complex& r);

//类声明
class complex
{
    ...
};
//类定义
complex::function ...
    
#endif
```

### 类的声明

#### inline(内联)函数

函数如果在类的本体里定义，就是inline函数。

inline的好处：享受宏的优点，快。

有的函数即使inline了，编译器也不一定会inline，是否inline由编译器决定。

```cpp
class complex
{
    public://访问级别：公开
    	complex (double r = 0, double i = 0): re(r),im(i) { }//inline
    	complex& operator += (const complex&);
    	double real () const { return re;}//inline
    	double imag () const { return im;}//inline
    private://访问级别：私有
    	doubel re, im;
    	friend complex& __doapl (complex*, const complex&);
};
```

#### class template(模板)简介

```cpp
template<typename T>
class complex
{
    public:
    	complex (T r = 0,T i = 0):re(r), im(i){ }
        complex& operator += (const complex&);
        T real () const {return re;}
        T imag () const {return im;}
    private:
    	T re, im;
    	friend complex& __doapl(complex*, const complex&);
};
```

```cpp
{
    complex<double> c1(2.5, 1.5);
    complex<int> c2(2, 6);
    ...
}
```

#### 构造函数

构造函数没有返回值，

```cpp
class complex
{
    public://访问级别：公开
    	complex (double r = 0, double i = 0)	//构造函数，有默认值
            : re(r), im(i)	//初始化阶段
        { }//赋值阶段
    	complex& operator += (const complex&);
    	double real () const { return re;}//inline
    	double imag () const { return im;}//inline
    private://访问级别：私有
    	doubel re, im;
    	friend complex& __doapl (complex*, const complex&);
};
```

构造函数可以这么写，虽然结果和上边的写法一致，但是效率差一些（放弃了初始化阶段），最好不要这么写：

```cpp
complex (double r = 0, double i = 0)
{ re = r; im = i;}//赋值阶段
```

**不带指针成员的类，多半不用写析构函数。**

构造函数可以有很多个（overloading，重载）：

```cpp
class complex
{
    public://访问级别：公开
    	complex (double r = 0, double i = 0)
            : re(r), im(i)
        { }
    	complex():re(0), im(0) { }//不能这样重载，这样写编译器不知道要用哪个构造函数

    	complex& operator += (const complex&);
    	double real () const { return re;}
    	double imag () const { return im;}
    	void real(double r){re = r;}//可以这么重载
    private://访问级别：私有
    	doubel re, im;
    	friend complex& __doapl (complex*, const complex&);
};
```

所有`real`函数经编译器编译后会变成如下的样子：

```cpp
?real@Complex@@ABENXZ
?real@Complex@@QAENABN@Z
```

构造函数私有化——单例模式：

```cpp
class A
{
    public:
    	static A& getInstance();
    	setup(){...}
    private:
    	A();
    	A(const A& rhs);
    	...
};

A& A::getInstance()
{
    static A a;
    return a;
}
```

### 常量成员函数（const member function）

```cpp
class complex
{
    public:
        complex(double r = 0,double i = 0)
            :re(r), im(i)
        { }
        complex& operator += (const complex&);
        double real() const {return re};
        double imag() const {return im};
    private:
    	double re, im;
    
   		friend complex& __doapl(complex*, const complex&);
}
```

如果类定义里，`real`和`imag`成员函数没有用`const`修饰，在代码中写`const complex c1(2,1);`在编译时会报错，因为编译器检查，发现前后矛盾。

### 参数转递

传值，pass by value

传引用，pass by reference

传引用不改变值，pass by reference to const

**参数传递，尽量传引用。**

### 友元（friend）

```cpp
class complex
{
    public:
        complex(double r = 0,double i = 0)
            :re(r), im(i)
        { }
        complex& operator += (const complex&);
        double real() const {return re};
        double imag() const {return im};
    private:
    	double re, im;
    
   		friend complex& __doapl(complex*, const complex&);//友元
};

inline complex&
__doapl(complex* ths, const complex& r)
{//自由取得friend的private成员
    ths->re += r.re;
    ths->im += r,im;
    return *ths;
}
```

相同class的各个object互为友元：

```cpp
class complex
{
    public:
    	complex(double r = 0, double i = 0)
            : re(r), im(i)
            { }
    	int func(const complex& param)
        { return param.re + param.im;}
    private:
    	double re, im;
};
...
{
    complex c1(2, 1);
    complex c2;
    
    c2.func(c1);
}
```

### 操作符重载

#### 成员函数

```cpp
inline complex&
__doapl(complex* ths, const complex& r)
{//自由取得friend的private成员
    ths->re += r.re;
    ths->im += r,im;
    return *ths;
}

inline complex&
complex::operator += (const complex& r)
{
    return __doapl(this,r);
}
```

```cpp
{
    complex	c1(2,1);
    complex c2(5);
    ...
    c1 += c2;//左边调用+=，右边作为参数传入
}
```

所有的成员函数都带有一个隐藏参数`this`

```cpp
complex:: operator += (const complex& r)
{
    return __doapl(this,r);
}
```

编译的时候：

```cpp
complex:: operator +=(this, const complex& r)
{
    return __doapl(this,r);
}
```

返回值传递引用的语法分析：

转递者无需知道接受者是以引用的方式接收。

#### 非成员函数

这种操作符重载没有隐藏参数`this`

为了对付用户的3种可能用法，对应开发3个函数：

```cpp
inline complex
operator + (const complex& x, const complex& y)
{
    return complex (real(x) + real(y), imag(x) + imag(y));
}

inline complex
operator + (const complex& x, double y)
{
    return complex (real(x) + y, imag(x));
}

inline complex
operator + (double x, const complex& y)
{
    return complex (x + real(y), imag(y));
}
```

```cpp
{
    complex c1(2,1);
    complex c2;
    
    c2 = c1 + c2;
    c2 = c1 + 5;
    c2 = 7 + c1;
}
```

#### 临时对象（temp object）

以下这些函数绝不可返回引用，因为它们返回的必定是局部对象。

`typename()`表示要创建临时对象，生命在下一行结束。

```cpp
inline complex
operator + (const complex& x, const complex& y)
{
    return complex(real(x) + real(y), imag(x) + imag(y));
}

inline complex
operator + (const complex& x, double y)
{
    return complex(real(x) + y, imag(x));
}

inline complex
operator + (double x, const complex& y)
{
    return complex(x + real(y), imag(y));
}
```

```cpp
{
    int(7);
    
    complex c1(2,1);//有名称
    complex c2;
    complex();//临时对象，没有名称
    complex(4,5);//临时对象，没有名称
    //执行到这一行，complex()和complex(4,5)就被释放
    cout << complex(2);//临时对象，没有名称
}
```

#### 取反操作符

```cpp
inline complex
operator + (const complex& x)
{
    return x;//没有临时对象
}

inline complex
operator - (const complex& x)
{//因为返回的临时对象，因此返回值，而非返回引用
    return complex(-real(x),-imag(x));
}
```

```cpp
{
    complex c1(2,1);
    complex c2;
    cout << -c1;
    cout << +c1;
}
```

#### 等号

```cpp
inline bool
operator == (const complex& x, const complex& y)
{
    return real(x) == real(y) && imag(X) == imag(y);
}

inline bool
operator == (const complex& x, double y)
{
    return real(x) == y && imag(X) == 0;
}

inline bool
operator == (double x, const complex& y)
{
    return x == real(y) && imag(X) == 0;
}
```

```c++
{
    complex c1(2,1);
    complex c2;
    
    cout << (c1 == c2);
    cout << (c1 == 2);
    cout << (0 == c2);
}
```

不等号同理

