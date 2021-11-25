# C++多态与面向对象



## 重载

C语言不支持重载



## 重载在继承中的问题



## 虚函数

虚函数机制允许开发者在基类中声明函数，然后在每个派生类中重新定义这些函数，从而解决类型域方法的固有问题。

编译器和链接器会保证对象和施用于对象上的函数之间的关联方式。

为了允许一个虚函数声明能作为派生类中定义的函数的接口，派生类中函数的参数类型必须与基类中声明的参数类型完全一致，返回类型也只允许细微改变。虚成员函数有时候也称为“方法（method）”。

首次声明虚函数的类必须定义它（除非虚函数被声明为纯虚函数）。

即使没有派生类，也可以使用虚函数，而派生类如果不需要自有版本的虚函数，可以不定义它。

如果派生类中一个函数的名字和参数类型与基类中的一个虚函数完全相同，则称之为“覆盖（override）”了虚函数的基类版本。

此外，我们可以用派生层次更深的返回类型覆盖基类中的虚函数。

```cpp
#include <iostream>
using namespace std;

class Character
{
public:
	void BeginPlay();
	void Destroy();
};
class IAttack
{
public:
	virtual void Attack(Character* character)
	{
		cout << "Base Attack." << endl;
	}
};

class MeleeCharacter : public Character, public IAttack
{
public:
	void Attack(Character* character) {
		cout << "Melee Attack." << endl;
	}

};

class RangeCharacter : public Character, public IAttack
{
public:
	void Attack(Character* character) {
		cout << "Range Attack." << endl;
	}
};

void Test()
{
	MeleeCharacter mc;
	RangeCharacter rc;
	IAttack* atk1 = &mc;
	IAttack* atk2 = &rc;
	atk1->Attack(&rc);
	atk2->Attack(&mc);
}

int main()
{
	Test();
	return 0;
}
```

```text
Melee Attack.
Range Attack.
```

如果删掉`virtual`则打印：

```text
Base Attack.
Base Attack.
```

无论真正使用确切的基类类型是什么，都能令基类的函数表现出“正确的”行为，这称为“多态性”。具有虚函数的类型称为多态类型或者运行时多态类型。

为C++中为了**获得运行时多态行为**，必须调用`virtual`成员函数，**对象必须通过指针或者引用进行访问**。

当直接操作一个对象时（不是通过指针或引用），编译器了解其确切类型，便会不需要运行时多态。

默认情况下，覆盖虚函数的函数自身也变为虚函数。我们在派生类中可以重复关键字`virtual`，但这不是必须的。

建议是不重复`virtual`。如果明确标记覆盖版本，可使用`override`。

为了实现多态，编译器必须在基类的对象中保存某个类型信息并利用它选择虚函数的正确版本。

在一个典型的C++实现中，这个信息只会占用一个指针大小的空间。

常用的编译器实现技术是将虚函数名转换为函数指针表中的一个索引。这个表通常称为虚函数表（vbtl）。每个具有虚函数的类都有自己的虚函数表，用来标识它的虚函数。

虚函数表中的函数令对象能正确使用，即使调用者不了解对象的大小和数据布局也没关系。

调用者的实现只需要了解一个基类中虚函数表的位置以及每个虚函数的索引是多少即可。

这种虚调用机制可以做到与“正常函数调用”几乎一样高效（性能差距在25%以内），因此只要普通函数掉i用的性能可以接受，那么性能因素就不应该称为使用虚函数的障碍。

虚调用机制为每个对象带来的额外内存开销是一个指针，再街上每个类一个虚函数表。只有带虚函数的对象才需要付出这样的代价。如果选择使用类型域方法作为替代，也需要大致相当的额外内存开销。

从构造函数或析构函数中调用虚函数能反映出部分构造状态或部分销毁状态的对象。因此从构造函数或析构函数中调用虚函数通常是一个糟糕的注意。

## 纯虚函数

```cpp
#include <iostream>
using namespace std;

class Character
{
public:
    void BeginPlay();
    void Destroy();
};
class IAttack
{
public:
    virtual void Attack(Character* character)=0;//纯虚函数,派生类必须实现
};

class MeleeCharacter: public Character, public IAttack
{
public:
    void Attack(Character* character) {
        cout << "Melee Attack." << endl;
    }

};

class RangeCharacter : public Character, public IAttack
{
public:
    void Attack(Character* character) {
		cout << "Range Attack." << endl;
	}
};

void Test()
{
    MeleeCharacter mc;
    RangeCharacter rc;
    IAttack *atk1 = &mc;
    IAttack *atk2 = &rc;
    atk1->Attack(&rc);
    atk2->Attack(&mc);
}

int main()
{
    Test();
    return 0;
}
```



## final的用法



## override的用法



## 虚函数原理（面试必考）



## lambda表达式

lambda表达式有时也叫lambda函数，或者简称lambda。

它是定义和使用匿名函数对象的一种简便方式。

尤其是当我们想把操作当成实参传给算法时，这种便捷性尤其重要。在图形用户界面或其他类似场合中，这样的操作常被称为“回调（callback）”。

一个lambda表达式包含以下组成要件：

- 一个可能为空的捕获列表（capture list），指明定义环境中的哪些名字能被用在lambda表达式内，以及这些名字的访问方式是拷贝还是引用。捕获列表位于`[]`内。
- 一个可选的参数列表（parameter list），指明lambda表达式所需的参数。参数列表位于`()`内。
- 一个可选的`mutable`修饰符，指明该lambda表达式可能会修改它自身的状态。（即，改变通过值捕获的变量的副本）
- 一个可选的`noexcept`修饰符。
- 一个可选的`->`形式的返回类型声明。
- 一个表达式体（body），指明要执行的代码，表达式体位于`{}`内。

lambda表达式可以作为局部函数使用。

### 实现模型

例子：

```cpp
#include <vector>
#include <algorithm>

...

void print_modulo(const vector<int>& v, ostream& os, int m)
{
	for_each(begin(v), end(v),
		[&os, m](int x) { if (x % m == 0) os << x << '\n'; }
	);
}
```

等价函数：

```cpp
class Modulo_print
{
    ostream& os; // 装捕获列表的成员
    int m;
public:
    Modulo_print(ostream& s, int mm) :os(s), m(mm) {} //捕获
    void operator()(int x) const
    { if (x%m==0) os << x << '\n'; }
};

void print_modulo(const vector<int>& v, ostream& os, int m)
// 当v[i]可以被m整除时，输出v[i]到os 
{
	for_each(begin(v), end(v), Modulo_print{os,m});
}
```

我们把由lambda生成的类的对象称为闭包对象（closure object，简称“闭包”）。

如果lambda通过引用（使用捕获列表`[&]`）捕获它的每个局部变量，则其闭包对象可以优化为简单地包含一个指向外层栈框架的指针。

### 替换lambda

为lambda取名字，则之前的例子变为：

```cpp
void print_modulo(const vector<int>& v, ostream& os, int m)
{
    auto Modulo_print = [&os, m](int x) { if (x % m == 0) os << x << '\n'; };
	for_each(begin(v), end(v), Modulo_print);
}
```

命名lambda是一种高效的手段，可以让我们把注意力集中在如何设计操作本身上，代码布局更加简单，也能使用递归。

用`for`循环替代`for_each`：

```cpp
void print_modulo(const vector<int>& v, ostream& os, int m)
{
	for(auto x : v)
    {
        if (x % m == 0) os << x << '\n';
    };
}
```

泛化print_modulo()，令其可以处理更多容器类型：

```cpp
template<class C>
void print_modulo(const C& v, ostream& os, int m)
{
	for(auto x : v)
    {
        if (x % m == 0) os << x << '\n';
    };
}
```

改写成宽度优先遍历：

```cpp
template<class C>
void print_modulo(const C& v, ostream& os, int m)
{
    breadth_first(begin(v), end(v),
        [&os, m](int x) { if (x % m == 0) os << x << '\n'; }
    };
}
```

`for_each`替代`breadth_first`就会进行深度优先遍历。

当lambda作为遍历算法的实参时，其性能与对应的循环等价（通常完全一致）。

因此当我们需要在“算法 + lambda”和“for语句”之间抉择时，评判标准应该是格式的优劣以及对于可扩展性和可维护性的评估。

### 捕获



#### lambda与生命周期



#### 命名空间名字



#### lambda与this



#### mutable的lambda



### 调用与返回



### lambda的类型





## 类函数内的lambda表达式



## 如何封装C++库



## 如何封装C库



## const_ cast



## reinterpret_cast



## dynamic_cast



## static_cast



## const和形参连用



## const和类函数连用

