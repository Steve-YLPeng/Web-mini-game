function rand(q){
	return Math.floor(Math.random()*(q+1));
}
function $(id){
	return (document.getElementById(id));
}

var keybuf = {};
function keydown(e){
	var evt = e || window.event;
	keybuf[evt.keyCode] = true;
}
function keyup(e){
	var evt = e || window.event;
	keybuf[evt.keyCode] = false;
}

var mapW = 1280;
var mapH = 720;
//var mapW = document.body.clientWidth;
//var mapH = document.body.clientHeight;
//var shootEn = 1;
var enemyN = 0;
var enemy = [];



function playerControl(){
	/* if(terminate){
		return;
	} */
	var display = $("div1");
	var str = "";
	var puri = $('player');
	var v_puri = 7;
	var puriX = puri.x;
	var puriY = puri.y;
	var moveDir = 0;
	var acc = puri.velocityMax*0.1;
	
	for(i=0; i<4; i++)moveDir += keybuf[37+i]<<i;
	switch(moveDir){//control the direction
		//下右上左
		case parseInt("0001",2):
			addVelocity(puri, acc, 180);
			break;
		case parseInt("0010",2):
			addVelocity(puri, acc, 270);
			break;
		case parseInt("0100",2):
			addVelocity(puri, acc, 0);
			break;
		case parseInt("1000",2):
			addVelocity(puri, acc, 90);
			break;
		case parseInt("0011",2):
			addVelocity(puri, acc, 225);
			break;
		case parseInt("1001",2):
			addVelocity(puri, acc, 135);
			break;
		case parseInt("0110",2):
			addVelocity(puri, acc, 315);
			break;
		case parseInt("1100",2):
			addVelocity(puri, acc, 45);
			break;
	}
	if(keybuf[32]&&puri.shootEn){//'space': place a puri
		puri.shootEn=0;
		var name="E"+enemyN++;
		enemy.push(name);
		var b = newObj(puri.x, puri.y, 100, 100, 'flying_puri.gif',1, name, 40,10,100);
		$('enemy').appendChild(b);
		addHpBar(b);
		moveRandom(b,4);
		setTimeout(function(){puri.shootEn=1;},1000);
	}
	if(keybuf[80]&&puri.shootEn){//'P': place 10 puri randomly
		puri.shootEn=0;
		for(i=0;i<10;i++){
			var name="E"+enemyN++;
			enemy.push(name);
			var b = newObj(rand(mapW-50)+25,rand(mapH-50)+25, 100, 100, 'flying_puri.gif',1, name, 40,10,100);
			$('enemy').appendChild(b);
			addHpBar(b);
			moveRandom(b,4);
		}
		setTimeout(function(){puri.shootEn=1;},1000);
	}
	if(keybuf[88]&&puri.shootEn){//'X': shoot 3 bullets
		puri.shootEn=0;
		for(i=0;i<3;i++){
			var b = newObj(puri.x, puri.y, 50, 50, 'bullet1.png',puri.direction, 'B1', 10,25,1);
			$('bullet').appendChild(b);
			shoot(b,30,90*(1-puri.direction)+10*(i-1),0,0);
		}
		setTimeout(function(){puri.shootEn=1;},750);
	}
	if(keybuf[90]&&puri.shootEn){//'Z': shoot 2 bullets
		puri.shootEn=0;
		var b = newObj(puri.x, puri.y+15, 50, 50, 'bullet1.png',puri.direction, 'B1', 10,30,1);
		$('bullet').appendChild(b);
		var b2 = newObj(puri.x, puri.y-20, 50, 50, 'bullet1.png',puri.direction, 'B2', 10,30,1);
		$('bullet').appendChild(b2);
		shoot(b,30,90*(1-puri.direction),0,0);
		shoot(b2,30,90*(1-puri.direction),0,0);
		setTimeout(function(){puri.shootEn=1;},750);
	}
	if(keybuf[67]&&puri.shootEn){//'C': shoot 1 big bullets
		puri.shootEn=0;
		var b = newObj(puri.x, puri.y+15, 150, 150, 'bullet2.png',puri.direction, 'B1', 70,1000,50);
		$('bullet').appendChild(b);
		shoot(b,40,90*(1-puri.direction),1,0);
		setTimeout(function(){puri.shootEn=1;},750);
	}
	if(keybuf[76]){//'L': list all puri
		keybuf[76]=false;
		var str="";
		for(E in enemy)
			str += enemy[E]+"; ";	
		alert(str);
	}
	if(keybuf[84]){//'T': test
		keybuf[84]=false;
		
		var c = document.createElement("canvas");
		c.style.position = "absolute";
		c.style.left = 0+'px';
		c.style.top = mapH/5+'px';
		c.style.width = mapW+'px';
		c.style.height = mapH*0.6+'px';
		var ctx=c.getContext("2d");
		ctx.globalAlpha=0.75;		
		ctx.fillStyle="#000000";
		ctx.fillRect(0,0,mapW,mapH/2); 
		$("char").appendChild(c);
		var msg = newObj(mapW/2, mapH/2, 760, 220, "lose.png", 0, "", 0, 0, 1);
		$("char").appendChild(msg);
	}
	if(keybuf[82]&&puri.shootEn){//'R': retry
		puri.shootEn = 0;
		var enemyList = $('enemy').childNodes;
		console.log(enemyList.length);
		for (var i = 0; i < enemyList.length; i++) {
			$('enemy').removeChild(enemyList[i]);
		}
		console.log(enemyList.length);
		/* puri.style.visibility = "visible";
		puri.health　=　puri.MAXhealth;
		puri.x = mapW*0.3;
		puri.y = mapH*0.5;
		state = 0;
		terminate = 0; */
		setTimeout(function(){puri.shootEn=1;},1000);
	}
	if(keybuf[46]){//'delete': delete all puri
		keybuf[46]=false;
		for(E in enemy){
			$(enemy[E]).health=0;
			$('enemy').removeChild($(enemy[E]));
			delete enemy[E];
		}
	}
	var c = $("HitPoint");
	if(keybuf[16]){//'shift': hold puri's direction
		c.style.visibility = "visible";
	}else c.style.visibility = "hidden";
	
	if(keybuf[72]){//'H' heal 100%
		keybuf[76]=false;
		puri.health　=　puri.MAXhealth;
	}
	if(keybuf[83]&&puri.shootEn){//'S' Sandiego mode
		puri.shootEn=0;
		puri.x = mapW*0.35;
		puri.y = mapH*0.5;
		var name="E"+enemyN++;
		enemy.push(name);
		var b = newObj(mapW*0.85,mapH*0.5, 200, 200, '3D5.gif',1, name, 50,10,3000);
		$('enemy').appendChild(b);
		addHpBar(b);
		movementEnemy1(b,0,0);
		setTimeout(function(){puri.shootEn=1;},2000);
	}
	for (k in keybuf) {
		if (keybuf[k]) {
			str += k + "; ";
		}
	}
	display.innerHTML = str;
	
	if(keybuf[16])move(puri, puri.velocity*0.75, puri.angle, 30);
	else move(puri, puri.velocity, puri.angle, 30);
	
	//update the move, HpBar
	displayXY(puri);
	updateHpBar(puri);
	var enemyList = $('enemy').childNodes;
	for (var i = 0; i < enemyList.length; i++) {
		if(puri.collideEn && collide(enemyList[i],puri)){
			damage(enemyList[i],puri);
			damage(puri,enemyList[i]);
			if(enemyList[i].health<=0){
				$('enemy').removeChild(enemyList[i]);
				delete enemyList[i];
			}
			puri.collideEn = 0;
			setTimeout(function(){puri.collideEn=1;},1000);
		}
		displayXY(enemyList[i]);
		updateHpBar(enemyList[i]);
	}
	var bulletList = $('bullet').childNodes;
	for (var i = 0; i < bulletList.length; i++) {
		displayXY(bulletList[i]);
	}
	puri.velocity -= puri.velocity*0.1;
	if(puri.velocity<0)puri.velocity = 0;
}
function addHpBar(obj){
	var w=parseInt(obj.style.width)-20;
	var c = document.createElement("canvas");
	c.style.position = "relative";
	c.style.left = 0+'px';//X
	c.style.top = -15+'px';//Y
	
	var ctx=c.getContext("2d");
	var grd=ctx.createLinearGradient(0,0,w,10);
	var med=obj.health/obj.MAXhealth;
	grd.addColorStop(0,"#00FF00");
	grd.addColorStop(med,"#00FF00");
	grd.addColorStop(med,"#FF0000");
	grd.addColorStop(1,"#FF0000");
	
	ctx.fillStyle=grd;
	ctx.fillRect(0,0,w,10);
	obj.appendChild(c);
	obj.HPbar=c;
	
	//updateHpBar(obj);
}
function updateHpBar(obj){
	var w=parseInt(obj.style.width);
	var ctx=obj.HPbar.getContext("2d");
	var grd=ctx.createLinearGradient(0,0,w,10);
	var med=obj.health/obj.MAXhealth;
	if(med<0)med=0;
	if(med<0.1){
		grd.addColorStop(0,"#00FF00");
		grd.addColorStop(med,"#FF0000");
		grd.addColorStop(1,"#FF0000");	
	}else if(med>1-0.1){
		grd.addColorStop(0,"#00FF00");
		grd.addColorStop(med,"#00FF00");
		grd.addColorStop(1,"#FF0000");	
	}else{
		grd.addColorStop(0,"#00FF00");
		grd.addColorStop(med-0.1,"#00FF00");
		grd.addColorStop(med+0.1,"#FF0000");
		grd.addColorStop(1,"#FF0000");		
	}
	ctx.fillStyle=grd;
	ctx.fillRect(0,0,w,10);
	
	if(obj.health<=0 || obj==null){
		if(obj!=$("player"))delete obj.HPbar;
		return;
	}
	//setTimeout(function(){updateHpBar(obj);},30);
}

function addHitPoint(obj){
	var c = document.createElement("canvas");
	var ctx=c.getContext("2d");
	c.id = "HitPoint";
	c.style.position = "absolute";
	c.style.left = 50-15+'px';
	c.style.top = 50-15+'px';
	c.style.visibility = "hidden";
	ctx.globalAlpha=0.5;
	ctx.fillStyle="#FF0000";
	ctx.beginPath();
	ctx.arc(15, 15, 15, 0, Math.PI * 2, true);
	ctx.closePath();
	ctx.fill();
	obj.appendChild(c);
}

function addVelocity(obj, acc, ang){
	var vx = obj.velocity*Math.cos(obj.angle*Math.PI/180);
	var vy = obj.velocity*Math.sin(obj.angle*Math.PI/180);
	var dvx = vx + acc*Math.cos(ang*Math.PI/180);
	var dvy = vy + acc*Math.sin(ang*Math.PI/180);
	obj.angle = Math.atan2(dvy, dvx)*180/Math.PI;
	obj.velocity = Math.sqrt(dvx*dvx + dvy*dvy);
	if(obj.velocity > obj.velocityMax)obj.velocity = obj.velocityMax;
}
function movementEnemy2(obj,v,time){
	if(obj.health<=0 || obj==null){
		delete obj;
		return;
	}
	if(obj.x <= 10){
		var puri = $('player');
		var bomb = newObj(obj.x,obj.y, 200, 200, 'bomb.gif',1, "bomb", 0,0,1);
		$('char').appendChild(bomb);
		setTimeout(function(){$('char').removeChild(bomb);},1500);
		puri.health -= 20;
		if(puri.health <= 0)gameOver(0);
		$('enemy').removeChild(obj);
		delete obj;
		return;
	}
	//console.log(v);
	move(obj,v,180,30);
	if(time%100 == 50){
		for(i=0;i<3;i++){
			var b = newObj(obj.x, obj.y, 25, 25, 'B1.png',obj.direction, 'B1', 10,20,1);
			$('bullet').appendChild(b);
			shoot(b,12,180-15+15*i,0,1);		
		}
	}
	if(time == 175){
		var b = newObj(obj.x, obj.y, 50, 15, 'gyorai.png',obj.direction, 'B1', 7,70,1);
		$('bullet').appendChild(b);
		snipe(5,b,$('player'));		
	}
	obj.moveFun = setTimeout(function(){movementEnemy2(obj,v,(time+1)%200);},30);
}
function movementEnemy1(obj,time,ang){
	obj.x = mapW*0.85;
	obj.y = mapH*0.5;
	if(obj.health<=0 || obj==null){
		var bomb = newObj(obj.x,obj.y, 300, 300, 'bomb.gif',1, "bomb", 0,0,1);
		$('char').appendChild(bomb);
		setTimeout(function(){$('char').removeChild(bomb);},1500);
		gameOver(1);
		return;
	}
	if(time%130==75){
		for(i=0;i<3;i++){
			setTimeout(function(){
				var b = newObj(obj.x, obj.y, 200, 160, 'ego(left).gif',obj.direction, 'B', 50,100,1);
				$('bullet').appendChild(b);
				snipe(15,b,$('player'));
			},i*600);
		}
	}
	if(time==100){
		for(i=0;i<2;i++){
			var b = newObj(mapW-50,rand(mapH-50)+25, 100, 100, 'flying_puri.gif',1, name, 40,10,100);
			$('enemy').appendChild(b);
			addHpBar(b);
			moveRandom(b,4);
		}
	}
	if(obj.shootEn==1){
		obj.shootEn=0;
		//var ang=time*23;
		for(i=0;i<6;i++){
			var b = newObj(obj.x, obj.y, 50, 50, 'bullet2.png',obj.direction, 'B', 10,40,1);
			$('bullet').appendChild(b);
			shoot(b,7,ang+60*i,0,1);
		}
		setTimeout(function(){obj.shootEn=1},331);
	}
	obj.moveFun = setTimeout(function(){movementEnemy1(obj,(time+1)%(130*4),(ang+1)%360);},30);
}
function snipe(v,obj,tar){
	var X = obj.x;
	var Y = obj.y;
	var pX = tar.x;
	var pY = tar.y;
	if(pY==Y){
		if(pX<X)
			shoot(obj,v,180,0,1);
		else
			shoot(obj,v,0,0,1);
	}
	else if(pX==X){
		if(pY<Y)
			shoot(obj,v,270,0,1);
		else
			shoot(obj,v,90,0,1);
	}
	else{
		var tan=(pY-Y)/(pX-X);
		var atan=Math.atan(tan)/Math.PI*180;
		if(pX<X)
			shoot(obj,v,atan+180,0,1);
		else
			shoot(obj,v,atan,0,1);
	} 
	
}

function moveRandom(obj,v){
	if(terminate)return;
	if(obj.health<=0 || obj==null){
		delete obj;
		return;
	}
	var X = obj.x;
	var Y = obj.y;
	var ang=rand(360);
	var time=400*(rand(7)+3);
	var delay=300*(rand(3)+1);
	var delay2=300*(rand(3)+1);
	if(X<mapW*0.2){
		//alert(ang);
		if(Y<mapH*0.2)
			ang=rand(60)+0+15;
		else if(Y>mapH*0.8)
			ang=rand(60)-90+15;
		else
			ang=rand(120)-90+30;
	}
	else if(X>mapW*0.8){	
		//alert(ang);
		if(Y<mapH*0.2)
			ang=rand(60)+90+15;
		else if(Y>mapH*0.8)
			ang=rand(60)+180+15;
		else
			ang=rand(120)+90+30;
	}
	else if(Y<mapH*0.2){
		ang=rand(120)+0+30;
	}
	else if(Y>mapH*0.8){
		ang=rand(120)+180+30;
	}
	move(obj,v+Math.random()*v*0.5,ang,time);
	setTimeout(function(){
		if(obj.health>0 && obj!=null){
			var ang=rand(360);
			var b = newObj(obj.x, obj.y, 50, 50, 'bullet2.png',obj.direction, 'B1', 10,25,1);
			var b2 = newObj(obj.x, obj.y, 50, 50, 'bullet2.png',obj.direction, 'B2', 10,25,1);
			$('bullet').appendChild(b);
			$('bullet').appendChild(b2);
			shoot(b,5,ang,0,1);
			shoot(b2,5,ang+180,0,1);
			//snipe(10,b,$('player'));
			//snipe(10,b2,$('player'));
		}
	},(time+delay));
	obj.moveFun = setTimeout(function(){moveRandom(obj,v);},(time+delay+delay2));
}
function move(obj,v,ang,time){
	if(time<=0)return;
	var mx = obj.x + v*Math.cos(ang*Math.PI/180);
	var my = obj.y + v*Math.sin(ang*Math.PI/180);
	
	if(mx>0 && mx<mapW)obj.x = mx;
	if(my>0 && my<mapH)obj.y = my;
	//alert(mx+" "+my);
	obj.moveFun = setTimeout(function(){move(obj,v,ang,time-30);},30);
}
function displayXY(obj){
	obj.style.left = obj.x+'px';
	obj.style.top = obj.y+'px';
}
function shoot(obj,v,ang,toRot,mode){
	//alert(obj.direction);
	//console.log("shoot");
	var X=obj.x;
	var Y=obj.y;
	var dr=toRot*15*obj.direction;
	if(X<0 || Y<0 || X>mapW || Y>mapH || obj.health<=0 || obj==null){
		$('bullet').removeChild(obj);
		delete obj;
		return;
	}
	if(mode==0){//shoot by player
		var enemyList = $('enemy').childNodes;
		for (var i = 0; i < enemyList.length; i++){
			var tar = enemyList[i];
			if(collide(obj,tar)){
				damage(obj,tar);
				damage(tar,obj);
				if(tar.health<=0){
					$('enemy').removeChild(tar);
					delete tar;
				}
				if(obj.health<=0){
					$('bullet').removeChild(obj);
					delete obj;
					return;
				}
			}
		}	
	}
	else{//shoot by enemy
		var tar = $('player');
		if(collide(obj,tar)){
			damage(obj,tar);
			damage(tar,obj);
			if(tar.health<=0){
				//tar.style.display='none';
				//$("char").removeChild(tar);
				$('bullet').removeChild(obj);
				delete obj;
				delete tar;
				gameOver(0);
				return;
			}
			if(obj.health<=0){
				$('bullet').removeChild(obj);
				delete obj;
				return;
			}
		}
	}

	if(!toRot){
		obj.x = X+v*Math.cos(ang*Math.PI/180);
		obj.y = Y+v*Math.sin(ang*Math.PI/180);	
	}
	else
		obj.x = X+v*obj.direction;
	obj.style.transform = "rotate("+ang+"deg)";
	obj.moveFun = setTimeout(function(){shoot(obj,v,ang+dr,toRot,mode);},30);
}
function damage(a,b){
	if(a.health<0)return;
	var dmg = b.damage*(1+0.3*Math.random()-0.15);
	a.health -= dmg;
	
	var dmgNum = document.createElement("div"); 
	var X = parseInt(a.style.width)/2 -30 + 100*Math.random();
	var Y = -10 + 50*Math.random();
	dmgNum.style.color = "#ff0000";
	dmgNum.style.fontWeight = 900;
	dmgNum.style.fontSize = "30px";
	dmgNum.style.position = "absolute";
	dmgNum.style.left = X +'px';
	dmgNum.style.top = Y +'px';
	dmgNum.textContent = Math.round("-"+dmg);  
	a.appendChild(dmgNum);
	setTimeout(function(){a.removeChild(dmgNum);},1000);
}
function collide(a,b){
	if(terminate)return false;
	var dx = a.x - b.x;
	var dy = a.y - b.y;
	var wa=a.size;
	var wb=b.size;
	return Math.sqrt(dx*dx+dy*dy)<(wa+wb);
}


function init(){
	var puri=newObj(mapW*0.3,mapH*0.5+rand(100)-50, 100, 100, 'puri.gif',1, 'player', 15,5,300);
	puri.velocity = 0;
	puri.velocityMax = 8;
	puri.angle = 0;
	puri.collideEn = 1;
	document.getElementById("char").appendChild(puri);
	addHpBar(puri);
	addHitPoint(puri);

	run();
}
function gameOver(win){
	terminate = 1;
	var puri = $("player");
	if(!win){
		var bomb = newObj(puri.x,puri.y, 300, 300, 'bomb.gif',1, "bomb", 0,0,1);
		$('char').appendChild(bomb);
		setTimeout(function(){$('char').removeChild(bomb);},1500);
		puri.style.visibility = "hidden";
	}
	//clearTimeout(process);
	var enemyList = $('enemy').childNodes;
	for (var i = 0; i < enemyList.length; i++) {
		clearTimeout(enemyList[i].moveFun);
	}
	setTimeout(function(){endGameMsg(win);},1000);
}
var state = 0;
var inState = 0;
var process;
var terminate = 0;
function run(){
	//console.log("running");
	//if(terminate)return;
	playerControl();
	stageControl();
	process = setTimeout('run()',30);
}

function endGameMsg(win){
	var endtext;
	if(win)endtext = "victory.png";
	else endtext = "lose.png";
	//create background canvas
	var c = document.createElement("canvas");
	c.style.position = "absolute";
	c.style.left = 0+'px';
	c.style.top = mapH/5+'px';
	c.style.width = mapW+'px';
	c.style.height = mapH*0.6+'px';
	var ctx=c.getContext("2d");
	ctx.globalAlpha=0.75;		
	ctx.fillStyle="#000000";
	ctx.fillRect(0,0,mapW,mapH/2); 
	$("char").appendChild(c);
	//create endgame messange
	var msg = newObj(mapW/2, mapH/2, 760, 220, endtext, 0, "", 0, 0, 1);
	$("char").appendChild(msg);
	//create retry button
	var button = document.createElement('button');
	button.style.position = "absolute";
	button.style.left = mapW*0.43+'px';
	button.style.top = mapH/5*3+'px';
	button.style.backgroundColor = 'transparent';
	button.style.color = "#ffffff";
	button.style.fontSize = "30px";
	button.style.border = "none";
	button.style.outline = "none";
	button.innerHTML = '- TOUCH TO CONTINUE -<br>画面をタッチ';
	button.onclick = function(){
		restart(c,msg,button);
	};
	$("char").appendChild(button);
}

var game = 0;
function restart(c,msg,button){
	if(!terminate)return;
	game++;
	//console.log("game++")
	//run();console.log("run");
	enemyNum = 0;
	state = 0;
	inState = 0;
	var puri = $('player');
	var enemyList = $('enemy').childNodes;
	console.log(enemyList.length);
	while(enemyList.length > 0)
	for (i = 0; i < enemyList.length; i++) {
		$('enemy').removeChild(enemyList[i]);
	}
	
	puri.style.visibility = "visible";
	puri.health　=　puri.MAXhealth;
	puri.velocity = 0;
	puri.x = mapW*0.3;
	puri.y = mapH*0.5;
	//state = 0;
	//terminate = 0;
	$("char").removeChild(c);
	$("char").removeChild(msg);
	$("char").removeChild(button);
	
	setTimeout(function(){terminate = 0;console.log("terminate=0");},3000);
}
var enemyNum = 0;
function stageControl(){
	if(terminate){
		//console.log("end at"+state);
		state = 0;
		inState = 0;
		return;
	}//console.log("now at"+state);
	switch(state){
		case 0:{
			console.log("state0 start");
			var time = 0;
			inState = 1;
			for(i=0;i<5;i++){
				//console.log("i="+i);
				for(j=0;j<3;j++){
					//console.log("i="+i+" j="+j);
					setTimeout(function(){
						if(terminate)return;
						if(enemyNum>=15)return;
						//if(state==0)return;
						//console.log("    ass"+i+j+" state"+state+" game"+game+" "+$('enemy').childNodes.length+" "+enemyNum+" time"+time);
						var randPos = (rand(4)+1);
						var enemy = newObj(mapW-1,mapH/6*randPos+rand(100)-50, 150, 150, 'enemyship.png',1, name, 55,10,200);
						$('enemy').appendChild(enemy);
						addHpBar(enemy);
						movementEnemy2(enemy,0.5+rand(100)/100,0);
						enemyNum++;
					;},time);
					time += 500+rand(1000);
				}
				time += 5000+rand(1000);
			}
			state += 0.5;
			break;		
		}
		case 0.5:{
			//console.log("state0.5");
			if($('enemy').childNodes.length <= 0 && inState){
				inState = 0;
				setTimeout(function(){state += 0.5;},3000);
			}
			break;		
		}
		case 1:{
			console.log("state1 start");
			inState = 1;
			/* for(i=0;i<10;i++){
				var b = newObj(mapW-1,rand(mapH-50)+25, 150, 150, 'enemyship.png',1, name, 55,10,100);
				$('enemy').appendChild(b);
				addHpBar(b);
				moveRandom(b,4);
			} */
			state += 0.5;
			break;		
		}
		case 1.5:{
			//console.log("state1.5");
			if($('enemy').childNodes.length <= 0 && inState){
				inState = 0;
				setTimeout(function(){state += 0.5;},3000);
			}
			break;			
		}
		case 2:{
			console.log("state2 start");
			inState = 1;
			var b = newObj(mapW*0.85,mapH*0.5, 200, 200, '3D5.gif',1, name, 50,20,3000);
			$('enemy').appendChild(b);
			addHpBar(b);
			movementEnemy1(b,0,0);
			state += 0.5;
			break;		
		}
		case 2.5:{
			//console.log("state2.5");
			if($('enemy').childNodes.length <= 0 && inState){
				inState = 0;
				setTimeout(function(){state += 0.5;},3000);
			}
			break;			
		}
	}
}

function newObj(x, y, w, h, img, dir, name, s, dmg, HP) {
	var obj = document.createElement("div");
	obj.shootEn=1;
	obj.direction=dir;
	obj.damage = dmg;
	obj.size = s;
	obj.health = HP
	obj.MAXhealth = HP
	obj.id=name;
	obj.style.position = "absolute";
	obj.style.left = x+'px';//X
	obj.style.top = y+'px';//Y
	obj.x = x;
	obj.y = y;
	obj.style.width = w+'px';
	obj.style.height = h+'px';
	obj.style.marginLeft = (-1*w/2)+'px';
	obj.style.marginTop = (-1*h/2)+'px';
	obj.style.backgroundSize = w+'px '+h+'px';
	obj.style.backgroundImage = "url('"+ img +"')";
	//obj.style.transform = "rotate("+rand(360)+"deg)";
	return obj;	
} 



