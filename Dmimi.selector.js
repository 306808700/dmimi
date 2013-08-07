/*
	节点操作
*/

DMIMI.selector = {
	find:function(selector){
		
		var ele = this;
		var domTemp = [];

		if(selector){
			var object = DMIMI.cpu._test("attr",selector);
			DMIMI.each(ele,function(dom){
				domTemp = DMIMI._selector(selector,dom,"find");
			});
			return domTemp;
		}else{
			return null;
		}
		
	},
	parent: function( selector ) {
		var ele = this;
		var domTemp = [];
		if(selector){
			var object = DMIMI.cpu._test("attr",selector);
			domTemp = DMIMI.cpu.dir(ele,selector,"parentNode",object);
			return DMIMI.classArray(domTemp);
		}else{
			DMIMI.each(ele,function(dom){
				if(dom.parentNode){
					domTemp.push(dom.parentNode);
				}
			});
			return DMIMI.classArray(domTemp);
		}
		//var parent = selector.parentNode;
		//return parent && parent.nodeType !== 11 ? parent : null;
	},
	next: function( selector ) {
		var ele = this;
		var domTemp = [];
		if(selector){
			var object = DMIMI.cpu._test("attr",selector);

			domTemp = DMIMI.cpu.dir(selector,"nextSibling",object);
			
		}else{
			DMIMI.each(ele,function(dom){
				DMIMI.cpu.nsibling(dom,"nextSibling",domTemp);
			});
		}

		DMIMI_ELE[0] = domTemp;
		return DMIMI_ELE;

		//return DMIMI.cpu.nth( DMIMI_ELE[0][0], selector, "nextSibling" );
	},
	prev: function( selector ) {
		var ele = this;
		var domTemp = [];
		if(selector){
			var object = DMIMI.cpu._test("attr",selector);
			domTemp = DMIMI.cpu.dir(selector,"previousSibling",object);
			return DMIMI.classArray(domTemp);
		}else{
			DMIMI.each(ele,function(dom){
				DMIMI.cpu.nsibling(dom,"previousSibling",domTemp);
			});
			return DMIMI.classArray(domTemp);
		}

		//return DMIMI.cpu.nth( selector, 2, "previousSibling" );
	},
	nextAll: function( selector ) {
		var ele = this;
		var domTemp = [];
		if(selector){
			var object = DMIMI.cpu._test("attr",selector);
			
			DMIMI.each(ele,function(dom){
				var _dom = [];
				DMIMI.cpu.sibling("nextSibling",dom,dom,_dom);
				for(var j=0;j<_dom.length;j++){
					if(DMIMI.cpu.validateSelector(_dom[j],object)){
						domTemp.push(_dom[j]);
					}
				}
			});
			return DMIMI.classArray(domTemp);
		}else{
			DMIMI.each(ele,function(dom){
				DMIMI.cpu.sibling("nextSibling",dom,dom,domTemp);
			});
			return DMIMI.classArray(domTemp);
		}
		//return DMIMI.cpu.dir( selector, "nextSibling" );
	},
	prevAll: function( selector ) {
		var ele = this;
		var domTemp = [];
		if(selector){
			var object = DMIMI.cpu._test("attr",selector);
			
			DMIMI.each(ele,function(dom){
				var _dom = [];
				DMIMI.cpu.sibling(dom,dom,_dom);
				for(var j=0;j<_dom.length;j++){
					if(DMIMI.cpu.validateSelector(_dom[j],object)){
						domTemp.push(_dom[j]);
					}
				}
			});
			return DMIMI.classArray(domTemp);
		}else{
			DMIMI.each(ele,function(dom){
				DMIMI.cpu.sibling("previousSibling",dom,dom,domTemp);
			});
			return DMIMI.classArray(domTemp);
		}
		//return DMIMI.cpu.dir( selector, "previousSibling" );
	},
	siblings: function( selector ) {
		var ele = this;
		var domTemp = [];
		if(selector){
			var object = DMIMI.cpu._test("attr",selector);

			DMIMI.each(ele,function(dom){
				var _dom = [];
				DMIMI.cpu.sibling("nextSibling",dom.parentNode.firstChild,dom,_dom);
				for(var j=0;j<_dom.length;j++){
					if(DMIMI.cpu.validateSelector(_dom[j],object)){
						domTemp.push(_dom[j]);
					}
				}
			});
			return DMIMI.classArray(domTemp);
		}else{
			DMIMI.each(ele,function(dom){
				DMIMI.cpu.sibling("nextSibling",dom.parentNode.firstChild,dom,domTemp);
			});
			return DMIMI.classArray(domTemp);
		}


		//return DMIMI.cpu.sibling( selector.parentNode.firstChild, selector );
	},
	children: function( selector ) {
		/*
			判断当父节点为空的时候 children 肯定也是空
		*/
		var ele = this;
		/*
			这时候需要对selector进行解析
		*/

		if(selector){
			var object = DMIMI.cpu._test("attr",selector);
			var tempDom = [];

			DMIMI.each(ele,function(dom){
				var b = DMIMI.cpu.sibling("nextSibling",dom.firstChild);

				for(var j=0;j<b.length;j++){
					if(DMIMI.cpu.validateSelector(b[j],object)){
						tempDom.push(b[j]);
					}
				}
			});
			return DMIMI.classArray(tempDom);
		}else{
			var arr = [];
			DMIMI.each(ele,function(){
				 this.childNodes;
				for(var i=0;i<this.childNodes.length;i++){
					if(this.childNodes[i].nodeType===1){
						arr.push(this.childNodes[i]);
					}
				}
			});
			
			return DMIMI.classArray(arr,true);
			 
		}
	},
	contents: function( selector ) {
		var ele = this;
		var dom = ele[0][0].contentWindow.document;
		return DMIMI._selector(selector,dom,"find");
	}
};