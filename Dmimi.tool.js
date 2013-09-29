/*
	工具类，
*/
DMIMI.add("tool",function($){
	var self;
	return ({

		get:function(i){
			i = i||0;
			return i>=0 ? this[0][i] : this[0][this[0].length+i];
		},
		index:function(){
			return $(this).prevAll().size();
		},
		size:function(){
			return this[0].length;
		},
		html:function(data){
			var ele = this;
			if(typeof data=="string"||typeof data=="number"){
				$.each(ele,function(index,dom){
					if(document.all&&dom.tagName == "table"){
						var temp = dom.ownerDocument.createElement('div');
						temp.innerHTML = '<table><tbody>' + data + '</tbody></table>';
						dom.parentNode.replaceChild(temp.firstChild.firstChild, dom.parentNode.tBodies[0]);
					}else{
						this.innerHTML = data;
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
				$.each(ele,function(){
					arr.push(this.innerHTML);
				});
				return arr.length==1?arr.join(""):arr;
			}
			if(data.Dmimi){
				ele.html("").append(data);
				return ele;
			}
		},
		text:function(data){
			if(data||data==""){
				$.each(this,function(){
					this.textContent? this.textContent = data:this.innerText = data;
				});
				return this;
			}else{
				var ret = "";
				$.each(this,function(){
					ret+=this.textContent? this.textContent:this.innerText;
				});
				return ret;
			}
		},
		val:function(data){
			var arr = [];
			this.each(function(){
				(data||data=="") ? this.value = data : arr.push(this.value);
			});
			return arr.length>0 ? arr.join("") : this;
			
		},
		value:function(data){
			if(this[0][0].tagName.match(/INPUT|TEXTAREA/)){
				if(data&&data!=true){
					this.val(data);
				}else{
					return this.val();
				}
			}else{
				if(data==true){
					return this.text();
				}else if(data){
					this.html(data);
				}else{
					return this.html();
				}
			}
			return this;
		},
		attr:function(name,value){
			var ele = this;
			if(value!=undefined){
				$.each(ele,function(){
					this.setAttribute(name,value);
				});
				return ele;
			}else{
				var arr=[],tmp;
				$.each(ele,function(){
					tmp = this.getAttribute(name)||"";
					if(!tmp){
						if(this.getAttributeNode){
							tmp = this.getAttributeNode(name)?this.getAttributeNode(name).value:""
						}
					}
					if(name&&name=="class"&&this.className){
						tmp = this.className;
					}
					arr.push(tmp);
				});
				return arr.length==1? arr[0] : arr;
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
		scrollPos:function(type,name,num){
			var scrollPos;
			if (typeof window.pageYOffset != 'undefined') {
				scrollPos = window[name]; 				//Netscape
			}else if (typeof document.compatMode != 'undefined' &&
				document.compatMode != 'BackCompat') {
				scrollPos = document.documentElement[type]; //Firefox、Chrome
			}else if (typeof document.body != 'undefined') {
				scrollPos = document.body[type]; 			//IE
			}
			return scrollPos;
		},
		scrollTop:function(num){
			return self.scrollPos("scrollTop","pageYOffset",num);
		},
		scrollLeft:function(num){
			return self.scrollPos("scrollLeft","pageXOffset",num);
		},
		width:function(data){
			var ele = this;
			if(ele[0][0].tagName=="BODY"){
				return document.body.clientWidth;
			}
			if(ele[0][0]==window){
				return document.documentElement.clientWidth;
			}
			if(data){
				$.each(ele,function(){
					this.style.width = data+"px";
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
			$.each(ele,function(){
				if(data){
					this.style.height = data+"px";
				}else{
					arr.push(this.offsetHeight||this.style.height.replace("px",""));
				}
			});
			if(arr.length==1){
				return arr[0];
			}
		},
		hide:function(speed,callback){
			if(speed){
				this.animate({opacity:0}, speed, callback);
			}else{
				this.css({display:"none"});
			}
			return this;
		},
		show:function(speed,callback){
			if(speed){
				this.css({opacity:0});
				this.animate({opacity:1}, speed, callback);
			}else{
				this.css({opacity:1});
			}
			this.css({display:"block"});
			return this;
		},
		/*
			文档操作
		*/
		
		appendTo:function(data){
			data.append(this);
			return this;
		},
		append:function(data){
			self.pend(this[0],"append",data);
			return this;
		},
		prepend:function(data){
			self.pend(this[0],"prepend",data);
			return this;
		},
		before:function(data){
			self.pend(this[0],"before",data);
			return this;
		},
		after:function(data){
			self.pend(this[0],"after",data);
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
			$.each(ele,function(){
				_class = this.className;
				if(_class.indexOf(data)!=-1){return;}
				_class = _class.split(" ")||[];
				_class.push(data);
				_class = _class.join(" ");
				this.className = _class;
			});
			return ele;
		},
		removeClass:function(data){
			var ele = this;
			$.each(ele,function(){
				this.className = $.trim(this.className.replace(data,""));
			});
			return ele;
		},
		removeAttr:function(data){
			var ele = this;
			$.each(ele,function(){
				this.removeAttribute(data);
			});
			return ele;
		},
		remove:function(){
			var ele = this;
			var div = $("<div></div>");

			$.each(ele,function(){
				if(this&&this.parentNode){
					this.parentNode.removeChild(this);
				}
			});
			delete ele;
		},
		clone:function(boolean){
			var ele = this;
			var newEle = ele.get().cloneNode(true)
			if(boolean){
				if(ele.get().eventCall){
					//newEle.eventCall = eventCall;
					var i,arr = ele.get().eventCall,len = arr.length;
					for(i=0;i<len;i++){
						newEle.on(arr[i].type,arr[i].fn);
					}
				}
			}
			return $(newEle);
		},
		eq: function( i ) {
			var ele = this,i = i||0;
			return i>=0 ? $(ele[0][i]) : $(ele[0][ele[0].length+i]);
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
			return data.replace(/^\s*|\s*$/g,"");
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
			if(typeof obj=="function"){
				callback = obj;
				obj = this;
			}
			if(!obj||obj[0].length==0){
				return;
			}
			var len = obj[0].length,i;
			if(len<=30){
				/*
					普通方式
				*/
				for (i=0; i < len; i++) {
					if ( callback.apply( obj[0][i],[i,obj[0][i]]) == false ) {
						break;
					}
				}
			}else{
				var fn = function(s){
					callback.apply( obj[0][s],[s,obj[0][s]]);
					callback.apply( obj[0][s+1],[s+1,obj[0][s+1]]);
					callback.apply( obj[0][s+2],[s+2,obj[0][s+2]]);
					callback.apply( obj[0][s+3],[s+3,obj[0][s+3]]);
					callback.apply( obj[0][s+4],[s+4,obj[0][s+4]]);
					callback.apply( obj[0][s+5],[s+5,obj[0][s+5]]);
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
						callback.apply( obj[0][i],[i,obj[0][i]]);i++;
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
			var setStyle = function(dom,prop){
				var name;
				for( var s in prop){
					name = s.replace(/-\w/,function(m){return m.toUpperCase();});
					name = name.replace("-","");
					if(name=="opacity"){
						if(dom.filters){
							var num = prop[s]*100;
							dom.style.filter ="alpha(opacity="+num+")";

							dom.style.zoom = 1;
						}else{
							dom.style.opacity = prop[s];
						}
					}else{
						if(name=="float"){
							name = !dom.all ? "cssFloat" : "styleFloat";
						}
						if(name.match(/width|height|left|top|marginLeft|marginRight|marginTop|marginBottom|paddingLeft|paddingRight|paddingTop|paddingBottom|borderWidth|fontSize|lineHeight/)){
							var value = prop[s];
							if(String(prop[s]).indexOf("px")==-1){
								value = prop[s]+"px";
							}
							dom.style[name] = value;
						}else{
							dom.style[name] = prop[s];
						}
					}
				}
			};
			if(obj&&typeof obj =="string"){
				name = obj.replace(/-\w/,function(m){return m.toUpperCase();});
				name = name.replace("-","");
				el = ele[0][0];

				return el.currentStyle?el.currentStyle[name]:getComputedStyle(el,null)[name];
			}else if(obj){
				$.each(ele,function(){
					setStyle(this,obj);
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
			$.each(ele,function(){
				if($(this).attr("animate")){
					var key = $(this).attr("animate").split(",");
					for(var i=0;i<key.length;i++){
						clearInterval(key[i]);
					}
				}
				
			});
			return ele;
		},
		start:function(){
			$.each(this,function(){
				if($(this).attr("animate")){
					var key = $(this).attr("animate").split(",");
					for(var i=0;i<key.length;i++){
						clearInterval(key[i]);
					}
				}
				
			});
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
			obj {string}{$ dom}   Such as "{text}  [list] {name} [/list] "  
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


				if(data[i].match("$")){
					if(data[i].indexOf(".css")!=-1){
						data[i] = "http://"+$.host("$")+"/plugin/"+data[i];
						dataType = "css";
					}else{
						data[i] = "http://"+$.host("$")+"/plugin/"+data[i]+".js";
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
			var len = $.getLength(prop);
			var speed = speed||400;
			var t = 0,bl,py;
		
			
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

			$.each(ele,function(index,dom){
				var num=0;
				dom.animateKeyArray = [];
				if($(dom).attr("animate")){
					dom.animateKeyArray = $(dom).attr("animate").split(",");
					for(var i=0;i<dom.animateKeyArray.length;i++){
						clearInterval(dom.animateKeyArray[i]);
					}
				}
				for(var i in prop){
					num++;

					if(i=="opacity"){
						var opacityValue,name,
							value = parseInt(prop[i]);

						if(this.filters){
							opacityValue = this.style.filter||"100";
							opacityValue = parseInt(opacityValue.replace(/[a-z()=]/g,""))/100;
						}else{
							opacityValue = this.style.opacity||1;
						}

						this.animateKeyArray.push(fun(parseInt(opacityValue),value,parseInt(speed),dom,i,num,function(tmp){	
							$(dom).css({
								opacity:tmp
							});
						}));
					}else if(i=="background"){
						this.animateKeyArray.push(fun(parseInt($(dom).css(i))||0,parseInt(prop[i]),parseInt(speed),dom,i,num,function(tmp,name){
							var temp = {};
							temp[i] = "#"+tmp;
							$(dom).css(temp);
						}));
					}
					else{
						this.animateKeyArray.push(fun(parseInt($(dom).css(i))||0,parseInt(prop[i]),parseInt(speed),dom,i,num,function(tmp,name){
							var temp = {};
							temp[name] = tmp+"px";
							$(dom).css(temp);
						}));
						
					}
				}
				$(dom).attr("animate",this.animateKeyArray.join(","));
			});
			return ele;
		},
		not:function(selector){
			var ele = this;
			var object = $.cpu._test("attr",selector);
			var num = [];

			$.each(ele,function(index,dom){

				if($.cpu.validateSelector(this,object)){

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
			if(obj&&obj.$){
				return obj.size()==0?true:false;
			}else{
				var obj = String($.trim(obj));
				if(obj.match(/false|null|undefined|0|function (){}/)){
					return true;
				}else if(obj=="[object object]"){
					if(obj.length){
						return obj.length==0?true:false;
					}else{
						for( var i in obj){
							return !i?true:false;
						}
					}
				}else if(obj==""){
					return true;
				}else{
					return false;
				}
			}
		},
		browser:function(){
            var userAgent = window.navigator.userAgent.toLowerCase(); 
            var object = { 
                version: (userAgent.match( /.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/ ) || [0,'0'])[1], 
                safari: /webkit/.test( userAgent ) && !(/chrome/i.test(userAgent) && /webkit/i.test(userAgent) && /mozilla/i.test(userAgent)), 
                opera: /opera/.test( userAgent ), 
                msie: /msie/.test( userAgent ) && !/opera/.test( userAgent ), 
                mozilla: /mozilla/.test( userAgent ) && !/(compatible|webkit)/.test( userAgent )&& !(/chrome/i.test(userAgent) && /webkit/i.test(userAgent) && /mozilla/i.test(userAgent)),
                chrome: /chrome/i.test(userAgent) && /webkit/i.test(userAgent) && /mozilla/i.test(userAgent)
            };
            return object;
        },
		/*
			深度读取
			@param {object}  Dmimi节点或者对象
			@param {string} 举例  "class1.data.user.name"
		*/
		futher:function(ele,str){
			var arr = str.split("."),
				len = arr.length,
				i = 0,
				obj = ele;

			function fn(ele){
				if(i<len){
					obj = ele[arr[i]];
					i++;
					fn(obj);
				}
			}
			fn(ele);

			return obj;
		},
	    host:function(param){
	    	switch(param){
	    		case "Dmimi":
	    			return "dmimi.sinaapp.com";
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
						//fn();//如果已经建成DOM
						dom.push(fn);
						dom.run();
					}else{
						dom.push(fn);//存储加载事件
					}
				}
			};
			dom.run = function(){			
				if ($.pluginState){//预加载插件状判断
					var len = 0;
					for (var j in  $.pluginState){
						len++;
						$.pluginState[j].done(function(j){
							delete $.pluginState[j];
							len--;
							if (len === 0){
								dom.running();
							};
						});
					};
				}else{
					dom.running();
				};
			};
			//真正运行的ready在这里哦
			dom.running = function(){
				for(var i=0,n=dom.length;i<n;i++){
					var fn = dom[i];
					var tmp = setTimeout(function(){
						fn();
						clearTimeout(tmp);
					},0);
				};
				dom.length = 0;//清空事件		
			};
			dom.fireReady =function(){
				if (dom.isReady){
					return;
				}
				dom.isReady = true;
				dom.run ();
				/*
				for(var i=0,n=dom.length;i<n;i++){
					var fn = dom[i];
					fn();
				}
				dom.length = 0;//清空事件
				*/
			};
			dom.initReady = function(){
				if($.domready){
					dom.fireReady();
				}
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
		},
		init:function(){
			self = this;
			function completed(){
				if ( document.addEventListener || event.type === "load" || document.readyState === "complete" ) {
					detach();
					$.domready = true;
				}
			}
			function detach(){
				if ( document.addEventListener ) {
					document.removeEventListener( "DOMContentLoaded", completed, false );
					window.removeEventListener( "load", completed, false );

				} else {
					document.detachEvent( "onreadystatechange", completed );
					window.detachEvent( "onload", completed );
				}
			}
			if ( document.addEventListener ) {
				document.addEventListener( "DOMContentLoaded", completed, false );
				window.addEventListener( "load", completed, false );
			} else {
				document.attachEvent( "onreadystatechange", completed );
				window.attachEvent( "onload", completed );
			}
			self.pend = function(dom,pend,data){
				var fun,temp,bool,obj1,obj2,type;

				if(!data){
					return false;
				}

				if(typeof data=="string"|| typeof data=="number"){
					bool = new RegExp(/^</).test(DMIMI.trim(String(data)));
					var frag = document.createDocumentFragment();
					
					fun = function(obj,type,child,type2){
						if(bool){
							temp = $.cpu.createElement(data);
							frag.appendChild(temp);
						}else{
							temp = document.createTextNode(data);
							frag.appendChild(temp);
						}
						switch(type2){
							case "append":
								obj.appendChild(frag);
							break;
							case "prepend":
								obj.insertBefore(frag,obj.firstChild);
							break;
							case "after":
								obj[type](temp,child);
							break;
							case "before":
								obj[type](temp,child);
							break;
						}
					};
				}else{
					if(data.Dmimi){
						fun = function(dom,type,child){ 
							for(var j=0;data[0][j];j++){
								if(data[0][j]){
									dom[type](data[0][j],child);
								}
							}
						};
					}else{
						fun = function(dom,type,child){ 
							dom[type](data,child);
						};
					}
				}
				
				for(var i=0;dom[i];i++){
					switch(pend){
						case "append":
							obj1 = dom[i];
							obj2 = dom[i].firstChild;
							type = "appendChild";
						break;
						case "prepend":
							obj1 = dom[i];
							obj2 = dom[i].firstChild;
							type = "insertBefore";
						break;
						case "before":
							obj1 = dom[i].parentNode;
							obj2 = dom[i];
							type = "insertBefore";
						break;
						case "after":
							obj1 = dom[i].parentNode;
							obj2 = dom[i].nextSibling;
							type = "insertBefore";
						break;
					}
					fun(obj1,type,obj2,pend);
				}
			}
			
			return this;
		}
	}).init();
});