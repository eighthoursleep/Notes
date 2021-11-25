# C++的继承与操作符重载



## 结构体成员权限

```CPP
#include <iostream>
using namespace std;

struct FHelloParent
{
    FHelloParent()
	{
		cout << "FHelloParent ctor" << endl;
        cout << "FHelloParent UserId = " << UserId << endl;
	}
	~FHelloParent()
	{
		cout << "FHelloParent dtor" << endl;
	}
private:
    int UserId = 10086;
protected:
	int UserCoin;
};

struct FHello : FHelloParent
{
    FHello()
    {
        cout << "private Coin2 = " << Coin2 << endl;
        cout << "Hello ctor" << endl;
        Id2 = 22;
        cout << "private Coin2 = " << Coin2 << endl;
    }
    ~FHello()
    {
        cout << "Hello dtor" << endl;
    }

    int Id = 1;//没有修饰默认为public

public:
    int Coin = 0;
private:
    int Id2 = 2;
    int Coin2 = 0;

public:
    void HelloThere() {
        UserCoin = 648;//访问继承的protected属性
        cout << "Hello There, UserCoin = " << UserCoin << endl;
    }
};

void Test() {
    FHello fhello;
    fhello.Coin = 999;//访问public属性

    cout << "fhello Id = " << fhello.Id << endl;
	cout << "fhello public Coin = " << fhello.Coin << endl;
	fhello.HelloThere();//访问public函数
}

int main()
{
    Test();
    return 0;
}
```

```text
FHelloParent ctor
FHelloParent UserId = 10086
private Coin2 = 0
Hello ctor
private Coin2 = 0
fhello Id = 1
fhello public Coin = 999
Hello There, UserCoin = 648
Hello dtor
FHelloParent dtor
```

## 类的成员函数

```cpp
#include <iostream>
using namespace std;

class Player
{
public:
    Player();
    ~Player();

    static void StartGame();

    void playGame();
private:
    int PlayerId = 7;
};

Player::Player()
{
    cout << "Player ctor" << endl;
}

Player::~Player()
{
    cout << "Player dtor" << endl;
}

void Player::StartGame()
{
    cout << "static StartGame function" << endl;
}

void Player::playGame()
{
    cout << "Player playGame" << endl;
    cout << "PlayerId = " << PlayerId << endl;
}

void Test()
{
    cout << "enter Test" << endl;
    Player player;
    player.playGame();
    Player::StartGame();
    cout << "exit Test" << endl;
}

int main()
{
    Test();
    return 0;
}
```

```text
enter Test
Player ctor
Player playGame
PlayerId = 7
static StartGame function
exit Test
Player dtor
```

## 类成员内联函数

```cpp
#include <iostream>
using namespace std;

class Player
{
private:
    int PlayerId = 7;
public:
    inline int GetPlayerId() const { return PlayerId; }//内联函数里不能出现for循环、switch、递归，不要写超过5行。
};

void Test()
{
    Player player;
    cout << "GetPlayerId : " << player.GetPlayerId() << endl;
}

int main()
{
    Test();
    return 0;
}
```

## 类的继承与成员函数

```cpp
#include <iostream>
using namespace std;


class GrandPa
{
public:
    int GrandPa_Money = 648;
protected:
    int GrandPa_Money_Protected = 6480;
};

class Father : public GrandPa
{
	/**
	 * GrandPa public -> Father public
	 * GrandPa protected -> Father protected
	 */
};

class Uncle : protected GrandPa
{
	/**
	 * GrandPa public -> Father protected
	 * GrandPa protected -> Father protected
	 */
};

class Aunt : private GrandPa
{
	/**
	 * GrandPa public -> Aunt private
	 * GrandPa protected -> Aunt private
	 */
};

class Son : public Father
{

};

class Cousin : public Aunt
{
	void Test() {
		//在这里无法访问GrandPa_Money;
	}
};

void Test()
{
	Son son;
	Father father;
	Uncle uncle;
	Aunt aunt;

	cout << "son.GrandPa_Money = " << son.GrandPa_Money << endl;
	//在这里无法访问son.GrandPa_Money_Protected

	cout << "father.GrandPa_Money = " << father.GrandPa_Money << endl;
	//在这里无法访问uncle.GrandPa_Money、aunt.GrandPa_Money
	
}

int main()
{
    Test();
    return 0;
}
```

## 类的多继承



## 类的虚继承



## 友元类



## 友元函数



## 构造函数和析构函数



## 初始化列表



## this指针



## 浅拷贝和深拷贝



## 命名空间



## 重载操作符

