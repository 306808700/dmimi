DMIMI.plugin("net", function($) {
    return ({
        
        paramToJson:function(str){
            var arr = str.split("&"),arr2 = [],temp = {},i;
            for(i=0;i<arr.length;i++){
                arr2 = arr[i].split("=");
                temp[arr2[0]]=arr2[1];
            }
            return temp;
        },
        jsonToParam:function(json){
            var str = "";
            for(var i in json){
                str+=i+"="+json[i]+"&";
            }
            str = str.substr(0,str.length-1);
            return str;
        },
        ajax: function(options) {

            $.ajaxNum?$.ajaxNum++:$.ajaxNum = 1;
            var opts = {
                url:"aboutblank",
                type:"post",
                dataType: "json",
                timeout:0,
                success: function() {},
                error:function(){},
                complete:function(){}
            };


            var opt = $.extend(opts,options);
            var callbackName,callbackParamName = "callback",symbol,paramCallback,xmlhttp, script,link, head = $("head");


            if(opt.dataType == "jsonp"){

                callbackName = "jsonpcallback"+$.ajaxNum;
                if(opt.jsonp){
                    callbackParamName = opt.jsonp;
                }
                window[callbackName] = function(res){
                    $(script).remove();
                    delete window[callbackName];
                    return opt.success(res);
                }
                
                var randomTime = +new Date();
                symbol = opt.url.indexOf("?")!=-1?"&":"?";
                opt.url = opt.url+symbol+"_dt="+randomTime;
                symbol = opt.url.indexOf("?")!=-1?"&":"?";
                paramCallback = symbol+callbackParamName+"=jsonpcallback"+$.ajaxNum;
                if(opt.data){
                    opt.url +="&"+$.jsonToParam(opt.data);
                }


                script = $.create("script",{type:"text/javascript",src:opt.url+paramCallback});
                
                head.append(script);
                return false;
            }
            if(opt.dataType=="js"){
                script = $.create("script",{type:"text/javascript",src:opt.url});
                script[0].onload = function(){
                    //$(script).remove();
                    return opt.success();
                };    
                head.append(script);
                return false;
            }
            if(opt.dataType=="css"){
                link = $.create("link",{rel:"stylesheet",href:opt.url});
                head.append(link);
                return false;
            }


            if(opt.type.match(/post|get/)){
                var xhr =  new XMLHttpRequest();
                xhr.open(opt.type.toUpperCase(), opt.url, true);  
                xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                if(opt.beforeSend){
                    opt.beforeSend(xhr);
                }
                xhr.send(opt.data?$.jsonToParam(opt.data):null);

                if(opt.timeout){
                    setTimeout(function(){
                        opt.timeoutBoolen = true;
                        opt.error({responseText:"timeout",status:"001"});

                    },opt.timeout*1000);
                }
                xhr.onreadystatechange = function(){  
                    if(opt.timeoutBoolen) return;
                    //alert(xhr.readyState);  
                    if (xhr.readyState == 4){ // 代表读取服务器的响应数据完成  
                        
                        var res = xhr.responseText || '{"responseText":"","status":"'+xhr.status+'"}';
                        opt.complete();
                        console.log(1423);
                        if (xhr.status == 200){ // 代表服务器响应正常  
                            if(opt.dataType=="json" && res){
                                try{

                                    res = JSON.parse(xhr.responseText);
                                }
                                catch(e){
                                    console.log(123);
                                    opt.error({responseText:"can not parse responseText",status:xhr.status,res:xhr.responseText});
                                    return;
                                }
                            }
                            opt.success(res,xhr.status);
                        }else{
                            opt.error({responseText:xhr.responseText,status:xhr.status});
                        }
                    }  
                };  
            }
            return xhr;
        },
        init: function() {
            return this;
        }
    }).init();
});
