# WebGL绘制三角形



## 一次性传入多个顶点数据

WebGL提供**缓冲区对象**(buffer object)机制。它可以一次性向着色器传入多个顶点的节点数据。

缓冲区对象是WebGL系统中的一块内存区域，我们可以一次性向缓冲区对象**填充大量的顶点数据**，然后将这些数据保存在其中，**供顶点着色器使用**。

使用缓冲区对象向顶点着色器传入多个顶点数据的步骤（5个）：

1. 创建缓冲区对象（`gl.createBuffer()`）。
2. 绑定缓冲区对象（`gl.bindBuffer()`）。
3. 将数据写入缓冲区对象（`gl.bufferData()`）。
4. 将缓冲区对象分配给一个`attribute`变量（`gl.vertexAttribPointer()`）。
5. 开启`attribute`变量（`gl.enableVertexAttributeArray()`）。

### 创建缓冲区对象

`gl.createBuffer()`（无输入参数，无返回值）

`gl.deleteBuffer(buffer)`（输入待删除的buffer，无返回值）

### 绑定缓冲区

```js
gl.bindBuffer(target, buffer)
//允许使用buffer表示的缓冲区对象，并将其绑定到target表示的目标上
/*
参数target: 可以是以下其中一个：
	gl.ARRAY_BUFFER: 缓冲区对象中包含了顶点的数据
	gl.ELEMENT_ARRAY_BUFFER: 缓冲区对象中包含了顶点的索引值
参数buffer: 指定之前由gl.createBuffer()返回的带绑定的缓冲区对象。如果为null,禁用对target的绑定。
无返回值。
*/
```

### 向缓冲区对象写入数据

```js
gl.bufferData(target, data, usage)
//开辟存储空间，向绑定在target上的缓冲区对象中写入数据data
/*
参数target: gl.ARRAY_BUFFER或gl.ELEMENT_ARRAY_BUFFER。
参数data: 写入缓冲区对象的数据（类型化数组）
参数usage: 表示程序将如何使用存储在缓冲区对象中的数据。该参数将帮助WebGL优化操作，传错了也不会终止程序，仅仅降低了程序效率。
	gl.STATIC_DRAW: 只会向缓冲区对象中写入一次数据，但需要绘制很多次。
	gl.STREAM_DRAW: 只会向缓冲区对象中写入一次数据，然后绘制若干次。
	gl.DYNAMIC_DRAW: 会向缓冲区对象中多次写入数据，并绘制很多次。
无返回值。
*/
```

使用Float32Array对象（类型化数组）而非常见的Array对象是因为Array是一种通用的类型，既可以在里边存储数字也可以存储字符串，并没有对“大量元素都是同一种类型”这种情况进行优化。

#### 类型化数组

为了绘制三维图形，WebGL通常需要同时处理大量相同类型的数据，例如顶点的坐标和颜色数据。为了优化性能，WebGL为每种基本数据类型引入了一种特殊的数组（类型化数组）。浏览器事先知道数组种的数据类型，所以处理起来也更有效率。

**`Float32Array`**是其中一种类型化数组，通常用于**存储顶点的坐标**或**颜色数据**。

WebGL种很多操作都用到类型化数组，比如`gl.bufferData()`中的第2个参数data。

| 数组类型     | 每个元素所占字节数 | 描述                               |
| ------------ | ------------------ | ---------------------------------- |
| Int8Array    | 1                  | 8位整型数（signed char）           |
| UInt8Array   | 1                  | 8位无符号整型数（unsigned char）   |
| Int16Array   | 2                  | 16位整型数（signed short）         |
| UInt16Array  | 2                  | 16位无符号整型数（unsigned short） |
| Int32Array   | 4                  | 32位整型数（signed int）           |
| UInt32Array  | 4                  | 32位无符号整型数（unsigned int）   |
| Float32Array | 4                  | 单精度32位浮点数（float）          |
| Float64Array | 8                  | 双精度64位浮点数（double）         |

与JS的Array数组相似，类型化数组也有一系列方法和属性（包括一个常量属性）。

| 方法、属性、常量   | 描述                                            |
| ------------------ | ----------------------------------------------- |
| get(index)         | 获取第index个元素值                             |
| set(index, value)  | 设置第index个元素的值为value                    |
| set(array, offset) | 从第offset个元素开始，将数组array中的值填充进去 |
| length             | 数组的长度                                      |
| BYTES_PER_ELEMENT  | 数组中每个元素所占的字节数                      |

与普通的Array数组不同的是，类型化数组**不支持`push()`和`pop()`方法。**

与普通的Array数组一样，类型化数组可以通过`new`运算符调用构造函数并传入数据而被创造出来。

注意，**创建类型化数组的唯一方法**就是**使用`new`运算符**，不能使用`[]`运算符（这样创建的就是普通数组）。

```js
var vertices = new Float32Array([
    0.0, 0.5, -0.5, -0.5, 0.5, -0.5
]);
var vertices2 = new Float32Array(4);//指定数组元素个数
```

### 将缓冲区对象分配给attribute变量

使用`gl.vertexAttrib[1234]f`系列函数一次只能分配一个值（一个顶点数据）。

但现在是要将整个数组中的所有值（所有的顶点数据）一次性分配给一个attribute变量。

`gl.vertexAttribPointer()`可以解决这个问题，它可以将整个缓冲区对象（实际上是缓冲区对象的引用/指针）分配给attibute变量。

```js
gl.vertexAttribPointer(location, size, type, normalized, stride, offset)
//将绑定到gl.ARRAY_BUFFER的缓冲区对象分配到由location指定的attribute变量。

/*
参数location: 指定待分配attribute变量的存储位置
参数size: 指定缓冲区中每个顶点的分量个数（1~4）。若size比attribute变量需要的分量数小，缺失分量将按照与gl.vertexAttrib[1234]f()相同的规则不全。比如，如果size=1,则第2、3分量自动设为0，第4分量为1。
参数type: 用以下类型之一指定数据格式:
	gl.UNSIGNED_BYTE:  Uint8Array
	gl.SHORT: Int16Array
	gl.UNSIGNED_SHORT:  Uint16Array
	gl.INT:  Int32Array
	gl.UNSIGNED_INT:  Uint32Array
	gl.FLOAT:  Float32Array
参数normalize: 布尔类型，表明是否将非浮点型的数据归一化到[0,1]或[-1,1]区间
参数stride: 指定相邻的两个顶点之间的字节数，默认为0
参数offset: 指定缓冲区对象中的偏移量（单位：字节）。如果是从起始位置开始，offset设为0。

无返回值
*/
```

### 激活attribute变量

使用`gl.enableVertexAttribArray()`方法，使顶点着色器能够访问缓冲区内的数据。

注意，虽然函数的名称看起来表示该函数是用来处理顶点数组的，但实际上它**处理的对象是缓冲区**。这个命名时历史原因造成的（从OpenGL中继承）。

```js
gl.enableVertexAttribArray(location)
//开启location指定的attribute变量
/*
参数location: 指定attribute变量的存储位置。

无返回值。
*/
```

执行了这一函数后，缓冲区对象和attribute变量之间的连接就真正建立了。

可以使用`gl.diableVertexArray()`来关闭分配。

注意，**激活attribute变量后，你就不能再使用`gl.vertexAttribute[1234]f()`向它传数据了。除非你显式地关闭该attribute变量。**实际上，你无法也不应该同时用这两个函数。

### gl.drawArrays()的第2个和第3个参数

```js
gl.drawArrays(mode, first, count)
//执行顶点着色器，按照mode参数指定的方式绘制图形
/*
参数mode: 指定绘制的方式，可接受以下常量符号:
	gl.POINTS
	gl.LINES
	gl.LINES_STRIP
	gl.LINES_LOOP
	gl.TRIANGLES
	gl.TRIANGLE_STRIP
	gl.TRIANGLE_FAN
参数first: 指定从第几个顶点开始绘制（整数）
参数count: 指定绘制需要用到多少个顶点（整数）
*/
```

