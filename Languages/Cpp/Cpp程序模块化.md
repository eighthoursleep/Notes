# Cpp程序模块化

构建C++程序的关键是清晰地定义这些组成部分之间的交互关系。

第一步是将某个部分的接口和实现分离开来。

在语言层面，C++使用声明来描述接口。声明指定了使用某个函数或者某种类型所需的所有内容。例如：

```cpp
double sqrt(double);	//接受一个double，返回值也是一个double

class Vector{
    public:
    	Vector(int s);
    	double& operator[](int i);
    	int size();
    private:
    	double* elem;	//elem指向一个数组，该数组包含sz个double
    	int sz;
};
```

```cpp
double sqrt(double d){
    ...
}
Vector::Vector(int s)	//构造函数的定义
    :elem{new double[s]},sz{s}{	//初始化成员
    
}
double& Vector::operator[](int i){	//下标运算符的定义
    return elem[i];
}
int Vector::size(){	//size()的定义
    return sz;
}
```

## 分离编译

C++支持分离编译，**用户代码只能看见所用类型和函数的声明，它们的定义则放置在分离的源文件里，并被分别编译**。这种机制有助于将一个程序组织成一组半独立的代码片段。

优点是**编译时间减到最少**，并且**强制要求程序中逻辑独立的部分分离开来**。

一个库通常是一组分离编译的代码片段（比如函数）的集合

一般情况下，我们把描述模块接口的声明放置在一个特定的文件中，文件名常常指示模块的预期用途。例如：

```cpp
//Vector.h:
class Vector
{
    public:
    	Vector(int s);
    	double& operator[](int i);
    	int size();
    private:
    	double* elem;
    	int sz;
}
```

这段声明被置于`Vector.h`文件中，称为**头文件**，用户将其包含进程序以访问接口。例如：

```cpp
// user.cpp:
#include "Vector.h"	//获得Vector的接口
#include <cmath>	//获得标准库数学函数接口，其中含有sqrt()
using namespace std;	//令std成员可见

double sqrt_sum(Vector& v)
{
    double sum = 0;
    for(int i=0;i!=v.size();++i)
    {
        sum += sqrt(v[i]);	//平方根的和
    }
    return sum;
}
```

为帮助编译器确保一致性，负责提供`Vector`实现部分的`.cpp`文件同样应该包含提供接口的`.h`文件：

```cpp
//Vector.cpp
#include "Vector.h"	//获得接口
Vector::Vector(int s)
    :elem{new double[s]},sz{s}
{
}
double& Vector::operator[](int i)
{
    return elem[i];
}
int Vector::size()
{
    return sz;
}
```

`user.cpp`和`Vector.cpp`中的代码共享`Vector.h`提供的`Vector`接口信息，但这两个文件是相互独立的，可以被分离编译。

![seperateCompile](F:\MyGitHub\Notes\Languages\Cpp\noteImg\seperateCompile.png)

分离编译不是语言问题，而是关于如何以最佳方式利用特定语言实现的问题。

分离编译机制在实际的编译过程中非常重要。最好的方法是最大限度地模块化，逻辑上通过语言特性描述模块，物理上通过划分文件及高效分离编译来充分利用模块化。

## 命名空间

命名空间机制一方面表达**某些声明是属于一个整体的**，另一方面表明**它们的名字不会与其他命名空间中的名字冲突**。例如：

```cpp
namespace My_code{
    class complex{/* ... */};
    complex sqrt(complex);
    // ...
    int main();
}
int My_code::main(){
    complex z{1,2};
    auto z2 = sqrt(z);
    std::cout << '{' << z2.real() << ',' << z2.imag() << "}\n";
    // ...
};
int main(){
    return My_code::main();
}
```

将代码放在命名空间中，可以确保自己的名字不会和命名空间std中的标准库名字冲突，因为标准库确实支持complex算术运算。

访问其他命名空间的某个名字最简单的方法是在这个名字前加上命名空间的名字作为限定，例如：

`std::cout`和`My_code::main`。“真正的`main()`”定义在全局命名空间中，它不属于任何自定义命名空间、类或函数。

想要**获取标准库命名空间中名字的访问权**，我们应该使用`using`指示。

命名空间主要用于**组织较大规模的程序组件**，最典型的例子是**库**。

使用命名空间可以把若干独立开发的部件组织成一个程序。

## 错误处理

错误处理是一个略显复杂的主题，其内容和影响远超语言特性层面，应该被归结为程序设计技术和工具范畴。

C++还是在这方面提供了一些有帮助的工具。

最主要的一个工具是类型系统本身。

在构建应用程序时，通常的做法不是仅仅依靠内置类型（如char、int、double）和语句（如if、while、for），而是建立更多适合应用的新类型（如string、map、regex）和算法（如sort()、find_if()和draw_all()）。

这些高层次的结构简化了程序设计，减少产生错误的机会，同时增加了编译器捕获错误的概率。

大多数C++的结构都致力于设计并实现优雅而高效的抽象模型（例如用户自定义类型和基于这些自定义类型的算法）。

这种模块化和抽象机制的一个重要影响是运行时错误的捕获位置与错误处理的位置被分离开来。

随着程序规模不断增长，特别是库的应用越来越广泛，处理错误的规范和标准变得愈加重要。

### 异常

以自定义类型Vector为例，Vector的作者并不知道使用者在何种程序场景中使用，也不能保证每次都检测到问题。

因此应该有Vector的实现者复杂检测可能的越界访问，然后通知使用者。

之后Vector的使用者可以采取适当的应对措施。例如，`Vector::operator[]()`能够检测到潜在越界访问错误并抛出一个out_of_range异常：

```cpp
double& Vector::operator[](int i){
    if(i<0 || size()<=i){
        throw out_of_range{
            "Vector::operator[]"
        };
        return elem[i];
    }
}
```

throw负责把程序的控制权从某个直接或间接调用`Vector::operator[]()`的函数转移到out_of_range异常处理代码。

### 不变式



### 静态断言（Static Assertions）

异常负责报告运行时发生的错误。

如果我们能在编译时发现错误，显然效果更好。这时大多数类型系统以及自定义类型接口的主要目的。

不过我们也可以堆其他一些编译时可知的属性做简单检查，并以编译报错的形式报告发现的问题，例如：

```cpp
static_assert(4 <= sizeof(int),"integers are too small");	//检查整型的尺寸
```

如果`4 <= sizeof(int)`为`false`，则输出消息"integers are too small"。

我们把这种表达某种期望的语句称为**断言（assertion）**。

static_assert机制用于任何可以表达为常量表达式的东西，例如：

```cpp
constexpr double C = 299792.458;

void f(double speed){
    const double local_max = 160.0/(60*60);
    
    static_assert(speed < C, "Can't go that fast");	//这样写是错误的，speed必须是常量
    static_assert(local_max < C, "Can't go that fast");	//这样写是正确的
    // ...
}
```

通常情况下，`static_assert(A, S)`的作用是**当A不为true时，把S作为一条编译器报错信息输出。**

`static_assert(A, S)`最重要的用途是**为泛型编程中作为形参的类型设置断言。**

