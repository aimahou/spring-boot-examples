(function( factory ) {
	if ( typeof define === "function" && define.amd ) {
		define( ["jquery"], factory );
	} else {
		factory( jQuery );
	}
}(function( $ ) {
	'use strict';
	//替换字符串 %s
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
    //比对方法
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
		  
		    //yyyy-mm-dd || yyyy/mm/dd  
		    if(arr[0].length==4){  
		        var date = new Date(arr[0],arr[1]-1,arr[2]);  
		        if(date.getFullYear()==arr[0] && date.getMonth()==arr[1]-1 && date.getDate()==arr[2]){  
		            return true;  
		        }  
		    }  
		    //dd-mm-yyyy || dd/mm/yyyy  
		    if(arr[2].length==4){  
		        var date = new Date(arr[2],arr[1]-1,arr[0]);  
		        if(date.getFullYear()==arr[2] && date.getMonth()==arr[1]-1 && date.getDate()==arr[0]){  
		            return true;  
		        }  
		    }  
		    //mm-dd-yyyy || mm/dd/yyyy  
		    if(arr[2].length==4){  
		        var date = new Date(arr[2],arr[0]-1,arr[1]);  
		        if(date.getFullYear()==arr[2] && date.getMonth()==arr[0]-1 && date.getDate()==arr[1]){  
		            return true;  
		        }  
		    }  
		    return false;  
		}
	};
	
	var toolObject=function(){
		this.init();
		return this;
	}
	
	//业务组装
	toolObject.prototype.init=function(){
    	
    }
	//菜单处理
	toolObject.prototype.menu=function(){
		
		return {
			init:function(){
				
			}
		}
	}();
	//form 表单的处理
	toolObject.prototype.form=function(){
		
	}();
	//工具包
	toolObject.prototype.tool=function(){
		
	}();
	toolObject.prototype.table=function(){
		
	}();
	//插件处理
	toolObject.prototype.plug=function(){
		
	}();
	//按钮处理
	toolObject.prototype.button=function(){
		
	}();
	//页面处理
	toolObject.prototype.page=function(){
		
	}();
	$.extend($.fn, {
		
	});	
}));