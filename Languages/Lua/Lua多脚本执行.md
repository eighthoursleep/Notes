# Lua多脚本执行



test.lua

```lua
print("We are in Test script now.")
testA = "I am testA"
local testLocalA = "I am testLocalA"

return testLocalA
```

main.lua

```lua
-- 多脚本执行
require("test") -- 关键字 require("脚本名")
print(testA) -- 可以打印test.lua里的全局变量
print(testLocalA) -- 无法直接访问test.lua里的局部变量
-- 脚本卸载
require('test') -- require加载执行过一次的脚本不会被再次加载
-- package.loaded["脚本名"]
-- 返回true说明该脚本是否被执行
print(package.loaded["test"])
package.loaded["test"] = nil
print(package.loaded["test"])
require("test")
-- 用require执行一个脚本时，可以在脚本最后设置返回值
print(require("test"))
-- 大G表, _G是一个总表，它将我们声明的所有全局变量都存储在其中
print("-------------分割线-------------")
for k,v in pairs(_G) do
	print(k,v)
end
-- 局部变量不会被存到_G中
```

> We are in Test script now.
> I am testA
> nil
> I am testLocalA
> nil
> We are in Test script now.
> I am testLocalA
> -------------分割线-------------
> string	table: 00B49218
> xpcall	function: 00B46ED0
> package	table: 00B469D0
> tostring	function: 00B46F30
> print	function: 00B47450
> os	table: 00B492E0
> unpack	function: 00B47170
> require	function: 00B480B0
> getfenv	function: 00B472F0
> setmetatable	function: 00B46FD0
> next	function: 00B474F0
> assert	function: 00B46410
> tonumber	function: 00B46FF0
> io	table: 00B49420
> rawequal	function: 00B473F0
> testA	I am testA
> collectgarbage	function: 00B47470
> arg	table: 00B491F0
> getmetatable	function: 00B47290
> module	function: 00B48130
> rawset	function: 00B471F0
> math	table: 00B49290
> debug	table: 00B49308
> pcall	function: 00B47530
> table	table: 00B46B88
> newproxy	function: 00B40520
> type	function: 00B47070
> coroutine	table: 00B46CA0
> _G	table: 00B41A78
> select	function: 00B473D0
> gcinfo	function: 00B47370
> pairs	function: 00B42F98
> rawget	function: 00B47190
> loadstring	function: 00B47510
> ipairs	function: 00B42EB0
> _VERSION	Lua 5.1
> dofile	function: 00B474D0
> setfenv	function: 00B47330
> load	function: 00B47490
> error	function: 00B47270
> loadfile	function: 00B47230
> [Finished in 0.1s]

## 对_G的理解

1._G表相当于Lua中的代码管理者，它本质上也是一个table

2.我们自定义的所有全局变量（任何类型）都会存在_G这张大表中

3.我们可以尝试用pairs遍历_G，看到所有信息