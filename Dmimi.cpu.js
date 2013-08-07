/*
	@ cpu
	
	desc 数据逻辑处理

*/

DMIMI.cpu = {
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
	extend:function(a,b){
		
		var _class = {};
	
		if(b){
			for(var name in b){
				_class[name] = b[name];
				
			}
		}
		
		if(a){
			if(typeof a == "function"){
				for(var name in b ){
					a[name] = b[name];
				}
				return ;
			}
			for(var name in a){
				if(b&&b[name]==a[name]){
					continue;
				}
				_class[name] = a[name];
				
			}
		}
		return _class;
	},

	// 用于将模块属性方法合并到主干，方便用户使用
	merge:function(a,b){
		var thisExtend = function(obj){
			for(var name in obj){
				a[name] = obj[name];
			}
		};
		for(var i=0;i<b.length;i++){
			thisExtend(b[i].obj);
			delete a[b[i].name];
		}
	},
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
		for(var i=0;i<data.length;i++){
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
				/*
				console.log(data[i]);
				var eleStr = data[i].match(/<\/?[()_a-zA-Z\s='";\d#:-.]*>/g).join("");
				
				if(/^<\//.test(eleStr)){
					var s = eleStr.replace("/","");
					eleStr = s+eleStr;
				}
				*/
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
	},
	setStyle:function(dom,prop){
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
				if(name.match(/width|height|left|top|marginLeft|marginRight|marginTop|marginBottom|paddingLeft|paddingRight|paddingTop|paddingBottom|borderWidth/)){
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

	},
	/*
		用于选择器，next parent 等
	*/
	dir: function(ele,selector,dir,object ) {
		var dom = [];
		var fun = function(elem,dir,arr){
			if(elem[dir]){
				if(DMIMI.cpu.validateSelector(elem[dir],object)){
					dom.push(elem[dir]);
				}else{
					return fun(elem[dir],dir,arr);
				}
			}else{
				return false;
			}
		};
		DMIMI.each(ele,function(dom){

			fun(dom,dir,object);
		});

		return dom;
	},

	/*
		用于append prepend
	*/
	oFragment:document.createDocumentFragment(),
	pend:function(dom,pend,data){
		var fun,temp,bool,obj1,obj2,type;

		if(!data){
			return false;
		}

		if(typeof data=="string"|| typeof data=="number"){
			bool = new RegExp(/^</).test(DMIMI.trim(String(data)));
			var frag = document.createDocumentFragment();
			
			fun = function(obj,type,child,type2){
				if(bool){
					temp = DMIMI.cpu.createElement(data);
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
	},

	/*
		这个或者兄弟节点采用递归方式，直到返回正确节点或者没有了。
	*/
	nsibling:function(dom,dir,domTemp){
		var fun = function(node){
			if(node.nodeType===1){
				return node;
			}
			if(node[dir]){
				return fun(node[dir]);
			}
			return null;
		};
		if(dom[dir]){
			var _dom = fun(dom[dir]);
			if(_dom){
				domTemp.push(_dom);
			}
		}
		return domTemp;
	},

	/*
		这里遍历兄弟节点判断nodeType返回元素，而不是空格换行等
	*/
	sibling: function(dir, n, elem ,domTemp) {
		var r = [];

		for ( ; n; n = n[dir] ) {
			if ( n.nodeType === 1 && n !== elem ) {

				if(domTemp){
					domTemp.push(n);
				}
				r.push( n );
			}
		}
		return r;
	},
	/*
		获取currentStyle 兼容处理
	*/
	currentStyle:function(dom,name){
		if(dom.currentStyle){
			name = name.replace(/-\w/,function(m){return m.toUpperCase();});
			name = name.replace("-","");
			return dom.currentStyle[name];
		}else{
			return window.getComputedStyle(dom).getPropertyValue(name);
		}
	},
	jsonToParam:function(json){
		var arr = [];
		for(var i in json){
			arr.push(i+"="+json[i]);
		}
		arr = arr.join("&");
		return arr;
	},
	isEmpty:function(obj){
	    for (var name in obj){
	        return false;
	    }
	    return true;
	}
};