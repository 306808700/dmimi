/*
	网络层
*/
DMIMI.net = {
	ajax:function( options ) {
		var opts = {
			async:true,
			type:"POST",
			dataType:"json",
			error:function(state,status,response){
			},
			success:function(){}
		};

		var o = DMIMI.cpu.extend(options,opts);
		
		
		var xmlhttp;

		/*
			内部回调函数
		*/
		var script,
			head = document.head || document.getElementsByTagName( "head" )[0] || document.documentElement;
		var scriptArray = [];

		var loadScript = function( url,len,callback) {
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
					 //alert(script.readyState)
					scriptCallback();
				}
				if(!document.all){
					scriptCallback();
				}
			};
			head.insertBefore( script, head.firstChild );
		};
		if(o.dataType=="javascript"||o.dataType=="css"){
			/*
			if(o.url.indexOf("http")==-1){
				switch(o.dataType){
					case "javascript":
						var js = document.createElement("script");
						js.async = false;
						js.src = o.url;
						head.insertBefore( js, head.firstChild );
						setTimeout(function(){
							o.success();
						},1);

						
					break;
					case "css":
						var css = document.createElement("link");
						css.href = o.url;
						css.rel = "stylesheet";
						css.type = 'text/css';
						head.insertBefore( css, head.firstChild );
						setTimeout(function(){
							o.success();
						},1);
					break;
				}
			}else{
				*/
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
			//}
			return;
		}
		if (window.XMLHttpRequest){
		// code for IE7+, Firefox, Chrome, Opera, Safari
			xmlhttp = new XMLHttpRequest();
		}else{
		// code for IE6, IE5
			xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		}
		
		if(o.async){

			xmlhttp.onreadystatechange = function(){

				//o.complete(xmlhttp.readyState,xmlhttp.status,xmlhttp.responseText);
				if (xmlhttp.readyState==4 && xmlhttp.status==200){
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
			    	//o.error(xmlhttp.readyState,xmlhttp.status,xmlhttp.responseText);
			    }

			};
		}else{
			if (xmlhttp.readyState==4 && xmlhttp.status==200){
		    	var data = xmlhttp.responseText;
		    	
				if(o.dataType=="json"){

					data = eval("("+data+")");
				}
		    }else{
		    	//o.error(xmlhttp.readyState,xmlhttp.status,xmlhttp.responseText);
		    }
		}
		var param = DMIMI.cpu.jsonToParam(o.data);
		xmlhttp.open(o.type.toUpperCase(),o.url,o.async);

		var accepts = {
			html: "text/html,text/css",
			text: "text/plain",
			json: "application/x-www-form-urlencoded, text/javascript"

		};

		xmlhttp.setRequestHeader("Content-Type",accepts[o.dataType]);

		xmlhttp.send(param);
		
		return false;
	}
	
};