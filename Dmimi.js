//@setting UTF-8
/*
	Dmimi version v1.1.3 
	Copyright (c) 2012,linchangyuan 
	developer more intimate more intelligent  
	
	“ 赞助作者 https://me.alipay.com/linchangyuan ”

	updata
		2012-5-10
		1.Dmimi 开始起草，建立 core cpu selector event tool net 模型
		2.完成Dmimi.js 核心代码

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
		1.Dmimi event drag 改良

		2012-8-7
		1.Dmimi DMIMI_ELE 方法改名为 current 并且优化

		2012-8-9
		1.SVG VML CANVAS 技术研究对比，决定不准备放进Dmimi中

		2012-8-10
		1.Dmimi ready 开发
		2.解决由于HTMLcollection 导致对象不稳定问题。

		2012-8-14
		1.drag 事件增加对于x y小于0的判断

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
		1.tool 增加not选择器
		2.优化validateSelector算法
		3.hasClass 优化支持对外使用 

		2012-8-31
		1.解决comparison IE6下animaite无效果的问题 	
		2.网站增加对css3部分支持 兼容ie6	

		2012-9-3
		1.对css3 插件优化详见网站 “我的田”

		2012-9-4
		1.增加tween 缓动支持，调用方法优化中
		2.对animate 优化

		2012-9-16
		1.event 增加keyboard 事件	支持多键监听比如 ctrl + A

		2012-9-28
		1.tool 增加stop事件用于停止对象动画队列


		*由于公司项目紧张，和一波三折，Dmimi停滞了半年，也许是懒得写了:-)
		*加入淘宝后，看了kissy那肥胖的身躯，让我重新燃起了继续开发亲爱的“大咪咪”的欲望，2013 走起! o(∩_∩)o 


		2013-5-2
		1.对append等操作加入fragment方式，提高效率
		2.优化each函数，text函数

		2013-5-7
		1.增加getNodeList函数 用于插入兄弟节点的情况
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

		计划：
			1.将所有插件以及方法文件化，
			2.制作一个方法和插件可多选的页面 checkAndDown，
			  a.支持多选下载，
			  b.可以保存用户设置，
*/


var DMIMI = function(elem){
	return DMIMI._selector(elem);
};

/*
	设置一个全局变量用于存储当前对象为了解决HTMLcollection 不稳定问题  (即将淘汰该变量)
*/
var DMIMI_ELE = []; 

DMIMI.Dmimi = "beta 1.1.3";
/*
	选择器主函数，selector: .class #id div []
*/

DMIMI._selector = function (selector,dom){
	var doc = dom||document;
	var domTemp;
	DMIMI.selector = selector;

	/*
		元素element		1
		属性attr		2
		文本text		3
		注释comments	8
		文档document	9
		片段fragment    11
	*/
	if(typeof selector == "object"){
		if(selector == document){
			selector = document.body;
		}
		return DMIMI.classArray([selector]);
	}
	if(selector.nodeType === 1||selector.nodeType === 9){
		return DMIMI.classArray([selector]);
	}
	if(selector.indexOf("<")==0){
		//var frag = document.createDocumentFragment();
		//frag.appendChild(DMIMI.cpu.createElement(selector));
		return DMIMI.classArray([DMIMI.cpu.createElement(selector,"create")]);
	}

	if(selector.indexOf("#")==0){
		domTemp = [doc.getElementById(selector.replace("#",""))];
	}else if(selector.indexOf(".")!="-1"){

		domTemp = [];
		if(selector.indexOf(".")!=0){
			/*
				如果“.”不在第一个位置那么存在元素
			*/
			var arr = selector.split(".");
			var d = doc.getElementsByTagName(arr[0]);

			for(var i=0;i<d.length;i++){
				if(DMIMI.hasClass(arr[1],d[i].className)){
					domTemp.push(d[i]);
				}
			}
		}else{
			if(DMIMI.browser("ie")){
				var arr = doc.getElementsByTagName("*");
				var _class = selector.replace(".","");
				var len = arr.length;
				for(var i=0;i<len;i++){
					if(DMIMI.hasClass(_class,arr[i].className)){
						domTemp.push(arr[i]);
					}
				}
			}else{
				domTemp = doc.getElementsByClassName(selector.replace(".",""));
			}

		}
	}else if(selector.indexOf("[")!=-1){
		domTemp = [];

		/*
			通过cpu 我们得到一个匹配selector 的数组，0： domTemp, 1: attributes
		*/
		var object = DMIMI.cpu._test("attr",selector);

		/*
			一个匿名函数返回指定节点， 通过遍历每一个节点并且判断tagName attribute 返回匹配的节点
		*/
		var d;
		object.tagName ? d = doc.getElementsByTagName(object.tagName) : d =  doc.getElementsByTagName("*");

		
		
		for(var i=0;i<d.length;i++){
			if(DMIMI.cpu.validateSelector(d[i],object)){
				domTemp.push(d[i]);
			}
		}
	}else {
		domTemp = doc.getElementsByTagName(selector);
	}

	/*
		当存在find 需要改变当操作dom对象的时候
	*/
 
	return DMIMI.classArray(domTemp);
};

/*
	使得dom对象继承所有Dmimi方法及属性
*/
DMIMI.classArray = function(dom){
	/*
		这里的dom 是 HTMLcollection  他会随着文档的改变而改变，所以需要重新创建数组。
	*/

	var arr = [];
	var len = dom.length;

	DMIMI_ELE = [dom];
	
	for(var i in DMIMI){
		DMIMI_ELE[i] = DMIMI[i];
	}
	return DMIMI_ELE;
};


/*
	@name Dmimi plugin
	@param {_plug}  function
		   {_param} param
	@逻辑
		1.插件已经在plugin.all里面，直接调用
		2.否则先加载进plugin.all再调用
		3.调用的插件依赖另一个插件，缓存该插件代码到plugin.all里面，继续加载插件所依赖的插件进plugin.all并优先执行，接着执行缓存中插件代码。
*/
DMIMI.plugin = function(name,options,callback){
	var _param,
		_plug;
	var opt = options;
	if(typeof options == "function"){
		callback = options;
		opt = {};
	}
	function getPlug(){
		$.include([name],function(){
			_plug = DMIMI.plugin.all[name];
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
	if(!DMIMI.plugin.all[name]){
		getPlug();
	}else{
		DMIMI.plugin.all[name].fun(opt,function(param){
			if(callback){
				callback(param);
			}
		});
	}
};
DMIMI.plugin.all = {};
DMIMI.plugin.add = function(name,fun,need){
	DMIMI.plugin.all[name] = {};
	DMIMI.plugin.all[name].name = name;
	DMIMI.plugin.all[name].fun = fun;
	DMIMI.plugin.all[name].need = need;
};
$ = DMIMI;
