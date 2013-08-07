/*
	这里的event模块理解为用户动作，包括鼠标事件 键盘事件 和一系列基于基本事件的衍生事件，比如拖拉
*/
DMIMI.event = {
	/*
		绑定事件监听
	*/
	on:function(type,callback){
		var ele = this;
		callback = callback||function(){};
		DMIMI.each(ele,function(){
			var dom = this;
			if(DMIMI.browser("ie")){
				if(type=="mouseover"){
					type = "mouseenter";
				}
				if(type=="mouseout"){
					type = "mouseleave";
				}
				dom.attachEvent("on"+type,function(){
					callback.apply(dom);
				}); // 已解决ie6 得不到this 问题
			}else{
				this.addEventListener(type,callback);
			}
		});
		return ele;
	},
	/*
		移除事件监听
	*/
	off:function(type,callback){
		var ele = this;
		callback = callback||function(){};
		DMIMI.each(ele,function(dom){
			if(DMIMI.browser("ie")){
				dom.detachEvent("on"+type,callback);
			}else{
				dom.removeEventListener(type,callback);
			}
		});
		return ele;
	},
	/*
		$("div").delegate("li","click",function(){})

	*/
	delegate:function(selector,type,callback){

		var ele = this;

		ele.on(type,function(e){
			e = e||window.event;
			var dom = DMIMI._selector(selector,ele[0][0]);
			
			var target = e.target||e.srcElement;
			$.each(dom,function(){
				if(target==this){
					callback.apply(this);
					return;
				}
			})
			/*
			var object = DMIMI.cpu._test("attr",selector);

			
			var bool;
			if(object.tagName){
				if(e.target.tagName==object.tagName){
					bool = true;
				}
			}
			if(object.arr){
				var arr = object.arr;
				var thisDomBool = false;
				for(var j=0;j<arr.length;j++){
					thisDomBool = DMIMI.cpu.validateSelector(thisDom,{
						attrName:arr[j].attrName,
						attrValue:arr[j].attrValue
					});
					if(!thisDomBool){
						break;
					}
				}

			}
			*/
			
		});
	},
	focus:function(callback){
		var ele = this;
		DMIMI.each(ele,function(dom){
			if(callback){
				dom.onfocus = callback;
			}else{
				dom.focus();
			}
		});
		return ele;
	},
	blur:function(callback){
		var ele = this;
		DMIMI.each(ele,function(dom){
			if(callback){
				dom.onblur = callback;
			}else{
				dom.blur();
			}
		});
		return ele;
	},
	click:function(callback){
		var ele = this;

		DMIMI.each(ele,function(dom){
			
			if(callback==null){
				dom.onclick = null;
				return;
			}
			if(callback){
				dom.onclick = callback;
			}else{
				dom.onclick();	
			}
		});
		return ele;
	},
	mouseover:function(callback){
		
		var ele = this;
		DMIMI.each(ele,function(dom){
			dom.onmouseenter = callback;
		});
		return ele;
	},
	mouseout:function(callback){
		var ele = this;
		DMIMI.each(ele,function(dom){
			dom.onmouseleave = callback;
		});
		return ele;
	},
	mousedown:function(callback){
		var ele = this;
		DMIMI.each(ele,function(dom){
			dom.onmousedown = callback;
		});
		return ele;
	},
	mousemove:function(callback){
		var ele = this;
		DMIMI.each(ele,function(dom){
			dom.onmousemove = callback||function(){};
		});
		return ele;
	},
	mouseup:function(callback){
		var ele = this;
		DMIMI.each(ele,function(dom){
			if(callback){
				dom.onmouseup = callback||function(){};
			}
		});
		return ele;
	},
	drag:function(downCallback,moveCallback,upCallback){
		var ele = this;
		if(!ele[0][0]){
			return;
		}
		var downCallback = downCallback || function(){};
		var moveCallback = moveCallback || function(){};
		var upCallback = upCallback || function(){};
		var _x,_y,body = $("body")[0][0];
		var fnX = function(e){
			thisX = e.clientX + (body && body.scrollLeft || 0)  - (body && body.clientLeft || 0);
			return thisX ;
		};
		var fnY = function(e){
			thisY = e.clientY + $(window).scrollTop() - (body.clientTop  || 0);
			return thisY ;
		};
		DMIMI.each(ele,function(dom){
			dom.downCallback = downCallback;
			dom.moveCallback = moveCallback;
			dom.upCallback = upCallback;

			$(dom).css({cursor:"move"});
			$(dom).mousedown(function(e){
				e = e||event;
				_x = e.x ? fnX(e) : e.pageX;
				_y = e.y ? fnY(e) : e.pageY;
				$("body").attr("style","-moz-user-select:none");
				dom.downCallback(e,_x,_y);
				$(document).mousemove(function(e){
					e = e||event;
					_x = e.pageX || fnX(e)||0;
					_y = e.pageY || fnY(e) ||0;
					window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
					dom.moveCallback(e,_x,_y);
	            });
	            $(document).mouseup(function(e){
	            	e = e||event;
	            	_x = ( e.x ? fnX(e) : e.pageX )||0;
					_y = ( e.y ? fnY(e) : e.pageY )||0;
					$(document).off("mousemove",$(document).mousemove());
					$(document).off("mouseup",$(document).mouseup());
					//$(document).off("mousedown",$(document).mousedown());
					$(document).mouseup(function(){});
					$("body").removeAttr("style");
					dom.upCallback(e,_x,_y);
				});
			});
		});
		return ele;
	},
	undrag:function(){
		var ele = this;
		ele.mousedown(function(){});
		ele.mouseup(function(){});
		ele.css({cursor:"default"});
		return ele;
	},
	resize:function(callback){
		window.onresize = null;
		var timer = false;
		if(document.all){
			window.onresize = function(){
				if(!timer){
					callback();
					timer = true;
				}
				setTimeout(function(){
					timer = false;
				},100);
			};
		}else{
			window.onresize = callback;
		}
	},
	scroll:function(callback){
		var ele = this;
		ele[0][0].onscroll = callback;
		return ele;
	},
	wheel:function(callback){
		var ele = this;
		var roll = function(){
			var delta = 0, 
			e = arguments[0] || window.event; 
			delta = (e.wheelDelta) ? e.wheelDelta / 120 : -(e.detail || 0) / 3; 
			callback.apply(ele[0][0],[delta]);//回调函数中的回调函数 
			if(e.preventDefault){
				e.preventDefault();
			}
			e.returnValue = false;
			return;
		} 
		
		if(document.attachEvent){
			ele[0][0].attachEvent("onmousewheel",roll);
		}else{
			ele[0][0].addEventListener("DOMMouseScroll", roll, false);
			ele[0][0].onmousewheel = roll;

		}
	},
	keyDown:function(callback){
		var ele = this;
		DMIMI.each(ele,function(dom){
			dom.onkeydown = function(e){
				var e = e||window.event;     
				var key = e.charCode||e.keyCode;
				callback(key)
			};
		});
		return ele;
	},
	keyUp:function(callback){
		var ele = this;
		DMIMI.each(ele,function(dom){
			dom.onkeyup = function(e){
				var e = e||window.event;     
				var key = e.charCode||e.keyCode;
				callback(key);
			};
		});
		return ele;
	},


	keyboard:function(downcallback,upCallback){
		var ele = this;
		var keyboardObject = {};
		var keyArray = [];
		var keyDownFn = function(e){
			var e = e||window.event;     
			var code = e.charCode||e.keyCode;
			if(keyboardObject[code]){
				return false;
			}
			keyboardObject[code]=setInterval(function(){
				downcallback.apply(ele[0][0],[keyboardObject]);
			},10);
		};
		var keyUpFn = function(e){
			var e = e||window.event;     
			var code = e.charCode||e.keyCode;
			clearInterval(keyboardObject[code]);
			delete keyboardObject[code];
			upCallback.apply(ele[0][0],[keyboardObject]);
		};
		
		

		$(document).on("keydown",keyDownFn);
		$(document).on("keyup",keyUpFn);
		return ele;
	},

	submit:function(callback){
		var ele = this;
		ele[0][0].onsubmit = callback;
		return ele;
	},

	trigger:function(event,param){
		var ele = this;
		var element = ele[0][0];

		if (document.createEventObject){
			// dispatch for IE
			var evt = document.createEventObject();
			return element.fireEvent('on'+event,evt);
		}
		else{
			// dispatch for firefox + others
			var evt = document.createEvent("HTMLEvents");
			evt.initEvent(event, true, true ); // event type,bubbling,cancelable
			for(var i in param){
				evt[i] = param[i];
			}
			return !element.dispatchEvent(evt);
		}
   },
	/*
		

		
	*/
	change:function(callback){
		var ele = this;
		DMIMI.each(ele,function(dom){
			dom.onchange = callback||function(){};
		});
		return ele;
	}
};


/*
	为了解决IE scrollTop 初始取值为0的bug

scrollTop = 0;
var defaultscrollfn = function(){
	scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
};
DMIMI(window).on("scroll",defaultscrollfn);

*/
