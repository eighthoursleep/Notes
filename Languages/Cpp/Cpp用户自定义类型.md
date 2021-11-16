# Cpp用户自定义类型

内置类型（built-in type）：

基本类型、`const`修饰符和声明运算符构造的类型

为了与内置类型区别开，把**利用C++的抽象机制构建的新类型**称为用户自定义类型(user-defined type)，例如类、枚举等。

C++语言的内置类型及其操作的集合非常丰富，不过相对来说更偏重底层编程。

内置类型的有点时能够直接有效地展现出传统计算机硬件的特性，但并不能像程序员提供便于书写高级应用程序的上层特性。

为此C++扩充了内置类型和操作，提供了一套成熟的抽象机制，使程序员可以使用这套机制实现所需的上层功能。

抽象机制的目的主要是让程序员能够设计并实现它们自己的数据类型，这些类型具有恰当的表现形式和操作。



## 结构体

构造一种新类型的第一步通常使把所需元素组织成一种数据结构。

例子：

```cpp
struct PlayerData{	//结构体定义
    int statusNum;	//玩家状态个数
    double* status;	//指向玩家状态值的指针
}

void init_player_data(PlayerData& data, int statusNum){
    data.status = new double[statusNum];	//分配一个数组
    data.statusNum = statusNum;
}

double read_and_sum(int num){
    PlayerData data;
    init_player_data(data, num);
    for(int i=0;i!=num;++i){
        cin >> data.status[i];
    }
    double sum = 0;
    for(int i=0;i!=s;++i){
        sum += data.status[i];
    }
    return sum;
}
```

`new`运算符从一块名为**自由存储（free store）又称动态存储（dynamic memory）**或**堆（heap）**的区域中分配内存。

访问`struct`成员的方式有两种：

1. 通过名字或引用，这时使用`.`（点运算符）；
2. 通过指针，这时使用`->`。

```cpp
void f(PlayerData data, PlayerData& rData, PlayerData* pData){
    int statusNum = data.statusNum;	//通过名字访问
    int statusNum2 = rData.statusNum;	//通过引用访问
    int statusNum3 = pData->statusNum;	//通过指针访问
}
```

## 类

使用结构体的时候，数据和操作是分隔的。

当我们希望自己构建的类型易于使用和修改，数据的使用具有一致性，并且表示形式最好对用户是不可见的。此时最理想的做法是把类型的接口与其实现分立出来。

实现这一目的的语言机制称为类（class），类的成员可能是数据、函数或者类型。

类的public成员定义该类的接口，private成员则只能通过接口访问。例如：

```cpp
class Vector{
    public:
    	Vector(int s): elem{new double[s]}, sz{s} {}	//构建一个Vector
    	double& operator[](int i){ return elem[i];}	//通过下标访问元素
    	int size(){ return sz;}
    private:
    	double* elem;	//指向元素的指针
    	int sz;	//元素的数量
};
```

构造函数使用成员初始化器列表（`{}`）来初始化Vector的成员：

```cpp
:elem {new double[s]},sz{s}
```

这条语句的含义：首先从自由空间获取s个double类型的元素，并用一个指向这些元素的指针初始化elem；然后用s初始化sz。

**访问元素**的功能是由一个下标函数提供的，这个函数名为`operator[]`，它的返回值是对相应元素的引用（double&）。

## 枚举

```cpp
enum class Color {red, blue, green};
enum class Traffic_light {green, yellow, red};
Color color = Color::red;
Traffic_light light = Tranffic_light::red;
```

枚举类型常**用于描述规模较小的整数值集合**。通过使用由指代有意义的枚举值名字可**提高代码的可读性，降低出错的风险**。

`enum`后的`class`指明了**枚举是强类型的**，且它的枚举值位于指定的作用域中。不同的`enum class`是不同的类型，有助于防止对常量的意外误用。

注意不能隐式地混用枚举和整数值：

```cpp
int i = Color::red;	//错误，Color::red不是一个int
Color c = 2;	//错误，2不是一个Color对象
```

如果你不想显式地限定枚举值名字，并且希望枚举值可以是`int`，则应该去掉`class`得到一个“普通的”`enum`。

默认情况下，`enum class`只是定义了赋值、初始化和比较操作。