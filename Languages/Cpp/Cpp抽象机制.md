# Cpp抽象机制

## 类

### 具体类型

基本思想：具体类的行为像内置类。比如`vector`和`string`很像内置的数组，只不过在可操作性上更胜一筹。

典型特征：表现形式是定义的一部分。表现形式只不过是一个或几个指向保存在别处的数据的指针，但这种表现形式出现在具体类的每一个对象中。允许：

- 把具体类型的对象置于栈、静态分配的内存或者其他对象中；
- 直接引用对象，而非仅仅通过指针或引用。
- 创建对象后立即进行完整的初始化
- 拷贝对象

类的表现形式可以被限定为私有的，只能通过成员函数访问，但它确实存在。

一旦表现形式发生了任何明显的改动，使用者就必须重新编译。

#### 一种算术类型

```cpp
class complex{
    double re,im;	//表现形式：两个双精度浮点数
    public:
    	complex(double r, double i) :re{r},im{i} {}	//用两个标量构建该复数
    	complex(double r) :re{r}, im{0} {}	//用一个标量构建该复数
    	complex() :re{0}, im{0} {}	//默认的复数是{0,0}
    	
    	double real() const {	//const说明符表示这个函数不会修改所调用的对象
            return re;
        }
    	void real(double d){
            re = d;
        }
    	double imag() const {
            return im;
        }
    	void imag(double d){
            im = d;
        }
    	complex& operator+=(complex z){	//加到re和im上然后返回
            re += z.re, im += z.im;
            return *this;
        }
    	complex& operator-=(complex z){
            re -= z.re, im -= z.im;
            return *this;
        }
    	complex& operator*=(complex);	//在类外的某处进行定义
    	complex& operator/=(complex);	//在类外的某处进行定义
    
    	complex operator+(complex a,complex b){
            return a+=b;
        }
    	complex operator-(complex a,complex b){
            return a-=b;
        }
    	complex operator-(complex a){	//一元负号
            return {-a.real(),-a.imag()};
        }
    	complex operator*(complex a,complex b){
            return a*=b;
        }
    	complex operator/(complex a,complex b){
            return a/=b;
        }
    	bool operator==(complex a,comlex b){	//相等
            return a.real() == b.real() && a.imag() == b.imag();
        }
    	bool operator!=(complex a,comlex b){	//不等
            return !(a==b);
        }
    	complex sqrt(complex);
    
}
void f(complex z){
    complex a{2.3};
    complex b{1/a};
    complex c{a+z*complex{1,2.3}};
    //...
    if(c != b){
        c = -(b/a) + 2 * b;
    }
}
```

编译器自动把计算complex值的运算符转换成对应的函数调用，例如`c != b`意味着`operator != (c,b)`，而`1/a`意味着`operator/(complex{1}, a)`。

在使用用户自定义的运算符（重载运算符）时，应该尽量小心谨慎，且尊重常规的使用习惯。不能定义一元运算符`/`，因为其语法在语言中已被固定。

同样，不可能改变一个运算符操作内置类型时的含义，因为不能重新定义运算符`+`令其执行`int`的减法。

#### 容器（container）

容器指一个**包含若干元素的对象**，因为`Vector`的对象都是容器，所以称`Vector`是一种容器类型。

`Vector`作为`double`的容器具有许多有点：

- 易于理解，建立有用的不变式
- 提供包含边界检查的访问功能
- 提供了`size()`以允许我们遍历其元素。

缺点：

- 使用`new`分配了元素但是从来没有释放这些元素。

尽管C++定义了一个垃圾回收的接口，将未使用的内存提供给新对象，但C++并不保证垃圾收集器总是可用的。

在某些情况下你不能使用回收功能，而且有的时候处于逻辑或者性能的考虑，你宁愿使用更精确的资源释放控制。

因此有了**析构函数(destructor)**这一机制以确保构造函数分配的内存一定会被销毁。

```cpp
class Vector{
    private:
    	double* elem;
    public:
    	Vector(int s) :elem{new double[s]}, sz{s}{	//构造函数：请求资源
            for(int i=0;i!=s;++i){
                elem[i] = 0;	//初始化元素
            }
        }
    	~Vector(){	//析构函数：释放资源
            delete[] elem;
        }
    	double& operator[](int i);
    	int size() const;
}
```

析构函数的命名规则是一个求补运算符`~`后接类的名字，含义是构造函数的补充。

析构函数使用`delete`运算符释放该空间以达到清理资源的目的。

这一切无需`Vector`的使用者干预，只需像使用普通的内置类型变量那样使用`Vector`对象即可，例如：

```cpp
void fct(int n){
    Vector v(n);
    // ... 使用 v ...
    {
        Vector v2(2*n);
        // ... 使用v、v2 ...
    }// v2在此处被销毁
    // ... 使用 v ...
}// v在此处被销毁
```

**构造函数/析构函数的机制是大部分C++通用资源管理技术的基础。**

构造函数负责分配空间并正确初始化成员，析构函数负责释放空间，是所谓**数据句柄模型（handle-to-data model）**。

这种模式常用来**管理对象生命周期种大小会发生变化的数据**。

在构造函数种请求资源，在析构函数种释放它们的技术称为**资源获取即初始化（Resource Acquisition Is Initialization, RAII）**。

好处：

1. 避免在普通代码种分配内存，把分配操作隐藏在行为良好的抽象的实现内部；
2. 使代码远离各种潜在风险，避免资源泄露。

### 抽象类型

抽象类型将使用者与类的实现细节完全隔离开来。

因为对抽象类型的表现形式一无所知，所以必须从自由存储为对象分配空间，然后通过引用或指针访问对象。

```cpp
class Container{
    public:
    virtual double& operator[](int) = 0;	//纯虚函数
    virtual int size() const = 0;	//常量成员函数
    virtual ~Container(){}	//析构函数
};
```

关键词`virtual`的意思是**“可能随后在其派生类种重新定义”**。

用关键词`virtual`声明的函数称为**虚函数**。

Container的派生类负责为Container接口提供具体实现。

`=0`说明该函数是**纯虚函数**，意味者Container的派生类必须定义这个函数。

含有纯虚函数的类称为**抽象类**。

Container的用法：

```cpp
void use(Container& c){
    const int sz = c.size();
    for(int i=0;i!=sz;++i){
        cout << c[i] << '\n';
    }
}
```

如果一个类负责为其他一些类提供接口，那么我们把前者称为**多态类型（polymorphic type）**。

作为一个抽象类，Container没有构造函数，因为它没有什么数据需要初始化。

Container有一个析构函数，且该析构函数是`virtual`的，因为抽象类需要通过引用或者指针来操作。

当我们试图通过一个指针销毁Container时，我们并不清楚它的实现部分到底拥有哪些资源。

```cpp
class Vector_container:public Container{
    Vector v;
    public:
    Vector_container(int s):v(s){}	//含有s个元素的Vector
    ~Vector_container(){}
    
    double& operator[](int i){
        return v[i];
    }
    int size() const {
        return v.size();
    }
}
```

`:public`可读作**“派生自”**或**“是...的子类型”**。

成员`operator[]()`和`size()`覆盖（override）了基类Container种的对应成员。

析构函数`~Vector_container()`覆盖了基类的析构函数`~Container()`。

成员`v`的析构函数（`~Vector()`）被其类的析构函数（`~Vector_container()`）隐式调用。

### 虚函数

### 类层次



## 拷贝和移动



## 模板

