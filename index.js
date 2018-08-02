// index.js by 94302037@qq.com

// 行列数量
var iRowCol = 4;

// 布局
var map = [];

// 单元格大小
var unit = 50;

// Keycode
var C_LEFT = 37;
var C_UP = 38;
var C_RIGHT = 39;
var C_DOWN = 40;

// 是否结束
var bFinished = false;

// 得分
var iScore = 0;

$(function(){

	// 重新开始
	Restart();

	// 初始化事件
	InitEvent();
});

// 初始化事件
function InitEvent()
{
	// 上,下,左,右检测
	$('body').on('keyup', function(e){
		if (bFinished)
			return;
		if(e.keyCode == C_LEFT)
			OnLeft();
		else if (e.keyCode == C_UP)
			OnUp();
		else if (e.keyCode == C_RIGHT)
			OnRight();
		else if (e.keyCode == C_DOWN)
			OnDown();
	});
	
	// 点击游戏结束的事件
	$('#tdFinished').on('click', function(){
		Restart();
		$(this).hide();
	});
	
	// 点击修改地图大小按钮
	$('#btnChangeMap').on('click', function(e){
		Restart();
	});
}

// 重新开始
function Restart(){
	// 获取行列数
	iRowCol = parseInt($('#selMapSize').val(), 10);
	
	// 调整背景区域大小
	$(".mainDiv").css({'width': (unit * iRowCol + iRowCol + 1), 'height': unit * iRowCol + iRowCol + 1});
	
	// 清除背景div格子
	$('.BGDiv').remove();
	
	// 生成背景div格子
	GenerateBG($('#mainFiled'));
	GenerateBG($('#preFiled'));
	
	// 重置变量
	bFinished = false;
	iScore = 0;
	
	// 清空已经生成的div格子
	$('#preFiled .cellDiv').remove();
	$('#mainFiled .cellDiv').remove();
	
	// 初始化画图区域
	InitMap();
	
	// 随机生成两个div格子
	RadomCell(2);
	
	// 绘图
	GenerateCell($('#mainFiled'));
}

// 初始化map层
function InitMap(){
	map = [];
	for(var i = 0; i < iRowCol; i++){
		var mapCell = [];
		for(var t = 0; t < iRowCol; t++){
			mapCell[t] = 0;
		}
		map[i] = mapCell;
	}
}

// 更新当前积分
function UpdateScore(){
	$('#tdScore').text(iScore);
	UpdateMaxScore();
}

// 更新最佳积分
function UpdateMaxScore(){
	var max = parseInt($('#tdMaxScore').text(), 10);
	if (iScore > max)
		$('#tdMaxScore').text(iScore);
}

// 测试用于复制前一步的结果到测试窗口
function CloneToPre(){
	$('#preFiled .cellDiv').remove();
	GenerateCell($('#preFiled'));
}

// 随机生成n个格子
function RadomCell(n){
	while(n > 0){
		var bHasMore = RandomPos();
		if (!bHasMore)
			break;
		n--;
	}
}

// <-
function OnLeft(){
	CloneToPre();
	var moved = false;
	for(var y = 0; y < iRowCol; y++){// 循环列
		for(var x1 = 0; x1 < iRowCol; x1++){// 循环行
			for(var x2 = x1 + 1; x2 < iRowCol; x2++){// 从下一个开始循环
				if (map[x2][y] != 0){// 如果下一个不是0
					if (map[x1][y] == 0){// 如果当前是0, 则设置当前的值为下一个的值
						map[x1][y] = map[x2][y];
						map[x2][y] = 0;
						moved = true;
						//console.log(x1 + "," + y + "设置成" + x2 + "," + y + "的值: " + map[x1][y]);
					}
					else if (map[x1][y] == map[x2][y])// 如果当前和下一个的值相同, 则合并
					{
						map[x1][y] = map[x1][y] + map[x2][y];
						map[x2][y] = 0;
						moved = true;
						iScore += map[x1][y];
						//console.log(x1 + "," + y + "设置成" + x2 + "," + y + "的和: " + map[x1][y]);
					}
					else // 当前不是0, 并且跟下一个不相同, 则跳出检查
						break;
				}
			}
		}
	}
	
	// 如果产生移动, 则刷新界面
	if (moved){
		$('#mainFiled .cellDiv').remove();
		RadomCell(1);
		GenerateCell($('#mainFiled'));
	}
}

// ^
// |
function OnUp(){
	CloneToPre();
	var moved = false;
	for(var x = 0; x < iRowCol; x++){// 循环行
		for(var y1 = 0; y1 < 5; y1++){// 循环列
			for(var y2 = y1 + 1; y2 < iRowCol; y2++){// 从下一个开始循环
				if (map[x][y2] != 0){// 如果下一个不是0
					if (map[x][y1] == 0){// 如果当前是0, 则设置当前的值为下一个的值
						map[x][y1] = map[x][y2];
						map[x][y2] = 0;
						moved = true;
						//console.log(x + "," + y1 + "设置成" + x + "," + y2 + "的值: " + map[x][y1]);
					}
					else if (map[x][y1] == map[x][y2])// 如果当前和下一个的值相同, 则合并
					{
						map[x][y1] = map[x][y1] + map[x][y2];
						map[x][y2] = 0;
						moved = true;
						iScore += map[x][y1];
						//console.log(x + "," + y1 + "设置成" + x + "," + y2 + "的和: " + map[x][y1]);
					}
					else // 当前不是0, 并且跟下一个不相同, 则跳出检查
						break;
				}
			}
		}
	}
	
	// 如果产生移动, 则刷新界面
	if (moved){
		$('#mainFiled .cellDiv').remove();
		RadomCell(1);
		GenerateCell($('#mainFiled'));
	}
}

// ->
function OnRight(){
	CloneToPre();
	var moved = false;
	for(var y = 0; y < iRowCol; y++){// 循环列
		for(var x1 = iRowCol-1; x1 >= 0; x1--){// 循环行
			for(var x2 = x1 - 1; x2 >= 0; x2--){// 从前一个开始循环
				if (map[x2][y] != 0){// 如果前一个不是0
					if (map[x1][y] == 0){// 如果当前是0, 则设置当前的值为前一个的值
						map[x1][y] = map[x2][y];
						map[x2][y] = 0;
						moved = true;
						//console.log(x1 + "," + y + "设置成" + x2 + "," + y + "的值: " + map[x1][y]);
					}
					else if (map[x1][y] == map[x2][y])// 如果当前和前一个的值相同, 则合并
					{
						map[x1][y] = map[x1][y] + map[x2][y];
						map[x2][y] = 0;
						moved = true;
						iScore += map[x1][y];
						//console.log(x1 + "," + y + "设置成" + x2 + "," + y + "的和: " + map[x1][y]);
					}
					else // 当前不是0, 并且跟前一个不相同, 则跳出检查
						break;
				}
			}
		}
	}
	
	// 如果产生移动, 则刷新界面
	if (moved){
		$('#mainFiled .cellDiv').remove();
		RadomCell(1);
		GenerateCell($('#mainFiled'));
	}	
}

// |
// v
function OnDown(){
	CloneToPre();
	var moved = false;
	for(var x = 0; x < iRowCol; x++){	// 循环行
		for(var y1 = iRowCol - 1; y1 >= 0; y1--){ // 循环列
			for(var y2 = y1 - 1; y2 >= 0; y2--){ // 从前一个开始循环
				if (map[x][y2] != 0){ // 如果前一个不是0
					if (map[x][y1] == 0){ // 如果当前是0, 则设置当前的值为前一个的值
						map[x][y1] = map[x][y2];
						map[x][y2] = 0;
						moved = true;
						//console.log(x + "," + y1 + "设置成" + x + "," + y2 + "的值: " + map[x][y1]);
					}
					else if (map[x][y1] == map[x][y2]) // 如果当前和前一个的值相同, 则合并
					{
						map[x][y1] = map[x][y1] + map[x][y2];
						map[x][y2] = 0;
						moved = true;
						iScore += map[x][y1];
						//console.log(x + "," + y1 + "设置成" + x + "," + y2 + "的和: " + map[x][y1]);
					}
					else // 当前不是0, 并且跟前一个不相同, 则跳出检查
						break;
				}
			}
		}
	}
	
	// 如果产生移动, 则刷新界面
	if (moved){
		$('#mainFiled .cellDiv').remove();
		RadomCell(1);
		GenerateCell($('#mainFiled'));
	}
}

// 检查是否还有空余的位置
function hasEmpty(){
	var bEmpty = false;
	for(var x = 0; x < iRowCol; x++){
		for(var y = 0; y < iRowCol; y++){
			if (map[x][y] == 0)
				bEmpty = true;
		}
	}
	return bEmpty;
}

// 检查是否游戏结束
function hasFinished(){
	for(var x = 0; x < iRowCol; x++){
		for(var y = 0; y < iRowCol; y++){
			if (map[x][y] == 0){
				return false;
			}
			else{
				try{
					if (map[x][y] == map[x][y+1])
						return false;
				}
				catch(e){}
				
				try{
					if (map[x][y] == map[x][y-1])
						return false;
				}
				catch(e){}
				
				try{
					if (map[x][y] == map[x-1][y])
						return false;
				}
				
				catch(e){}
				try{
					if (map[x][y] == map[x+1][y])
						return false;
				}
				catch(e){}
			}
		}
	}
	return true;
}

// 生成随机位置数
function RandomPos(){
	var bEmpty = hasEmpty();
	while(bEmpty){
		var x = randomFrom(0, iRowCol-1);
		var y = randomFrom(0, iRowCol-1);
		if (map[x][y] == 0){
			map[x][y] = 2;
			break;
		}
	}
	return bEmpty;
}

//获取指定区间范围随机数，包括lowerValue和upperValue
function randomFrom(lowerValue,upperValue)
{
    return Math.floor(Math.random() * (upperValue - lowerValue + 1) + lowerValue);
}

// 根据map数组生成结果
function GenerateCell(obj){
	var mainX = 0;
	var mainY = 0;
	var p = obj.position();
	mainX = p.left + 1;
	mainY = p.top + 1;
	for(var x = 0; x < iRowCol; x++){
		for(var y = 0; y < iRowCol; y++){
			var cellVal = map[x][y];
			if (cellVal > 0){
				var cell = $("<div class='cellDiv c"+ cellVal +"'><span class='cellspan'>" + cellVal +"</span></div>");
				cell.offset({"top" : (unit * y + 1 * y + mainY), "left" : (unit * x + 1 * x + mainX)});
				obj.append(cell);
			}
		}
	}
	
	// 更新积分
	UpdateScore();

	// 检查是否游戏结束
	bFinished = hasFinished();
	if (bFinished)
	{
		$('#tdFinished').text("游戏结束!再来一次?");
		$('#tdFinished').show();
	}
}

// 生成背景
function GenerateBG(obj)
{
	var mainX = 0;
	var mainY = 0;
	var p = obj.position();
	mainX = p.left + 1;
	mainY = p.top + 1;
	for(var i = 0; i < iRowCol; i++){
		for(var t = 0; t < iRowCol; t++){
			var cell = $("<div class='BGDiv'></div>");
			cell.offset({"top" : (unit * t + 1 * t + mainY), "left" : (unit * i + 1 * i + mainX)});
			obj.append(cell);
		}
	}
}