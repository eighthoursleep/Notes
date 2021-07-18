---
title: C#与MySQL交互
date: 2020-04-06 13:20:00
tag: C Sharp
toc: true
---

- MySQL的基础使用
- C#与MySQL的交互
- 实战：账号注册和登录的功能开发

<!--more-->

# 为什么要学习MySQL及其应用？

主要作用：集中管理网络游戏中所有玩家的数据与游戏中固定核心数据

1. 数据库主要应用再网路游戏开发中
2. 因为网络上有成百上千的玩家，如果把数据存储到每个玩家的本地，管理起来就有很大的风险，其一是玩家更换设备就意味着数据会丢失
3. 如果把数据放在玩家本地，玩家就可以篡改数据，以达到作弊的目的
4. 把数据存放在本地，不方便玩家之间的交互
5. 与微软的SQLServer对比，MySQL更加轻量级，使用起来更加方便

官网：http://www.mysql.com/

使用5.7版本，因为相对比较稳定



# MySQL的基础使用

安装MySQL 5.7.11.0和MySQL-Front以后将两者打开，我们主要在MySQL-Front（汉化界面）操作数据库。

打开MySQL-Front后选中127.0.0.1，右键选择新建|数据库

![image-20200413210049278](image-20200413210049278.png)

名称填game，其他默认，点击确定。

![image-20200413210156333](image-20200413210156333.png)

要删除数据库，只需右键game，点击删除即可。

我们选择game，右键选择新建|表格，在弹出的窗口中，名称填写user，点击确定创建一个表格

要删除表格，只需右键user，点击删除即可。

表格的Id字段在我们创建表格时自动创建了，我们再添加其他字段。选中表格user右键，选择新建|字段，名称填写account，类型设置“VarChar”，其他默认，点击确定。

![image-20200413211141716](image-20200413211141716.png)

添加字段“password”如下

![image-20200413211333185](image-20200413211333185.png)

点击数据浏览器，接下来进行添加数据

![image-20200413211536502](image-20200413211536502.png)

直接点击字段下的空白，然后输入数据，点击发布按钮即可

![image-20200413211742171](image-20200413211742171.png)

点击插入数据按钮，申请一行供插入数据，点击其右边的删除数据按钮删除一行数据。

![image-20200413211947211](image-20200413211947211.png)

点击SQL编辑器，然后通过SQL指令查询数据

![image-20200413212322437](image-20200413212322437.png)

![image-20200413212509122](image-20200413212509122.png)

![image-20200413212610862](image-20200413212610862.png)

# C#与MySQL的交互

## 添加数据

连接数据库

定义SQL操作语句：

```sql
insert to 表名（字段1，字段2，字段3，...）values（值1，值2，值3，...）
```

构建MySqlCommand，传递操作的sql语句和连接的实例

连接的实例需要先调用Open打开数据库

调用ExecuteNonQuery

### 例子

用VS2017创建一个项目Project_MySQL，添加引用**MySql.Data.dll**

编辑Program.cs如下：

```c#
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MySql.Data.MySqlClient;

namespace Project_MySQL
{
    class Program
    {
        static void Main(string[] args)
        {
            Insert();
        }

        private static MySqlConnection Connection()
        {
            string sqlInfo = "server=127.0.0.1;" +
                            "port=3306;" +
                            "database=game;" +
                            "user=root;" +
                            "password=12345";
            MySqlConnection mySqlConnection = new MySqlConnection(sqlInfo);
            return mySqlConnection;
        }

        public static void Insert()
        {
            MySqlConnection client = Connection();//连接数据库
            //插入操作的sql语句
            string addCmd = "insert into user(Id,account,password) " +
                "value(1005,\"a777\",555555)";
            //用于执行sql命令的对象
            MySqlCommand mySqlCommand = new MySqlCommand(addCmd, client);
            client.Open();
            int result = mySqlCommand.ExecuteNonQuery();
            if(result > 0)
            {
                Console.WriteLine("插入成功！");
            }
            else
            {
                Console.WriteLine("插入失败！");
            }
            client.Close();
        }
    }
}
```

程序运行后控制台打印“插入成功！”

在数据库里看到成功添加一行数据

![image-20200413205024575](image-20200413205024575.png)



## 修改数据

```sql
update 表名 set 字段名称1=新的值2, 字段名称2=新的值2, ... where 字段名称=值 and 字段名称=值 ...
```

要注意SQL操作语句中的条件是否能在数据库中找到相应的数据



### 例子

修改Program.cs如下：

```c#
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MySql.Data.MySqlClient;

namespace Project_MySQL
{
    class Program
    {
        static void Main(string[] args)
        {
            Update();
        }

        private static MySqlConnection Connection()
        {
            string sqlInfo = "server=127.0.0.1;" +
                            "port=3306;" +
                            "database=game;" +
                            "user=root;" +
                            "password=12345";
            MySqlConnection mySqlConnection = new MySqlConnection(sqlInfo);
            return mySqlConnection;
        }
        
        public static void Update()
        {
            MySqlConnection client = Connection();//连接数据库
            //修改操作的sql语句
            string addCmd = "update user set password=333 where account=\"hongqigong\" ";
            //用于执行sql命令的对象
            MySqlCommand mySqlCommand = new MySqlCommand(addCmd, client);
            client.Open();
            int result = mySqlCommand.ExecuteNonQuery();
            if (result > 0)
            {
                Console.WriteLine("修改成功！");
            }
            else
            {
                Console.WriteLine("修改失败！");
            }
            client.Close();
        }
    }
}
```

运行程序后控制台打印消息“修改成功！”。

刷新数据库，表格里的数据也得到正确修改

![image-20200413213640327](image-20200413213640327.png)



## 删除数据

```sql
delete from 表的名称 条件语句 where 字段名称=值 and 字段名称=值
```

### 例子

修改Program.cs如下：

```c#
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MySql.Data.MySqlClient;

namespace Project_MySQL
{
    class Program
    {
        static void Main(string[] args)
        {
            Delete();
        }

        private static MySqlConnection Connection()
        {
            string sqlInfo = "server=127.0.0.1;" +
                            "port=3306;" +
                            "database=game;" +
                            "user=root;" +
                            "password=12345";
            MySqlConnection mySqlConnection = new MySqlConnection(sqlInfo);
            return mySqlConnection;
        }
        /// <summary>
        /// 删除数据
        /// </summary>
        public static void Delete()
        {
            MySqlConnection client = Connection();//连接数据库
            //删除操作的sql语句
            string addCmd = "delete from user where account=\"hongqigong\" ";
            //用于执行sql命令的对象
            MySqlCommand mySqlCommand = new MySqlCommand(addCmd, client);
            client.Open();
            int result = mySqlCommand.ExecuteNonQuery();
            if (result > 0)
            {
                Console.WriteLine("删除成功！");
            }
            else
            {
                Console.WriteLine("删除失败！");
            }
            client.Close();
        }
    }
}
```

程序运行后，成功删除game数据库user表格中account为hongqigong的那一条数据。



## 查询数据

```sql
select *from 表名 条件
```

MySQLCommand构建的时候传递操作的sql语句，与连接的实例。

### 例子

修改Program.cs如下：

```c#
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MySql.Data.MySqlClient;

namespace Project_MySQL
{
    class Program
    {
        static void Main(string[] args)
        {
            Select();
        }

        private static MySqlConnection Connection()
        {
            string sqlInfo = "server=127.0.0.1;" +
                            "port=3306;" +
                            "database=game;" +
                            "user=root;" +
                            "password=12345";
            MySqlConnection mySqlConnection = new MySqlConnection(sqlInfo);
            return mySqlConnection;
        }}
        /// <summary>
        /// 查询数据
        /// </summary>
        public static void Select()
        {
            string cmd = "select *from user";
            MySqlConnection client = Connection();//连接数据库
            //用于执行sql命令的对象
            MySqlCommand mySqlCommand = new MySqlCommand(cmd, client);
            client.Open();
            //执行读取 查询业务 返回的时查询到的数据
            MySqlDataReader mySqlData = mySqlCommand.ExecuteReader();
            //循环读取 mySqlData.Read内部 控制指针每次读取后往下一条数据进行移动
            while (mySqlData.Read())
            {
                string account = mySqlData.GetString("account");
                int id = mySqlData.GetInt32("Id");
                int password = mySqlData.GetInt32("password");
                Console.WriteLine(id + " " + account + " " + password);
            }
            Console.WriteLine("读取结束");
            mySqlData.Close();
            client.Close();
        }
    }
}
```

运行程序后，控制台打印当前从数据库表格里查询到所有数据。

![image-20200413220950808](image-20200413220950808.png)



# 实战：账号注册和登录的功能开发

注册功能：

1. 接收用户输入的账号和密码
2. 判断数据库中是否已经存在相同的账号
3. 如果没有就可以往内部添加
4. 如果有，就提示用户账号已存在

登录功能：

1. 接收用户输入的账号和密码
2. 判断数据库中是否有匹配的记录
3. 如果有，告知用户登录成功
4. 如果没有，告知用户登录失败

修改Program.cs如下：

```c#
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MySql.Data.MySqlClient;

namespace Project_MySQL
{
    class Program
    {
        static void Main(string[] args)
        {
            while (true)
            {
                string account = "";
                int pwd;
                Console.WriteLine("请输入，1：登录，2：注册");
                int cmd = int.Parse(Console.ReadLine());
                if (cmd == 1)
                {
                    //登录
                    Console.WriteLine("请输入账号：");
                    account = Console.ReadLine();
                    Console.WriteLine("请输入密码：");
                    pwd = int.Parse(Console.ReadLine());
                    //数据库进行查询，如果存在匹配的记录，告诉用户登录成功
                    bool result = Select("where account = \"" + account +
                        "\" and " + "password = " + pwd);
                    if (result == true)
                    {
                        Console.WriteLine("登录成功");
                    }
                    else
                    {
                        Console.WriteLine("登录失败，请检查账号或者密码");
                    }
                }
                else if (cmd == 2)
                {
                    //注册
                    Console.WriteLine("请输入账号：");
                    account = Console.ReadLine();
                    Console.WriteLine("请输入密码：");
                    pwd = int.Parse(Console.ReadLine());
                    //数据库进行查询，如果存在匹配的记录，告诉用户账户已存在
                    bool result = Select(String.Format("where account=\"{0}\"", account));
                    if (result == true)
                    {
                        Console.WriteLine("账户已存在，注册失败！");
                    }
                    else
                    {
                        //如果没有，插入数据。插入成功，通知用户，注册成功。
                        bool insertResult = Insert(account, pwd);
                        if (insertResult)
                        {
                            Console.WriteLine("注册成功！");

                        }
                        else
                        {
                            Console.WriteLine("注册失败，可能已被抢注");
                        }
                    }
                }
            }
            
        }

        private static MySqlConnection Connection()
        {
            string sqlInfo = "server=127.0.0.1;" +
                            "port=3306;" +
                            "database=game;" +
                            "user=root;" +
                            "password=12345";
            MySqlConnection mySqlConnection = new MySqlConnection(sqlInfo);
            return mySqlConnection;
        }
        /// <summary>
        /// 修改数据
        /// </summary>
        public static void Update()
        {
            MySqlConnection client = Connection();//连接数据库
            //修改操作的sql语句
            string addCmd = "update user set password=333 where account=\"hongqigong\" ";
            //用于执行sql命令的对象
            MySqlCommand mySqlCommand = new MySqlCommand(addCmd, client);
            client.Open();
            int result = mySqlCommand.ExecuteNonQuery();
            if (result > 0)
            {
                Console.WriteLine("修改成功！");
            }
            else
            {
                Console.WriteLine("修改失败！");
            }
            client.Close();
        }
        /// <summary>
        /// 删除数据
        /// </summary>
        public static void Delete()
        {
            MySqlConnection client = Connection();//连接数据库
            //删除操作的sql语句
            string addCmd = "delete from user where account=\"hongqigong\" ";
            //用于执行sql命令的对象
            MySqlCommand mySqlCommand = new MySqlCommand(addCmd, client);
            client.Open();
            int result = mySqlCommand.ExecuteNonQuery();
            if (result > 0)
            {
                Console.WriteLine("删除成功！");
            }
            else
            {
                Console.WriteLine("删除失败！");
            }
            client.Close();
        }
        /// <summary>
        /// 查询数据
        /// </summary>
        public static void Select()
        {
            string cmd = "select *from user";
            MySqlConnection client = Connection();//连接数据库

            //用于执行sql命令的对象
            MySqlCommand mySqlCommand = new MySqlCommand(cmd, client);
            client.Open();
            //执行读取 查询业务 返回的时查询到的数据
            MySqlDataReader mySqlData = mySqlCommand.ExecuteReader();
            //循环读取 mySqlData.Read内部 控制指针每次读取后往下一条数据进行移动
            while (mySqlData.Read())
            {
                string account = mySqlData.GetString("account");
                int id = mySqlData.GetInt32("Id");
                int password = mySqlData.GetInt32("password");
                Console.WriteLine(id + " " + account + " " + password);
            }
            Console.WriteLine("读取结束");
            mySqlData.Close();
            client.Close();
        }
        /// <summary>
        /// 查询账号和密码是否有匹配的记录
        /// </summary>
        /// <param name="whereSQL"></param>
        /// <returns></returns>
        public static bool Select(string whereSQL)
        {
            string cmd = "select *from user " + whereSQL;
            MySqlConnection client = Connection();//连接数据库

            //用于执行sql命令的对象
            MySqlCommand mySqlCommand = new MySqlCommand(cmd, client);
            client.Open();
            //执行读取 查询业务 返回的时查询到的数据
            MySqlDataReader mySqlData = mySqlCommand.ExecuteReader();

            if (mySqlData.Read())
            {
                mySqlData.Close();
                client.Close();
                return true;
            }
            else
            {
                mySqlData.Close();
                client.Close();
                return false;
            }
        }

        int id = 1000;
        /// <summary>
        /// 添加数据
        /// </summary>
        /// <param name="account"></param>
        /// <param name="pwd"></param>
        /// <returns></returns>
        public static bool Insert(string account,int pwd)
        {
            MySqlConnection client = Connection();//连接数据库
            //插入操作的sql语句
            string addCmd = string.Format("insert into user(account,password) " +
                "value(\"{0}\",{1})", account, pwd);
            //用于执行sql命令的对象
            MySqlCommand mySqlCommand = new MySqlCommand(addCmd, client);

            client.Open();
            int result = mySqlCommand.ExecuteNonQuery();
            client.Close();
            if (result > 0)
            {
                Console.WriteLine("插入成功！");
                return true;
            }
            else
            {
                Console.WriteLine("插入失败！");
                return false;
            }
        }
    }
}
```

