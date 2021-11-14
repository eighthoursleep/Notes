# Cpp容器与算法



## 标准库

### 什么是标准库



### 标准库头文件与命名空间



## 字符串



## I/O流



## 容器

大多数计算任务都会涉及创建值的集合，然后对这些集合进行操作。

例如，先读取若干字符到string中，然后打印这个string。

如果**一个类**的**主要目的是保存一些对象**，那么我们通常称之为**容器**。

为给定的任务**提供合适的容器**以及**之上有用的基本操作**，是构建任何程序的重要步骤。

标准库提供了一些既通用又好用的容器类型：

| vector<T>               | 可变大小向量           |
| ----------------------- | ---------------------- |
| list<T>                 | 双向链表               |
| forward_list<T>         | 单向链表               |
| deque<T>                | 双端队列               |
| set<T>                  | 集合                   |
| multiset<T>             | 允许重复值的集合       |
| map<K,V>                | 关联数组               |
| multimap<K,V>           | 允许重复关键字的map    |
| unordered_map<K,V>      | 采用哈希搜索的map      |
| unordered_multimap<K,V> | 采用哈希搜索的multimap |
| unordered_set<T>        | 采用哈希搜索的set      |
| unordered_multiset<T>   | 采用哈希搜索的multiset |

无序容器针对关键字（通常是一个字符串）搜索进行了优化，通过使用哈希表来实现。

从符号表示的角度看，标准库的各种容器和它们的基本操作比较类似。而且，不同容器的操作含义也大致相同。基本操作可用于每一种适用的容器，且高效实现。例如：

- `begin()`和`end()`分别返回指向首元素和尾后位置的迭代器。
- `push_back()`可用来返回指向首元素和尾后位置的迭代器。
- `size()`返回元素数目。

### vector

vector是STL中的一种常用容器。一个vector就是一个给定类型元素的序列，元素在内存种是连续存储的。

**注意**：当序列较短且元素尺寸较小时，`vector`通常比`list`高效（`insert()`和`erase()`操作也是如此）。

推荐将标准库`vector`作为存储元素列表的默认类型，只有当你有足够充分的理由时，再考虑选择其他容器。

#### 实现思想

// todo

#### 用法

初始化：

```cpp
vector<Entry> phone_book = {
    {"David Hume",123456},
    {"Kari Popper",234567},
    {"Bertrand Arthur William Russell",345678}
};
```

通过下标运算符访问元素，通过成员函数`size()`访问元素的数目：

```cpp
void print_book(const vector<Entry>& book){
    for(int i=0;i!=book.size();i++){
        cout << book[i] << endl;
    }
}
```

`vector`的所有元素构成一个范围，因此我们可以对其使用范围`for`循环：

```cpp
void print_book(const vector<Entry>& book){
    for(const auto& x: book)
        cout << x << endl;
}
```

定义一个`vector`时，为它设定一个初始元素数目：

```cpp
vector<int> v1 = {1,2,3,4};	//size为4
vector<string> v2;	//size为0
vector<Shape*> v3(23);	//size为23；元素初始值是nullptr
vector<double> v4(32,9,9);	//size为32；元素初始值全是9.9
```

我们可以用圆括号显式给出vector的大小，如上边的`v3(23)`。

**默认情况下，元素被初始化为其类型的默认值（例如，指针会被初始化为`nullptr`，整数会被初始化为0）。**

如果不想要默认值，你可以通过构造函数的**第2个实参**来**指定一个值**（例如，v4的32个元素初始化为9.9）。

`vector`的初始化大小随着程序的执行可以被改变。

`vector`最常用的一个操作就是`push_back()`，它向`vector`末尾追加一个新元素，从而将`vector`的规模增大1，例如：

```cpp
void input(){
    for(Entry e; cin >> e)
        phone_book.push_back(e);
}
```

标准库`vector`经过了精心设计，即使不断调用`push_back()`来扩充`vector`也会很高效。

在赋值和初始化时，`vector`可以被拷贝，例如：

```cpp
vector<Entry> book2 = phone_book;	//这里的拷贝和移动vector是通过构造函数和赋值运算符实现的。
```

**`vector`的赋值过程包括拷贝其中的元素。**

**当一个`vector`包含很多元素时，看起来无害的赋值或初始化可能非常耗时。**

因此，**当拷贝并非必要时，应当优先使用引用和指针或者移动操作。**

#### vector的元素

和多有STL容器一样，`vector`也是元素类型为T的容器，即`vector<T>`。

几乎任意一种数据类型都可以作为容器的元素类型，包括内置数值类型（如char、int、double）、用户自定义类型（如string、Entry、list<int>、Matrix<double, 2>）以及指针类型（如const char *、Shape *、double *）。

当插入一个元素时，它的值被拷贝到容器中。例如当你把一个整型值7存入容器时，结果元素确实就是一个值为7的整型对象，而不是指向某个整型对象7的引用或指针。

这样的策略促成了精巧、紧凑、访问快速的容器。对于在意内存大小和运行时性能的人来说，这个非常关键。

#### vector的范围检查

标准库`vector`并不进行范围检查，例如：

```cpp
void silly(vector<Entry>& book){
    int i = book[ph.size()].number;	//book.size()越界
    //...
}
```

这个初始化操作有可能将某个随机值存入`i`中，而不是产生一个错误。

通常使用vector的一个简单改进版本，增加范围检查：

```cpp
template<typename T>
class Vec:public std::vector<T>{
    public:
    	using vector<T>::vector;//使用vector的构造函数
    	T& operator[](int i)//范围检查
        {return vector<T>::at(i);}
    	const T& operator[](int i) const//常量版本
        {return vector<T>::at(i);}
};
```

`vector`的`at()`函数同样负责下标操作，但它会在参数越界时抛出一个类型为`out_of_range`的异常。

如果用户不捕获异常，则程序会以一种定义良好的方式退出，而不是继续执行或者以一种未定义个方式终止。



### list

STL提供了一个名为`list`的**双向链表**。

如果我们希望在一个序列中**添加和删除元素的同时无需移动其他元素**，应该使用`list`。

当使用链表时，我们通常并不想像使用向量那样使用它。即，不会用下标操作来访问链表元素，而是想进行**”在链表中搜索具有给定值的元素“这类操作**。

我们有时需要在`list`中定位一个元素。例如，我们可能想删除这个元素或者在这个元素之前插入一个新元素。

为此，我们需要使用**迭代器（iterator）**：一个`list`迭代器指向`list`中的一个元素，它可以用来遍历`list`。

每个STL都提供`begin()`和`end()`函数，分别返回一个指向首元素的迭代器和一个指向尾后位置的迭代器。

显式使用迭代器遍历`list`的例子：

```cpp
int get_number(const string& s){
    for(auto p = phone_book.begin(); p!=phone_book.end(); ++p){
        if(p->name == s){
            return p->number;
        }
    }
}
```

这样用，可以使函数更简练、更不容易出错。实际上，这样写差不多就是编译器最终实现范围for的方式。

给定一个迭代器`p`，`*p`表示它所指向的元素，`++p`令`p`指向下一个元素。当`p`指向一个类且该类有一个成员`m`时，`p->m`等价于`(*p).m`。



### map



### unordered_map





## 算法



## 建议

1. 没有必要推倒重来，直接使用STL是最好的选择；
2. 除非万不得已，大多时候先考虑使用STL，再考虑别的库；
3. STL绝非万能；
4. 如果你用到了某些STL设施，记得把头文件`#include`进来；
5. STL设施位于命名空间`std`中；
6. STL的`string`优于C风格字符串（`char`）;
7. `iostream`具有类型敏感、类型安全和可拓展等特点；
8. 与`T[]`相比，`vector<T>`、`map<K,T>`、`unordered_map<K,T>`更优；
9. 一定要了解各种STL的设计思想和优缺点；
10. 优先选用`vector`作为容器类型；
11. 数据结构应力求小巧；
12. 如果你拿不准会不会越界，记得使用带边界检查的容器（比如`Vec`）；
13. 用`push_back`或者`back_insert()`给容器添加元素；
14. 在`vector`上使用`push_back()`要比在数组上使用`realloc()`更好；
15. 在`main()`函数中捕获常见的异常；
16. 了解常用的标准库算法，用它们代替你自己手写的循环；
17. 如果迭代器实现某算法过于冗长，不妨改写成使用容器的版本。
