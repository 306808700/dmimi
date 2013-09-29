/*
	事件类
*/
DMIMI.add("event",function($){
	return ({

		/*
			绑定事件监听
		*/
		on:function(type,callback){
			var ele = this;
			callback = callback||function(){};
			$.each(ele,function(){
				var dom = this;
				dom.events = dom.events||[];
				if(dom.attachEvent){
					type = type=="mouseover"?"mouseenter":type;
					type = type=="mouseout"?"mouseleave":type;
					dom.attachEvent("on"+type,function(e){
						e = e ? e : window.event;
						e.target = e.target? e.target : e.srcElement;
						callback.call(dom,e);
					}); // 已解决ie6 得不到this 问题
				}else{
					if(type.match(/mouseenter|mouseleave/)){
						type = type=="mouseenter"?"mouseover":type;
						type = type=="mouseleave"?"mouseout":type;
						dom.addEventListener(type,function(e){
							if(!dom.contains(e.relatedTarget)){
								callback.call(dom,e);
							}
						});
					}else{
						dom.addEventListener(type,callback);
					}
				}
				dom.events.push({type:type,fn:callback});
			});
			return ele;
		},
		/*
			移除事件监听
		*/
		off:function(type,callback){
			var ele = this;
			function removeEvent(dom,ev,type,callback){
				if(callback){
					dom[ev](type,callback);
				}else{
					if(dom.events){
						for(var i=0;i<dom.events.length;i++){
							if(type==dom.events[i].type){
								dom[ev](type,dom.events[i].fn);
							}
						}
					}
					dom[ev][type] = null;
				}
			}
			ele.each(function(){
				if(this.detachEvent){
					removeEvent(this,"detachEvent","on"+type,callback)
				}else{
					removeEvent(this,"removeEventListener",type,callback)
				}
			});
			return ele;
		},
		delegate:function(selector,type,callback){

			var ele = this;

			ele.on(type,function(e){
				e = e||window.event;
				var dom = $._selector(selector,ele[0][0]);
				
				var target = e.target||e.srcElement;
				$.each(dom,function(){
					if(target==this){
						callback.apply(this);
						return;
					}
				});
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
			$.each(ele,function(index,dom){
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
						if(document.all){
							event.returnValue = false;
						}
						dom.moveCallback(e,_x,_y);
		            });
		            $(document).mouseup(function(e){
		            	e = e||event;
		            	_x = ( e.x ? fnX(e) : e.pageX )||0;
						_y = ( e.y ? fnY(e) : e.pageY )||0;
						$(document).off("mousemove");
						$(document).off("mouseup");
						//$(document).off("mousedown",$(document).mousedown());
						//$(document).mouseup(function(){});
						$("body").removeAttr("style");
						dom.upCallback(e,_x,_y);
					});
				});
			});
			return ele;
		},
		undrag:function(){
			var ele = this;
			ele.off("mousedown");
			ele.off("mouseup");
			ele.css({cursor:"default"});
			return ele;
		},
		resize:function(callback){
			window.onresize = null;
			var timer = false;
			
			window.onresize = function(){
				if(!timer){
					callback();
					timer = true;
				}
				setTimeout(function(){
					timer = false;
				},100);
			};
			
			return this;
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
				element.fireEvent('on'+event,evt);
			}
			else{
				// dispatch for firefox + others
				var evt = document.createEvent("Event");
				evt.initEvent(event, true, true ); // event type,bubbling,cancelable
				for(var i in param){
					evt[i] = param[i];
				}
				element.dispatchEvent(evt);
			}
			return ele;
	    },
		init:function(){
			var self = this;

			/*
				设置基本事件
			*/
			({
				events:[
					"focus","blur","click","dblclick",
					"mouseover","mouseout","mouseup","mousedown","mousemove",
					"keyup","keydown","keypress","change","paste"
				],
				setEvent:function(e){
					self[e] = function(callback){
						if(!callback){
							this.trigger(e);
						}else{
							this.on(e,callback);
						}
						return this;
					}
				},
				init:function(){
					var len = this.events.length;
					var i = 0;
					for(;i<len;i++){
						this.setEvent(this.events[i]);
					}
				}
			}).init();
			
			return this;
		}
	}).init();
});