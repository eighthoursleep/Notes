# C#网络编程

目标：访问网络共享资源、实现玩家之间的交互

技术点应用：软件、游戏、网站、App、...

程序之间如何通信：通过IP找到通信的主机、通过Port找到主机上的程序


# Socket-TCP

## 服务器

创建TcpListener实例x：

TcpListener.Create(port);

指定监听的端口



启动服务器：

x.Start();

### 例子

用VS2017创建控制台应用项目Server，添加类TCPServer。TCPServer.cs内容如下：

```c#
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;

namespace Server
{
    class TCPServer
    {
        //启动服务器的接口
        TcpListener tcpListener;

        public void Start()
        {
            try
            {
                //构建Socket网络通信
                //它是对Socket更上一层的封装
                //端口1-65535 每个程序的端口不能相同
                //在控制台输入指令：netstat -ano可以查看所有使用中的端口
                tcpListener = TcpListener.Create(7788);
                tcpListener.Start(500);
                Console.WriteLine("启动服务器成功！");
                //Accept方法进行监听来自客户端的连接
                Accept();

            }catch(Exception error)
            {
                Console.WriteLine(error);
            }
        }
        //监听客户端的接口
        private async void Accept()
        {
            try
            {
                TcpClient tcpClient = await tcpListener.AcceptTcpClientAsync();
                //访问
                Console.WriteLine("客户端已连接：" + tcpClient.Client.RemoteEndPoint);
                Accept();
            }
            catch (Exception error)
            {
                Console.WriteLine(error);
                tcpListener.Stop();//停止服务器工作
            }
            
        }
    }
}
```

Program.cs内容如下：

```c#
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
/// <summary>
/// 服务器-TCP
/// </summary>
namespace Server
{
    class Program
    {
        static void Main(string[] args)
        {
            TCPServer server = new TCPServer();
            server.Start();

            while (true)
            {
                //让程序阻塞在这里
                Console.ReadLine();
            }
            
        }
    }
}
```

程序运行后将在控制台打印“启动服务器成功！”



## 客户端

### 例子

用VS2017创建控制台应用项目Client，添加类Client。Client.cs内容如下：

```c#
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;

namespace Client
{
    class Client
    {
        TcpClient client;
        //启动
        public void Start()
        {
            client = new TcpClient();
            Connect();
            //连接的端口：7788
        }

        //连接服务器
        async void Connect()
        {
            try
            {
                await client.ConnectAsync("127.0.0.1", 7788);
                Console.WriteLine("连接成功！");
            }
            catch (Exception error)
            {

                Console.WriteLine(error.Message);
            }
        }
        //监听服务器消息

        //发送消息给服务器
    }
}
```

Progam.cs内容如下：

```c#
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
/// <summary>
/// 客户端-TCP
/// </summary>
namespace Client
{
    class Program
    {
        static void Main(string[] args)
        {
            Client client = new Client();
            client.Start();
            while (true)
            {
                Console.ReadLine();
            }
        }
    }
}
```

先运行上一个TCP服务器例子程序，然后运行TCP客户端例子程序，客户端控制台打印“连接成功！”，服务器控制台打印：

启动服务器成功！
客户端已连接：[::ffff:127.0.0.1]:60056



## 服务器与客户端相互发送、接收消息例子

### 作为服务器的Server项目

#### Program.cs

```c#
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
/// <summary>
/// 服务器-TCP
/// </summary>
namespace Server
{
    class Program
    {
        static void Main(string[] args)
        {
            TCPServer server = new TCPServer();
            server.Start();

            while (true)
            {
                //让程序阻塞在这里
                string text = Console.ReadLine();
                server.tempClient.Send(Encoding.UTF8.GetBytes(text));
            }
            
        }
    }
}
```

#### TCPServer.cs

```c#
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;

namespace Server
{
    class TCPServer
    {
        //启动服务器的接口
        TcpListener tcpListener;

        public void Start()
        {
            try
            {
                //构建Socket网络通信
                //它是对Socket更上一层的封装
                //端口1-65535 每个程序的端口不能相同
                //在控制台输入指令：netstat -ano可以查看所有使用中的端口
                tcpListener = TcpListener.Create(7788);

                tcpListener.Start(500);
                Console.WriteLine("启动服务器成功！");
                //Accept方法进行监听来自客户端的连接
                Accept();

            }catch(Exception error)
            {
                Console.WriteLine(error);
            }
        }

        public Agent tempClient;
        //监听客户端的接口
        private async void Accept()
        {
            try
            {
                TcpClient tcpClient = await tcpListener.AcceptTcpClientAsync();
                //访问连接的客户端的远程IP和端口
                //IPv6的格式，IPv4没有ffff:这样的前缀
                Console.WriteLine("客户端已连接：" + tcpClient.Client.RemoteEndPoint);

                //tcpClient代表与客户端的连接，通过它可以给客户端发送消息或接收客户端的消息。
                //1对多，构建每一个玩家的数据模型，在它内部去模拟每个玩家的行为。
                Agent agent = new Agent(tcpClient);
                tempClient = agent;
                Accept();
            }
            catch (Exception error)
            {

                Console.WriteLine(error);
                tcpListener.Stop();//停止服务器工作
            }
            
        }
    }
}
```

#### Agent.cs

```c#
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;

namespace Server
{
    class Agent
    {
        TcpClient client;
        public Agent(TcpClient tcpClient)
        {
            client = tcpClient;
            //接收来自客户端的消息
            Recieve();
        }

        void Input()
        {
            Console.ReadLine();
        }
        /// <summary>
        /// 接收来自客户端的消息
        /// </summary>
        private async void Recieve()
        {
            //while循环进行持续的接收
            //条件是这个Socket处于连接状态

            //从流中读取数据
            while (client.Connected)
            {
                try
                {
                    //缓存接收到的数据 byte[]
                    byte[] buffer = new byte[4096];

                    int length = await client.GetStream().ReadAsync(buffer,0,buffer.Length);
                    //将字节数组转化为字符串
                    Console.WriteLine(Encoding.UTF8.GetString(buffer, 0, length));
                }
                catch (Exception error)
                {
                    Console.WriteLine(error.Message);
                    client.Close();
                }
                
            }
        }

        /// <summary>
        /// 发送消息给客户端
        /// </summary>
        /// <param name="data"></param>
        public async void Send(byte[] data)
        {

            //客户端处于连接状态才能发送消息
            if (client.Connected)
            {
                //使用try catch方式来捕捉发送的时候可能出现的异常
                try
                {
                    //networkStream，向这个网络流，异步地写入数据=发送消息给服务器
                    await client.GetStream().WriteAsync(data, 0, data.Length);
                    Console.WriteLine("发送成功！");
                }
                catch (Exception error)
                {
                    //打印异常消息，关闭客户端与服务器的连接
                    client.Close();
                    Console.WriteLine(error.Message);
                }

            }
        }
    }
}
```

### 作为客户端的Client项目

#### Program.cs

```c#
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
/// <summary>
/// 客户端-TCP
/// </summary>
namespace Client
{
    class Program
    {
        static void Main(string[] args)
        {
            Client client = new Client();
            client.Start();
            while (true)
            {
                string input = Console.ReadLine();
                client.Send(Encoding.UTF8.GetBytes(input));
            }
        }
    }
}
```

#### Client.cs

```c#
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;

namespace Client
{
    class Client
    {
        TcpClient client;
        //启动
        public void Start()
        {
            client = new TcpClient();
            Connect();
            //连接的端口：7788
        }

        //连接服务器
        async void Connect()
        {
            try
            {
                await client.ConnectAsync("127.0.0.1", 7788);
                Console.WriteLine("连接成功！");
                Recieve();
            }
            catch (Exception error)
            {

                Console.WriteLine(error.Message);
            }
        }
        //监听服务器消息

        //发送消息给服务器
        public async void Send(byte[] data)
        {
            
            //客户端处于连接状态才能发送消息
            if (client.Connected)
            {
                //使用try catch方式来捕捉发送的时候可能出现的异常
                try
                {
                    //networkStream，向这个网络流，异步地写入数据=发送消息给服务器
                    await client.GetStream().WriteAsync(data, 0, data.Length);
                    Console.WriteLine("发送成功！");
                }
                catch (Exception error)
                {
                    //打印异常消息，关闭客户端与服务器的连接
                    client.Close();
                    Console.WriteLine(error.Message);
                }
                
            }
        }
        /// <summary>
        /// 接收服务器发来的消息
        /// </summary>
        private async void Recieve()
        {
            //while循环进行持续的接收
            //条件是这个Socket处于连接状态

            //从流中读取数据
            while (client.Connected)
            {
                try
                {
                    //缓存接收到的数据 byte[]
                    byte[] buffer = new byte[4096];

                    int length = await client.GetStream().ReadAsync(buffer, 0, buffer.Length);
                    //将字节数组转化为字符串
                    Console.WriteLine(Encoding.UTF8.GetString(buffer, 0, length));
                }
                catch (Exception error)
                {
                    Console.WriteLine(error.Message);
                    client.Close();
                }

            }
        }
    }
}
```

运行Server项目，服务端控制台打印消息“启动服务器成功！”。

运行Client项目，客户端控制台打印消息“连接成功！”，服务端控制台打印消息“客户端已连接...”。

在客户端输入消息后回车，服务端接收到消息并打印。

在服务端输入消息后回车，客户端端接收到消息并打印。

![image-20200416173425579](.\\CSharp网络编程\\image-20200416173425579.png)


# Socket-UDP

相对TCP而言，UDP不需要建立连接。

TCP在建立连接后，每次未来数据的准确到达，都会进行发送和接收的确认。

## 服务器

构建UdpClient对象x，构建的时候绑定端口

提供异步接收的接口，**RecieveAsync**

提供异步发送的接口，**SendAsync**

项目：Project_Server

Program.cs

```c#
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Project_Server
{
    class Program
    {
        static void Main(string[] args)
        {
            UDPServer server = new UDPServer();
            server.Start();
            while (true)
            {
               string text = Console.ReadLine();
            }
        }
    }
}
```



UDPServer.cs

```c#
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;

namespace Project_Server
{
    class UDPServer
    {
        UdpClient udpClient;

        public void Start()
        {
            //1-65535
            udpClient = new UdpClient(8899);
            Recieve();
        }

        IPEndPoint remote;
        /// <summary>
        /// 接收消息
        /// </summary>
        private async void Recieve()
        {
            while (udpClient != null)
            {
                try
                {
                    //接收客户端的消息
                    UdpReceiveResult result = await udpClient.ReceiveAsync();
                    remote = result.RemoteEndPoint;

                    string text = Encoding.UTF8.GetString(result.Buffer);
                    Console.WriteLine("接收到的数据：" + text);
                }
                catch (Exception error)
                {
                    Console.WriteLine("接收异常：" + error.Message);
                    udpClient.Close();
                    udpClient = null;
                }             
            }
        }
        /// <summary>
        /// 发送消息
        /// </summary>
        /// <param name="data"></param>
        private void Send(byte[] data)
        {

        }
    }
}
```



## 客户端

构建UdpClient对象x，端口可以传递0，系统自动分配

提供异步接收的接口，**RecieveAsync**

提供异步发送的接口，**SendAsync**

项目名：Project_Client

Program.cs

```c#
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Project_Client
{
    class Program
    {
        static void Main(string[] args)
        {
            Client client = new Client();
            client.Start();
            while (true)
            {
                string text = Console.ReadLine();
                client.Send(Encoding.UTF8.GetBytes(text));
            }
        }
    }
}
```



Client.cs

```c#
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;

namespace Project_Client
{
    class Client
    {
        UdpClient udpClient;

        public void Start()
        {
            //0表示由系统任意分配
            udpClient = new UdpClient(0);
        }

        public async void Send(byte[] data)
        {
            if (udpClient != null)
            {
                 try
                {
                    int length = await udpClient.SendAsync(data, data.Length, "127.0.0.1", 8899);
                    if (data.Length == length)
                    {
                        Console.WriteLine("完整的发送！");
                    }

                }
                catch (Exception error)
                {

                    Console.WriteLine(error.Message);
                    udpClient.Close();
                }
            }
            else
            {
                udpClient.Close();
                udpClient = null;
            }
           
        }
    }
}
```

程序运行后在Project_Client的控制台窗口输入要发送的消息后回车，Project_Server的控制台窗口将打印接收到的消息，如下图：

![image-20200418223632262](.\\CSharp网络编程\\image-20200418223632262.png)



## 服务器与客户端相互发送、接收消息例子

### Project_Server

#### Program.cs

```c#
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Project_Server
{
    class Program
    {
        static void Main(string[] args)
        {
            UDPServer server = new UDPServer();
            server.Start();
            Console.WriteLine("服务器已打开，请先接收客户端的消息");
            while (true)
            {
               string text = Console.ReadLine();
               server.Send(Encoding.UTF8.GetBytes(text));
            }
        }
    }
}
```



#### UDPServer.cs

```c#
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;

namespace Project_Server
{
    class UDPServer
    {
        UdpClient udpClient;

        public void Start()
        {
            //1-65535
            udpClient = new UdpClient(8899);
            Recieve();
        }

        IPEndPoint remote;
        /// <summary>
        /// 接收消息
        /// </summary>
        private async void Recieve()
        {
            while (udpClient != null)
            {
                try
                {
                    //接收客户端的消息
                    UdpReceiveResult result = await udpClient.ReceiveAsync();
                    remote = result.RemoteEndPoint;

                    string text = Encoding.UTF8.GetString(result.Buffer);
                    Console.WriteLine("接收到的数据：" + text);
                }
                catch (Exception error)
                {

                    Console.WriteLine("接收异常：" + error.Message);
                    udpClient.Close();
                    udpClient = null;
                }  
            }     
        }
        /// <summary>
        /// 发送消息
        /// </summary>
        /// <param name="data"></param>
        public async void Send(byte[] data)
        {
            if(udpClient != null)
            {
                try
                {
                    //对客户端来讲，它肯定是知道服务器的IP和端口
                    //对服务器来说，它无法知道客户端的IP和端口
                    //使用UDP都需要客户端先发送消息过来，我们才可以获取到用户的IP和端口
                    //其实使用TCP也是一样
                    int length = await udpClient.SendAsync(data, data.Length,remote);
                    if(length == data.Length)
                    {
                        Console.WriteLine("完整地发送了数据");
                    }
                }
                catch (Exception e)
                {
                    Console.WriteLine("发送了异常：" + e.Message);
                    udpClient.Close();
                    udpClient = null;
                }
            }
            else
            {
                udpClient.Close();
                udpClient = null;
            }            
        }
    }
}
```



### Project_Client

#### Program.cs

```c#
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Project_Client
{
    class Program
    {
        static void Main(string[] args)
        {
            Client client = new Client();
            client.Start();
            Console.WriteLine("客户端已启动，现在开始发送消息吧");
            while (true)
            {
                string text = Console.ReadLine();
                client.Send(Encoding.UTF8.GetBytes(text));
            }
        }
    }
}
```



#### Client.cs

```c#
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;

namespace Project_Client
{
    class Client
    {
        UdpClient udpClient;

        public void Start()
        {
            //0表示由系统任意分配
            udpClient = new UdpClient(0);
            Recieve();
        }

        public async void Send(byte[] data)
        {
            if (udpClient != null)
            {
                 try
                {
                    int length = await udpClient.SendAsync(data, data.Length,
                                                           "127.0.0.1", 8899);
                    if (data.Length == length)
                    {
                        Console.WriteLine("完整的发送！");
                    }
                }
                catch (Exception error)
                {

                    Console.WriteLine(error.Message);
                    udpClient.Close();
                }
            }
            else
            {
                udpClient.Close();
                udpClient = null;
            }  
        }

        public async void Recieve()
        {
            while (udpClient != null)
            {
                try
                {
                    UdpReceiveResult result = await udpClient.ReceiveAsync();
                    Console.WriteLine(Encoding.UTF8.GetString(result.Buffer));
                }
                catch (Exception e)
                {

                    Console.WriteLine(e.Message);
                    udpClient.Close();
                    udpClient = null;
                }
            }
        }
    }
}
```



运行两个程序后，先在客户端向服务器发送一条消息，此时服务器接收到消息并获知了客户端的端口，此时可以从服务器控制台向客户端发送消息。

![image-20200421201139889](.\\CSharp网络编程\\image-20200421201139889.png)



# Http

## 客户端发起Get请求、服务器接收请求



## 服务器响应客户端的Get请求



## 客户端Post请求与服务器响应



## 实现文件下载功能