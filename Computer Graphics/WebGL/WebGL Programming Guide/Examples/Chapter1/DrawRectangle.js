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