# Lua调试与运行



## 执行外部代码

编译与运行Lua外部代码块有3种形式：

1. `loadfile`编译Lua外部代码块，但不会运行代码，将会以函数的形式返回编译结果。
2. `dofile`直接编译运行Lua外部代码块，并不反悔任何结果。`dofile`是loadfile的进一步简化封装。
3. `loadstring`编译字符串中的代码，而非从文件读取。



### loadfile

`loadfile`编译Lua外部代码块，但不会运行代码，将会以函数的形式返回编译结果。

注意：因为仅返回编译后的结果函数，所以在调用外部Lua文件函数之前，必须先调用本结果函数。

testLua.lua内容：

```lua
local externalFile = loadfile("testLua2.lua"); -- 返回一个函数

print(externalFile);
print(type(externalFile));

externalFile(); -- 调用此函数是必须的！！！

ShowInfo(); -- 调用全局函数
-- ShowInfoLocal(); -- 调用局部函数，会引发异常
print(num); -- 调用全局变量
print(num2); -- 尝试调用局部函数
```

testLua2.lua内容：

```lua
print("这是一个被调用的脚本")
num = 3090;
local numLocal = 1660;

function ShowInfo()
    print("ShowInfo被调用了")
end

local function ShowInfoLocal()
    print("ShowInfoLocal被调用了")
end
```

执行testLua.lua结果：

> function: 00B1BED8
> function
> 这是一个被调用的脚本
> ShowInfo被调用了
> 3090
> nil

### dofile

`dofile`直接编译运行Lua外部代码块，并不返回任何结果。

`dofile`是`loadfile`的进一步简化封装。

修改testLua.lua后内容如下：

```lua
local externalFile = dofile("testLua2.lua"); -- dofile不返回结果

print(externalFile);
print(type(externalFile));

ShowInfo();
print(num);
```

> 这是一个被调用的脚本
> nil
> nil
> ShowInfo被调用了
> 3090

### dofile与loadfile的区别

- dofile编译并运行代码块，而loadfile只编译不运行。
- dofile不返回任何结果，loadfile返回编译结果函数。
- dofile是loadfile的封装，loadfile是dofile的核心。
- dofile是编译失败将会引发的一个错误，loadfile不会引发错误而会返回nil及错误信息。

### dofile与loadfile的优缺点

- 对于简单任务**dofile非常的便捷**，在一次调用中完成整个编译与运行。
- 而**loadfile更加的灵活**，在发生错误的情况下loadfile会返回nil以及错误信息，这可按自定义的方式去处理错误。
- **当需要多次运行一个文件时，只需调用过一次loadfile并保存编译结果函数，然后多次调用编译结果函数即可**，优点是只编译一次可多次运用。而dofile每次运行都需要从新编译，相比较dofile，loadfile的开销将小很多。

### loadstring

`loadstring`编译字符串中的代码，而非从文件读取。

```lua
local result = loadstring("print('This is lua info.')");

print(result);
print(type(result));

result();
```

> function: 00BEB838
> function
> This is lua info.

**注意事项：**

`loadstring`在编译时不涉及词法域（即闭包），因此与function定义的函数不等价。

`loadstring`总是在全局环境中编译它的字符串。


```lua
num1 = 1000;
local num1 = 20;

fun1 = loadstring("num1 = num1 + 1; print(num1)");
fun2 = function() num1 = num1 + 1 print(num1)  end

fun1();
fun2();
```

> 1001
> 21

**注意事项：**

`loadstring`在编译时不涉及词法域，所以loadstring在编译时不会显式错误信息，只有当使用`assert`时才可以显式`loadstring`中的错误。

```lua
local res = loadstring("Hello"); -- 不会报错，需要抛异常
print(res);
```

> nil

## Lua错误与异常处理

Lua所遇到的任何位于其条件都会引发一个错误。因此在发生错误时不能简单的崩溃或退出，而是结束当前程序块并返回应用程序。当错误引发时进行恰当的处理是最合适的。

Lua主要使用`error()`、`assert()`函数来抛错误，使用`pcal()`、`xpcall()`来捕获错误。

### error()抛异常

`error()`函数抛异常

```lua
local num = nil;
if (not num) then
    error("error occur!!!"); -- 自定义异常
else
    print("valid.");
end
```

### assert()抛异常

- `assert()`函数是`error()`的进一步封装，简化处理。
- `assert()`函数定义：
  - `assert()`首先检查第1个参数是否返回错误，如果不反悔错误，则`assert()`简单返回，否则以第2个参数抛出异常信息。
  - `assert(a,b)`参数a是要检查是否有错误的一个参数，b是a错误时抛出的信息。第2个参数b是可选的。

```lua
local num = nil;

result = assert(num,"error: invalid number!!!"); -- 自定义异常
print(result);
```

```lua
num = "abc"
res = tonumber(num);
assert(res,"发生错误，请输入一个数值型数据，不允许字符串");
print(res);
```

### pcall()捕获异常

`pcall()`函数可以捕获函数执行中的任何错误，如果没有发生错误，那么返回true及函数调用的返回值，否则返回false及错误信息。当然错误信息不一定是一个字符串，还可以是Lua中的任何值。

```lua
function ErrorFun()
    error({error="本函数有错误发生！"})
end
-- 捕获异常
local resFlag, errorInfo = pcall(ErrorFun);
if (resFlag) then
    print("正确执行代码！");
else
    print("发生错误：",errorInfo.error);
end
```

> 发生错误：	本函数有错误发生！

`pcall()`函数的优点是写起来简单，但缺点是不能输出错误堆栈信息。

如果希望捕获错误信息，且显式完整的堆栈错误信息，则需要使用`xpcall()`函数。

### xpcall()

`xpcall()`函数必须输入两个函数，前者是可能引发错误的函数，后者是错误处理函数。

```lua
function ErrorFun() -- 错误源
    error({error="本函数有错误发生！"})
end

function ProcessError() -- 处理错误的函数
    print("发生错误，详细信息如下：");
    print(debug.traceback());
end

local processFlag = xpcall(ErrorFun, ProcessError); -- 捕获错误信息

if (processFlag) then
    print("正确执行！");
end

print("后续语句继续执行。")
```

> 发生错误，详细信息如下：
> stack traceback:
> 	testLua.lua:7: in function <testLua.lua:5>
> 	[C]: in function 'error'
> 	testLua.lua:2: in function <testLua.lua:1>
> 	[C]: in function 'xpcall'
> 	testLua.lua:10: in main chunk
>
> [C]: ?
> 后续语句继续执行。

## Lua垃圾收集机制

Lua中使用`collectgarbage()`函数来做垃圾收集机制。

```lua
print(collectgarbage("count"));-- 显式Lua占用的总内存数
myTab = {};
print("开始填充数据");
for i = 1, 10000 do
    myTab[i] = i;
end
print("填充数据完毕");
print(collectgarbage("count"));-- 显式Lua占用的总内存数

myTab = nil; -- 资源释放
print(collectgarbage("count"));
collectgarbage("collect"); -- 强制进行垃圾收集处理
print(collectgarbage("count"));
```

> 20.6181640625
> 开始填充数据
> 填充数据完毕
> 276.6787109375
> 276.3583984375
> 19.5390625
