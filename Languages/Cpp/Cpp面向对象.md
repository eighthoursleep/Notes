# Cpp面向对象

需要基础概念：变量（variables）、类型（types, ex: int, float, char, struct ...）、作用域（scope）、循环（loops）、流程控制（flow control, ex: if-else, switch-case）

正规的、大气的编程习惯：

1. 良好的方式写Cpp Class（Object Based）
   - 没有指针成员的类
   - 有指针成员的类
2. Class之间的关系（Object Oriented）
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
cout << "i=" << i << endl;
```

### 头文件中的防卫式声明

yourheadfile.h

```cpp
#ifndef __YOURHEADFILE__
#define __YOURHEADFILE__

...
    
#endif
```

