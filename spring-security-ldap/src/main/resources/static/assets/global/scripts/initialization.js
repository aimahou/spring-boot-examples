/**
 * 项目初始化加载js
 * 
 */
;(function (factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('jquery'));
  } else {
    factory(jQuery);
  }
}(function ($) {
	'use strict';
	
	// it only does '%s', and return '' when arguments are undefined
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
    /*名片*/
    var card=function (options) {
		var body=$('body'),wp;
		if(body.length==1){
			wp=$('<div class="row" style="display:none;position:absolute;"></div>').appendTo($('body')).css({
				'z-index':1000
			});
		}

		/*获得触发元素坐标、计算新容器的坐标*/
		var handleNewCoord =function (o) {
			o=$(o);
			if(o.length>0&&wp.length>0){
				var x=o.offset().top,y=o.offset().left,top=x+o.outerHeight()+10;
				wp.css({'top':top+'px','left':y+'px'});
			}
		}
		return {
			open:function (j,callback) {
				handleNewCoord(j);
				wp.fadeIn(1000,function(){
					if(options.unit.isFunction(callback)){
						callback();
					}
				});
				return this;
			},
			close:function () {
				wp.fadeOut();
				return this;
			},
			getwp:function(){
				return wp;
			}
		}	
	};
	
	var tool=function(e){
		var lf="localStorage" in window && window["localStorage"] !== null,cf=navigator.cookieEnabled;
		$.extend({includePath:"",include:function(d){var a=typeof d=="string"?[d]:d;for(var e=0;e<a.length;e++){var b=a[e].replace(/^s$/g,"");var g=b.split(".");var c=g[g.length-1].toLowerCase();var href=$.includePath+b;if($('link[href="'+href+'"],script[href="'+href+'"]').length>0){break;}var j=c=="css";var k=j?"link":"script";var f=j?" type='text/css' rel='stylesheet' ":" language='javascript' type='text/javascript' ";var h=(j?"href":"src")+"='"+$.includePath+b+"'";if($(k+"["+h+"]").length==0){$("<"+k+f+h+"></"+k+">").appendTo($('body'));}}}});
		
		var handleInit=function(){
			var plugs=getOpt('plug');
			handlePlugsInit(plugs);
		}
		
		var handlePlugsInit=function(plugs){
			if(!handleContrast(plugs)){
				for(var d in plugs){
					var json=plugs[d];
					if(json.init!=true){continue}
					handlePlug(d)
				}
				var copyright=handleDom("copyright");
				if(!handleContrast(copyright)){
					var copy=handleGetCompany("copyright");
					if(!handleContrast(copy)){
						copyright.html(copy)
					}
				}
				var logo=handleDom("page_logo");
				if(!handleContrast(logo)){
					var logoPath=(handleContrast(getOpt('contextPath'))?'':getOpt('contextPath'))+handleGetCompany("logo");
					var itemName=handleGetCompany("itemName");
					
					if(!handleContrast(logoPath)){
						
						if($("img",logo).length>0){
							$("img",logo).attr("src",logoPath).attr("alt",itemName).addClass("logo-default")
						}else{
							$('<a href="/" title="'+itemName+'"><img src="'+logoPath+'" alt="'+itemName+'" width="150" height="48" class="logo-default"/></a>').prependTo(logo)
						}
					}
				}
			}
		}
		
		var getOpt=function(key){
			if(!handleContrast(key)){
				var opts=e.opt;
				return handleContrast(opts)?null:opts[key];
			}
			return e.opt;
		}
		
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
		}
		var isEmpty=function(s){var flag=false;var type=typeof(s);switch(type){case"string":flag=$.trim(s)==""||$.trim(s).length<=0;break;case"undefined":flag=true;break;default:flag=s==null||s.length<=0;break}return flag}
		//持久化设置数据
		var handleSetPersistenceData=function(key,value){
			if(!handleContrast(key)&&!handleContrast(value)&&handleContrast(key,'string')){
				if(lf){
					window.localStorage[key]=escape(value);
				}else if(cf){
					setCookie(key,value);
				}
			}
			
		}
		
		var handleGetPersistenceData=function(key){
			var result=null;
			if(!handleContrast(key)&&handleContrast(key,'string')){
				result=lf?unescape(window.localStorage[key]):cf?getCookie(key):null;
			}	
			return result;
		}
		
		var setCookie=function(name,value,seconds){
			seconds=seconds||0;var expires="";if(seconds!=0){var date=new Date();date.setTime(date.getTime()+(seconds*1000));expires="; expires="+date.toGMTString()}document.cookie=name+"="+escape(value)+expires+";path=/"; 
		}
		
		var getCookie=function(name){
			var nameEQ=name+"=";var ca=document.cookie.split(";");for(var i=0;i<ca.length;i++){var c=ca[i];while(c.charAt(0)==" "){c=c.substring(1,c.length)}if(c.indexOf(nameEQ)==0){return unescape(c.substring(nameEQ.length,c.length))}}return null
		}
		
		function delCookie(name){   
			 var exp = new Date();
			 exp.setTime(exp.getTime() - 1);   
			 var cval=getCookie(name);   
		     if(cval!=null)  {
		    	 document.cookie= name + "="+cval+"; path=/;expires="+exp.toGMTString();   
		     } 	       
		}
		//删除持久化数据
		var handleDelPersistenceData=function(key){
			if(lf){
				window.localStorage.removeItem(key);
			}else if(cf){
				delCookie(key);
			}
		}
		//插件
		var handlePlug=function(key){
			var plugs=getOpt('plug');
			if(handleContrast(plugs,'json')){
				var plug=plugs[key];if(handleContrast(plug)){return}var css=plug.css;css=handleContrast(css,'array')?css:[];var js=plug.js;if(handleContrast(js,'array')){$.each(js,function(i,v){css.push(v)})}if(!handleContrast(css)){$.include(css)}
				return plug
			}
			return null;
		}
		
		var handleGetCompany=function(key){
			var company=getOpt('company');
			if(handleContrast(key)){
				return company;
			}
			return company[key];
		}
		
		var handleToken=function(o){
			var token=getOpt('token');
			if(handleContrast(token,'json')){
				if(!handleContrast(o) && $(o).is('form')){
					for(t in token){
						if($('[name="t"]',$(o)).length<1){
							$('<input type="hidden" name="'+t+'" value="'+token[t]+'"/>').appendTo($(o));
						}	
					}
				}else if(handleContrast(o,'json')){
					for(var t in token){
						o[t]=token[t];
					}
					return o;
				}
			}
			return token;
		}
		
		var handleDom=function(key){
			var doms=getOpt('dom');
			return (!handleContrast(doms)&& handleContrast(doms,'json'))?$(doms[key]).length<1?null:$(doms[key]):null;
		}
		
		return {
			init:function(){
				handleInit();
			},
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
			alert:function(title,message,type){
				swal(title,message,type);
			},
			getData:function(key){
				return handleGetPersistenceData(key);
			},
			setData:function(key,value,l){
				handleSetPersistenceData(key,value);
			},
			delData:function(key){
				handleDelPersistenceData(key);
			},
			open:function(e,data){
				var th=$(e),init=this;if(!th.length){return false}var form=th.is("form")?th:$("form",th);if(form.length>0){if(!this.isEmpty(data)&&this.isJson(data)){init.fullForm(form,data)}else{if(!form.hasClass("no-empty")){this.emptyForm(form)}}}if(th.hasClass("modal")){th.modal();return}if(th.hasClass("tab-pane")){var content=this.getDom("tab_content");if(!content.length){return}var close=$(".tab-pane:visible",content);close.fadeTo("slow",0,function(){close.removeClass("active in").removeAttr("style");th.addClass("active in")});return}
			},
			close:function(e){
				
			},
			plug:function(key){
				handlePlug(key);
			},
			submit:function(options,callback){
				var unit=this;
				var opt={dataType:'JSON',type:'POST'};
				if(this.isJson(options)){
					opt.data=handleToken(options.data);
					console.log(opt);
					opt=$.extend(opt,options);
				}else if($(options).is('form')){
					var validate=$(options).validate();
					if(!unit.isEmpty(validate)){
						if(!validate.form()){
							return;
						}
					}
					var form=$(options),url=form.attr('action'),data=form.serialize(),type=isEmpty(form.attr('method'))?'POST':form.attr('method');
					if(!this.isEmpty(url)){
						opt=$.extend(opt,{url:url,data:data,type:type,dataType:'JSON'});
					}
				}
				if(!this.isEmpty(opt.url)){
					return $.ajax(opt).always(function(data,state){
						var title='操作提示',type='success',message='操作成功!';
						if(state!='success'){
							type='error',title='错误',message='请求失败,系统错误!';
						}else{
							title=data.flag?title:'错误',type=data.flag?type:'error',message=data.flag?data.message||'操作成功':data.errorMsg||'操作失败!';
						}
						if(unit.isFunction(callback)){
							callback({title:title,type:type,message:message},data,state);
						}
					});					
				}
				return null;
			},
			//获取公司信息
			getCompany:function(key){
				return handleGetCompany(key);
			},
			//设置URL
			setUpUrl:function(url){
				if(!handleContrast(url)){
					var contextPath=getOpt('contextPath');
					contextPath=handleContrast(contextPath)?'':contextPath;
					url=contextPath+url;
				}
				return url;
			},
			setToken:function(o){
				return handleToken(o);
			},
			getDom:function(key){
				return handleDom(key);
			},
			fullForm:function(form,data){
				var init=this;if($(form).is("form")){this.emptyForm(form);if(!this.isEmpty(data)&&this.isJson(data)){$('select,textarea,input[name!="_csrf"]',$(form)).each(function(){var th=$(this);if(th.is("input")){var type=th.attr("type");if(type=="button"||type=="image"||type=="reset"||type=="submit"){return true}}var id=th.attr("id"),name=th.attr("name");for(var d in data){if(d==id||d==name){if(th.is("input")){var type=th.attr("type");if(type=="radio"||type=="checkbox"){var value=th.attr("value");if(value==data[d]){th.attr("checked","checked")}else{th.removeAttr("checked","checked")}break}th.val(data[d]);break}if(th.is("select")){th.val(data[d]).trigger("change");break}th.val(data[d]);break}}})}};
			},
			emptyForm:function(f){
				if($(f).is("form")&&$(f).length>0){
					var validate=$(f).validate();
					if(!handleContrast(validate)){validate.resetForm();}
					$(f)[0].reset();
					$('input:hidden',f).each(function(){
						var token=getOpt('token'),$this=$(this);
						var f=false;
						for(var d in token){
							if($this.attr('name')==d){
								f=true;
								break;
							}
						}
						if(f){
							return true;
						}
						$this.val('');
					});
				}
			},
			getOpt:function(key){
				return getOpt(key);
			},
			encapsulationSearch:function(form,json){
				var orderby="";var init=this;var order=json.order;var columns=json.columns;var tranform,alias;if(form.length>0){form.each(function(){var th=$(this);tranform=th.data("tranform");alias=th.data("alias");return false})}if(!init.isEmpty(order)&&!init.isEmpty(columns)){$.each(order,function(i,v){if(i>0){orderby+=","}var column=columns[i];var name=column.data;orderby+=" ";var dir=v.dir;if(!init.isEmpty(alias)){orderby+=alias+"."}if(tranform||tranform=="true"){orderby+=tranformStr(name)+" "+dir}else{orderby+=name+" "+dir}});json["orderBy"]=orderby}if(init.isEmpty(form)){return json}if(form.length>0){form.each(function(){var th=$(this);json=init.isEmpty(json)?{}:json;var data=th.serializeArray();$.each(data,function(i,v){json[v.name]=v.value});return false})}return json;function tranformStr(s){return s.replace(/([A-Z])/g,"_$1").toLowerCase()}
			},
			toDate:function(l,format){
				format=format||"yyyy-MM-dd HH:mm:ss";l=parseInt(l);l=isNaN(l)?0:l;if(l<=0){return""}return formatDate(l,format);function formatDate(l,format){Date.prototype.format=function(fmt){var o={"M+":this.getMonth()+1,"d+":this.getDate(),"h+":this.getHours()%12==0?12:this.getHours()%12,"H+":this.getHours(),"m+":this.getMinutes(),"s+":this.getSeconds(),"q+":Math.floor((this.getMonth()+3)/3),"S":this.getMilliseconds()};var week={"0":"\u65e5","1":"\u4e00","2":"\u4e8c","3":"\u4e09","4":"\u56db","5":"\u4e94","6":"\u516d"};if(/(y+)/.test(fmt)){fmt=fmt.replace(RegExp.$1,(this.getFullYear()+"").substr(4-RegExp.$1.length))}if(/(E+)/.test(fmt)){fmt=fmt.replace(RegExp.$1,((RegExp.$1.length>1)?(RegExp.$1.length>2?"\u661f\u671f":"\u5468"):"")+week[this.getDay()+""])}for(var k in o){if(new RegExp("("+k+")").test(fmt)){fmt=fmt.replace(RegExp.$1,(RegExp.$1.length==1)?(o[k]):(("00"+o[k]).substr((""+o[k]).length)))}}return fmt};var d=new Date();d.setTime(l);var s=d.format(format);return s}
			},
			viewPhoto:function(e){
				
			},
			nofind:function(e){
				var img=this.setUpUrl('/assets/layout/img/timg.jpg');
				$(e).attr('src',img);				
			}
		}
	}
	//相册初始化
	var album=function(init){
		
				
	}
	
	var Initialization=function(options){
		this.options=options;
		this.opt=$.extend(Initialization.DEFAULTS,options);
		this.init();
		return this;	
	}
	Initialization.DEFAULTS1={
		company:{
			name:'深圳市吉粮商业管理有限公司',
			address:'',//地址
			customer:'',//客服 ','隔开
			QRCode:[],//二维码
			logo:'',//图标
		},
		item:{
			copyright:'',
			favicon:'',
			name:'',
			
		},
		plugs:{
			
		},
		doms:{
			
		},
		contextPath:'',
		menuData:[],
		resourceList:[],
		start:function(){
			//页面初始化
		},
		end:function(){
			//初始化完毕
		},
		icon:[],
		style:[],//基础样式
		
	}
	Initialization.DEFAULTS={
		    "company": {
		        "name": "深圳市吉粮商业管理有限公司", 
		        "copyright": "2015-2019 © All Rights Reserved.粤ICP备15020515号.吉粮商业 阿凡达（深圳）网络科技有限公司 版权所有.", 
		        "logo": "/assets/layout/img/logo.png", 
		        "itemName": "吉粮商业-后台管理"
		    }, 
		    "plug": {
		        "multiSelect": {
		            "css": [
		                "/assets/global/plugins/jquery-multi-select/css/multi-select.css"
		            ], 
		            "js": [
		                "/assets/global/plugins/jquery-multi-select/js/jquery.multi-select.js"
		            ]
		        }, 
		        "select2": {
		            "css": [
		                "/assets/global/plugins/select2/css/select2-bootstrap.min.css", 
		                "/assets/global/plugins/select2/css/select2.min.css"
		            ], 
		            "js": [
		                "/assets/global/plugins/select2/js/select2.full.min.js"
		            ]
		        }, 
		        "bootstrapSwitch": {
		            "css": [
		                "/assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css", 
		                "/assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js"
		            ], 
		            "js": [
		                "/assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js"
		            ]
		        }, 
		        "uploader": {
		            "js": [
		                "/assets/global/plugins/plupload/js/plupload.full.min.js"
		            ], 
		            "font": [
		                "/assets/global/plugins/plupload/js/Moxie.swf", 
		                "/assets/global/plugins/plupload/js/Moxie.xap"
		            ]
		        }, 
		        "bootstrapTable": {
		            "css": [
		                "/assets/global/plugins/bootstrap-table/bootstrap-table.css"
		            ], 
		            "js": [
		                "/assets/global/plugins/bootstrap-table/bootstrap-table.min.js", 
		                "/assets/global/plugins/bootstrap-table/locale/bootstrap-table-zh-CN.js"
		            ], 
		            "init": true
		        }, 
		        "animsition": {
		            "css": [
		                "/assets/global/plugins/animsition/css/animsition.min.css"
		            ], 
		            "js": [
		                "/assets/global/plugins/animsition/js/animsition.min.js"
		            ]
		        }, 
		        "plugins": {
		            "css": [
		                "/assets/global/css/plugins.min.css"
		            ], 
		            "init": true
		        }, 
		        "error": {
		            "css": [
		                "/assets/pages/css/error.min.css"
		            ]
		        }, 
		        "validate": {
		            "js": [
		                "/assets/global/plugins/jquery-validation/js/jquery.validate.min.js", 
		                "/assets/global/plugins/jquery-validation/js/additional-methods.min.js", 
		                "/assets/global/plugins/jquery-validation/js/localization/messages_zh.min.js"
		            ]
		        }, 
		        "dataTables": {
		            "js": [
		                "/assets/global/plugins/datatables/datatables.min.js", 
		                "/assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.js"
		            ], 
		            "css": [
		                "/assets/global/plugins/datatables/datatables.min.css", 
		                "/assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css"
		            ]
		        }, 
		        "fancybox": {
		            "js": [
		                "/assets/global/plugins/fancybox/source/jquery.fancybox.pack.js"
		            ], 
		            "css": [
		                "/assets/global/plugins/fancybox/source/jquery.fancybox.css"
		            ]
		        },
		        'cubeportfolio':{
		        	js:['/assets/global/plugins/cubeportfolio/js/jquery.cubeportfolio.min.js'],
		        	css:['/assets/global/plugins/cubeportfolio/css/cubeportfolio.css'],
		        	init: true
		        }
		    }, 
		    "animsition": true, 
		    "dom": {
		        "copyright": ".page-footer-inner", 
		        "tab_content": ".tab-content", 
		        "tab_pane": ".tab-content .tab-pane", 
		        "table": "table.table:first:not(.no-automatic)", 
		        "menu": "#sidebar_menu", 
		        "navigation_bar": "#navigation_bar", 
		        "caption": ".caption", 
		        "logo": ".logo", 
		        "page_logo": ".page-logo", 
		        "page_content": ".page-content:first", 
		        "select2": "select[data-type],select[data-url],select[data-data],select.select2", 
		        "addBtn": ".btn[data-type=\"add\"]", 
		        "saveBtn": ".btn[data-type=\"save\"]", 
		        "cancelBtn": ".btn[data-type=\"cancel\"]", 
		        "searchBtn": ".btn[data-type=\"search\"]", 
		        "uploader": "[data-type=\"uploader\"]", 
		        "toggleBtn": ".btn[data-toggle]", 
		        "make_switch": "input.make-switch"
		    }, 
		    "data": [ ], 
		    "icon": [
		        "icon-bell", 
		        "fa fa-plus", 
		        "fa fa-bolt", 
		        "fa fa-bell-o", 
		        "fa fa-bullhorn", 
		        "icon-envelope-open", 
		        "icon-calendar", 
		        "fa fa-angle-down", 
		        "icon-user", 
		        "icon-rocket", 
		        "icon-lock", 
		        "icon-key", 
		        "icon-logout", 
		        "icon-close", 
		        "icon-magnifier", 
		        "icon-home", 
		        "icon-bar-chart", 
		        "icon-bulb", 
		        "icon-graph", 
		        "icon-diamond", 
		        "icon-puzzle", 
		        "icon-settings", 
		        "icon-briefcase", 
		        "icon-wallet", 
		        "icon-pointer", 
		        "icon-layers", 
		        "icon-feed", 
		        "icon-paper-plane", 
		        " icon-wrench", 
		        "icon-basket", 
		        "icon-tag", 
		        "icon-docs", 
		        "icon-clock", 
		        "icon-check", 
		        "icon-envelope", 
		        "icon-notebook", 
		        "icon-user-female", 
		        "icon-user-following", 
		        "icon-users", 
		        "icon-lock-open", 
		        "icon-social-dribbble", 
		        "icon-info", 
		        "icon-call-end", 
		        "icon-wrench", 
		        "icon-pencil", 
		        "icon-note", 
		        "icon-folder", 
		        "icon-power", 
		        "icon-star", 
		        "icon-camera", 
		        "icon-link", 
		        "icon-globe", 
		        "fa fa-circle", 
		        "icon-shield", 
		        "icon-bag", 
		        "fa fa-500px", 
		        "fa fa-amazon", 
		        "fa fa-balance-scale", 
		        "fa fa-battery-0", 
		        "fa fa-battery-1", 
		        "fa fa-battery-2", 
		        "fa fa-battery-3", 
		        "fa fa-battery-4", 
		        "fa fa-battery-empty", 
		        "fa fa-battery-full", 
		        "fa fa-battery-half", 
		        "fa fa-battery-quarter", 
		        "fa fa-battery-three-quarters", 
		        "fa fa-black-tie", 
		        "fa fa-calendar-check-o", 
		        "fa fa-calendar-minus-o", 
		        "fa fa-calendar-plus-o", 
		        "fa fa-calendar-times-o", 
		        "fa fa-cc-diners-club", 
		        "fa fa-cc-jcb", 
		        "fa fa-chrome", 
		        "fa fa-clone", 
		        "fa fa-commenting", 
		        "fa fa-commenting-o", 
		        "fa fa-contao", 
		        "fa fa-creative-commons", 
		        "fa fa-expeditedssl", 
		        "fa fa-firefox", 
		        "fa fa-fonticons", 
		        "fa fa-genderless", 
		        "fa fa-get-pocket", 
		        "fa fa-gg", 
		        "fa fa-gg-circle", 
		        "fa fa-hand-grab-o", 
		        "fa fa-hand-lizard-o", 
		        "fa fa-hand-paper-o", 
		        "fa fa-hand-peace-o", 
		        "fa fa-hand-pointer-o", 
		        "fa fa-hand-rock-o", 
		        "fa fa-hand-scissors-o", 
		        "fa fa-hand-spock-o", 
		        "fa fa-hand-stop-o", 
		        "fa fa-hourglass", 
		        "fa fa-hourglass-1", 
		        "fa fa-hourglass-2", 
		        "fa fa-hourglass-3", 
		        "fa fa-hourglass-end", 
		        "fa fa-hourglass-half", 
		        "fa fa-hourglass-o", 
		        "fa fa-hourglass-start", 
		        "fa fa-houzz", 
		        "fa fa-i-cursor", 
		        "fa fa-industry", 
		        "fa fa-internet-explorer", 
		        "fa fa-map", 
		        "fa fa-map-o", 
		        "fa fa-map-pin", 
		        "fa fa-map-signs", 
		        "fa fa-mouse-pointer", 
		        "fa fa-object-group", 
		        "fa fa-object-ungroup", 
		        "fa fa-odnoklassniki", 
		        "fa fa-odnoklassniki-square", 
		        "fa fa-opencart", 
		        "fa fa-opera", 
		        "fa fa-optin-monster", 
		        "fa fa-registered", 
		        "fa fa-safari", 
		        "fa fa-sticky-note", 
		        "fa fa-sticky-note-o", 
		        "fa fa-television", 
		        "fa fa-trademark", 
		        "fa fa-tripadvisor", 
		        "fa fa-tv", 
		        "fa fa-vimeo", 
		        "fa fa-wikipedia-w", 
		        "fa fa-y-combinator", 
		        "fa fa-yc", 
		        "fa fa-adjust", 
		        "fa fa-anchor", 
		        "fa fa-archive", 
		        "fa fa-area-chart", 
		        "fa fa-arrows", 
		        "fa fa-arrows-h", 
		        "fa fa-arrows-v", 
		        "fa fa-asterisk", 
		        "fa fa-at", 
		        "fa fa-automobile", 
		        "fa fa-ban", 
		        "fa fa-bank", 
		        "fa fa-bar-chart", 
		        "fa fa-bar-chart-o", 
		        "fa fa-barcode", 
		        "fa fa-bars", 
		        "fa fa-bed", 
		        "fa fa-beer", 
		        "fa fa-bell", 
		        "fa fa-bell-slash", 
		        "fa fa-bell-slash-o", 
		        "fa fa-bicycle", 
		        "fa fa-binoculars", 
		        "fa fa-birthday-cake", 
		        "fa fa-bomb", 
		        "fa fa-book", 
		        "fa fa-bookmark", 
		        "fa fa-bookmark-o", 
		        "fa fa-briefcase", 
		        "fa fa-bug", 
		        "fa fa-building", 
		        "fa fa-building-o", 
		        "fa fa-bullseye", 
		        "fa fa-bus", 
		        "fa fa-cab", 
		        "fa fa-calculator", 
		        "fa fa-calendar", 
		        "fa fa-calendar-o", 
		        "fa fa-camera", 
		        "fa fa-camera-retro", 
		        "fa fa-car", 
		        "fa fa-caret-square-o-down", 
		        "fa fa-caret-square-o-left", 
		        "fa fa-caret-square-o-right", 
		        "fa fa-caret-square-o-up", 
		        "fa fa-cart-arrow-down", 
		        "fa fa-cart-plus", 
		        "fa fa-cc", 
		        "fa fa-certificate", 
		        "fa fa-check", 
		        "fa fa-check-circle", 
		        "fa fa-check-circle-o", 
		        "fa fa-check-square", 
		        "fa fa-check-square-o", 
		        "fa fa-child", 
		        "fa fa-circle-o", 
		        "fa fa-circle-o-notch", 
		        "fa fa-circle-thin", 
		        "fa fa-clock-o", 
		        "fa fa-close", 
		        "fa fa-cloud", 
		        "fa fa-cloud-download", 
		        "fa fa-cloud-upload", 
		        "fa fa-code", 
		        "fa fa-code-fork", 
		        "fa fa-coffee", 
		        "fa fa-cog", 
		        "fa fa-cogs", 
		        "fa fa-comment", 
		        "fa fa-comment-o", 
		        "fa fa-comments", 
		        "fa fa-comments-o", 
		        "fa fa-compass", 
		        "fa fa-copyright", 
		        "fa fa-credit-card", 
		        "fa fa-crop", 
		        "fa fa-crosshairs", 
		        "fa fa-cube", 
		        "fa fa-cubes", 
		        "fa fa-cutlery", 
		        "fa fa-dashboard", 
		        "fa fa-database", 
		        "fa fa-desktop", 
		        "fa fa-diamond", 
		        "fa fa-dot-circle-o", 
		        "fa fa-download", 
		        "fa fa-edit", 
		        "fa fa-ellipsis-h", 
		        "fa fa-ellipsis-v", 
		        "fa fa-envelope", 
		        "fa fa-envelope-o", 
		        "fa fa-envelope-square", 
		        "fa fa-eraser", 
		        "fa fa-exchange", 
		        "fa fa-exclamation", 
		        "fa fa-exclamation-circle", 
		        "fa fa-exclamation-triangle", 
		        "fa fa-external-link", 
		        "fa fa-external-link-square", 
		        "fa fa-eye", 
		        "fa fa-eye-slash", 
		        "fa fa-eyedropper", 
		        "fa fa-fax", 
		        "fa fa-feed", 
		        "fa fa-female", 
		        "fa fa-fighter-jet", 
		        "fa fa-file-archive-o", 
		        "fa fa-file-audio-o", 
		        "fa fa-file-code-o", 
		        "fa fa-file-excel-o", 
		        "fa fa-file-image-o", 
		        "fa fa-file-movie-o", 
		        "fa fa-file-pdf-o", 
		        "fa fa-file-photo-o", 
		        "fa fa-file-picture-o", 
		        "fa fa-file-powerpoint-o", 
		        "fa fa-file-sound-o", 
		        "fa fa-file-video-o", 
		        "fa fa-file-word-o", 
		        "fa fa-file-zip-o", 
		        "fa fa-film", 
		        "fa fa-filter", 
		        "fa fa-fire", 
		        "fa fa-fire-extinguisher", 
		        "fa fa-flag", 
		        "fa fa-flag-checkered", 
		        "fa fa-flag-o", 
		        "fa fa-flash", 
		        "fa fa-flask", 
		        "fa fa-folder", 
		        "fa fa-folder-o", 
		        "fa fa-folder-open", 
		        "fa fa-folder-open-o", 
		        "fa fa-frown-o", 
		        "fa fa-futbol-o", 
		        "fa fa-gamepad", 
		        "fa fa-gavel", 
		        "fa fa-gear", 
		        "fa fa-gears", 
		        "fa fa-gift", 
		        "fa fa-glass", 
		        "fa fa-globe", 
		        "fa fa-graduation-cap", 
		        "fa fa-group", 
		        "fa fa-hdd-o", 
		        "fa fa-headphones", 
		        "fa fa-heart", 
		        "fa fa-heart-o", 
		        "fa fa-heartbeat", 
		        "fa fa-history", 
		        "fa fa-home", 
		        "fa fa-hotel", 
		        "fa fa-image", 
		        "fa fa-inbox", 
		        "fa fa-info", 
		        "fa fa-info-circle", 
		        "fa fa-institution", 
		        "fa fa-key", 
		        "fa fa-keyboard-o", 
		        "fa fa-language", 
		        "fa fa-laptop", 
		        "fa fa-leaf", 
		        "fa fa-legal", 
		        "fa fa-lemon-o", 
		        "fa fa-level-down", 
		        "fa fa-level-up", 
		        "fa fa-life-bouy", 
		        "fa fa-life-buoy", 
		        "fa fa-life-ring", 
		        "fa fa-life-saver", 
		        "fa fa-lightbulb-o", 
		        "fa fa-line-chart", 
		        "fa fa-location-arrow", 
		        "fa fa-lock", 
		        "fa fa-magic", 
		        "fa fa-magnet", 
		        "fa fa-mail-forward", 
		        "fa fa-mail-reply", 
		        "fa fa-mail-reply-all", 
		        "fa fa-male", 
		        "fa fa-map-marker", 
		        "fa fa-meh-o", 
		        "fa fa-microphone", 
		        "fa fa-microphone-slash", 
		        "fa fa-minus", 
		        "fa fa-minus-circle", 
		        "fa fa-minus-square", 
		        "fa fa-minus-square-o", 
		        "fa fa-mobile", 
		        "fa fa-mobile-phone", 
		        "fa fa-money", 
		        "fa fa-moon-o", 
		        "fa fa-mortar-board", 
		        "fa fa-motorcycle", 
		        "fa fa-music", 
		        "fa fa-navicon", 
		        "fa fa-newspaper-o", 
		        "fa fa-paint-brush", 
		        "fa fa-paper-plane", 
		        "fa fa-paper-plane-o", 
		        "fa fa-paw", 
		        "fa fa-pencil", 
		        "fa fa-pencil-square", 
		        "fa fa-pencil-square-o", 
		        "fa fa-phone", 
		        "fa fa-phone-square", 
		        "fa fa-photo", 
		        "fa fa-picture-o", 
		        "fa fa-pie-chart", 
		        "fa fa-plane", 
		        "fa fa-plug", 
		        "fa fa-plus-circle", 
		        "fa fa-plus-square", 
		        "fa fa-plus-square-o", 
		        "fa fa-power-off", 
		        "fa fa-print", 
		        "fa fa-puzzle-piece", 
		        "fa fa-qrcode", 
		        "fa fa-question", 
		        "fa fa-question-circle", 
		        "fa fa-quote-left", 
		        "fa fa-quote-right", 
		        "fa fa-random", 
		        "fa fa-recycle", 
		        "fa fa-refresh", 
		        "fa fa-remove", 
		        "fa fa-reorder", 
		        "fa fa-reply", 
		        "fa fa-reply-all", 
		        "fa fa-retweet", 
		        "fa fa-road", 
		        "fa fa-rocket", 
		        "fa fa-rss", 
		        "fa fa-rss-square", 
		        "fa fa-search", 
		        "fa fa-search-minus", 
		        "fa fa-search-plus", 
		        "fa fa-send", 
		        "fa fa-send-o", 
		        "fa fa-server", 
		        "fa fa-share", 
		        "fa fa-share-alt", 
		        "fa fa-share-alt-square", 
		        "fa fa-share-square", 
		        "fa fa-share-square-o", 
		        "fa fa-shield", 
		        "fa fa-ship", 
		        "fa fa-shopping-cart", 
		        "fa fa-sign-in", 
		        "fa fa-sign-out", 
		        "fa fa-signal", 
		        "fa fa-sitemap", 
		        "fa fa-sliders", 
		        "fa fa-smile-o", 
		        "fa fa-soccer-ball-o", 
		        "fa fa-sort", 
		        "fa fa-sort-alpha-asc", 
		        "fa fa-sort-alpha-desc", 
		        "fa fa-sort-amount-asc", 
		        "fa fa-sort-amount-desc", 
		        "fa fa-sort-asc", 
		        "fa fa-sort-desc", 
		        "fa fa-sort-down", 
		        "fa fa-sort-numeric-asc", 
		        "fa fa-sort-numeric-desc", 
		        "fa fa-sort-up", 
		        "fa fa-space-shuttle", 
		        "fa fa-spinner", 
		        "fa fa-spoon", 
		        "fa fa-square", 
		        "fa fa-square-o", 
		        "fa fa-star", 
		        "fa fa-star-half", 
		        "fa fa-star-half-empty", 
		        "fa fa-star-half-full", 
		        "fa fa-star-half-o", 
		        "fa fa-star-o", 
		        "fa fa-street-view", 
		        "fa fa-suitcase", 
		        "fa fa-sun-o", 
		        "fa fa-support", 
		        "fa fa-tablet", 
		        "fa fa-tachometer", 
		        "fa fa-tag", 
		        "fa fa-tags", 
		        "fa fa-tasks", 
		        "fa fa-taxi", 
		        "fa fa-terminal", 
		        "fa fa-thumb-tack", 
		        "fa fa-thumbs-down", 
		        "fa fa-thumbs-o-down", 
		        "fa fa-thumbs-o-up", 
		        "fa fa-thumbs-up", 
		        "fa fa-ticket", 
		        "fa fa-times", 
		        "fa fa-times-circle", 
		        "fa fa-times-circle-o", 
		        "fa fa-tint", 
		        "fa fa-toggle-down", 
		        "fa fa-toggle-left", 
		        "fa fa-toggle-off", 
		        "fa fa-toggle-on", 
		        "fa fa-toggle-right", 
		        "fa fa-toggle-up", 
		        "fa fa-trash", 
		        "fa fa-trash-o", 
		        "fa fa-tree", 
		        "fa fa-trophy", 
		        "fa fa-truck", 
		        "fa fa-tty", 
		        "fa fa-umbrella", 
		        "fa fa-university", 
		        "fa fa-unlock", 
		        "fa fa-unlock-alt", 
		        "fa fa-unsorted", 
		        "fa fa-upload", 
		        "fa fa-user", 
		        "fa fa-user-plus", 
		        "fa fa-user-secret", 
		        "fa fa-user-times", 
		        "fa fa-users", 
		        "fa fa-video-camera", 
		        "fa fa-volume-down", 
		        "fa fa-volume-off", 
		        "fa fa-volume-up", 
		        "fa fa-warning", 
		        "fa fa-wheelchair", 
		        "fa fa-wifi", 
		        "fa fa-wrench", 
		        "fa fa-hand-o-down", 
		        "fa fa-hand-o-left", 
		        "fa fa-hand-o-right", 
		        "fa fa-hand-o-up", 
		        "fa fa-ambulance", 
		        "fa fa-subway", 
		        "fa fa-train", 
		        "fa fa-intersex", 
		        "fa fa-mars", 
		        "fa fa-mars-double", 
		        "fa fa-mars-stroke", 
		        "fa fa-mars-stroke-h", 
		        "fa fa-mars-stroke-v", 
		        "fa fa-mercury", 
		        "fa fa-neuter", 
		        "fa fa-transgender", 
		        "fa fa-transgender-alt", 
		        "fa fa-venus", 
		        "fa fa-venus-double", 
		        "fa fa-venus-mars", 
		        "fa fa-file", 
		        "fa fa-file-o", 
		        "fa fa-file-text", 
		        "fa fa-file-text-o", 
		        "fa fa-info-circle fa-lg fa-li", 
		        "fa fa-cc-amex", 
		        "fa fa-cc-discover", 
		        "fa fa-cc-mastercard", 
		        "fa fa-cc-paypal", 
		        "fa fa-cc-stripe", 
		        "fa fa-cc-visa", 
		        "fa fa-google-wallet", 
		        "fa fa-paypal", 
		        "fa fa-bitcoin", 
		        "fa fa-btc", 
		        "fa fa-cny", 
		        "fa fa-dollar", 
		        "fa fa-eur", 
		        "fa fa-euro", 
		        "fa fa-gbp", 
		        "fa fa-ils", 
		        "fa fa-inr", 
		        "fa fa-jpy", 
		        "fa fa-krw", 
		        "fa fa-rmb", 
		        "fa fa-rouble", 
		        "fa fa-rub", 
		        "fa fa-ruble", 
		        "fa fa-rupee", 
		        "fa fa-shekel", 
		        "fa fa-sheqel", 
		        "fa fa-try", 
		        "fa fa-turkish-lira", 
		        "fa fa-usd", 
		        "fa fa-won", 
		        "fa fa-yen", 
		        "fa fa-align-center", 
		        "fa fa-align-justify", 
		        "fa fa-align-left", 
		        "fa fa-align-right", 
		        "fa fa-bold", 
		        "fa fa-chain", 
		        "fa fa-chain-broken", 
		        "fa fa-clipboard", 
		        "fa fa-columns", 
		        "fa fa-copy", 
		        "fa fa-cut", 
		        "fa fa-dedent", 
		        "fa fa-files-o", 
		        "fa fa-floppy-o", 
		        "fa fa-font", 
		        "fa fa-header", 
		        "fa fa-indent", 
		        "fa fa-italic", 
		        "fa fa-link", 
		        "fa fa-list", 
		        "fa fa-list-alt", 
		        "fa fa-list-ol", 
		        "fa fa-list-ul", 
		        "fa fa-outdent", 
		        "fa fa-paperclip", 
		        "fa fa-paragraph", 
		        "fa fa-paste", 
		        "fa fa-repeat", 
		        "fa fa-rotate-left", 
		        "fa fa-rotate-right", 
		        "fa fa-save", 
		        "fa fa-scissors", 
		        "fa fa-strikethrough", 
		        "fa fa-subscript", 
		        "fa fa-superscript", 
		        "fa fa-table", 
		        "fa fa-text-height", 
		        "fa fa-text-width", 
		        "fa fa-th", 
		        "fa fa-th-large", 
		        "fa fa-th-list", 
		        "fa fa-underline", 
		        "fa fa-undo", 
		        "fa fa-unlink", 
		        "fa fa-angle-double-down", 
		        "fa fa-angle-double-left", 
		        "fa fa-angle-double-right", 
		        "fa fa-angle-double-up", 
		        "fa fa-angle-left", 
		        "fa fa-angle-right", 
		        "fa fa-angle-up", 
		        "fa fa-arrow-circle-down", 
		        "fa fa-arrow-circle-left", 
		        "fa fa-arrow-circle-o-down", 
		        "fa fa-arrow-circle-o-left", 
		        "fa fa-arrow-circle-o-right", 
		        "fa fa-arrow-circle-o-up", 
		        "fa fa-arrow-circle-right", 
		        "fa fa-arrow-circle-up", 
		        "fa fa-arrow-down", 
		        "fa fa-arrow-left", 
		        "fa fa-arrow-right", 
		        "fa fa-arrow-up", 
		        "fa fa-arrows-alt", 
		        "fa fa-caret-down", 
		        "fa fa-caret-left", 
		        "fa fa-caret-right", 
		        "fa fa-caret-up", 
		        "fa fa-chevron-circle-down", 
		        "fa fa-chevron-circle-left", 
		        "fa fa-chevron-circle-right", 
		        "fa fa-chevron-circle-up", 
		        "fa fa-chevron-down", 
		        "fa fa-chevron-left", 
		        "fa fa-chevron-right", 
		        "fa fa-chevron-up", 
		        "fa fa-long-arrow-down", 
		        "fa fa-long-arrow-left", 
		        "fa fa-long-arrow-right", 
		        "fa fa-long-arrow-up", 
		        "fa fa-backward", 
		        "fa fa-compress", 
		        "fa fa-eject", 
		        "fa fa-expand", 
		        "fa fa-fast-backward", 
		        "fa fa-fast-forward", 
		        "fa fa-forward", 
		        "fa fa-pause", 
		        "fa fa-play", 
		        "fa fa-play-circle", 
		        "fa fa-play-circle-o", 
		        "fa fa-step-backward", 
		        "fa fa-step-forward", 
		        "fa fa-stop", 
		        "fa fa-youtube-play", 
		        "fa fa-adn", 
		        "fa fa-android", 
		        "fa fa-angellist", 
		        "fa fa-apple", 
		        "fa fa-behance", 
		        "fa fa-behance-square", 
		        "fa fa-bitbucket", 
		        "fa fa-bitbucket-square", 
		        "fa fa-buysellads", 
		        "fa fa-codepen", 
		        "fa fa-connectdevelop", 
		        "fa fa-css3", 
		        "fa fa-dashcube", 
		        "fa fa-delicious", 
		        "fa fa-deviantart", 
		        "fa fa-digg", 
		        "fa fa-dribbble", 
		        "fa fa-dropbox", 
		        "fa fa-drupal", 
		        "fa fa-empire", 
		        "fa fa-facebook", 
		        "fa fa-facebook-f", 
		        "fa fa-facebook-official", 
		        "fa fa-facebook-square", 
		        "fa fa-flickr", 
		        "fa fa-forumbee", 
		        "fa fa-foursquare", 
		        "fa fa-ge", 
		        "fa fa-git", 
		        "fa fa-git-square", 
		        "fa fa-github", 
		        "fa fa-github-alt", 
		        "fa fa-github-square", 
		        "fa fa-gittip", 
		        "fa fa-google", 
		        "fa fa-google-plus", 
		        "fa fa-google-plus-square", 
		        "fa fa-gratipay", 
		        "fa fa-hacker-news", 
		        "fa fa-html5", 
		        "fa fa-instagram", 
		        "fa fa-ioxhost", 
		        "fa fa-joomla", 
		        "fa fa-jsfiddle", 
		        "fa fa-lastfm", 
		        "fa fa-lastfm-square", 
		        "fa fa-leanpub", 
		        "fa fa-linkedin", 
		        "fa fa-linkedin-square", 
		        "fa fa-linux", 
		        "fa fa-maxcdn", 
		        "fa fa-meanpath", 
		        "fa fa-medium", 
		        "fa fa-openid", 
		        "fa fa-pagelines", 
		        "fa fa-pied-piper", 
		        "fa fa-pied-piper-alt", 
		        "fa fa-pinterest", 
		        "fa fa-pinterest-p", 
		        "fa fa-pinterest-square", 
		        "fa fa-qq", 
		        "fa fa-ra", 
		        "fa fa-rebel", 
		        "fa fa-reddit", 
		        "fa fa-reddit-square", 
		        "fa fa-renren", 
		        "fa fa-sellsy", 
		        "fa fa-shirtsinbulk", 
		        "fa fa-simplybuilt", 
		        "fa fa-skyatlas", 
		        "fa fa-skype", 
		        "fa fa-slack", 
		        "fa fa-slideshare", 
		        "fa fa-soundcloud", 
		        "fa fa-spotify", 
		        "fa fa-stack-exchange", 
		        "fa fa-stack-overflow", 
		        "fa fa-steam", 
		        "fa fa-steam-square", 
		        "fa fa-stumbleupon", 
		        "fa fa-stumbleupon-circle", 
		        "fa fa-tencent-weibo", 
		        "fa fa-trello", 
		        "fa fa-tumblr", 
		        "fa fa-tumblr-square", 
		        "fa fa-twitch", 
		        "fa fa-twitter", 
		        "fa fa-twitter-square", 
		        "fa fa-viacoin", 
		        "fa fa-vimeo-square", 
		        "fa fa-vine", 
		        "fa fa-vk", 
		        "fa fa-wechat", 
		        "fa fa-weibo", 
		        "fa fa-weixin", 
		        "fa fa-whatsapp", 
		        "fa fa-windows", 
		        "fa fa-wordpress", 
		        "fa fa-xing", 
		        "fa fa-xing-square", 
		        "fa fa-y-combinator-square", 
		        "fa fa-yahoo", 
		        "fa fa-yc-square", 
		        "fa fa-yelp", 
		        "fa fa-youtube", 
		        "fa fa-youtube-square", 
		        "fa fa-h-square", 
		        "fa fa-hospital-o", 
		        "fa fa-medkit", 
		        "fa fa-stethoscope", 
		        "fa fa-user-md", 
		        "icon-login", 
		        "icon-speech", 
		        "icon-arrow-left", 
		        "icon-paper-clip", 
		        "icon-arrow-up"
		    ], 
		    "debug": false, 
		    "dictionaryUrl": "/dictionaries/retrieval/", 
		    "ignoreTh": [
		        "id", 
		        "dmId", 
		        "crtime", 
		        "createTime", 
		        "updateTime", 
		        "uptime", 
		        "createBy", 
		        "updateBy", 
		        "status", 
		        "state", 
		        "0"
		    ], 
		    "uploader": {
		        "filters": {
		            "mime_types": [
		                {
		                    "title": "图片选择", 
		                    "extensions": "jpg,gif,png,jpeg"
		                }
		            ], 
		            "max_file_size": "1024kb", 
		            "prevent_duplicates": true
		        }, 
		        "multipart": true, 
		        "max_retries": 0, 
		        "chunk_size": 0, 
		        "multi_selection": false, 
		        "unique_names": true, 
		        "runtimes": "html5,flash,silverlight,html4", 
		        "flash_swf_url": "/assets/global/plugins/plupload/js/Moxie.swf", 
		        "silverlight_xap_url": "/assets/global/plugins/plupload/js/Moxie.xap"
		    }, 
		    "oss": "/oss/sign", 
		    "defaultImage": "/assets/layout/img/timg.jpg"
}
	
	Initialization.prototype.init=function(){  
		 this.unit=new tool(this);
		 new menu(this).init();
		 this.card=new card(this); 
		 if(!$().validate){
			this.unit.plug('validate');
		 }
		 $.validator.setDefaults({errorElement:"span",errorClass:"help-block help-block-error",focusInvalid:false,ignore:"",invalidHandler:function(event,validator){var error=$(".alert-danger",event);var success=$(".alert-success",event);success.hide();error.show();App.scrollTo(error,-200)},errorPlacement:function(error,element){if(element.is(":checkbox")){error.insertAfter(element.closest(".md-checkbox-list, .md-checkbox-inline, .checkbox-list, .checkbox-inline"))}else{if(element.is(":radio")){error.insertAfter(element.closest(".md-radio-list, .md-radio-inline, .radio-list,.radio-inline"))}else{error.insertAfter(element)}}$(".help-block-ignore",$(element).parents(".form-group")).hide()},highlight:function(element){$(element).closest(".form-group").addClass("has-error")},unhighlight:function(element){$(element).closest(".form-group").removeClass("has-error");$(".help-block-ignore",$(element).closest(".form-group")).show()},success:function(label){label.closest(".form-group").removeClass("has-error");$(".help-block-ignore",label.closest(".form-group")).show()},submitHandler:function(form){$(".alert-success",$(form)).show();$(".alert-danger",$(form)).hide()}});
		 this.upload=new myupload(this);
		 
		 this.table=new table(this);
		 
		 //this.page=new page(this);
		 
		 new select(this).init();
		 
		 this.func=new func(this);
		
		// this.automatic=new automatic(this).init(); 
		 var content=this.unit.getDom('tab_content');
		 
		 this.makeSwitch=new makeSwitch(this);
		  
		 this.makeSwitch.init();
		 
		 this.unit.init();
		 
		 ///this.page.init();
		 
		 this.table.init();
		 
		 //this.page.initAfter();
		 
		 this.upload.init();
		 
		 new button(this).init();
		  
		 /*if(!this.unit.isEmpty(content)){
			 App.blockUI({
	             target: content,
	             boxed: true,
	             message:'加载页面中...'
	         });
		 }*/	 
		/* if(!this.unit.isEmpty(content)){
			 window.setTimeout(function() {
	             App.unblockUI(content);  
	         }, 500); 
		 } */
		
		 this.transformation=new transformation(this);
		 
		 $('.th-inner .downMenu').parent().css({padding:'0px'})
	}
	//菜单
	var menu=function(init){
		var unit=init.unit,key='menu_id';
		var handleInit=function(d){
			var data=unit.getOpt('data'),animsition=unit.getOpt('animsition')||false;
			if(!unit.isEmpty(data)){
				var menu=unit.getDom('menu');			
				if(unit.isEmpty(menu)||!menu.is('ul')||unit.isEmpty(data)){
					return;
				}
				menu.empty();
				handleBuild(data,menu,animsition);
				$('li.nav-item:first',menu).addClass('start').find('li.nav-item').addClass('start');
				open(menu);
				handleTitle(menu);
			}
		}
		
		var handleBuild=function(c,a,b){
			if(unit.isEmpty(c)||unit.isEmpty(a)){return}$.each(c,function(g,m){var n=$('<li class="nav-item"></li>').appendTo(a);var k=m.title;if(unit.isEmpty(k)){return true}var d="";var f=m.resource;if(!unit.isEmpty(f)){d=f.value}d=unit.isEmpty(d)?m.url:d;d=unit.isEmpty(d)?"javascript:;":d;var l=$('<a href="javascript:;" title="'+k+'" class="nav-link" data-id="'+m.id+'"></a>').appendTo(n);var j=m.icon;if(!unit.isEmpty(j)){$('<i class="'+j+'"></i>').appendTo(l)}$('<span class="title">'+k+"</span>").appendTo(l);var h=m.childs;if(unit.isEmpty(h)){if(!unit.isEmpty(d)&&"javascript:;"!=d){d=d.replace(/\//g," ").replace(/\s+/g,"/")}l.attr("href",d);l.on("click",function(){if($(this).parent(".nav-item").hasClass("active")){return false}});if(b==true&&d!="javascript:;"){l.addClass("animsition_link")}if(!unit.isEmpty(d)&&d!="javascript:;"){l.on("click",function(){handleClick($(this),m.id);return true})}return true}l.addClass("nav-toggle");$('<span class="arrow"></span>').appendTo(l);var e=$('<ul class="sub-menu"></ul>').appendTo(n);handleBuild(h,e,b)})
		}
		
		var handleClick=function(e,id){
			unit.setData(key,id);
		}
		
		var open=function(menu){
			var caption = unit.getDom('caption'),b;
			var e = window.location.pathname;
		    e = e.replace(/\//g, " ").replace(/\s+/g, "/");
		    b = $('a[href="' + e + '"]', menu)
		    if(unit.isEmpty(b)){
		    	var g = unit.getData(key);
				if (!unit.isEmpty(g)) {
				    b = $('a[data-id="' + g + '"]', menu)
				}
		    }
			if (!unit.isEmpty(b)) {
			    openMenu(b);
			    if (unit.isEmpty(caption)) {
			        var f = b.text();
			        var d = $("i", b).attr("class");
			        var c = unit.isEmpty(d) ? "" : '<i class="' + d + '"></i>';
			        c += '<span class="caption-subject font-green bold uppercase">' + f + "</span>";
			        if (!unit.isEmpty(caption)) {
			            caption.html(c)
			        }
			    }
			}
		}
		var openMenu=function(e){
			if($(e).length>0){$(e).parent().addClass("open").addClass("active").find("span.arrow").addClass("open");var ul=$(e).parents("ul.sub-menu");if(ul.length>0){openMenu($("a:first",ul.parent()))}}
		}	
		var handleTitle=function(e){
			if($('body').hasClass('no-title')){
				return;
			}
			var pt=$('.page-title');
			if(pt.length<1){
				pt=$('<h3 class="page-title"></h3>').prependTo($('.page-content'));
			}
			if(pt.length>1){
				$('.page-title:gt(0)').remove();
			}
			var actives=$('li.nav-item.active',$(e)),len=actives.length;
			actives.each(function(i){
				var title=$(this).find('a:first').attr('title');
				if((i+1)==len){
					$('<small>'+title+'</small>').appendTo(pt);
				}else{
					pt.text(title);
				}
			});
		}
		return {
			init:function(){
				handleInit();
			},
			refresh:function(data){
				handleInit(data);
			}
		}
	}
	
	//table
	var table=function(init){
		var unit=init.unit,t=unit.getDom('table');
		
		var handleInit=function(bt){
			if(!unit.isEmpty(bt)){
				bt.each(function(){
					$(this).bootstrapTable();
				})  
			}
		}
		
		var getTableData=function(id){
			var data={};
			if(!unit.isEmpty(t)&&!unit.isEmpty(id)){
				data=t.bootstrapTable('getRowByUniqueId',id);
				if(unit.isEmpty(data)){
					data=$('tr[data-uniqueid="'+id+'"]',t).data('data');
				}
			}
			return data;
		}
		
		var handleTableRefresh=function(form){
			if(!unit.isEmpty(t)){
				var params = {};
				if(!unit.isEmpty(form)&&$(form).is('form')){
					params = t.bootstrapTable('getOptions');
					params.queryParams=function(params){
						var order=[];var columns=[];if(!unit.isEmpty(params.sort)){columns.push({data:params.sort});order.push({dir:params.order})}var temp={length:params.limit,start:params.offset,columns:columns,order:order};return unit.encapsulationSearch(form,temp)
					}
				}
				t.bootstrapTable('refresh',params);
			}
		}	
		return {	
			init:function(){
				if(!unit.isEmpty(t)){
					if(!$().bootstrapTable){
						unit.plug('bootstrapTable');
					}
					$.extend($.fn.bootstrapTable.columnDefaults,{
						'class':'table-title td-nobr'
					});
					$.extend($.fn.bootstrapTable.defaults,{
						queryParams:function(params){var order=[];var columns=[];if(!unit.isEmpty(params.sort)){columns.push({data:params.sort});order.push({dir:params.order})}var temp={length:params.limit,start:params.offset,columns:columns,order:order};return temp},
						responseHandler:function(res){if(unit.isJson(res)){var data={total:res.recordsTotal,rows:res.data};return data;}return res;},
						pageNumber:1,pageSize:10,pageList:[10,25,50,100],undefinedText:" ",cache:false,striped:true,icons:{paginationSwitchDown: 'glyphicon-collapse-down icon-chevron-down', paginationSwitchUp: 'glyphicon-collapse-up icon-chevron-up',refresh: 'glyphicon-refresh icon-refresh',toggle: 'glyphicon-list-alt icon-list-alt',columns: 'glyphicon-th icon-th',detailOpen: 'glyphicon-plus-sign icon-plus-sign',detailClose: 'glyphicon-minus-sign icon-minus-sign'}
					});
					handleInit(t);
				}	
			},
			search:function(form){
				handleTableRefresh(form);	
			},
			getData:function(id){				
				return getTableData(id);
			},
			refresh:function(){
				handleTableRefresh();
			},
			getTable:function(){
				return t;
			}	
		}
	}
	
	var makeSwitch=function(init){
		var unit=init.unit,dom=unit.getDom('make_switch');
		return {
			init:function(){
				if(!unit.isEmpty(dom)&&dom.length>0){
					unit.plug('bootstrapSwitch');
					dom.bootstrapSwitch();
				}
			}
		}
	}
	
	//上传插件
	var myupload=function(init){
		var unit=init.unit,key='myupload.sign',doms=unit.getDom('uploader'),content=unit.getDom("tab_content"),pane=unit.getDom("tab_pane");;
		
		var random_string=function(b){
			b=b||32;var d="ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";var a=d.length;var e="";for(var c=0;c<b;c++){e+=d.charAt(Math.floor(Math.random()*a))}return e
		}
		//获取oss注册
		var handleSign=function($upload){
			var result={};
			if(!unit.isEmpty($upload)&&$upload.length>0){
				$upload.each(function(){
					var $this=$(this),data=$this.data(key);
					if(!unit.isEmpty(data)){
						result=data;
						return false;
					}
				});
				if(unit.isEmpty(result)||unit.isEmpty(result.host)){
					var oss=unit.setUpUrl(unit.getOpt('oss'));
					$.ajax({
						async:false,
						dataType:'JSON',
						type:'GET',
						url:oss,
					}).always(function(data,state){
						if(state == 'success'){
							$upload.first().data(key,result=data);
						}
					});
				}
			}
			return result;
		}
		
		var getUploader=function(o,sign){	
			if(!unit.isEmpty(sign)&&!unit.isEmpty(sign.host)){
				var options=$.extend({},unit.getOpt('uploader'), o.data());
				options['url']=sign.host;
				if(o.attr('multiple')=='multiple'){
					//多选
				}else{
					//单选
					var button=buildSingleHtml(o);
					if(button.length>0){
						options['browse_button']=button[0];
					}	
				}
				return new plupload.Uploader(options);			
			}
			return null;
		}
		
		var getPath=function(files){
			var res='';
			if(!unit.isEmpty(files)){
				$.each(files,function(i,file){
					var path=file.path;
					if(!unit.isEmpty(path)){
						res+=path+','
					}
				});
			}
			if(!unit.isEmpty(res)){
				res=res.substring(0,res.length-1);
			}
			return res;
		}
		
		var handleBind=function(up,o,sign){
			var fileinput=$('.fileinput',o.parent());	
			var multiple=o.attr('multiple')=='multiple';
			up.bind('FilesAdded',function(uploader,files){
				if(!multiple){
					$.each(uploader.files,function(i,file1){	
						if(!unit.isEmpty(file1)){
							var f=false;
							$.each(files,function(k,file2){
								if(!unit.isEmpty(file2)&&file1.id==file2.id){
									f=true;
									return false;
								}
							});
							if(!f){
								uploader.removeFile(file1);
							}
						}
						
					});
				}
				$.each(files,function(i,file){
					var fr = file.type == 'image/gif'?new mOxie.FileReader():new mOxie.Image(),size=(file.size/1024)/1024,unit1=size<0.1?'KB':'MB';
					size=size<0.1?file.size/1024:size;
					file.size=size;file.unit=unit1;
					fr.onload=function(){
						var src=file.type == 'image/gif'?fr.result:fr.type=='image/jpeg'?fr.getAsDataURL('image/jpeg',80):fr.getAsDataURL();
						file.src=src;
						var thumbnail=$('.thumbnail',fileinput).empty();
						$('<a rel="friend" href="javascript:;" title="'+file.name+'" id="'+file.id+'"><img src="'+src+'" alt="'+file.name+'" style="height:100%;width:100%;"/></a>').appendTo(thumbnail);
						$('.btn.upload',fileinput).html('<i class="fa fa-file-photo-o"></i>&nbsp;更改');
						$('.btn.remove',fileinput).removeClass('hide');
						o.trigger($.Event('uploader.add'),[uploader,file]);
						fr.destroy();
			            fr = null;
					}
					if(file.type == 'image/gif'){fr.readAsDataURL(file.getSource());}else{fr.load(file.getSource());}	
				});
			});
			
			up.bind('BeforeUpload',function(uploader,file){
				var rstr=random_string(10),arr=file.name.split('.'),fix=arr.length>1?arr[arr.length-1]:'',key=sign.dir+'/'+rstr+'.'+fix;
				file.replaceUrl=sign.replaceUrl;file.path=sign.replaceUrl+'/'+key;
				uploader.setOption({'multipart_params':{
				  'key':key,
				  'policy':sign.policy,
				  'OSSAccessKeyId':sign.accessid,
				  'success_action_status':200,
				  'signature':sign.signature
				}});
			});
			
			up.bind('FilesRemoved',function(uploader,files){
				var thumbnail=$('.thumbnail',fileinput);
				$.each(files,function(i,file){
					$('#'+file.id,thumbnail).remove();
				});
				o.val(getPath(files));
			});
			
			up.bind('Error',function(uploader,errObject){
				if(!unit.isEmpty(o)&&$(o).length>0){
					o.trigger($.Event('uploader.error'),[uploader,errObject]);
				}	
			});
			
			up.bind('UploadComplete',function(uploader,files){
				if(!unit.isEmpty(o)&&$(o).length>0){
					o.trigger($.Event('uploader.complete'),[uploader,files]);
				}	
			});
		}
		
		var buildSingleHtml=function(o){
			var html=$('<div class="fileinput fileinput-new" data-provides="fileinput"></div>');
			var thumbnail=$('<div class="fileinput-preview thumbnail" style="width: 200px; height: 150px;"></div>').appendTo(html);
			var value=o.val(),ub='上传',remove=false;
			if(!unit.isEmpty(value)){
				$('<a rel="friend" href="javascript:;" title="'+value+'" ><img src="'+value+'" alt="'+value+'" style="height:100%;width:100%;"/></a>').appendTo(thumbnail);
				ub='更改',remove=true;
			}
			var buttons=$('<div class="clearfix"></div>').appendTo(html);
			var uploadBtn=$('<a class="btn green-haze btn-outline sbold uppercase upload" title="'+ub+'" href="javascript:;" style="margin-right:5px;"><i class="fa fa-file-photo-o"></i>&nbsp;'+ub+'</a>').appendTo(buttons);
			var removeBtn=$('<a href="javascript:;" class="btn red-mint btn-outline sbold uppercase remove hide" title="删除图片"><i class="glyphicon glyphicon-trash"></i>&nbsp;删除 </a>').appendTo(buttons);
			if(remove){removeBtn.removeClass('hide');}
			removeBtn.unbind().bind('click',function(){
				var up=o.data('up');
				var a=$('a',thumbnail);
				var oid=a.attr('id');				
				if(!unit.isEmpty(up)&&!unit.isEmpty(oid)){
					up.removeFile(oid);
				}else{
					a.remove();
				}
				$(this).addClass('hide');
				uploadBtn.html('<i class="fa fa-file-photo-o"></i>&nbsp;上传');
				o.val('');
			});
			html.insertAfter(o);
			return uploadBtn;
		}
			
		var buildMultipleHtml=function(o){
			
		}
		var getField=function(e){
			var field=null;
			if(!unit.isEmpty(e)){
				field=e.data('field');
			}
			if($(field).length<1){
				if(!unit.isEmpty(pane)&&$(pane).length>0){
					field=pane.filter(':not(.active):first');
				}
				if($(field).length<1){
					field=$('.modal form[role="form"]').first();
				}
			}
			return field;
		}
		var handleUpload=function(up,e,o){
			console.log(up);
			if($(e).length>0){
				//找到form表单
				var form=$(e).parents('form');
				form=form.length>0?form:$('form',$(e).parents('.modal'));
				
				if(form.length>0){
					// 提交
					$(e).off().on('click',function(){
						if(!unit.isEmpty(up.files)&&up.files.length>0){
							up.start();
						}else{
							unit.submit(form,function(opt,data,state){	
								if(form.parents('.modal').length>0){
									form.parents('.modal').modal('hide');
								}else{
									unit.open(getField(e));
								}
								unit.alert(opt.title,opt.message,opt.type);
								init.table.refresh();
							});
						}	
					});
					//上传成功
					$(o).off().on('uploader.complete',function(event,uploader,files){
						if($(this).is('input')){
							$(this).val(getPath(files));
						}
						//提交表单
						unit.submit(form,function(opt,data,state){	
							if(form.parents('.modal').length>0){
								form.parents('.modal').modal('hide');
							}else{
								unit.open(getField(e));
							}
							unit.alert(opt.title,opt.message,opt.type);
							init.table.refresh();
						});
					}).on('uploader.error',function(event,uploader,errObject){
						unit.alert('错误提示','上传图片失败','error');
					});
				}				
			}
		}
		
		return {
			init:function(){
				if(!unit.isEmpty(doms)){
					var sign=handleSign(doms);
					unit.plug('uploader');
					doms.each(function(){
						var $this=$(this);
						var uploader=getUploader($this,sign);
						$this.data('up',uploader);
						if(!unit.isEmpty(uploader)){
							uploader.init();
							handleBind(uploader,$this,sign);
						}
						var tjBtn=$($this.data('uploader'));
						handleUpload(uploader,tjBtn,$this);
					});			
				}
			},
			remove:function(e){
				if(!unit.isEmpty(e)&&$(e).length>0){
					
				}
			},
			setImage:function(e,path){
				if(!unit.isEmpty(e)&&$(e).length>0){
					var fileinput=$('.fileinput',$(e).parents('.form-group'));
					var thumbnail=$('.thumbnail',fileinput);
					path=unit.isEmpty(path)?$(e).val():path;
					$('.btn.remove',fileinput).addClass('hide');
					$('.btn.upload',fileinput).html('<i class="fa fa-file-photo-o"></i>&nbsp;上传');
					thumbnail.empty();
					if(!unit.isEmpty(path)){
						$('<a rel="friend" href="javascript:;" title="'+path+'" ><img src="'+path+'" alt="'+path+'" style="height:100%;width:100%;" /></a>').appendTo(thumbnail);
						$('.btn.remove',fileinput).removeClass('hide');
						$('.btn.upload',fileinput).html('<i class="fa fa-file-photo-o"></i>&nbsp;更改');
					}
					
				}
			}
		}	
	}
	
	var select=function(init){
		var unit=init.unit,doms=unit.getDom('select2');	
		var handleSelect2=function(){
			if(!unit.isEmpty(doms)&&$(doms).is('select')){	
				unit.plug('select2');
				$(doms).each(function(){
					var $this=$(this),type=$this.data('type'),data=handleData($this),params={allowClear:$this.hasClass('select2-allow-clear'),placeholder:$this.data('placeholder')||'请选择'};
					if(type=='menu_power'||type=='resource_power'){
						unit.plug('multiSelect');
						$.each(data,function(i,v){
							var childs=v.childs;
							if(!unit.isEmpty(childs)){
								var group=$('<optgroup label="'+v.text+'" data-id="'+v.id+'"></optgroup>').appendTo($this);
								if(v.display){
									group.attr('disabled','disabled');
								}
								$.each(childs,function(k,j){
									var option=$('<option value="'+j.url+'">'+j.text+'</option>').appendTo(group);
									if(j.display){
										option.attr('disabled','disabled');
									}
									if(j.xz){
										option.attr('selected','selected ');
									}
								})
							}else{
								var option=$('<option value="'+v.url+'">'+v.text+'</option>').appendTo($this);
								if(v.display){
									option.attr('disabled','disabled');
								}
								if(v.xz){
									option.attr('selected','selected').attr('readonly','readonly');
								}
							}
						})
						$this.multiSelect({
				            selectableOptgroup: true
				        });
						return true;
					}
					if(!unit.isEmpty(data)){
						params.data=data;
					}
					if(type=='icon'){
						params.templateResult=params.templateSelection=function(state){
							if(!state.id){return state.text}var $state=$('<span><i class="'+state.text+'"></i> - '+state.text+"</span>");return $state
						}					                                
					}
					$this.select2(params);
				});
			}
		}
		
		var handleData=function(e){
			var type=e.data('type'),url=e.data('url'),data=e.data('data');
			if(!unit.isEmpty(type)){
				switch(type){
				case 'icon':
					var icons=unit.getOpt('icon');
					if(!unit.isEmpty(icons)){
						var r=[];
						$.each(icons,function(i,v){
							r.push({id:v,text:v});
						});
						data=r;
					}
					break;
				case 'menu_power':
					var menuData=unit.getOpt('data');
					if(!unit.isEmpty(menuData)){
						var r=[];
						$.each(menuData,function(i,v){
							var display=(v.state!=0 || (unit.isEmpty(v.childs) && unit.isEmpty(v.url)));
							var xz=v.url=='/index.htm';
							var json={id:v.id,text:v.title,url:v.url,display:display,xz:xz};
							if(!unit.isEmpty(v.childs)){
								var childs=[];
								$.each(v.childs,function(k,j){
									var display=j.state!=0 || unit.isEmpty(j.url);
									var xz=j.url=='/index.htm';
									childs.push({id:j.id,text:j.title,url:j.url,display:display,xz:xz});
								})
								json.childs=childs;
							}
							r.push(json);
						})
						data=r;
					}
					break;
				case 'resource_power':
					var resourceList=unit.getOpt('resourceList');
					if(!unit.isEmpty(resourceList)){
						var r=[];
						$.each(resourceList,function(i,v){
							var json={id:v.value,text:v.value,url:v.value};
							r.push(json);
						});
						data=r;
					}
					break;
				case 'url_get_htm':
					var resourceList=unit.getOpt('resourceList');
					if(!unit.isEmpty(resourceList)){
						var r=[];
						$.each(resourceList,function(i,v){
							if(v.requestType=='GET'&&v.type==0&&v.state==0){
								r.push({id:v.value,text:v.value});
							}
						})
						data=r;
					}
					break;
				default:
					url=unit.setUpUrl(unit.getOpt('dictionaryUrl'))+type;
					break;
				}				
			}			
			if(unit.isEmpty(data)&&!unit.isEmpty(url)){
				$.ajax({
					async:false,
					type:'GET',
					dataType:'JSON',
					url:url
				}).always(function(d,state){
					if(state=='success'&&!unit.isEmpty(d)&&unit.isArray(d)){
						var r=[];
						$.each(d,function(i,v){
							r.push({id:v.value,text:v.label});
						})
						data=r;
					}
				});
			}
			return data;
		}
		
		return {
			init:function(){
				handleSelect2();
			}			
		}
	}
	
	var button=function(init){
		var unit=init.unit,addBtn=unit.getDom('addBtn'),saveBtn=unit.getDom('saveBtn'),cancelBtn=unit.getDom('cancelBtn'),searchBtn=unit.getDom('searchBtn'),toggleBtn=unit.getDom('toggleBtn');;
		var content=unit.getDom("tab_content"),pane=unit.getDom("tab_pane");
		
		var getField=function(e){
			var field=null;
			if(!unit.isEmpty(e)){
				field=e.data('field');
			}
			if($(field).length<1){
				if(!unit.isEmpty(pane)&&$(pane).length>0){
					field=pane.filter(':not(.active):first');
				}
				if($(field).length<1){
					field=$('.modal form[role="form"]').first();
				}
			}
			return field;
		}
		
		var handleBtnsParams=function(e){
			var params=$.extend({
				field:getField(),
				before:function(e){
					//打开之前
					
				},
				after:function(e){
					//打开之后
				
				},
				data:{}
			},e.data());
			return params;
		}
		//添加
		var add=function(){
			if(!unit.isEmpty(addBtn)){
				addBtn.each(function(){
					var params=handleBtnsParams($(this)),$this=$(this);
					$this.bind('click',function(){
						var field=getField($this);  
						if(unit.isEmpty(field)){
							return true;
						}
						if(unit.isFunction(params.before)){
							params.before($(this));
						}
						unit.open(field,params.data);
						if(unit.isFunction(params.after)){
							params.after($(this));
						}
					});
				});					
			}
		}
		//取消按钮
		var cancel=function(){
			if(!unit.isEmpty(cancelBtn)){
				cancelBtn.each(function(){
					var params=handleBtnsParams($(this)),$this=$(this);
					params.after=function(e){
						//还原form
					}
					$(this).bind('click',function(){
						var field=getField($this);
						if(unit.isEmpty(field)){
							return true;
						}
						if(unit.isFunction(params.before)){
							params.before();
						}
						unit.open($(field));
						if(unit.isFunction(params.after)){
							params.after();
						}
					});
				});	
			}
		}
		//搜索
		var search=function(){
			if(!unit.isEmpty(searchBtn)){
				searchBtn.each(function(){
					var $this=$(this),params=handleBtnsParams($(this));
					$(this).bind('click',function(){
						var form=$this.parents('form');
						if(unit.isFunction(params.before)){
							params.before();
						}
						init.table.search(form);
						if(unit.isFunction(params.after)){
							params.after();
						}
					});
				});	
			}
		}
		
		var save=function(){
			var uploader=unit.getDom('uploader');
			if(!unit.isEmpty(saveBtn)&&unit.isEmpty(uploader)){
				saveBtn.each(function(){
					var $this=$(this),params=handleBtnsParams($(this));
					$(this).bind('click',function(){
						var form=$this.parents('form');
						if(form.length>0){
							if(unit.isFunction(params.before)){
								params.before();
							}
							var validate=$(form).validate();
							if(!unit.isEmpty(validate)){
								if(!validate.form()){
									return true;
								}
							}
							var field=getField($this);
							unit.submit(form,function(opt,data,state){
								swal(opt.title,opt.message,opt.type);
								if(opt.type=='success'){
									unit.open(field);
									init.table.refresh();
								}
							});
							if(unit.isFunction(params.after)){
								params.after();
							}
						}
					});
				});	
			}
		}
		
		return {
			init:function(){
				add();
				cancel();
				search();
				save();
			}
		}
	}
	// 自动匹配
	
	
	// Websocket
	Initialization.prototype.websocket=function(){
		// TODO Websocket通话
		return {
			init:function(){
				
			}
		}
	}
	
	// 错误拦截
	Initialization.prototype.onError=function(){
		// TODO 错误监听 上报至后台
		return {
			init:function(){
				
			}
		}
	}
	//自动生成表单
	var page=function(init){
		var unit=init.unit,addField;
		var ignore=['id','dmId','status','state','crtime','createTime','uptime'];
		var handlePageInit=function(){
			var content=unit.getDom("tab_content"),pane=unit.getDom("tab_pane");
			var tables=unit.getDom('table');
			if(!unit.isEmpty(tables)&&$(tables).length==1){
				if(unit.isEmpty(content) || content.length<1){	
					var body=$(tables).parents('.portlet-body');
					var content=$('<div class="tab-content"><div class="tab-pane fade in active"></div></div>');
					$('table',body).wrapAll(content);
					addField=$('<div class="tab-pane fade"><form action="" ></form></div>').appendTo($('.tab-content',body));
				}
			}
		}
		
		var handlePage=function(){
			if(unit.isEmpty(addField)){
				return ;
			}
			var tables=unit.getDom('table');
			var ths=$('thead tr th',tables);
			if($(ths).length>0){
				$(ths).each(function(){
					var $this=$(this);
					var data=$this.data();
					var checkbox=data.checkbox||false;
					var radio=data.radio||false;
					if(checkbox||radio){
						return true;
					}
					var field=data.field,title=data.title;
					var formatter=data.formatter;
					if(!unit.isEmpty(formatter)&&formatter.indexOf('.toBtn') != -1){
						return true;
					}
					if(unit.isEmpty(title)||$.inArray(field,ignore)!=-1){
						return true;
					}
					var json={title:title,field:field};
					var select=$('#'+field).first();
					if(select.length>0&&select.is('select')){
						json.select=true;
						json.option=$('option',select);
					}
					
				})
			}
		}
		
		var buildForm=function(json){
			if(unit.isEmpty(json)){
				return ;
			}
			
			
		}
		
		return {
			init:function(){
				handlePageInit();
			},			
			initAfter:function(){
				handlePage();
			}
		}
		
	}
	//功能方法 实现页面交互
	var func=function(init){
		var unit=init.unit,table=init.table,card=init.card;
		var content=unit.getDom("tab_content"),pane=unit.getDom("tab_pane");
		var getField=function(e){
			var field=null;
			if(!unit.isEmpty(e)){
				field=e.data('field');
			}
			if($(field).length<1){
				if(!unit.isEmpty(pane)&&$(pane).length>0){
					field=pane.filter(':not(.active):first');
				}
				if($(field).length<1){
					field=$('.modal form[role="form"]').first();
				}
			}
			return field;
		}
		 
		return {
			//修改
			edit:function(e,id){
				if(unit.isEmpty(e)||unit.isEmpty(id)){
					return true;
				}
				var data=table.getData(id);
				if(unit.isEmpty(data)){
					return true;
				}
				//数据处理 通过tigger交给页面
				unit.open(getField($(e)),data);
			},
			//查看详情
			show:function(e,id){
				console.log(id);
			},
			//删除
			remove:function(e,id,urlprefix){
				
			},
			//修改状态
			updateState:function(e,id,urlprefix){
				if(unit.isEmpty(e)||unit.isEmpty(id)){
					return true;
				}
				var data=table.getData(id);
				var state=!unit.isEmpty(data.status)?data.status:unit.isEmpty(data.state)?1:data.state;
				var txt=state==1?'启用':'禁用';
				swal({
					title: "Are you sure?",
					text: "确定要"+txt+"这条规则吗！",
					type: "warning", 
					showCancelButton: true, 
			        closeOnConfirm: false, 
			        closeOnCancel:false,
			        cancelButtonText:'我再考虑一下',
			        confirmButtonText: "是的，我要"+txt, 
			        confirmButtonColor: "#ec6c62",
			        showLoaderOnConfirm:true, 
				},function(isConfirm){
					if(!isConfirm){
						swal.close();
						return ;
					}
					var url=urlprefix+'/updateState';
					var data=unit.setToken({id:id});
					unit.submit({url:url,data:data},function(opt,data,state){
						swal(opt.title,opt.message,opt.type);
						if(opt.type=='success'){
							table.refresh();
						}
					})
				});
			},
			//查看详情
			openDetailView:function(){
				
			},
			//添加数据
			add:function(){
				
			},
			//删除数据
			remove:function(e,id,urlprefix){
				
			},
			//打开
			open:function(){
				
			},
			//名片
			businessCard:function(e,id){
				var wp=card.getwp(),data;
				try{data=table.getData(id);}catch(e){}
				if(unit.isEmpty(wp) || wp.length<1 || unit.isEmpty(data)){
					return ;
				}
				wp.css({'background-color':'#E7E708','width':'410px','height':'180px',margin: 0});
				var headimg=data.headimg,account=data.account,nickname=data.nickname,vistCode=data.vistCode,sex=data.sex,mphonenum=data.mphonenum,authen=data.authen,name=data.name,signat=data.signat,status=data.status,steps=data.steps;
				sex=sex==1?'<i title="男" class="fa fa-male"></i> 男':sex==0?'<i title="女" class="fa fa-female"></i> 女':'<i title="保密" class="fa fa-question-circle"></i> 保密';
				var box=$('.box',wp);
				if(box.length<1){
					var arrows=unit.setUpUrl('/assets/global/img/ico-arrowsTop.png');
					$('<span class="arrows" style="position: absolute;bottom: 100%;left: 10px;display: block;width: 20px;height: 20px;background: url('+arrows+') no-repeat bottom center / 15px auto;"></span>').appendTo(wp);
					box=$('<div class="box" style="padding: 10px 0;"><div class="contact-box"><a href="javascript:;" ><div class="col-sm-4" style="width:120px;float:left;"><div class="text-center"></div></div><div class="col-sm-4 user" style="float:left;"></div><div class="col-sm-4 state" style="float:left;"></div><div class="clearfix"></div></a></div>').appendTo(wp);
				}
				headimg=!unit.isEmpty(headimg)?headimg:unit.setUpUrl('/assets/layout/img/avatar.png');
				name=unit.isEmpty(name)?nickname:name;
				$('.text-center',box).html('<img alt="'+nickname+'" src="'+headimg+'" class="img-circle m-t-xs " style="width:100%;height:auto;display: block;"/><div class="m-t-xs font-bold" style="margin-top:10px;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;" title="'+nickname+'">'+nickname+'</div></div>');
				var html='<dl><dt>帐号:</dt><dd title="'+account+'" style="text-overflow: ellipsis;white-space: nowrap;overflow: hidden;"> '+account+'</dd>';
				html+='<dt>名称:</dt><dd title="'+name+'" style="text-overflow: ellipsis;white-space: nowrap;overflow: hidden;"> '+name+'</dd>';
				html+='<dt>手机:</dt><dd title="'+mphonenum+'" style="text-overflow: ellipsis;white-space: nowrap;overflow: hidden;"> '+mphonenum+'</dd>';
				html+='<dt>性别:</dt><dd style="text-overflow: ellipsis;white-space: nowrap;overflow: hidden;"> '+sex+'</dd></dl>';
				$('.user',box).html(html);
				authen=authen==1?'<span class="badge badge-success badge-roundless">已认证</span>':'<span class="badge badge-danger badge-roundless">未认证</span>';
				steps=steps==1?'<span class="badge badge-info badge-roundless">注册</span>':steps==2?'<span class="badge badge-success badge-roundless">完善</span>':steps==3?'<span class="badge badge-warning badge-roundless">等待审核</span>':'<span class="badge badge-danger badge-roundless">未开</span>';
				status=status==0?'<span class="badge badge-success badge-roundless">正常</span>':status==1?'<span class="badge badge-warning badge-roundless">屏蔽</span>':'<span class="badge badge-danger badge-roundless">注销</span>';
				var stateHtml='<dl><dt>认证状态:</dt><dd> '+authen+'</dd><dt>步奏:</dt><dd> '+steps+'</dd><dt>状态:</dt><dd> '+status+'</dd></dl>';
				$('.state',box).html(stateHtml);
				card.open(e,function(){
					
				});
				var flag=false;
				var interval=$(wp).data('interval');
				if(!unit.isEmpty(interval)){
					window.clearInterval(interval); 
					$(wp).removeData('interval');
				}
				
				$(e).off().on('mouseout',function(){
					var interval=$(wp).data('interval');
					if(!unit.isEmpty(interval)){
						return true;
					}
					$(wp).data('interval',interval=window.setTimeout(function(){
						wp.fadeOut();
						$(wp).removeData('interval');
					},1000))
				});
				
				wp.unbind('mouseenter').mouseenter(function(){
					var interval=$(wp).data('interval');
					if(!unit.isEmpty(interval)){
						window.clearInterval(interval); 
						$(wp).removeData('interval');
					}
				})
				wp.unbind('mouseleave').mouseleave(function(){
					wp.fadeOut();
				})
			}
		}
	}
	
	// 字段转换
	var transformation=function(e){
		var unit=e.unit;
		//按钮
		var handleBtn=function(id,rows,index,e){
			var button=[],btns='',urlPrefix='';
			if(unit.isEmpty(e)){
				button=['edit'];
			}else{
				var b=e.buttons;
				if(unit.isString(b)){
					button=b.split(',');
				}else if(unit.isArray(b)){
					button=b;
				}
				urlPrefix=e.urlprefix;	
			}
			if(!unit.isEmpty(button)){
				$.each(button,function(i,v){
					if(unit.isEmpty(v)){
						return true;
					}
					if(unit.isString(v)){
						if(v=='edit'){
							btns+='<a href="javascript:;" title="编辑" class="btn btn-xs purple-plum" onclick="$hmsh.func.edit(this,'+id+');"><i class="fa fa-edit"></i>&nbsp;编辑</a>';
						}else if(v=='updateState'&&!unit.isEmpty(urlPrefix)){
							var state=(!unit.isEmpty(rows)&&unit.isEmpty(rows.state))?(!unit.isEmpty(rows)&&unit.isEmpty(rows.status))?1:rows.status:rows.state;
							var t='禁用',i='fa fa-expeditedssl',c='btn btn-xs red-sunglo';
							if(state!=0){
								t='启用',i='fa fa-get-pocket',c='btn btn-xs green';
								btns+='<a href="javascript:;" title="'+t+'" class="'+c+'" onclick="$hmsh.func.updateState(this,'+id+',\''+urlPrefix+'\');"><i class="'+i+'"></i>&nbsp;'+t+'</a>';
							}	
						}else if(v=='remove' && !unit.isEmpty(urlPrefix)){
							btns+='<a href="javascript:;" title="删除" class="btn btn-xs purple" onclick="$hmsh.func.remove(this,'+id+',\''+urlPrefix+'\');"><i class="fa fa-remove"></i>&nbsp;删除</a>';
						}else if(v=='show'){
							btns+='<a href="javascript:;" title="查看" class="btn btn-xs yellow" onclick="$hmsh.func.show(this,'+id+');"><i class="fa fa-search"></i>&nbsp;查看</a>';
						}else if(v!='remove'&&v!='updateState'){
							try{
								var  func=eval(v);
								if(unit.isFunction(func)){
									var r=func.call(id,rows,index,e);
									btns+=unit.isEmpty(r)?'':r;
								}
							}catch(e){
								console.error(e);
							}
						}	
					}
				})
			}
			return btns;
		}
		var handleImage=function(data,rows,index){
			var html='';
			var result=[];
			if(unit.isString(data)){
				var arr=data.split(',');
				$.each(arr,function(i,v){
					if(unit.isEmpty(v)){
						return true;
					}
					if(unit.isString(v)){
						result.push({path:v,text:v});
					}else if(unit.isJson(v)){
						result.push(v);
					}
				});
			}else if(!unit.isEmpty(data)&&unit.isArray(data)){
				$.each(data,function(i,v){
					if(unit.isEmpty(v)){
						return true;
					}
					if(unit.isString(v)){
						result.push({path:v,text:v});
					}else if(unit.isJson(v)){
						result.push(v);
					}
				});
			}
			if(!unit.isEmpty(result)){
				$.each(result,function(i,v){
					var path=v.path;
					var text=unit.isEmpty(v.text)?unit.isEmpty(v.title)?v.name:v.title:v.text;
					if(unit.isEmpty(path)){
						return true;
					}
					html+='<a rel="group" href="javascript:;"  onclick="$unit.viewPhoto(this);" title="'+text+'"><img alt="'+text+'" src="'+path+'" style="width:70px;height:30px;vertical-align:middle;" onclick="" onerror="$unit.nofind(this)"/></a>';
				});
			}
			return html;
		}
		//前缀 或者 后缀转换
		var handlePrefixOrSuffix=function(row,suffix,prefix){
			var res=row;
			if(unit.isEmpty(res)){
				return '';
			}
			if(!unit.isEmpty(suffix)){
				res=res+' '+suffix;
			}
			if(!unit.isEmpty(prefix)){
				res=prefix+' '+ res;
			}	
			return res;
		}
		
		var handleBusinessCard=function(data,rows,index){	
			var id=unit.isEmpty(rows.id)?rows.dmId:rows.id;
			return '<a onMouseOver="$hmsh.func.businessCard(this,\''+id+'\');" title="'+data+'">'+data+'</a>';
		}
		
		return {
			toDate:function(data,rows,index){
				return unit.toDate(data,'yyyy-MM-dd');
			},
			toTime:function(data,rows,index){
				return unit.toDate(data);
			},
			toSex:function(data,rows,index){
				var sex=!unit.isString(data)&&unit.isJson(data)?data.sex:data;
				return  sex==0?'<i class="fa fa-female"></i> 女':sex==1?'<i class="fa fa-male"></i> 男':'<i class="fa fa-question-circle"></i> 保密';
			},
			toImage:function(data,rows,index){
				return handleImage(data,rows,index);
			},
			// 名片
			toBusinessCard:function(data,rows,index){
				return handleBusinessCard(data,rows,index);		
			},
			toBtn:function(data,rows,index){
				
				return handleBtn(data,rows,index,this);
			},
			toKey:function(data,rows,index){
				var field=this.field,text=data;
				if(!unit.isEmpty(field)){
					var select=$('select#'+field),obation;
					select.each(function(){
						var $this=$(this),options=$('option',$this),flag=true;
						options.each(function(){
							var value=$(this).attr('value');
							if(!unit.isEmpty(value)&&value==data){
								text=$(this).text();
								flag=false;
								return false;
							}							
						});	
						return flag;
					});
				}
				return text;
			},
			toFormat:function(data,rows,index){
				if(unit.isEmpty(data)){
					return '<span>none</span>';
				}
				var suffix=this.suffix || '';
				var prefix=this.prefix || '';
				if(unit.isEmpty(suffix)&&unit.isEmpty(prefix)){
					suffix='%';
				}
				if(suffix=='级'){
					data=data=='-1'?'无限':data=='-2'?'所属区域':data;
					suffix=data=='-2'?'':suffix;
				}
				return handlePrefixOrSuffix(data,suffix,prefix);
			},
			toState:function(data,rows,index){
				return !unit.isEmpty(data)&&data==0?'<span class="badge badge-success badge-roundless">启用</span>':'<span class="badge badge-danger badge-roundless ">禁用</span>';
			},
			toWhether:function(data,rows,index){
				return data==0?'<span class="badge badge-success">是</span>':'<span class="badge badge-danger">否</span>';
			}
		}
	}
	$.extend({
		initialization:function(options){
			var data=$('body').data('initialization');
			if (!data)  {
				$('body').data('initialization', (data = new Initialization(options)));
			}
			return data;
		}
	})
}));