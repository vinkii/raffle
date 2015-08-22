//窗口全屏
while (true) {
	try {
		var w = screen.width, h = screen.height;  
		window.resizeTo(w, h);  
		window.moveTo((window.screen.width - w) / 2, (window.screen.height - h) / 2);
		break;  
	} catch (e) { continue; }  
}

var pgpath = document.location.href;
var spath = pgpath.substr(0,pgpath.indexOf("/rs")).replace("file:///","") + "/img";
var bgloaded=0, imageEs, total=0, phloaded=0, currentNumber=-1;
var speed = 100;        //单位是毫秒,1秒=1000毫秒，1000/100=10，一秒钟展示10张照片
var showed = [];
var sh = null;
var lhgif = null, lhswfdiv = null, gx = null;

//背景图片加载完会调用该方法
function loadedbg(){
	bgloaded++;
	//加载完成延时100毫秒开始加载照片（避免程序打开时出现白屏）
	if (bgloaded == 2){
		setTimeout(loadph,100);
	}
}

//读取并加载照片
function loadph(){
	if(typeof(path) != "undefined" && path !=null && path.length > 0){
		spath = path;
	}
	
	var fso = new ActiveXObject("Scripting.FileSystemObject");
	var fldr;
	try{
		fldr = fso.GetFolder(spath);
	}catch(e){
		alert("照片目录" + spath + "不存在");
		window.close();
	}
	var fs = fldr.files;
	total = fs.count;
	if (total==0){
		alert("目录" + spath + "里没有照片");
		window.close();
	}
	var fc = new Enumerator(fs);
	var name;
	for(;!fc.atEnd();fc.moveNext()) {
		name = fc.item().name;
		$("#imagesDiv").append('<div name="ph" class="hide">'+
							   '	<img src="' + spath + '/' + name + '" class="img"/ onload="loadedph();">'+
							   '	<div class="name">'+
							   '		<br/><span name="namespan">' + name.split(".")[0] + '</span>'+
							   '	</div>'+
							   '</div>');
	}
}

//每张照片加载完成后会回调该方法
function loadedph(){
	phloaded++;
	$("#percent").html(phloaded + "/" + total);
	//全部加载完成后修改状态并注册空格按键侦听
	if (total == phloaded) {
		$(document).bind("keydown",function(event){
		  if(event.keyCode == 32){
			 if (sh == null){
				start();
			 } else {
				stop();
			 }
		  } 
		});
		$("#state").html("<br />照片加载完成，按空格键开始");
	}
}

//开始切换图片
function start(){
	//若currentNumber为-1，则是第一次开始，不为-1则意味着之前已抽过，移除该图片
	if (currentNumber==-1) {
		$("#who").css("display","none");
	} else {
		gx.html("");
		if (useFlash ){
			$("#lhswfdiv").html("");
		} else {
			lhgif.hide();
		}
		imageEs.eq(currentNumber).remove();
	}

	imageEs = $("div[name='ph']");
	total = imageEs.length;
	showed = [];

	if (total==1) {
		imageEs.eq(0).css("display","inline");
		if (confirm("已到最后一张！\n要重新开始吗？")){
			document.location.reload();
		} else {
			return;
		}
	}

	sh = setInterval(change, speed);
}

//停止切换并显示恭喜XXX中奖
function stop(){
	clearInterval(sh);
	sh = null;
	//
	gx.html("恭喜<span style='color:red'>"+imageEs.eq(currentNumber).find("span[name='namespan']").html()+"</span>中奖");
	if (useFlash ){
		lhswfdiv.html("<embed src='lh.swf' wmode='transparent' quality='high' width='" + h + "' height='" + h + "' type='application/x-shockwave-flash'></embed>");
	} else {
		lhgif.show();
	}
}

//随机切换图片
function change() {
	imageEs.eq(currentNumber).css("display","none");
	var number = getNextNum();
	imageEs.eq(number).css("display","inline");
	currentNumber = number;
}

//获取随机数
function getNextNum() {
	var n;
	while(true){
		n = Math.floor(Math.random() * total);
		if (n!=currentNumber&&!isShowed(n)){
			return n;
		}
	}
}

//判断是否显示过，确保一轮每个人都被显示，不重复
function isShowed(index){
	if (showed.length==total){
		showed=[];
		showed.push(index);
		return false;
	}
	if($.inArray(index,showed)==-1){
		showed.push(index);
		return false;
	}
	return true;
}

onload=function(){
	if(fitWidth) {
		//背景图片宽度适应
		$("#bg").width(w);
	} else {
		//背景图片高度适应
		$("#bg").height(h);
	}
	gx=$("#gx");
	lhgif = $("#lhgif");
	lhgif.find("img").height(h-20);
	lhswfdiv = $("#lhswfdiv");
}