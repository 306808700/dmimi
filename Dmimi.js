//@setting UTF-8
/*
	Dmimi version v1.1.5 
	Copyright (c) 2012,linchangyuan 
	developer more intimate more intelligent  
	
	“ 赞助作者 https://me.alipay.com/linchangyuan ”

	updata
		2012-5-10
		1.Dmimi 开始起草，建立 core cpu selector event tool net 模型  
		2.完成Dmimi.js 核心代码   1.0.0

		2012-5-11
		1.Dmimi.init.js 打包封装个模型块
		
		*项目紧张暂停2个月

		2012-7-23
		1.开发selector模型，编写日常使用率最高的几种查询器id class attr 等

		2012-7-26
		1.优化CPU参数传递模式.
		2.工具包中增加各种dom操作

		2012-7-27
		1.Dmimi框架基本成型。发布demo1.0;
		2.解决tool html()功能的bug

		2012-7-30
		1.解决 append after 等文档操作插入string 和 dom类型不同的bug

		2012-7-31
		1.Dmimi plugin 开发模式确定  

		2012-8-4
		1.Dmimi event drag 改良 1.0.1

		2012-8-7
		1.Dmimi DMIMI_ELE 方法改名为 current 并且优化

		2012-8-9
		1.SVG VML CANVAS 技术研究对比，决定不准备放进Dmimi中

		2012-8-10
		1.Dmimi ready 开发   1.0.2
		2.解决由于HTMLcollection 导致对象不稳定问题。

		2012-8-14
		1.drag 事件增加对于x y小于0的判断  1.0.3

		2012-8-15
		1.Dmimi mvdn 底层开发

		2012-8-16
		1.model 开发完成
		2.解决net层在post状态下参数传递问题

		2012-8-20~8-27
		1.Dmimi 网站的建立。

		2012-8-28
		1.提供一种能监控普通节点内容改变的方式。已加进model 
		2.优化animate 算法，comparesion可以看到效果,效率提升10倍

		2012-8-29 
		1.官网导航加了小ET 和音乐目前支持火狐

		2012-8-30  
		1.tool 增加not选择器   1.0.4
		2.优化validateSelector算法
		3.hasClass 优化支持对外使用 

		2012-8-31
		1.解决comparison IE6下animaite无效果的问题 	  1.0.6
		2.网站增加对css3部分支持 兼容ie6	

		2012-9-3
		1.对css3 插件优化详见网站 “我的田”  

		2012-9-4
		1.增加tween 缓动支持，调用方法优化中  1.0.7
		2.对animate 优化

		2012-9-16
		1.event 增加keyboard 事件	支持多键监听比如 ctrl + A

		2012-9-28
		1.tool 增加stop事件用于停止对象动画队列  1.0.8


		*由于公司项目紧张，和一波三折，Dmimi停滞了半年，也许是懒得写了:-)
		*加入淘宝后，看了kissy那肥胖的身躯，让我重新燃起了继续开发亲爱的“大咪咪”的欲望，2013 走起! o(∩_∩)o 


		2013-5-2
		1.对append等操作加入fragment方式，提高效率
		2.优化each函数，text函数

		2013-5-7
		1.增加getNodeList函数 用于插入兄弟节点的情况  1.1.0
		2.修改plugin层逻辑见line:251

		2013-5-23
		1.修改templete函数，支持数组对象替换
		2.修改include 函数，判断本地文件还是远程文件
		
		2013-6-3
		1.增加API，selectText，可以选中文字包括input textarea
		2.增加API，randomColor，随机返回一个颜色值

		2013-6-4
		1.增加API，本地数据库

		2013-7-15
		1.官网增加留言板，

		2013-7-18
		1.官网增加together
		2.修改api简介
		
		2013-8-10
		1.解决attr IE67 兼容问题

		2013-8-15
		1.解决hide show  IE78兼容问题  1.1.3

		2013-8-22 - 2013-8-30
		1.优化selector event tool 等语法结构
		2.添加命名空间

		2013-9-5  
		1.重写tool.js selector.js 减少冗余代码1K  1.1.4					
	
		2013-9-09
		1.Dmimi.js命名空间   1.1.5
		2.编写出错提示		
		.
		.
		.
		.
		.
		.
		(1.2.0 正式推广版)
*/


window.$ = window.DMIMI = function(elem){
	return DMIMI._selector(elem);
};
(function($){
	/*
		版本号
		注：有些时候会通过.Dmimi判断是否是Dmimi对象，所以这里属性名不能改。
	*/
	$.Dmimi = "beta 1.1.5";

	/*
		选择器主函数
		@param {string dom fn} .class #id div [] html
		@param {dom} dom
	*/
	$._selector = function (selector,dom){
		var doc = dom||document,
			arr,
			domTemp = [],
			i,
			len,
			nodes;
		if(!selector){
			return DMIMI;
		}
		// 函数？那么是ready
		if(typeof selector == "function"){
			return $(document).ready(selector);
		}
		// 一个套就够了
		if(selector.Dmimi){
			return selector;
		}
		
		// dom节点要套子
		if(typeof selector == "object" || selector.nodeType === 1 || selector.nodeType === 9 ){
			if(selector == document){
				selector = document.body;
			}
			return $.classArray([selector]);
		}
		// <号是要创建节点
		if(String(selector).indexOf("<")==0){
			return $.classArray([$.cpu.createElement(selector,"create")]);
		}
		// #号是查询ID了
		if(String(selector).indexOf("#")==0){
			domTemp = [doc.getElementById(selector.replace("#",""))];
		}
		// 有点肯定是查询class
		else if(String(selector).indexOf(".")!="-1"){

			if(String(selector).indexOf(".")!=0){
				/*
					如果“.”不在第一个位置那么存在元素
				*/
				arr = selector.split(".");
				nodes = doc.getElementsByTagName(arr[0]);
				len = nodes.length;
				for(i=0;i<len;i++){
					if($.hasClass(arr[1],nodes[i].className)){
						domTemp.push(nodes[i]);
					}
				}
			}else{
				if($.browser("ie")){
					nodes = doc.getElementsByTagName("*");
					var _class = selector.replace(".","");
					len = nodes.length;
					for(var i=0;i<len;i++){
						if($.hasClass(_class,nodes[i].className)){
							domTemp.push(nodes[i]);
						}
					}
				}else{
					domTemp = doc.getElementsByClassName(selector.replace(".",""));
				}

			}
		}
		// 目测是要查询属性
		else if(String(selector).indexOf("[")!=-1){
			/*
			 *进一步分析selector，区分出tagName 和 属性
			 */
			var object = $.cpu._test("attr",selector);

			
			object.tagName ? 
				nodes = doc.getElementsByTagName(object.tagName) : 
				nodes = doc.getElementsByTagName("*");

			len = nodes.length;

			for(i=0;i<len;i++){
				if($.cpu.validateSelector(nodes[i],object)){
					domTemp.push(nodes[i]);
				}
			}
		}

		// 最后只能是节点了
		else {
			domTemp = doc.getElementsByTagName(selector);
		}
		

		// 把准备好的东东套上返回
		return $.classArray(domTemp);
	};
	
	/*
		@ cpu
		复杂逻辑处理
	*/
	$.cpu = {
		_test:function(name,text){
			var results;
			var _class = {
				attr:function(text){
					var object = {};
					if(text.indexOf(".")!=-1){
						var domTemp = [];
						if(text.indexOf(".")!=0){
							/*
								如果“.”不在第一个位置那么存在元素
							*/
							var arr = text.split(".");
							object.tagName = arr[0];
							object.arr = [{className:"class",classValue:arr[1]}];
							
						}else{
							object.arr =[{className:"class",classValue:text.replace(".","")}];

						}
						return object;
					}


					var reg1 = /^\w*/;
					var reg2 = /(\[\w+=.+]|\[\w+]*\])/gi;
					
					/*
						通过正则reg1 得到匹配的tagName
					*/
					results = text.match(reg1);
					if(results&&results.length&&results[0]!=""){
						object.tagName = results[0];
					}

					/*
						通过正则reg2 得到匹配的attribute
					*/
					object.arr = [];
					results = text.match(reg2);



					if(results&&results.length){
						//这里用来把[name=abc]多个这样的放到一个对象中准备作为过滤的条件
						for(var i=0;i<results.length;i++){
							var a = results[i],b,c;
							
							a = a.match(/\[\w*=[#\-\d\w]*\]|\[\w*\]/g);
							if(a&&a.length){
								for(var j=0;j<a.length;j++){
									 
									b = a[j].replace(/[\[\]]/g,"");
									c = b.split("=");
									object.arr[j] = {attrName:c[0],attrValue:c[1]};
								}	
							}
						}
					}

					return object;
				}
			};
			return _class[name](text);
		},
		/*
			用于验证dom是否符合selector条件
			object: tagName attrName attrValue
		*/
		validateSelector:function(dom,object){
			/*
				验证属性
			*/

			var attributeFun = function(dom,object){
				var n,v;

				if(object.attrName){
					if(!dom.getAttribute(object.attrName)){
						return false;
					}
				}

				if(object.attrValue){
					/*
						当属性为href的时候IE下会自动补全
					*/
					v = dom.getAttribute(object.attrName);
					if(object.attrName=="href"){
						v = dom.getAttribute(object.attrName);
						if(v.indexOf("#")!=-1){
							v = "#"+v.split("#")[1];
						}
					}
					if(v!=object.attrValue){
						return false;
					}
				}
				
				if(object.className){
					 	
					if(!DMIMI.hasClass(object.classValue,dom.className)){
						return false;
					}
				}
				
				return true;
			};

			/*
				先验证tagName因为是唯一的
			*/
			if(object.tagName){
				if(dom.tagName!=object.tagName.toUpperCase()){
					return false;
				}
			}

			/*
				验证属性需要多个
			*/

			var arr = object.arr;
			var bool = true;
			for(var j=0;j<arr.length;j++){
				bool = attributeFun(dom,arr[j]);
				/*
					只要一个不通过直接就返回false
				*/
				if(!bool){
					break;
				}
			}
			return bool;
		},
		//var reg = /<(?:(?:\/?[A-Za-z]\w*\b(?:[=\s](['"]?)[\s\S]*?\1)*)|(?:!--[\s\S]*?--))\/?>/g;
		getNodeList:function(str){
			var nodeList = [],			//返回解析好的数组
				arr,					//临时数组用于堆栈
				temp = str,				//复制原字符串
				name,					//父节点元素名
				i1,						//匹配的<div位置
				i2,						//匹配的</div>位置
				r = "",					//getNodeList函数局部字符串用于排除的字符存储
				nn,						//元素name length
				s;						//ref1 函数局部临时字符串存储
				
			function ref1(temp){
				name = temp.match(/^<\w*/)[0];
				name = name.replace("<","");
				if(!name){
					return;
				}
				nn = name.length;
				arr = [];
				s = r;
				function ref2(){
					i1 = temp.indexOf("<"+name);
					i2 = temp.indexOf("</"+name+">");
					rn = r.length;
					i1n = i1+1+nn;
					i2n = i2+3+nn;
					if(i2>i1&&i1!=-1){
						arr.push("dom");
						temp = temp.substring(i1n);
						r+=str.substring(rn,rn+i1n);
						ref2();
					}else{
						arr.splice(arr.length-1,1);
						temp = temp.substring(i2n);
						r+=str.substring(rn,rn+i2n);
						if(arr.length==0){
							nodeList.push(r.replace(s,""));
							if(temp.length>0){
								ref1(temp);
							}
							return;
						}
						ref2();
					}
				}
				ref2(0);
			}
			ref1(temp);
			return nodeList;
		},
		createElement:function(data,type){
			data = DMIMI.cpu.getNodeList(data);
			var reg1 = /^<\w*/; // 匹配元素name
			var frag = document.createDocumentFragment();

			for(var i=0,len=data.length; i<len; i++){
				var element;

				var results1 = data[i].match(reg1);
				results1 = results1[0].replace("<",""); // 元素name
				
				
				/*
					这个正则获取元素属性包括class
				*/
				var reg2 = /\w*=['"][^=]*['"]/g;

				var firstH = data[i].indexOf(">");

				/*
					这里过滤一下，只要最外层元素及属性,
				*/
				var data1 = data[i].substring(0,firstH+1); 

				var results2 = data1.match(reg2);
				
				/*
					这个html 得到 元素html
				*/
				var index = data[i].indexOf(">");

				var index2 = data[i].length-(3+results1.length);
				var html;
				if(index2>index){
					html = data[i].substring(index+1,index2);
				}else{
					html = "";
				}

				if(!+"\v1"){
					element = document.createElement(data[i]);
				}else{
					element = document.createElement(results1);
					/*
						收集元素上含有的属性
					*/
					if(results2){
						var arr = [];
						for(var j=0;j<results2.length;j++){
							var a = results2[j];
							a = a.replace(/['"]/g,"");
							var aArray = a.split("=");
							arr[j] = {attrName:aArray[0],attrValue:aArray[1]};
						}
					
						/*
							遍历收集的属性 一一对新创建的 _dom 赋值
						*/

						for(var k=0;k<arr.length;k++){
							var name = arr[k].attrName;
							var val = arr[k].attrValue;
							element.setAttribute(name,val);
						}

					}
				}
				if(element.tagName=="IFRAME"){
					return element;
				}
				element.innerHTML = html;

				frag.appendChild(element);
			}
			if(frag.childNodes.length<2){
				return element;
			}
			return frag;
		}
	};
	/*
		套子
		@param {array} 容器
	*/

	$.classArray = function(dom){


		/* 
			这里的dom 是 HTMLcollection  他会随着文档的改变而改变，所以需要重新创建数组
			因为ie下的dom对象是以com对象的形式实现的，js对象与com对象不能进行转换所以用普通的方式
		*/
		var toArray = function(s){
			try{
			    return Array.prototype.slice.call(s);
			} catch(e){
			       var arr = [];
			        for(var i = 0,len = s.length; i < len; i++){
			            arr[i] = s[i]; 
			       }
			        return arr;
			}
		}

		var arr = [toArray(dom)];

		for(var i in $){
			arr[i] = $[i];
		}

		return arr;
	};


	/*
		@name $ plugin
		@param {_plug}  function
			   {_param} param
		@逻辑
			1.插件已经在plugin.all里面，直接调用
			2.否则先加载进plugin.all再调用
			3.调用的插件依赖另一个插件，缓存该插件代码到plugin.all里面，继续加载插件所依赖的插件进plugin.all并优先执行，接着执行缓存中插件代码。
	*/
	$.plugin = function(name,options,callback){
		var _param,
			_plug;
		var opt = options;
		if(typeof options == "function"){
			callback = options;
			opt = {};
		}
		function getPlug(){
			$.include([name],function(){
				_plug = $.plugin.all[name];
				//console.log(_plug,1);
				if(_plug.need){

					var len = 0;
					for(var i=0;i<_plug.need.length;i++){
						var t_plug = _plug.need[i];
						if(t_plug.match("css")){
							// 这里是css 可以直接include
							//console.log(t_plug,"css");
							$.include(t_plug,function(){
								//console.log("css success");
								len++;
							});
						}else{
							// 为什么这里不能用include ，因为函数加载完成还是需要执行完才能下一步。
							$.plugin(t_plug,{},function(temp){
								len++;
							});
						}
					}
					//console.log(_plug,2);
					// 延迟等待 need 文件加载完成后执行
					var key = setInterval(function(){
						//console.log(len,"interval");
						if(len>=_plug.need.length){
							clearInterval(key);
							//console.log(_plug,3);
							_plug.fun(opt,function(param){
								if(callback){
									callback(param);
								}
							});
						}
					},20);
					
				}else{
					_plug.fun(opt,function(param){
						if(callback){
							callback(param);
						}
					});
				}
			});
		}
		if(!$.plugin.all[name]){
			getPlug();
		}else{
			$.plugin.all[name].fun(opt,function(param){
				if(callback){
					callback(param);
				}
			});
		}
	};
	$.plugin.all = {};
	$.plugin.add = function(name,fun,need){
		$.plugin.all[name] = {};
		$.plugin.all[name].name = name;
		$.plugin.all[name].fun = fun;
		$.plugin.all[name].need = need;
	};


	/*
		返回新的对象，
		已a为主，添加不覆盖
	*/
	$.extend = function(a,b){
		var _class = {};
		if(a){
			if(typeof a == "function"){
				for(var name in b ){
					a[name] = b[name];
				}
				return ;
			}
			for(var name in a){
				_class[name] = a[name];
			}
		}
		if(b){
			for(var name in b){
				if(!_class[name]){
					_class[name] = b[name];
				}
			}
		}
		
		return _class;
	};

	/*
		添加到主干
		@param {string} 分支名
		@param {fn} 匿名函数，返回对象。
	*/
	$.add = function(name,fn){
		var obj = fn($);
		delete obj.init;
		var setFunction = function(key,obj){
			$[key] = function(){
				return obj[key].apply(this,arguments);
				/*
				try{
					return obj[key].apply(this,arguments);
				}
				catch(e){
					console.warn({
						msg:"function " + key +" error",
						object:this
					});
				}
				*/
			}
		}
		for(var key in obj){
			setFunction(key,obj);
		}
		$[name] = $.extend($[name],obj);
	};	
})(DMIMI);
