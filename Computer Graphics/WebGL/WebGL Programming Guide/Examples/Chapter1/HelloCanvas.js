function main(){
    var canvas = document.getElementById("example");
    if(!canvas){
        console.log("Fail to retrieve the <canvas> element");
        return;
    }
    //获取WebGL绘图区域
    var glContext = getWebGLContext(canvas);
    if(!glContext){
        console.log("Failed to get the rendering context for WebGL");
        return;
    }
    //指定清空canvas的填充色
    glContext.clearColor(0.0, 0.0, 0.0, 1.0);
    //清空canvas
    glContext.clear(glContext.COLOR_BUFFER_BIT);
}