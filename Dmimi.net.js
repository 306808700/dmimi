/*
	网络层
*/
DMIMI.add("net",function($){
	return ({
		jsonToParam:function(json){
			var arr = [];
			for(var i in json){
				arr.push(i+"="+json[i]);
			}
			arr = arr.join("&");
			return arr;
		},
		ajax:function( options ) {
			var opts = {
				async:true,
				type:"POST",
				dataType:"json",
				error:function(error){
				},
				success:function(){}
			};

			var o = $.extend(options,opts);
			var xmlhttp,script,head = document.head || document.getElementsByTagName( "head" )[0] || document.documentElement;
			var scriptArray = [];
			var param = $.jsonToParam(o.data);
			var accepts = {
				html: "text/html,text/css",
				text: "text/plain",
				json: "application/x-www-form-urlencoded, text/javascript"
			};
	
			function XMLHttpRequestFn(){
				if (xmlhttp.readyState==4){
					if(xmlhttp.status==200){
						var script;
						var data = xmlhttp.responseText;
						if(o.dataType=="javascript"){
							new Function(data)();
							o.success();
							return;
						}
						if(o.dataType=="css"){
							o.success();
							return;
						}
						if(o.dataType=="json"){
							data = eval("("+data+")");
						}

						o.success(data);
						if(o.dataType=="html"&&data.indexOf("<script")!=-1){
							var str = data;
							var resultUrl = str.match(/<script[\sa-zA-Z=':".\/-]*>.*<\/script>/g);
							var temp,url=[];
							if(resultUrl&&resultUrl.length>0){
								for(var i=0;i<resultUrl.length;i++){
									temp = resultUrl[i].match(/src[='"a-zA-z:.\/-]*/).join("");
									temp = temp.replace(/src=/g,"").replace(/["']/g,"");
									url.push(temp);
								}
							}
							str = str.replace(/\s/g," ");
							var resultScript = str.match(/<script[\sa-zA-Z='/]*>.*<\/script>/);
							result = resultScript[0].match(/>.*</);
							result = result[0].replace(/^>/,"");
							result = result.replace(/<$/,"");
							if(url.length>1){
								for(var i=0;i<url.length;i++){
									loadScript(url[i],url.length,function(){
										new Function(result)();
									});
								}
							}else{
								new Function(result)();
							}
							//xmlhttp.detachEvent("onreadystatechange");
						}

						delete data;
					}else{
						o.error({state:xmlhttp.readyState,status:xmlhttp.status,res:xmlhttp.responseText});
					}
			    }
			}
			function loadScript( url,len,callback) {
				script = document.createElement( "script" );
				script.async = "async";
				script.src = url;
				//alert(len)
				var scriptCallback = function(){
					scriptArray.push(1);
					if(scriptArray.length==len){
						callback&&callback();
					}
				};
				script.onload = script.onreadystatechange = function( _, isAbort ) {
					if ( script.readyState&&/loaded|complete/.test(script.readyState)) {
						scriptCallback();
					}
					if(!document.all){
						scriptCallback();
					}
				};
				head.insertBefore( script, head.firstChild );
			};

			if(o.dataType=="javascript"||o.dataType=="css"){
				switch(o.dataType){
					case "javascript":
						loadScript(o.url,1,function(){
							o.success();
						});
					break;
					case "css":
						var link = document.createElement("link");
						link.href = o.url
						link.rel = "stylesheet";
						link.type = 'text/css';
						head.insertBefore( link, head.firstChild );
						setTimeout(function(){
							o.success();
						},1);
					break;
				}
				return;
			}
			xmlhttp = window.XMLHttpRequest?new XMLHttpRequest():new ActiveXObject("Microsoft.XMLHTTP");
			
			if(o.async){
				xmlhttp.onreadystatechange = function(){
					XMLHttpRequestFn();
				};
			}else{
				XMLHttpRequestFn();
			}

			xmlhttp.open(o.type.toUpperCase(),o.url,o.async);
			xmlhttp.setRequestHeader("Content-Type",accepts[o.dataType]);
			xmlhttp.send(param);
			return $;
		},
		init:function(){
			return this;
		}
	}).init();
});