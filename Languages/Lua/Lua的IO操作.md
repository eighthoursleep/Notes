# Lua的IO操作



## IO分类与适用场合

Lua I/O库用于读取和处理文件。分为简单模式、完全模式。

- 简单模式

  拥有一个当前输入文件和一个当前输出文件，并且提供方针对这些文件相关的操作。

- 完全模式

  使用外部的文件句柄来实现。它以一种面向对象的形式，将所有的文件操作定义为文件句柄的方法。

- 我们需要在同一时间处理多个文件，使用`file:function_name`来代替`io.function_name`方法。

两种模式的适用场合区分：

- 简单模式在做一些简单的文件操作时较为合适。

  但在进行一些高级的文件操作时，简单模式就显得力不从心。

  例如同时读取多个文件这样的操作，使用完全模式则较为合适。



## 文件只读操作

- 打开文件的操作语句

  `file = io.open(filename [, mode])`

  `mode`的值有：

  `r`：以只读方式打开文件，该文件必须存在。（适用：对于配置文件的读取）

  `w`：打开只写文件，若文件存在则文件长度清零，即该文件内容会消失。若文件不存在则简历该文件。（适用：对于配置文件的写入）

  `a`：以附加的方式打开只写文件。若文件不存在，则建立该文件，如果文件存在，写入的数据会被加到文件尾，即文件原先的内容会被保留。[EOF符保留]（适用：对于日志文件的追加写入）

  其他：

  `r+`：可读写方式打开文件，该文件必须存在。

  `w+`：打开可读写文件，若文件存在则文件长度清零，即该文件内容会消失。若文件不存在则建立该文件。

  `a+`：与`a`类似，但此问价可读可写

  `b`：二进制模式，如果i文件是二进制文件，可以加上`b`

  `+`：表示对文件既可以读也可以写

**典型示例1：**

以只读方式打开文件，读取一行。

test.txt文件内容：

```text
Hello There.
```

```lua
file = io.open("test.txt","r");
io.input(file);
print(io.read());
io.close(file);
```

> Hello There.

**典型示例2：**

以只读方式打开文件，读取多行。

```text
Hello There.
Are you ok?
```

```lua
file = io.open("test.txt","r");
for line in file:lines() do
    print(line)
end
io.close(file);
```

> Hello There.
> Are you ok?



## 文件写入操作

**典型示例：**

覆盖写入文本文件

```lua
file = io.open("test.txt","w"); -- 覆盖式写入文件，如果不存在则自动创建文件
io.output(file) -- 输出信息到文件
io.write("This is Lua data. \nThis is Lua data as well.");
io.close(file);
```



## 文件追加写入

**典型示例：**

以追加（append）的方式打开只写文件。

test.txt内容：

```text
This is Lua data.
This is Lua data as well.
```

```lua
file = io.open("test.txt","a");
io.output(file) -- 输出信息到文件
io.write("This is Lua data.\nThis is Lua data as well.");
io.close(file);
```

执行后，test.txt内容：

```text
This is Lua data.
This is Lua data as well.This is Lua data.
This is Lua data as well.
```
