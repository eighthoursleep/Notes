---
title: C#面向对象基础（四）继承
date: 2020-06-27 13:01:06
tags: C Sharp
toc: true
categories: 面向对象
---

关键词：定义、原则、隐藏、base、向上转型、is和as

<!--more-->

# 一、什么是继承？

继承是由**已有的类**创建**新类**的**机制**。

由继承得到的类，称为**子类（派生类）**。
被继承的类成为**父类（超类、基类）**。

继承的**作用**：

1. 实现代码可复用的重要方式；
2. 增强代码的可扩充性；
3. 提高代码的可维护性。

**声明继承**

```
[<修饰符>] class <子类名> : (extends) <基类名> Object类
```

C#中多有的类都是Object的直接或间接子类。

# 二、继承的原则

**可继承内容：**

子类**继承**父类**私有以外的**成员变量、方法；
子类**不继承**父类的**构造方法**；
子类**继承**父类的**析构方法**；
子类**不能删除**父类的成员；
子类可以**重定义（隐藏/覆盖）**父类成员；
子类可以**增加**自己**独有**的成员。

子类对象**对父类成员的访问权限**：

子类可以访问父类**私有以外的**成员变量、方法；
注意：**受保护（protected）**只能在**子类内**访问。



# 三、隐藏

子类可以**重定义**与父类成员**同名的成员**，此时父类的成员被**隐藏**。

注意：程序中会出现警告，警告不影响执行。

消除警告的方法：在隐藏属性或方法中追加**new**关键字。

## 例1（重定义继承下来的父类成员）

```c# Program.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectExtends
{
    class Program
    {
        static void Main(string[] args)
        {
            TestHuman();
        }

        public static void TestHuman()
        {
            Human[] humen = new Human[3];//对象数组，humen指向humen[0],humen[1],humen[2]
            humen[0] = new Human("Jessie", "noodles", 100); //humen[*]才指向对象
            humen[1] = new Human("Max", "rice", 100);
            humen[2] = new Human("David", "porridge", 100);
            Animal animal = new Animal();
            foreach(var item in humen)
            {
                Console.WriteLine("{0}\t{1}\t{2}",item.Name,item.Age,item.Food);
            }
            Console.WriteLine("{0}\t{1}\t{2}", animal.Name, animal.Age, animal.Food);


        }
    }
    class Animal
    {
        string name = "beast";
        int age = 20;
        string food = "meat";

        public Animal()
        {

        }
        public Animal(string name, string food, int age)
        {
            this.name = name;
            this.age = age;
            this.food = food;
        }

        public string Name { get => name; set => name = value; }
        public int Age { get => age; set => age = value; }
        public string Food { get => food; set => food = value; }
    }
    class Human : Animal
    {
        string name;
        string food;
        int age;

        public Human(string name, string food, int age)
        {
            this.name = name;
            this.food = food;
            this.age = age;
        }

        public new string Name { get => name; set => name = value; }//添加new关键字，隐藏基类的成员
        public new string Food { get => food; set => food = value; }
        public new int Age { get => age; set => age = value; }
    }
}
```

![image-20200627192018244](image-20200627192018244.png)

# 四、base

base用于**引用（指向）**当前对象的父类对象

用法：

1. 访问父类被隐藏的成员变量；
2. 调用父类中被覆盖的方法；
3. 调用父类的构造函数。

如：

base.variable;

base.Method([paramList]);

:base([paramList]);

注意：

1. 写类要带无参构造，因为这样可以生成base，避免继承时报错。

2. base只在类内部和子类内部可以访问。

## 例1（没有父类无参构造，怎么通过子类构造父类对象）

```c# Program.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectExtends
{
    class Program
    {
        static void Main(string[] args)
        {
            TestHuman();
        }

        public static void TestHuman()
        {
            Human[] humen = new Human[3];//对象数组，humen指向humen[0],humen[1],humen[2]
            humen[0] = new Human("Jessie", "homo sapiens","noodles", 100); //humen[*]才指向对象
            humen[1] = new Human("Max", "homo sapiens", "rice", 100);
            humen[2] = new Human();
            foreach(var item in humen)
            {
                Console.WriteLine("{0}\t{1}\t{2}\t{3}",item.Name,item.Type,item.Age,item.Food);
            }
            Animal animal = humen[2].GetBase();
            Console.WriteLine("{0}\t{1}\t{2}\t{3}", animal.Name, animal.Type, animal.Age, animal.Food);

        }
    }
    class Animal
    {
        string name;
        string type;
        int age;
        string food;

        public Animal(string name, string type, string food, int age)
        {
            this.name = name;
            this.type = type;
            this.age = age;
            this.food = food;
        }

        public string Name { get => name; set => name = value; }
        public int Age { get => age; set => age = value; }
        public string Food { get => food; set => food = value; }
        public string Type { get => type; set => type = value; }
    }
    class Human : Animal
    {
        string name;
        string type;
        string food;
        int age;
        public Human() : base("Lucy", "Australopithecus afarensis", "fruit", 30)
            //先有父类对象才有子类对象
            //没有父类构造，但子类用无参构造，这时需要通过base构造父类对象
        {

        }
        public Human(string name, string type, string food, int age):base(name,type,food,age)
            //没有父类无参构造时，子类自己向外部要实参构造父类对象
        {
            this.name = name;
            this.type = type;
            this.food = food;
            this.age = age;
        }
        public Animal GetBase()
        {
            return new Animal(base.Name, base.Type, base.Food, base.Age);
        }
        public new string Name { get => name; set => name = value; }
        public new string Food { get => food; set => food = value; }
        public new int Age { get => age; set => age = value; }
        public string Type { get => type; set => type = value; }
    }
}
```

![image-20200627203755233](image-20200627203755233.png)

## 例2（父与子到底是谁花的钱？）

```c# Program.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectExtends
{
    class Program
    {
        static void Main(string[] args)
        {
            TestPay();
        }
        
        public static void TestPay()
        {
            Child child01 = new Child("John", 100,10000);
            Child child02 = new Child("Alice", 100,10000);
            child01.Pay(1000);
            child01.ShowMoney();
            child02.PayByDad(1000);
            child02.ShowMoney();
        }
    }
    class Father
    {
        string name;
        float money;

        public Father(string name, float money)
        {
            this.name = name;
            this.money = money;
        }

        public string Name { get => name; set => name = value; }
        public float Money { get => money; set => money = value; }

        public void Pay(float money)
        {
            this.money -= money;
        }
    }
    class Child : Father
    {
        float money; //child自己的money
        public Child(string name, float myMoney,float money) : base(name, money)
        {
            this.money = myMoney;
        }
        //child自己的封装
        public new float Money { get => money; set => money = value; }

        public new void Pay(float money)
            //child自己的Pay方法，如果不写，直接用Pay,则减的是base.Money
        {
            this.money -= money;
        }
        public void PayByDad(float money)
        {
            base.Money -= money;
        }
        public void ShowMoney()
        {
            Console.WriteLine("{0}：{1}\nFather of {2}：{3}",
                this.Name, this.money, this.Name, base.Money);
            //其实this.Name等于base.Name
            //Console.WriteLine(base.Name);
        }
    }
}
```

![image-20200627214253293](image-20200627214253293.png)

# 五、向上转型

子类和父类具有“is xxx”的关系

例如：

父类“人”和子类“学生”：“学生”是“人”
父类“动物”和子类“猫”：”猫“是“动物”

因此父类的引用可以指代子类的实例

动物 = 猫
人 = 学生

以上称之为：Upcasting/向上转型

上转型引用**访问范围受限**：

可以访问子类继承或覆盖的成员；不能访问子类中新增（独有）成员。
向上转型对象可以被重新赋值为子类引用

人 = 学生
学生 = （学生）人

这时它又重新可以访问子类中新增（独有）成员。

**作用：用一个引用处理各个子类对象，便于扩展和维护项目。**

**向上转型的使用范围**：

1. 方法参数：用一个方法处理家族对象；
2. 数组或集合的类型上：用于存储家族对象。

## 例1（转为父类，转回子类）

```c# Program.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectExtends
{
    class Program
    {
        static void Main(string[] args)
        {
            Tiger tiger = new Tiger("Tiger","meat");
            Lion lion = new Lion("Lion", "meat");
            TestEat(tiger);//用Animal类接收tiger，向上转型为父类
            TestEat(lion);//用Animal类接收lion，向上转型为父类
            TestTigerSleep(tiger);
        }
        public static void TestEat(Animal animal)
        {
            animal.Eat();//调用父类方法
        }
        public static void TestTigerSleep(Animal animal)
        {
            Tiger tiger = (Tiger)animal;//强转回Tiger类（子类）
            tiger.Sleep();//父类无法调用子类新增的方法，转回子类才可以。
        }
    }
    class Animal
    {
        string name;
        string food;
        public void Eat()
        {
            Console.WriteLine("{0} is eating.", name);
        }
        public Animal()
        {

        }
        public Animal(string name, string food)
        {
            this.name = name;
            this.food = food;
        }

        public string Name { get => name; set => name = value; }
        public string Food { get => food; set => food = value; }
    }
    class Tiger : Animal
    {
        public void Sleep()//子类新增方法
        {
            Console.WriteLine("Tiger is Sleeping.");
        }
        public Tiger(string name, string food) : base(name, food)
        {
        }
    }
    class Lion : Animal
    {
        public Lion(string name, string food) : base(name, food)
        {
        }
    }
}
```

![image-20200628111439520](image-20200628111439520.png)

## 例2（一种父类接收多种子类）

```c# Program.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectExtends
{
    class Program
    {
        static void Main(string[] args)
        {
            PK(new Warrior(), new Mage());//一种参数类型方法接收整个家族
            Player[] aoeHits = new Player[]//一种类型数组接收整个家族
            {
                new Warrior(), new Warrior(), new Warrior(),
                new Mage(), new Mage()
            };
        }
        public static void PK(Player player01, Player player02)
        {
            
        }
        public static void AOE()
        {

        }
    }
    class Player
    {
    }
    class Mage : Player
    {
    }
    class Warrior : Player
    {
    }
}
```

# 六、is和as

父类转子类，往往会发生异常。

原因：无法确认父引用是否经过向上转型

is/as：父类转子类的安全保障。

is语法：**对象引用 is 类型**
作用：检测对象引用是否属于某个类或其父类。
返回值：true/false
优势：适配所有类型（包括null）
劣势：效率稍低

as语法：**对象引用 as 类型**
作用：尝试转换对象引用为具体类型的引用
返回值：对象引用/null
优势：效率高
劣势：仅适配引用类型

## 例1（is用法）

```c# Program.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectExtends
{
    class Program
    {
        static void Main(string[] args)
        {
            Warrior warrior = new Warrior();
            Mage mage = new Mage();
            Movement(warrior);
            Movement(mage);
        }
        public static void Movement(Player player)//用父类Player接收
        {
            if(player is Warrior)//用is判断是否是Warrior类
            {
                Warrior w = (Warrior)player;//父类转回子类
                w.Attack();//调用子类方法
            }
            else if (player is Mage)//用is判断是否是Mage类
            {
                Mage m = (Mage)player;//父类转回子类
                m.CastSpell();//调用子类方法
            }
        }
    }
    class Player
    {
    }
    class Mage : Player
    {
        public void CastSpell()
        {
            Console.WriteLine("Mage is casting spell.");
        }
    }
    class Warrior : Player
    {
        public void Attack()
        {
            Console.WriteLine("Warrior is attacking the target.");
        }
    }
}
```

![image-20200629123959600](image-20200629123959600.png)

## 例2（as用法）

```c# Program.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectExtends
{
    class Program
    {
        static void Main(string[] args)
        {
            Warrior warrior = new Warrior();
            Mage mage = new Mage();
            Movement(warrior);
            Movement(mage);
        }
        public static void Movement(Player player)//用父类Player接收
        {
            Warrior w = player as Warrior;//尝试player是否可以转为Warrior类，失败返回null
            if(w != null)//做判断，如果是null，说明转型失败跳过调用Attack
            {
                w.Attack();
            }
            Mage m = player as Mage;//尝试player是否可以转为Mage类，失败返回null
            if(m != null)//做判断
            {
                m.CastSpell();
            }
        }
    }
    class Player
    {
    }
    class Mage : Player
    {
        public void CastSpell()
        {
            Console.WriteLine("Mage is casting spell.");
        }
    }
    class Warrior : Player
    {
        public void Attack()
        {
            Console.WriteLine("Warrior is attacking the target.");
        }
    }
}
```

结果同本小节例1。

