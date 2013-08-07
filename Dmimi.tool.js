/*
	工具类，

*/

DMIMI.tool = {
	get:function(){
		var ele = this;
		return ele[0][0];
	},
	size:function(){
		var ele = this;
		if(ele&&ele[0]&&ele[0][0]){
			return ele[0].length;
		}else{
			return 0;
		}
	},
	html:function(data){
		var ele = this;
		if(typeof data=="string"||typeof data=="number"){
			DMIMI.each(ele,function(dom){
				if(document.all&&dom.tagName == "table"){
					var temp = dom.ownerDocument.createElement('div');
					temp.innerHTML = '<table><tbody>' + data + '</tbody></table>';
					dom.parentNode.replaceChild(temp.firstChild.firstChild, dom.parentNode.tBodies[0]);
				}else{
					dom.innerHTML = data;
				}
			});
			return ele;
		}

		if(typeof data=="boolean"){
			var temp = $("<div></div>");
			temp.append(ele);
			return temp.html();
		}
		if(typeof data=="undefined"){
			var arr=[];
			DMIMI.each(ele,function(dom){
				arr.push(dom.innerHTML);
			});
			if(arr.length==1){
				return arr.join("");
			}else{
				return arr;
			}
		}
	},
	text:function(data){
		var ele = this;
		if(data||data==""){
			DMIMI.each(ele,function(){
				if(typeof this.textContent=='string'){
					this.textContent = data;
				}else{
					this.innerText = data;
				}
			});
			return ele;
		}else{
			var ret = "";
			DMIMI.each(ele,function(){
				if(typeof this.textContent=='string'){
					ret+=this.textContent;
				}else{
					ret+=this.innerText;
				}
			});
			return ret;
		}
	},
	val:function(data){
		var ele = this;
		var arr = [];
		DMIMI.each(ele,function(dom){
			if(data||data==""){
				dom.value = data;
			}else{
				arr.push(dom.value);
			}
		});
		return arr.join("");
	},
	value:function(data){
		var ele = this;
		if(ele[0][0].tagName.match(/INPUT|TEXTAREA/)){
			if(data&&data!=true){
				ele.val(data);
			}else{
				return ele.val();
			}
		}else{
			if(data==true){
				return ele.text();
			}else if(data){
				ele.html(data);
			}else{
				return ele.html();
			}
		}
		return ele;
	},
	attr:function(name,value){
		var ele = this;
		if(value||value==0){
			DMIMI.each(ele,function(dom){
				dom.setAttribute(name,value);
			});
			return ele;
		}else{
			var arr=[],tmp;
			DMIMI.each(ele,function(dom){
				tmp = dom.getAttribute(name)||"";
				if(name&&name=="class"&&document.all){
					tmp = dom.className;
				}
				arr.push(tmp);
			});
			if(arr.length==1){
				return arr[0];
			}else{
				return arr;
			}
		}
	},

	/*
		文档空间
	*/
	position:function(){
		var ele = this;
		return {
			left:ele[0][0].getBoundingClientRect().left,
			top:ele[0][0].getBoundingClientRect().top
		}
	},
	offset:function(){
		var ele = this;
		return {
			left:ele.offsetLeft(),
			top:ele.offsetTop()
		};
	},
	offsetTop:function(){
		var ele = this;
		var offsetTop = ele[0][0].offsetTop;
		var pTop;

		$.each(ele.parent(),function(){
			if($(this).css("position")=="replative"||$(this).css("position")=="fixed"){
				pTop = $(this).offsetTop();

				offsetTop +=pTop;
			}
		});
		return offsetTop;
	},
	offsetLeft:function(){
		var ele = this;
		var offsetLeft = ele[0][0].offsetLeft;
		var pLeft;
		$.each(ele.parent(),function(){
			if($(this).css("position")=="replative"||$(this).css("position")=="fixed"){
				pLeft = $(this).offsetLeft();

				offsetLeft +=pLeft;
			}
		});
		return offsetLeft;
	},
	scrollTop:function(){
		var ele = this;
		var scrollPos;
		if (typeof window.pageYOffset != 'undefined') {
			scrollPos = window.pageYOffset; 				//Netscape
		}else if (typeof document.compatMode != 'undefined' &&
			document.compatMode != 'BackCompat') {
			scrollPos = document.documentElement.scrollTop; //Firefox、Chrome
		}else if (typeof document.body != 'undefined') {
			scrollPos = document.body.scrollTop; 			//IE
		}
		return scrollPos;
	},
	width:function(data){
		var ele = this;
		if(ele[0][0]==window){
			return document.documentElement.clientWidth;
		}
		if(data){
			DMIMI.each(ele,function(dom){
				dom.style.width = data+"px";
			});
			return ele;
		}else{
			if(ele[0][0].currentStyle){
				return parseInt(ele[0][0].offsetWidth);
			}else if(window.getComputedStyle){
				return parseInt(window.getComputedStyle(ele[0][0] , null)['width']);
			}else{
				return parseInt(document.defaultView.getComputedStyle(ele[0][0],null).width);
			}
		}		
	},
	height:function(data){
		var arr = [];
		var ele = this;
		if(ele[0][0].tagName=="BODY"){
			return document.body.clientHeight;
		}
		if(ele[0][0]==window){
			return document.documentElement.clientHeight;
		}
		DMIMI.each(ele,function(dom){
			if(data){
				dom.style.height = data+"px";
			}else{
				arr.push(dom.offsetHeight||dom.style.height.replace("px",""));
			}
		});
		if(arr.length==1){
			return arr[0];
		}
	},
	hide:function(speed,callback){
		var ele = this;
		if(speed){
			// 缓慢隐藏
			ele.animate({opacity:0}, speed, callback||function(){});
		}else{
			DMIMI.each(ele,function(dom,index){
				dom.style.display = "none";
			});
		}
		return ele;
	},
	show:function(speed,callback){
		var ele = this;
		if(speed){
			ele.css({
				display:"block",
				opacity:0
			});
			ele.animate({opacity:1}, speed, callback||function(){});
		}else{
			DMIMI.each(ele,function(dom){
				$(dom).css({
					opacity:1
				});
				if(document.all){
					dom.style.cssText = "display:block;";
				}else{
					dom.style.display = "block";
				}
			});
		}
		return ele;
	},
	/*
		文档操作
	*/
	append:function(data){
		DMIMI.cpu.pend(this[0],"append",data);
		return this;
	},
	prepend:function(data){
		DMIMI.cpu.pend(this[0],"prepend",data);
		return this;
	},
	before:function(data){
		DMIMI.cpu.pend(this[0],"before",data);
		return this;
	},
	after:function(data){
		DMIMI.cpu.pend(this[0],"after",data);
		return this;
	},
	hasClass:function(selector,className){
		if(typeof className=="undefined"){
			var ele = this;
			className = ele.attr("class");
		}
		var pattern = new RegExp("(^|\\s)"+selector+"(\\s|$)");
        return pattern.test(className);
    },
	addClass:function(data){
		var ele = this;
		var _class;
		DMIMI.each(ele,function(dom){
			_class = dom.className;
			if(_class.indexOf(data)!=-1){return;}
			_class = _class.split(" ")||[];
			_class.push(data);
			_class = _class.join(" ");
			dom.className = _class;
		});
		return ele;
	},
	removeClass:function(data){
		var ele = this;
		DMIMI.each(ele,function(dom){
			dom.className = DMIMI.trim(dom.className.replace(data,""));
		});
		return ele;
	},
	removeAttr:function(data){
		var ele = this;
		DMIMI.each(ele,function(dom){
			dom.removeAttribute(data);
		});
		return ele;
	},
	remove:function(){
		var ele = this;
		var div = $("<div></div>");

		DMIMI.each(ele,function(dom){
			if(dom&&dom.parentNode){
				dom.parentNode.removeChild(dom);
			}
		});
		delete ele;
	},
	clone:function(){
		var ele = this;
		var newEle = ele[0][0].cloneNode(true);
		return $(newEle);
	},
	eq: function( i ) {
		var ele = this;
		return i === -1 ?
			DMIMI.classArray([ele[0][ele[0].length-1]]) :
			DMIMI.classArray([ele[0][i]]);
	},
	inArray:function(a,arr){
		if(a.Dmimi){
			arr = arr[0];
			a = a[0][0];
		}
		for(var i = 0;i<arr.length;i++){
			if(arr[i]==a){
				return i;
			}
		}
		return -1;
	},
	/*
		匹配前后空格，去除
	*/
	trim:function(data){
		data = data.replace(/^\s*|\s*$/g,"");
		return data;
	},
	trimAll:function(data){
		return data.replace(/\s*/g,"");
	},
	/*
		each 遍历
	*/
	each:function(obj,callback){
		/*
			分段遍历策略
		*/
		if(!obj||obj[0].length==0){
			return;
		}
		var len = obj[0].length,i;
		if(len<=30){
			/*
				普通方式
			*/
			for (i=0; i < len; i++) {
				if ( callback.apply( obj[0][i],[obj[0][i],i]) == false ) {
					break;
				}
			}
		}else{
			var fn = function(s){
				callback.apply( obj[0][s],[obj[0][s],s]);
				callback.apply( obj[0][s+1],[obj[0][s+1],s+1]);
				callback.apply( obj[0][s+2],[obj[0][s+2],s+2]);
				callback.apply( obj[0][s+3],[obj[0][s+3],s+3]);
				callback.apply( obj[0][s+4],[obj[0][s+4],s+4]);
				callback.apply( obj[0][s+5],[obj[0][s+5],s+5]);
			};
			var remainder = len % 6;
			var section = Math.floor( len / 6);
			if(section){
				i = 0;
				while(i<section){
					fn(i*6);i++;
				}
			}
			if(remainder){
				i = len-remainder;;
				while(i<len){
					callback.apply( obj[0][i],[obj[0][i],i]);i++;
				}
			}
		}
		return obj;
	},

	/*
		css
	*/
	css:function(obj){
		var ele = this;
		var name,arr;
		if(obj&&typeof obj =="string"){
			name = obj.replace(/-\w/,function(m){return m.toUpperCase();});
			name = name.replace("-","");
			el = ele[0][0];

			return el.currentStyle?el.currentStyle[name]:getComputedStyle(el,null)[name];
		}else if(obj){
			DMIMI.each(ele,function(dom){
				DMIMI.cpu.setStyle(dom,obj);
			});
		}else{
			if(document.all){
				return ele[0][0].currentStyle;
			}else{
				var style=ele[0][0].ownerDocument.defaultView.getComputedStyle(ele[0][0], null);
				return style;
			}
		}
		return ele;
	},
	/*
		停止当前对象所有动画
	*/
	stop:function(){
		var ele = this;
		if(ele.attr("animate")){
			var key = ele.attr("animate").split(",");
			for(var i=0;i<key.length;i++){
				clearInterval(key[i]);
			}
		}
		return ele;
	},
	getLength:function(obj){
		var num = 0;
		for(var i in obj){
			num++;
		}
		return num;
	},
	toggleClass:function(data){
		var ele = this;
		if(ele.hasClass(data)){
			ele.removeClass(data);
		}else{
			ele.addClass(data);
		}
		return ele;
	},
	/*
		@template
		obj {string}{Dmimi dom}   Such as "{text}  [list] {name} [/list] "  
		json {json}
	*/
	template:function(obj,json){
		var str;
		function fun(str){
			for(var name in json){
				if(typeof json[name]=="object"){
					// 字符串截取出新字符串
					var getStr = str.substring(str.indexOf("["+name+"]")+2+name.length,str.lastIndexOf("[/"+name+"]"));
					var newStr = "";
					for(var i=0;i<json[name].length;i++){
						var newStrP = getStr;
						for(var s in json[name][i]){
							newStrP = newStrP.replace(eval("/{"+s+"}/ig"),json[name][i][s]);
						}
						newStr+=newStrP;
					}
					str = str.replace("["+name+"]"+getStr+"[/"+name+"]",newStr);
				}else{
					if(json[name]==undefined){
						json[name] = "";
					}
					str = str.replace(eval("/{"+name+"}/ig"),json[name]);
				}
			}
			return str;
		}
		if(typeof obj=="object"){
			str = String(obj.html());
			return obj.html(fun(str));
		}else{
			str = obj;
			str = fun(str);
			return str;
		}
	},
	include:function(data,callback){
		if(typeof data=="string"){
			data = [data];
		}

		var len = data.length;
		var n = 0;
		var dataType;
		var time = +new Date();
		for(var i=0;i<len;i++){
			if($.includeHistory[data[i]]){
				n++;
				continue;
			}
			if(data[i].indexOf(".js")!=-1){
				dataType = "javascript";
			}
			if(data[i].indexOf(".css")!=-1){
				dataType = "css";
			}


			if(data[i].match("Dmimi")){
				if(data[i].indexOf(".css")!=-1){
					data[i] = "http://"+$.host("Dmimi")+"/plugin/"+data[i];
					dataType = "css";
				}else{
					data[i] = "http://"+$.host("Dmimi")+"/plugin/"+data[i]+".js";
					dataType = "javascript";
				}
			}

			$.ajax({
				url:data[i]+"?"+"time="+time,
				dataType:dataType,
				success:function(){
					n++;
				}
			});
			 
			$.includeHistory[data[i]] = true;
		}

		var date = new Date();
		var key = setInterval(function(){
			if(n>=len){
				clearInterval(key);
				if(callback){
					callback();
				}
			}else{
				if(new Date-date>3000){
					clearInterval(key);
				}
			}
		},20);
	},
	
	includeHistory:{},
	randomColor:function(){
		return "#"+Math.ceil(Math.random()*16777215).toString(16);
	},
	selectText:function() {
		var ele = this;
		var text = ele[0][0];
		if(text.tagName.match(/INPUT|TEXTAREA/)){
			text.select();
			return ele;
		}
		if (document.all) {
			var range = document.body.createTextRange();
			range.moveToElementText(text);
			range.select();
		}else{
			var selection = window.getSelection();
			var range = document.createRange();
			range.selectNodeContents(text);
			selection.removeAllRanges();
			selection.addRange(range);
		}
		return ele;
	},
	/*
		.animate({height:100,width:400,left:400},200,function(){
		默认 小到大、透明到显示 存在easing 相反
	*/
	animate:function(prop, speed, callback ,frameCallback){
		var ele = this;
		var len = DMIMI.getLength(prop);
		var speed = speed||400;
		var t = 0,bl,py;
		var animateKeyArray = [];
		
		var fun = function(v1,v2,s,d,name,num,cl){
			var abs = Math.abs(v2-v1); // 偏移量
			var tmp = v1;
			var n = s/10; // 得到次数
			var date1 = new Date(),date2;
			var key = setInterval(function(){
				date2 = new Date();
				t = date2-date1;
				bl = t/speed;
				py =abs*bl;

				if(v2<v1){
					py = v1-py;

				}else{
					py = v1+py;

				}
				if(t>=speed){
					stopFun(key,len,num,d,callback);
					py = v2;
				}

				cl(py,name);
				if(frameCallback){
					frameCallback();
				}
			},10);
			return key;
		};
		var stopFun = function(key,len,num,d,callback){
			clearInterval(key);
			if(len==num){
				if(callback){
					callback.call(ele[0][0],d);
				}
				ele.removeAttr("animate");
			}
		};

		DMIMI.each(ele,function(dom){
			var num=0;
			if($(dom).attr("animate")){
				animateKeyArray = $(dom).attr("animate").split(",");
				for(var i=0;i<animateKeyArray.length;i++){
					clearInterval(animateKeyArray[i]);
				}
			}
			for(var i in prop){
				num++;

				if(i=="opacity"){
					var opacityValue,name,
						value = parseInt(prop[i]);

					if(dom.filters){
						opacityValue = dom.style.filter||"100";
						opacityValue = parseInt(opacityValue.replace(/[a-z()=]/g,""))/100;
					}else{
						opacityValue = dom.style.opacity||1;
					}

					fun(parseInt(opacityValue),value,parseInt(speed),dom,i,num,function(tmp){	
						$(dom).css({
							opacity:tmp
						});
					});
				}else if(i=="background"){
					animateKeyArray.push(fun(parseInt($(dom).css(i))||parseInt($(dom).css(i))||0,parseInt(prop[i]),parseInt(speed),dom,i,num,function(tmp,name){
						var temp = {};
						temp[i] = "#"+tmp;
						$(dom).css(temp);
					}));
				}
				else{
					animateKeyArray.push(fun(parseInt($(dom).css(i))||parseInt($(dom).css(i))||0,parseInt(prop[i]),parseInt(speed),dom,i,num,function(tmp,name){

						var temp = {};
						temp[name] = tmp+"px";
						$(dom).css(temp);
					}));
					
				}
			}
			$(dom).attr("animate",animateKeyArray.join(","));
		});
		return ele;
	},
	not:function(selector){
		var ele = this;
		var object = DMIMI.cpu._test("attr",selector);
		var num = [];

		DMIMI.each(ele,function(dom,index){

			if(DMIMI.cpu.validateSelector(this,object)){

				num.push(index);
			}
		});
		for(var i=0;i<num.length;i++){
			ele[0].splice(num[i],1);
		}
		return ele;
	},
	date: function(date, f){
		if(typeof date != "object"){
			f = date;
			date = new Date();
		}
		f = f || "yyyy-MM-dd hh:mm:ss";
        var o = {
            "M+": date.getMonth() + 1,
            "d+": date.getDate(),
            "h+": date.getHours(),
            "m+": date.getMinutes(),
            "s+": date.getSeconds(),
            "q+": Math.floor((date.getMonth() + 3) / 3),
            "S": date.getMilliseconds()
        };
        if (/(y+)/.test(f))
            f = f.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(f))
                f = f.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        return f;
    },
	/*
		用于判断所有空
		false "false" null undefined 0 "0" "" " " {} [] function(){}
	*/
	is:function(obj){
		if(obj&&obj.Dmimi){
			if(obj.size()==0){
				return true;
			}else{
				return false;
			}
		}else{
			var obj = String($.trim(obj));
			if(obj.match(/false|null|undefined|0|function (){}/)){
				return true;
			}else if(obj=="[object object]"){
				if(obj.length){
					if(obj.length==0){
						return true;
					}else{
						return false;
					}
				}else{
					for( var i in obj){
						if(!i){
							return true;
						}else{
							return false;
						}
					}
				}
			}else if(obj==""){
				return true;
			}else{
				return false;
			}
		}
	},
	browser:function(param){
		var ua = navigator.userAgent.toLowerCase();
		var s,sys = {};
		(s = ua.match(/msie ([\d.]+)/)) ? sys.ie = s[1] :
		(s = ua.match(/firefox\/([\d.]+)/)) ? sys.firefox = s[1] :
		(s = ua.match(/chrome\/([\d.]+)/)) ? sys.chrome = s[1] :
		(s = ua.match(/opera.([\d.]+)/)) ? sys.opera = s[1] :
		(s = ua.match(/version\/([\d.]+).*safari/)) ? sys.safari = s[1] : 0;
		return sys[param];
	},
    host:function(param){
    	switch(param){
    		case "Dmimi":
    			return "Dmimi.sinaapp.com";
    		break;
    		default:
    			return window.location.host;
    		break;
    	}
    },
	/*
		dom ready 实现研究

		综合执行顺序为：
	    oncontentready，DOM树完成
	    script defer，外链script完成
	    ondocumentready complete，这时可以使用HTC组件与XHR
	    html.doScroll  HTML元素使用doScroll方法 例如textarea 或者设置了scroll 属性的元素
	    window.onload  图片、flash等资源都加载完毕
	*/
	ready:function(callback){

		var dom = [];
		dom.isReady = false;
		dom.isFunction = function(obj){
			return Object.prototype.toString.call(obj) === "[object Function]";
		};
		dom.ready = function(fn){
			dom.initReady();//如果没有建成DOM树，则走第二步
			if(dom.isFunction(fn)){
				if(dom.isReady){
					fn();//如果已经建成DOM
				}else{
					dom.push(fn);//存储加载事件
				}
			}
		};
		dom.fireReady =function(){
			if (dom.isReady){
				return;
			}
			dom.isReady = true;
			for(var i=0,n=dom.length;i<n;i++){
				var fn = dom[i];
				fn();
			}
			dom.length = 0;//清空事件
		};
		dom.initReady = function(){

			if (document.addEventListener) {
				document.addEventListener( "DOMContentLoaded", function(){
					document.removeEventListener( "DOMContentLoaded", arguments.callee, false );//清除加载函数
					dom.fireReady();
				}, false );
			}else{
				document.write("<script id='ie-domReady' defer='defer' src='//:'></script>");

				document.getElementById("ie-domReady").onreadystatechange = function() {
					if (this.readyState === "complete") {
						dom.fireReady();
						this.onreadystatechange = null;
						this.parentNode.removeChild(this);
					}
				};
			}
		};
		dom.ready(callback);
	}
};