/*
	节点操作
*/
DMIMI.add("selector",function($){
	return ({
		find:function(selector){
			var ele = this;
			var domTemp = [];
			if(selector){
				$.each(ele,function(){
					domTemp = domTemp.concat(
						$._selector(selector,this,"find")[0]
					);
				});
				return $.classArray(domTemp);
			}
			return null;
		},
		contents: function( selector ) {
			var ele = this;
			var dom = ele[0][0].contentWindow.document;
			return $._selector(selector,dom,"find");
		},
		init:function(){
			var self = this;
			/*
				selector 基础处理函数
			*/
			({
				attrs:{
					parent:["parentNode",1],
					next:["nextSibling",1],
					prev:["previousSibling",1],
					nextAll:["nextSibling",2],
					prevAll:["previousSibling",2],
					siblings:["nextSibling",3,"parentNode.firstChild"],
					children:["nextSibling",3,"firstChild"]
				},
				/*
					递归寻找
					@param {dom} 节点
					@param {dir} 关系

				*/ 
				recursion:function(dom,dir){
					var _Selector = this;
					var arr = [];
					void function rec(dom){
						if(dom[dir]){
							if(_Selector.verify.call(dom[dir])){
								arr = dom[dir];
							}else{
								rec(dom[dir]);
							}
						}
					}(dom);
					return arr;
				},
				/*
					遍历寻找
					@param {dom} 节点
					@param {dir} 关系 每一次查询关系
					@param {dom} 节点 用于判断本身

				*/
				foreach:function(dom,dir,elem){
					var _Selector = this;
					var arr = [];
					for ( ; dom; dom = dom[dir] ) {
						if (_Selector.verify.call(dom) && dom !== elem ) {
							arr.push( dom );
						}
					}
					return arr;
				},
				/*
					设置函数到DMIMI
					@param {String} 键名
					@param {Array} 存储该健名属性
				*/
				setSelector:function(method,arr){
					var _Selector = this;

					self[method] = function(selector){
						_Selector.verify = selector ? function(){
								var object = $.cpu._test("attr",selector);
								return this.nodeType===1&&$.cpu.validateSelector(this,object);
							}:function(){
								return this.nodeType===1;
							};
						return $.classArray(self[method].dir.call(this,arr));
					}
					self[method].dir = (function(){
						switch(arr[1]){
							case 1:
								return function(arr){
									var domTemp = [];
									$.each(this,function(){
										domTemp = domTemp.concat(
											_Selector.recursion.apply(
												_Selector,
												[this,arr[0],this]
											)
										);
									});
									return domTemp;
								};
							break;
							case 2:
								return function(arr){
									var domTemp = [];
									$.each(this,function(){
										domTemp = domTemp.concat(
											_Selector.foreach.apply(
												_Selector,
												[this,arr[0],this]
											)
										);
									});
									return domTemp;
								};
							break;
							case 3:	
								return function(arr){
									var domTemp = [];
									$.each(this,function(){
										domTemp = domTemp.concat(
											_Selector.foreach.apply(
												_Selector,
												[$.futher(this,arr[2]),arr[0],this]
											)
										);
									});
									return domTemp;
								};
							break;
						}
					})();
				},
				init:function(){
					var arr;
					for(var name in this.attrs){
						this.setSelector(name,this.attrs[name]);
					}
				}
			}).init();

			return this;
		}
	}).init();
});