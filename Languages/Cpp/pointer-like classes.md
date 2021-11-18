# pointer-like classes

## 智能指针

```cpp
//shared_ptr.h
#pragma once
#ifndef SHAREDPTR_H_
#define SHAREDPTR_H_

#include <iostream>

template<class T>
class sharedptr
{
public:
	T& operator*() const
	{
		return *px;
	}
	T* operator->() const
	{
		return px;
	}
	sharedptr(T* p):px(p){}
private:
	T* px;
	long* pn;
};

#endif // !SHAREDPTR_H_

```

```cpp
//Source.cpp
#include <iostream>
#include "shared_ptr.h"
using namespace std;

struct Foo
{
	void method(void) { cout << "Foo here." << endl; };
};

int main() {
	sharedptr<Foo> sp(new Foo);
	Foo f(*sp);
	sp->method();
	return 0;
}
```

## 迭代器

