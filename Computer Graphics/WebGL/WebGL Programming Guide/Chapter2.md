# WebGL入门



## 什么是Canvas？如何使用

Canvas在这里是指`< canvas >`标签，是HTML5中新引入的元素，它定义了网页的绘图区域。

HTML5出现前，只能在`< img>`标签上显示静态图像，不能实时绘制和渲染，要显示动态图像就通过第三方解决方案Flash Player等。

HTML5出现后，引入`< canvas >`标签，允许JS动态绘制二维图形。WebGL加入后，允许JS在`< canvas >`绘制三维图形。

## HTML如何引入WebGL JS文件

例子：

DrawRectangle.html

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8"/>
        <title>Draw a blue rectangle (canvas version)</title>
    </head>
    <body onload="main()">
        <canvas id="example" width="500" height="500">
            Please use a browser that supports canvas
        </canvas>
        <script src="DrawRectangle.js"></script>
    </body>
</html>
```

DrawRectangle.js

```javascript
// DrawRectangle.js copyright Eighthoursleep
function main(){
    var canvas = document.getElementById("example");
    if(!canvas){
        console.log("Fail to retrieve the <canvas> element");
        return;
    }
    
    var ctx = canvas.getContext('2d');
    ctx.fillStype = 'rgba(0,0,255,1.0)';//设置填充色为蓝色
    ctx.fillRect(120,10,150,150);//填充矩形
}
```

- `< canvas >`标签通过属性width和height规定画布区域大小（像素数），用属性id指定唯一标识符。
- 默认情况下，如果不用JS做些什么，`< canvas >`是透明的。
- 如果浏览器不支持`< canvas >`，会直接忽略，因此可以在标签下写上提示错误的信息。
- `< body >`标签指定`onload`属性，告诉浏览器`< body >`元素加载完成后（即页面加载完成），以`DrawRectangle.js`为入口，执行里边定义的`main()`函数。



## 简单的WebGL绘图函数

## WebGL着色器程序

