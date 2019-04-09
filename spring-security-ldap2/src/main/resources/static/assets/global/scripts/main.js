var main=(function($,options){
	'use strict';
	
	// 对Date的扩展，将 Date 转化为指定格式的String
	// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
	// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
	// 例子：
	// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
	// (new Date()).Format("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
	Date.prototype.format=function(fmt){
		var o={
				"M+":this.getMonth()+1,
				"d+":this.getDate(),
				"h+":this.getHours()%12==0?12:this.getHours()%12,
				"H+":this.getHours(),"m+":this.getMinutes(),
				"s+":this.getSeconds(),
				"q+":Math.floor((this.getMonth()+3)/3),
				"S":this.getMilliseconds()
		};
		var week={"0":"\u65e5","1":"\u4e00","2":"\u4e8c","3":"\u4e09","4":"\u56db","5":"\u4e94","6":"\u516d"};
		if(/(y+)/.test(fmt)){
			fmt=fmt.replace(RegExp.$1,(this.getFullYear()+"").substr(4-RegExp.$1.length))
		}
		if(/(E+)/.test(fmt)){
			fmt=fmt.replace(RegExp.$1,((RegExp.$1.length>1)?(RegExp.$1.length>2?"\u661f\u671f":"\u5468"):"")+week[this.getDay()+""])
		}
		for(var k in o){
			if(new RegExp("("+k+")").test(fmt)){
				fmt=fmt.replace(RegExp.$1,(RegExp.$1.length==1)?(o[k]):(("00"+o[k]).substr((""+o[k]).length)))
			}
		}
		return fmt
	}
		
	
	 var sprintf = function (str) {
        var args = arguments,
            flag = true,
            i = 1;

        str = str.replace(/%s/g, function () {
            var arg = args[i++];

            if (typeof arg === 'undefined') {
                flag = false;
                return '';
            }
            return arg;
        });
        return flag ? str : '';
    };
    
    
    var handleContrast=function(obj,key){
		var flag=false;
		switch(key){
		case 'array':case 'isArray':
			flag=Object.prototype.toString.call(obj) === '[object Array]';
			break;
		case 'string':case 'isString':
			flag=Object.prototype.toString.call(obj) === "[object String]"
			break;
		case 'json':case 'isJson':
			flag= typeof(obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length; 
			break;
		case 'number':case 'isNumber':
			flag= obj === +obj;
			break;
		case 'integer':case 'isInteger':
			flag= obj === +obj && obj%1 === 0;
			break;
		case 'date':case 'isDate':
			flag=handleIsDate(obj);
			break;
		case 'function':case 'isFunction':
			flag=jQuery.isFunction(obj);
			break;
		default:
			flag=isEmpty(obj);
			break;
		}
		return flag;
		
		var handleIsDate=function(obj){
			var arr = new Array();    
		    if(dateval.indexOf("-") != -1){  
		        arr = dateval.toString().split("-");  
		    }else if(dateval.indexOf("/") != -1){  
		        arr = dateval.toString().split("/");  
		    }else{  
		        return false;  
		    }  
		  
		    // yyyy-mm-dd || yyyy/mm/dd
		    if(arr[0].length==4){  
		        var date = new Date(arr[0],arr[1]-1,arr[2]);  
		        if(date.getFullYear()==arr[0] && date.getMonth()==arr[1]-1 && date.getDate()==arr[2]){  
		            return true;  
		        }  
		    }  
		    // dd-mm-yyyy || dd/mm/yyyy
		    if(arr[2].length==4){  
		        var date = new Date(arr[2],arr[1]-1,arr[0]);  
		        if(date.getFullYear()==arr[2] && date.getMonth()==arr[1]-1 && date.getDate()==arr[0]){  
		            return true;  
		        }  
		    }  
		    // mm-dd-yyyy || mm/dd/yyyy
		    if(arr[2].length==4){  
		        var date = new Date(arr[2],arr[0]-1,arr[1]);  
		        if(date.getFullYear()==arr[2] && date.getMonth()==arr[0]-1 && date.getDate()==arr[1]){  
		            return true;  
		        }  
		    }  
		    return false;  
		}
	}
    
    var getOpt=function(key){
    	if(tool.isString(key)){
    		return options[key];
    	}
    	return null;
    }
    
    var getDom=function(key){
    	var doms=getOpt('doms');
    	if(!tool.isEmpty(doms)&&tool.isJson(doms)){
    		return doms[key];
    	}
    	return null;
    }
    
    
	var tool={
		isEmpty:function(obj){
			return handleContrast(obj);
		},
		isArray:function(obj){
			return handleContrast(obj,'isArray');
		},
		isDate:function(obj){
			return handleContrast(obj,'isDate');
		},
		isNumber:function(obj){
			return handleContrast(obj,'isNumber');
		},
		isFunction:function(obj){
			return handleContrast(obj,'isFunction');
		},
		isJson:function(obj){
			return handleContrast(obj,'isJson');
		},
		isInteger:function(obj){
			return handleContrast(obj,'isInteger');
		},
		isString:function(obj){
			return handleContrast(obj,'string');
		},
		open:function(e){
			
		},
		close:function(e){
			
		},
		submit:function(options){
			if(this.isString(options)){
				
			}
		},
		fullForm:function(form,data){
			
		},
		emptyForm:function(form){
			
		},
		obj2Date:function(l,format){
			format=format||'yyyy-MM-dd HH:mm:ss';
			return isNaN(parseInt(l))||parseInt(l)<1?'':new Date().format(format);
		},
		obj2Money:function(l,c){
			
		},
		buildForm:function(data){
			
		},
		
	}
	
	var menu=function(){
		var key='HMSH.MENU.ID';
		
		
		return {
			
		}
	}
	
	var button=function(){
		
	}
	
	var form=function(){
		
	}
	
	var table=function(){
		
	}
	
	
}(jQuery));
