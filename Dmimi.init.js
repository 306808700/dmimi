/*
	打包模块
*/
/* 前端监控
	function runMethod(instance){
		for(name in instance){
			method = instance[name];
			if(typeof method == "function"){
				instance[name] = function(name,method){
					return function (){
						console.log(this[0][0]);
						if(this&&this[0]&&this[0][0]){
							return method.apply(this,arguments);
						}else{
							throw name+"节点为空";
						}
					}
				}(name,method);
			}
		}
	}
	runMethod(DMIMI.selector);
*/
DMIMI.cpu.merge(DMIMI,[
	{
		name:"selector",
		obj:DMIMI.selector
	},
	{
		name:"tool",
		obj:DMIMI.tool
	},
	{
		name:"net",
		obj:DMIMI.net
	},
	{
		name:"event",
		obj:DMIMI.event
	}
]);



