# Lua字符串



## 常用函数

### 字符与ASCII码之间的转换

```lua
print(string.byte("A")); -- 字符转ASCII码
print(string.byte("a"));
print(string.byte("AbcHello",2)); -- 对指定字符串中第2个字符转码
print(string.byte("AbcHello",2,5)); -- 对指定字符串中第2到第5个字符进行转码
```

> 65
> 97
> 98
> 98	99	72	101

```lua
print(string.char(65))
print(string.char(97))
```

> A
> a

### 返回字符串多个拷贝

```lua
print(string.rep("Hello",2)) --2个拷贝相连接
```

> HelloHello



## 模式匹配

模式匹配可以使用”匹配参数“的方式，对给定字符串进行“模糊智能”查询（类似C#的正则表达式）。

模式匹配支持以下函数：

```lua
string.match()
string.gmatch()
string.find()
string.sub()
string.gsub()
```

例子：

```lua
s = "游戏上线日期是 28/12/2021，切记！" -- 原始字符串
date = "%d%d/%d%d/%d%d%d%d" -- 模式匹配字符串
print(string.sub(s,string.find(s, date)))
```

> 28/12/2021

Lua支持的所有匹配规则：

| 配对格式 | 配对类型         |
| ---- | -------------- |
| `.`  |   与任何字符配对             |
| `%a` | 任何字母 |
| `%d` | 任何数字 |
| `%w` | 任何字母/数字 |
| `%s` | 任何空白 |
| `%l` | 任何小写字母 |
| `%u` | 任何大写字母 |
| `%p` | 任何标点 |
| `%c` | 任何控制符 |
| `%x` | 任何十六进制数 |
| `%z` | 任何代表零的字符 |

1. 单个字符加一个`*`号，将要匹配零个或多个该类的字符。尽可能匹配长的串。
2. 单个字符加一个`+`号，将要匹配一个或者多个该类的字符。尽可能匹配长的串。
3. 单个字符加一个`-`号，将要匹配零个或多个该类的字符，与`*`不同是，尽可能匹配短的串。
4. 单个字符加一个`?`号，将要匹配零个或者一个该类的字符。
5. `%n`，n可以是1~9，匹配1到n个符合条件的子串。

```lua
str = string.match("Hello,EveryOne!","%a"); -- 查找字符串中的字母
print(str); -- 打印第一个查找到的字母
str = string.match("Hello,EveryOne!","%A"); -- 查找字符串中的非字母
print(str); -- 打印第一个查找到的非字母
```

> H
> ,

```lua
print(string.find("GTX1660Ti 2022","%d",1)) -- 从位置1开始查找字符串中第一个数字的位置
print(string.find("GTX1660Ti 2022","%d+",8)) -- 从位置8开始查找字符串中第一个数字的位置以及数字串末尾的位置
```

> 4	4
> 11	14

`gmatch()`类似`match()`，也可以用于模糊匹配。区别是自带迭代器可以返回多个匹配结果。

```lua
str = "GTX1660Ti, RTX3060";
pattern = "%a+";
pattern2 = "%d+";
pattern3 = "TX%d+";

str2 = "LuaC#JavaC++C";
pattern4 = "C%p*";

matchFunc = function(str,pattern)
    for word in string.gmatch(str,pattern) do
        print(word);
    end
    print();
end
matchFunc(str,pattern);
matchFunc(str,pattern2);
matchFunc(str,pattern3);
matchFunc(str2,pattern4);
```

> GTX
> Ti
> RTX
>
> 1660
> 3060
>
> TX1660
> TX3060
>
> C#
> C++
> C

`gsub()`函数类似`sub()`也用于模糊匹配。区别是自带迭代器可以返回多个匹配结果。

```lua
-- 应用场景：昵称敏感字段替换

str = "奥巴马布里特朗普京拜登龙剑";
strKeyWord = {"普京","奥巴马","马布里"};

replace = function(str,strKeyWord)
    for i=1, #strKeyWord do
        str = string.gsub(str,strKeyWord[i],"A") -- 敏感字段替换为A
    end
    return str;
end
print(replace(str,strKeyWord));
```

> A布里特朗A拜登龙剑

```lua
-- 应用场景：昵称合法性检查，规定只允许由数字字母下划线组成且不能以数字开头

str = "abc789123cd";
pattern = "^%w_"; -- 字符串不含字母数字下划线模板
numCheckPos = string.find(str,pattern); -- 查询”字母数字下划线“以外的内容

if numCheckPos == nil then
    local strFirstLetter = nil;
    strFirstLetter = string.sub(str,1,1);
    if string.match(strFirstLetter,"%D")==nil then
        print("不能以数字开头！");
    else
        print("信息合法！");
    end
else
    print("输入账号含有非法信息！");
end
```



```lua
-- 阿拉伯数字转中文
function NumToCN(num)
    local result = "";
    local wordCN = {"一","二","三","四","五","六","七","八","九","零"};
    for i = 1, #tostring(num) do
        local singleNum = tonumber(string.sub(tostring(num),i,i));
        local singleNumStr = wordCN[singleNum];
        if singleNumStr == nil then
            singleNumStr = wordCN[#wordCN];
        end
        result = result .. singleNumStr;
    end
    return result
end

print(NumToCN(1230456789));
```

>一二三零四五六七八九



## 字符串不变性原理

字符串每一次连接操作之后，都会产生新的字符串（不同于原来的，开辟了新的存储空间）。

这样不断连续字符串，就会不断产生大量新的字符串，且需要大量赋值操作。

随着连接操作的不断增加，字符串越来越大，复制操作也就越来越耗时，所以执行速度就会明显降低。

```lua
local strs = {};
local result = "";

local startTime = os.clock();
local endTime = nil;
local useTime = nil;

for i = 1, 70000 do
    strs[i] = "HelloWorld!";
end

for index,str in ipairs(strs) do -- 字符多的时候不要用循环+..连接
    result = result .. str;
end

endTime = os.clock();
useTime = endTime - startTime;
print("useTime : ",useTime);
```

> result length : 	770000
> useTime : 	8.703

```lua
local strs = {};
local result = "";

local startTime = os.clock();
local endTime = nil;
local useTime = nil;

for i = 1, 70000 do
    strs[i] = "HelloWorld!";
end

result = table.concat(strs); -- 适合用于大量字符串连接

endTime = os.clock();
useTime = endTime - startTime;
print("result length : ",#result);
print("useTime : ",useTime);
```

> result length : 	770000
> useTime : 	0.007
