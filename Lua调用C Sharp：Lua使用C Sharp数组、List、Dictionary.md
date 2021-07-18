---
title: Lua调用C#：数组、List、Dictionary
date: 2020-07-08 13:11:46
tags:
- C Sharp
- Lua
categories: xLua
toc: true
---

Lua使用C#数组、List、Dictionary

<!--more-->

C#脚本里声明List和Dictionary

```c# LuaAccessCSharp.cs
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class LuaAccessCSharp : MonoBehaviour
{
}
public class MyArray
{
    public int[] array = new int[5] { 1, 2, 3, 4, 5 };
    public List<int> list = new List<int>();
    public Dictionary<int, string> dict = new Dictionary<int, string>();
}
```

# 数组

```lua Main.lua
print("Access Main.Lua File.")
require("AccessArray")
```

```lua AccessArray.lua
print("------------Lua调用C#数组-----------")
local obj = CS.MyArray() -- 实例化MyArray
-- 长度 userdata
-- C#怎么用，Lua就怎么用，不能用#取长度
print("the Length of array is " .. obj.array.Length)
-- 访问元素
print("array[0]" .. obj.array[0])
-- 遍历：注意索引从0开始
str = ""
for i=0,obj.array.Length - 1 do
	str = str .. " -> "
	str = str .. obj.array[i]
end
print(str)
print(obj.array)
-- 创建C#中的数组，使用Array类中的静态方法即可
local array2 = CS.System.Array.CreateInstance(typeof(CS.System.Int32), 10)
print("the Length of array2 is " .. array2.Length)
print("array2[0] = " .. array2[0])
print("array2[1] = " .. array2[1])
```

> LUA: Access Main.Lua File.
>
> LUA: ------------Lua调用C#数组-----------
>
> LUA: the Length of array is 5
>
> LUA: array[0]1
>
> LUA:  -> 1 -> 2 -> 3 -> 4 -> 5
>
> LUA: System.Int32[]: -851065344
>
> LUA: the Length of array2 is 10
>
> LUA: array2[0] = 0
>
> LUA: array2[1] = 0

# List

```lua AccessArray.lua
print("-----------Lua调用C#的List-----------------")
-- 调用成员方法用冒号
obj.list:Add(1)
obj.list:Add(2)
obj.list:Add(3)
-- 长度
print(obj.list.Count)
-- 遍历
str = ""
for i=0,obj.list.Count - 1 do
	str = str .." -> "
	str = str .. obj.list[i]
end
print(str)
print(obj.list)
-- 在Lua中创建List对象
-- 老版本
local list2 = CS.System.Collections.Generic["List`1[System.String]"]()
print(list2)
list2:Add("456")
print("list2[0] = " .. list2[0])
-- 新版本：v2.1.12
-- 相当于得到一个List<string>的一个类的别名，需要再实例化出来
local List_String = CS.System.Collections.Generic.List(CS.System.String)
local list3 = List_String()
list3:Add("789")
print("list3[0] = " .. list3[0])
```

> LUA: -----------Lua调用C#的List-----------------
>
> LUA: 3
>
> LUA:  -> 1 -> 2 -> 3
>
> LUA: System.Collections.Generic.List`1[System.Int32]: 958893952
>
> LUA: System.Collections.Generic.List`1[System.String]: -920179968
>
> LUA: list2[0] = 456
>
> LUA: list3[0] = 789

# Dictionary

```lua AccessArray.lua
print("---------Lua调用C#的Dictionary---------------")
-- 使用方式和C#一致
obj.dict:Add(1,"gtx1650")
obj.dict:Add(2,"gtx1660")
print(obj.dict[1])
-- 遍历
for k,v in pairs(obj.dict) do
	print(k,v)
end

--在Lua中创建一个字典对象
local Dict_String_Vector3 = CS.System.Collections.Generic.Dictionary(CS.System.String, CS.UnityEngine.Vector3)
local dict2 = Dict_String_Vector3()
dict2:Add("123",CS.UnityEngine.Vector3.right)
for i,v in pairs(dict2) do
	print(i,v)
end
print(dict2["123"]) --打印出来的nil
-- 如果要通过键获取值，需要用以下固定句式
print(dict2:get_Item("123"))
dict2:set_Item("123",nil)
print(dict2:get_Item("123"))
-- 第二种：
print(dict2:TryGetValue("123"))
```

> LUA: ---------Lua调用C#的Dictionary---------------
>
> LUA: gtx1650
>
> LUA: 1	gtx1650
>
> LUA: 2	gtx1660
>
> LUA: 123	(1.0, 0.0, 0.0): 1065353216
>
> LUA: nil
>
> LUA: (1.0, 0.0, 0.0): 1065353216
>
> LUA: (0.0, 0.0, 0.0): 0
>
> LUA: true	(0.0, 0.0, 0.0): 0