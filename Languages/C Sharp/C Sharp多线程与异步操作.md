# C#多线程与异步操作

# 一、线程基础

## 为什么使用线程？

1. 将某段代码同其他低吗隔离，提高应用程序可靠性。
2. 简化代码。
3. 实现并发执行

**什么是并发执行？**

...

## 什么是线程？

### 1. 进程与线程

**进程**是**操作系统执行程序的基本单位**，**拥有应用程序的资源**。

（例：一个应用程序的一次运行。）

进程包含线程，**进程的资源被线程共享**，**线程不拥有资源**。

（一个进程包含很多线程。）

### 2. 前台线程和后台线程

通过**Thread类新建线程**默认为**前台线程**。**当所有前台线程关闭时，所有的后台线程也会被直接终止，不会抛出异常**。

### 3. 挂起（Suspend）和唤醒（Resume）

由于线程的执行顺序和程序的执行情况不可预知所以使用挂起和唤醒容易发生死锁的情况，在实际应用中应该尽量少用。

### 4. 阻塞线程

Join，阻塞调用线程，直到该线程终止。

### 5. 终止线程

Abort：抛出ThreadAbortException异常让线程终止，终止后的线程不可以唤醒。

Interrupt：抛出ThreadInterruptException异常让线程终止，通过捕获异常可以继续执行。

### 6. 线程优先级

AbortNormal、BelowNormal、Highest、Lowest、Normal，默认为Normal。

## 线程的使用

线程函数通过委托传递，可以不带参数，也可以带参数（只能有一个参数），可以用一个类或结构体封装参数。

```c#
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;

namespace TheardTest
{
    class Program
    {
        static void Main(string[] args)
        {
            Thread t = new Thread(Run);
            t.Start();
        }
        static void Run()
        {
            while(true)
            {
                Console.WriteLine("aaa");
            }
        }
    }
}
```



## 线程池



## 任务



## 委托异步执行



# 二、线程同步

## 原子操作（Interlocked）



## lock()语句



## Monitor实现线程同步



## ReaderWriterLock



## 事件（Event）类实现同步



## 信号量（Semaphore）



## 互斥体（Mutex）



## 跨进程间的同步







多线程处理的作用：

1. 实现多任务。
2. 解决延迟。

1. 多线程应用：计算量大的场景、计算时长久的业务，比如LOL中的战争迷雾，它需要算很多可视化和迷雾单位，需要独立的线程进行计算。
2. 在LOL中，每个正在战斗的房间，底层也是要求相互独立，可并行的，所以也需要多线程的支持。
3. 每次打开王者荣耀，要更新很多内容，如果不使用多线程下载更新，速度会更慢。
4. 其他

有关线程的对象：**Thread**（.net 4.0）、**Task** （.net 4.0之后）

线程同步保证数据的可靠性

# Thread

- 创建线程
  - 构建**Thread**实例，参数需要指定一个方法
  - 通过**Start方法**开始执行线程
  - 如果需要给方法传递参数，则使用**匿名函数( ) => { }**
  - 如果有返回值怎么办？定义变量进行接收
- 暂停线程
  - 通过Thread实例调用Join，可以阻止其他线程的调用，直到由该实例表示的线程终止
  - **线程实例.Join();**
  - 可以传递一个参数，表示最长**阻塞**多长时间的（单位：毫秒）
- 计时等待
  - **Thread.Sleep()**让线程休眠一段时间
  - 通过**静态方法**可以让当前的线程等待一定的时间，由参数决定等待的时间（单位：毫秒）
  - 它只影响当前执行的线程，其他线程依旧会执行
- 终止线程
  - **Thread.Abort();**
  - 该方法终止方式是对线程进行销毁，它适用于当线程要关闭的时候进行调度，能够保证线程程序关闭，线程也被销毁
  - 其他地方尽可能不要用，有其他方式，比如用在线程内部用了lock语句，那么强制关闭线程回导致lock失效从而可能影响计算结果
- 通过**信号控制**线程的**暂停**执行和**继续**执行
  - **ManualResetEvent**
- 检测线程状态
  - **thread.ThreadState**
- 前台线程和后台线程
  - 后台线程程序停止后可能还会继续执行
  - 前台线程程序停止都会停止掉左右前台线程，线程默认都是前台线程
- 访问当前线程
  - **Thread.CurrentThread.ManagedThreadId**

## 例1

本例包含：线程的**创建、启动、阻塞（等待）、休眠、终止**

IDE：**VS 2017**

创建项目类型：**控制台应用(.NET Framework)**

项目名：**Project_Thread**

**Program.cs**代码如下：

```c#
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Project_Thread
{
    class Program
    {
        static void Main(string[] args)
        {
            ThreadDemo threadDemo = new ThreadDemo();//实例化ThreadDemo
            threadDemo.Start();//启动三个任务：Thread01,Thread02,Thread03
        }

        
    }
}
```

在项目中新建一个类，取名为**ThreadDemo**

**ThreadDemo.cs**代码如下：

```c#
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Project_Thread
{
    class ThreadDemo
    {
        public void Start()
        {
            //多个线程，可以同时执行不同的任务，减少
            //通过线程调用方法
            Thread t1 = new Thread(Thread01);
            t1.Start();

            Thread t2 = new Thread(Thread02);
            t2.Start();

            Thread t3 = new Thread(Thread03);
            t3.Start();

            int count = 0;//局部变量
            Thread t4 = new Thread(()=> { count=Thread04(500); });//用匿名方法传递参数
            t4.Start();

            //等待线程执行完毕
            t4.Join();
            /*************以下代码块是有关进程的终止**********/
            Console.WriteLine(t4.ThreadState);//访问进程t4的当前状态
            try
            {
                t4.Abort();//终止线程，通过抛异常的形式销毁线程
                Console.WriteLine(t4.ThreadState);//访问进程t4的当前状态
            }
            catch (Exception e)//捕获异常
            {
                Console.WriteLine(e);//打印异常信息
            }
            /********************************************/
            
            Console.WriteLine("count是多少：" + count);
        }
        public void Thread01()
        {
            for(int i=0; i<100; i++)
            {
                //Thread.Sleep(1000); //当前进程休眠1000ms（1s）
                Console.WriteLine("Thread01: " + i);
            }
        }
        public void Thread02()
        {
            for (int i = 0; i < 100; i++)
            {
                Console.WriteLine("Thread02: " + i);
            }
        }
        public void Thread03()
        {
            for (int i = 0; i < 100; i++)
            {
                Console.WriteLine("Thread03: " + i);
            }
        }
        public int Thread04(int count)
        {
            int _count = 0;
            for (int i = 0; i < count; i++)
            {
                _count++;
                Console.WriteLine("Thread04: " + i);
            }
            return _count;
        }
    }
}
```

## 例2

本例包含**暂停执行、继续执行**

给项目新建一个类，取名为ManualResetEventDemo

ManualResetEventDemo.cs内容如下：

```c#
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Project_Thread
{
    //通过信号的形式控制线程的暂停与继续
    class ManualResetEventDemo
    {
        
        //停止信号
        ManualResetEvent mr = new ManualResetEvent(true);
        public ManualResetEventDemo()
        {
            Thread t = new Thread(Thread01);
            t.IsBackground = false;//false前台线程， true后台线程
            //基本不会用到这个属性 软件开发可能用到比较多
            //前台线程会在应用程序关闭的时候全部停止掉，后台线程在程序执行完之前不会停止。
            t.Start();

            Start();
        }
        public void Start()
        {
            //发送一个让线程继续执行的信号
            mr.Set();//继续
        }
        public void Stop()
        {
            mr.Reset();
        }
        public void Thread01()
        {
            Thread.Sleep(3000);
            int i = 0;
            while (true)
            {
                mr.WaitOne();
                //线程ID是系统自动分配的；每次都是不同的ID, 每个线程的ID唯一。
                Console.WriteLine("线程的ID: " + Thread.CurrentThread.ManagedThreadId);
                i++;
                Console.WriteLine("i的值：" + i);
                Thread.Sleep(3000);
            }
        }
    }
}
```

修改Program.cs如下：

```c#
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Project_Thread
{
    class Program
    {
        static void Main(string[] args)
        {
            //ThreadDemo threadDemo = new ThreadDemo();//实例化ThreadDemo
            //threadDemo.Start();//启动三个任务：Thread01,Thread02,Thread03
            ManualResetEventDemo mre = new ManualResetEventDemo();
            Console.WriteLine("输入 start:继续执行线程 stop:停止线程");
            while (true)
            {
                string s = Console.ReadLine();
                if(s == "start")
                {
                    mre.Start();
                }
                else if(s == "stop")
                {
                    mre.Stop();
                }
            }
        } 
    }
}
```



# Task

.net4.0之后推出，.net4.5又开放了更多接口

- 创建任务

- 接收返回值

- 计时等待

- 等待任务执行完毕

- 取消任务

  CancellationToken

  bool标志位 自定义逻辑 进行内部控制



## 例1（创建、接收返回值，阻塞）

通过VS 2017创建C#控制台应用项目Project_Task，新建一个类TaskDemo，编辑TaskDemo.cs如下:

```c#
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Project_Task
{
    class TaskDemo
    {
        public void Start()
        {
            //开始执行三个任务
            Task.Run((Action)Task01);
            //Run有多个重载方法，因此参数前要加上(Action)，指定只需要一个Action参数的Run方法
            Task.Run((Action)Task02);
            Task.Run((Action)Task03);

            Task t4 = Task.Run(() => {//用匿名方法传递参数
               mCount = Task04(10);
            });
            //线程等待，等待线程的执行完毕
            t4.Wait();
            Console.WriteLine("COUNT: " + mCount);
            
        }

        public int mCount = 0;

        private int Task04(int count)
        {
            int _count = 0;
            for (int i = 0; i < count; i++)
            {
                _count++;
                Console.WriteLine("Task04: " + i);
            };
            return _count;
        }

        private void Task03()
        {
            for (int i = 0; i < 8; i++)
            {
                Console.WriteLine("Task03: " + i);
            };
        }

        private void Task02()
        {
            for (int i = 0; i < 8; i++)
            {
                Console.WriteLine("Task02: " + i);
            }
        }

        private void Task01()
        {
            for(int i = 0; i < 8; i++)
            {
                Console.WriteLine("Task01: " + i);
            }
        }
    }
}
```

编辑Program.cs如下：

```c#
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Project_Task
{
    class Program
    {
        static void Main(string[] args)
        {
            TaskDemo taskDemo = new TaskDemo();
            taskDemo.Start();

            Console.ReadKey();//等待用户输入，阻塞程序，以便线程都工作完毕。
        }
    }
}
```

程序运行结果如下：

![image-20200406115319542](.\\CSharp多线程与异步操作\\image-20200406115319542.png)



## 例2（计时等待）

修改TaskDemo.cs如下：

```c#
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Project_Task
{
    class TaskDemo
    {
        public void Start()
        {
            Task.Run((Action)Task05);            
        }

        private async void Task05()
        {
            while (true)
            {
                Console.WriteLine("Task05执行中...");
                //Task.Delay 可以执行一个延时的操作
                await Task.Delay(1000);//单位毫秒 1000ms = 1s
            }
        }
    }
}
```

运行后控制台每隔1秒打印一次“Task05执行中...”

## 例3（取消任务）