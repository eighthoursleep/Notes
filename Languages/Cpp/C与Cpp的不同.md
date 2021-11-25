# C与C++的不同

首先HelloWorld不同

```c
#include "stdio.h"

void main(){
    printf("Hello world.");
}
```

```cpp
#include <stdio>
using namespace std;

int main(){
    cout << "Hello world." << endl;
    return 0;
}
```



## C和C++的bool

C语言要使用bool必须`#include "stdbool.h"`，而在C++里使用bool不需要这个包含命令。

## C和C++形参的引用和指针不同

C不支持传引用，C++支持传引用。

```cpp
struct MyStruct
{
    int Id=0;
    long int Coin=0;
};

void MyFunction(MyStruct &ms)//C++传引用，没有拷贝
{
    ms.Id = 2;
}
void MyFunctionC(MyStruct* ms)//C传指针，拷贝指针，消耗4个字节
{
	ms->Id = 2;
}

int main()
{
    MyStruct myStruct;
    MyFunction(myStruct);//传对象
    MyFunctionC(&myStruct);//传地址
    return 0;
}
```

声明的引用必须初始化，否则程序会崩溃。

引用具有唯一性。

```cpp
MyStruct ms,ms1;
MyStruct& r = ms;
MyStruct& r2 = NULL;//不能这么写，没有空引用
MyStruct& r3 = ms1;
r3 = r;//引用具有唯一性，这么写，ms1就和ms一模一样了.
```

引用的底层实现是指针。

对指针求`sizeof()`得到的是4个字节，这个是指针的大小，对引用求`sizeof()`，返回的就是对象的大小了。

## C和C++结构体函数不同

C的结构体里不能直接放函数，只能放函数指针。

C++里的结构体可以放函数。

```c
#include "stdio.h"

void HelloFunction(int a, int b)//函数定义
{
    
}
struct MyStruct
{
    void (*Hello)(int, int);//函数指针
    int a;
    int b;
} ms;

void main()
{
    ms.Hello = HelloFunction;//使用前先必须初始化函数指针
	ms.Hello(1,2);
}
```

```cpp
#include <iostream>
using namespace std;

struct FTest
{
    void Hello(int a,int b){
        
    };
    int a;
    int b;
} ft;

void main()
{
    ft.Hello(1,2);
}
```



## C和C++继承不同

C里没有继承。

