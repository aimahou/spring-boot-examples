var Auxiliary=function(){
	var formInitData={};
	//情况form表单 单选框和复选狂都是默认选中
	var emptyForm=function(form){
		if($(form).is('form')){
			$('select,textarea,input[name!="_csrf"]',$(form)).each(function(){
				var th=$(this);
				if(th.hasClass('ignore')){
					return;
				}
				if(th.is('select')){
					th.val('').trigger('change');
				}
				if(th.is('input')){
					var type=th.attr('type');
					if(type=='button'||type=='image'||type=='reset'||type=='submit'){
						return true;
					}
					if(type=='radio'||type=='checkbox'){						
						if(th.data('default')==false){
							th.removeAttr('checked','checked');
						}else{
							th.attr('checked','checked');
						}
						return true;
					}					
					th.val('');
					return true;
				}
				th.val('');
			});
		}
	}
	
	var formToJson=function(form){
		$.fn.serializeObject = function()    
		{    
		   var o = {};    
		   var a = this.serializeArray();    
		   $.each(a, function() {    
		       if (o[this.name]) {    
		           if (!o[this.name].push) {    
		               o[this.name] = [o[this.name]];    
		           }    
		           o[this.name].push(this.value || '');    
		       } else {    
		           o[this.name] = this.value || '';    
		       }    
		   });    
		   return o;    
		};
		var jsonuserinfo = $(form).serializeObject();
		return jsonuserinfo;
	}
	
	var compare=function(objA, objB){
		if (!isObj(objA) || !isObj(objB)) return false; //判断类型是否正确
		if (getLength(objA) != getLength(objB)) return false; //判断长度是否一致
		return compareObj(objA, objB, true);//默认为true
	}
	
	var compareObj=function(objA, objB, flag) {
		for (var key in objA) {
		if (!flag) //跳出整个循环
		break;
		if (!objB.hasOwnProperty(key)) { flag = false; break; }
		if (!isArray(objA[key])) { //子级不是数组时,比较属性值
		if (objB[key] != objA[key]) { flag = false; break; }
		} else {
		if (!isArray(objB[key])) { flag = false; break; }
		var oA = objA[key], oB = objB[key];
		if (oA.length != oB.length) { flag = false; break; }
		for (var k in oA) {
		if (!flag) //这里跳出循环是为了不让递归继续
		break;
		flag = CompareObj(oA[k], oB[k], flag);
		}
		}
		}
		return flag;
	}
	
	var isObj=function(object) {
		return object && typeof (object) == 'object' && Object.prototype.toString.call(object).toLowerCase() == "[object object]";
	}
	var isArray=function(object) {
		return object && typeof (object) == 'object' && object.constructor == Array;
	}
	var isJson=function(obj){
		return  typeof(obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length; 
	}
	var isFunction=function(obj){
		return (typeof obj=='function')&&obj.constructor==Function; 
	}
	var isString=function(obj){
		return (typeof obj=='string')&&obj.constructor==String; 
	}
	var  getLength=function(object) {
		var count = 0;
		for (var i in object) count++;
		return count;
	}
	//填充数据
	var fullForm=function(form,data) {
		if($(form).is('form')){
			this.emptyForm(form);
			if(!isEmpty(data)&&isJson(data)){
				$('select,textarea,input[name!="_csrf"]',$(form)).each(function() {
					var th=$(this);
					if(th.is('input')){
						var type=th.attr('type');
						if(type=='button'||type=='image'||type=='reset'||type=='submit'){
							return true;
						}
					}
					var id=th.attr('id'),name=th.attr('name');
				    for (var d in data) {
				    	if(d==id||d==name){
				    		if(th.is('input')){
				    			var type=th.attr('type');    			
				    			if(type=='radio'||type=='checkbox'){
				    				var value=th.attr('value');
				    				if(value==data[d]){
				    					th.attr('checked','checked');
				    				}else{
				    					th.removeAttr('checked','checked');
				    				}
				    				break;
				    			}
				    			th.val(data[d]);
				    			break;
				    		}
				    		if(th.is('select')){
				    			th.val(data[d]).trigger("change");
				    			break;
				    		}
				    		th.val(data[d]);
				    		break;
				    	}
				    }
				});
			}
		}
	}
	//打开 tab/modal 自带清空form里面的内容(如果需要关闭,则设置no-empty class) 和 填充form里面的内容 
	var handleOpen=function(e,data){
		var th=$(e);
		if(!th.length){
			console.warn('找不到需要打开的内容!');
			return;
		}
		var form=$('form',th);
		if(!isEmpty(data)&&isJson(data)){
			fullForm(form,data);
		}else if(!th.hasClass('no-empty')){
			emptyForm(form);
		}
		
		if(th.hasClass('modal')){
			th.modal();			
			return;
		}		
		if(th.hasClass('tab-pane')){
			var content=th.parents('.tab-content');
			if(!content.length){
				console.warn('找不到tab-content 容器!');
				return;
			}
			var close=$('.tab-pane:visible',content);
			//默认淡入淡出效果
			close.fadeTo('slow',0,function(){
				close.removeClass('active in').removeAttr('style');
				th.addClass('active in');
			});
			return;
		}
		console.warn('无法确定需要打开的类型!当前支持 modal 和 tab类型');
		console.log('modal类型','Class 必须带有 modal!');
		console.log('tab 类型','Class 必须带有 tab-pane 并且在tab-content容器中!');
	}
	//form表单提交
	var formSubmit=function(form,callback){
		var url=form.attr('action'),data=form.serialize(),type=isEmpty(form.attr('method'))?'POST':form.attr('method');
		if(isEmpty(url)){
			if(isFunction(callback)){
				callback('错误','找不到URL,无法提交表单!','error');
			}
			return;
		}
		$.ajax({
			url:url,
			data:data,
			type:type,
			dataType:'JSON'
		}).always(function(data,state){
			var title='操作提示',type='success',message='操作成功!';
			if(state!='success'){
				type='error',title='错误',message='请求失败,系统错误!';
			}
			var flag=data.flag;
			if(flag==false){
				title='错误',type='error',message=data.errorMsg||'操作失败!';
			}else{
				message=data.message||'操作成功';
			}
			if(isFunction(callback)){
				callback(title,message,type);
			}
		});
	}
	//转换 字典格式
	var transformation=function(row,obj){
		var result=row || '';
		if(isEmpty(obj)){
			return row;
		}
		if($(obj).length>0&&$(obj).is('select')){
			$('option',$(obj).first()).each(function(){
				var th=$(this);
				var value=th.attr('value') || '';
				var text=th.text();
				if(value==row){
					result=text;
					if(th.parent().is('optgroup')){
						var label=th.parent().attr('label');
						if(!isEmpty(label)){
							result=label+' > '+text;
						}
					}
					return false;
				}
			});
		}else if(isArray(obj)){
			$.each(obj,function(i,v){
				var value=v.value;
				var label=v.label;
				if(value==row){
					result=label;
					return false;
				}
			});
		}else if(isString(obj)){
			var data=$('body').data(obj.replace(/\_/g,''));
			if(isEmpty(data)){
				$.ajax({
					url:'/dictionaries/retrieval/'+obj,
					dataType:'JSON',
					type:'GET',
					async:false
				}).always(function(data,state){
					if(state!='success'){
						$('body').data(obj.replace(/\_/g,''),'none');
					}else{
						$('body').data(obj.replace(/\_/g,''),data);
					}
				});
			}
			data=$('body').data(obj.replace(/\_/g,''));
			if(!isEmpty(data)&&data!='none'&&isArray(data)){
				$.each(data,function(i,v){
					var value=v.value;
					var label=v.label;
					if(value==row){
						result=label;
						return false;
					}
				});
			}
		}
		return result;
	}
	
	var handleLong2Date=function(l,format){
		format=format||'yyyy-MM-dd HH:mm:ss';
		l=parseInt(l);
		l=isNaN(l)?0:l;
		if(l<=0){
			return '';
		}
		return formatDate(l,format);
		function formatDate(l,format){
			Date.prototype.format=function(fmt) {        
			    var o = {        
			    "M+" : this.getMonth()+1, // 月份
			    "d+" : this.getDate(), // 日
			    "h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, // 小时
			    "H+" : this.getHours(), // 小时
			    "m+" : this.getMinutes(), // 分
			    "s+" : this.getSeconds(), // 秒
			    "q+" : Math.floor((this.getMonth()+3)/3), // 季度
			    "S" : this.getMilliseconds() // 毫秒
			    };        
			    var week = {        
			    "0" : "\u65e5",        
			    "1" : "\u4e00",        
			    "2" : "\u4e8c",        
			    "3" : "\u4e09",        
			    "4" : "\u56db",        
			    "5" : "\u4e94",        
			    "6" : "\u516d"       
			    };        
			    if(/(y+)/.test(fmt)){        
			        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));        
			    }        
			    if(/(E+)/.test(fmt)){        
			        fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "\u661f\u671f" : "\u5468") : "")+week[this.getDay()+""]);        
			    }        
			    for(var k in o){        
			        if(new RegExp("("+ k +")").test(fmt)){        
			            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));        
			        }        
			    }        
			    return fmt;        
			} 
			var d=	new Date();
			d.setTime(l);
			var s=d.format(format);
			return s;
		}
	}
	//前缀 或者 后缀转换
	var handlePrefixOrSuffix=function(row,suffix,position){
		position=position||'suffix';
		suffix=suffix || '';
		if(isEmpty(row)){
			return 'none';
		}
		if(position=='suffix'){
			return row+' '+suffix;
		}
		return suffix+' '+row;
	}
	
	var handleRemove=function(url,data,callback){
		 swal({
		        title: "Are you sure?",
		        text: "您将无法恢复这个删除的内容！",
		        type: "warning",
		        showCancelButton: true,
		        closeOnConfirm: false,
		        closeOnCancel: false,
		        cancelButtonText: '我再考虑一下',
		        confirmButtonText: "是的，我要删除",
		        confirmButtonColor: "#ec6c62",
		        showLoaderOnConfirm: true,
		    }, function(isConfirm) {
		        if (!isConfirm) {
		            swal.close();
		            return;
		        }
		        $.ajax({
		        	url:url,
		        	data:data,
		        	dataType:'JSON',
		        	type:'POST',	
		        }).always(function(data,state){
		        	var title='操作提示',type='success',message='操作成功!';
					if(state!='success'){
						type='error',title='错误',message='请求失败,系统错误!';
					}
					var flag=data.flag;
					if(flag==false){
						title='错误',type='error',message=data.errorMsg||'操作失败!';
					}else{
						message=data.message||'操作成功';
					}
					swal(title,message,type);
					if(isFunction(callback)){
						callback(type=='success');
					}	
		        });
		    });
	}
	
	var automatic=function(){
		$('select.automatic[data-url]').each(function(){
			var th=$(this);
			var url=th.data('url');
			if(!isEmpty(url)){
				url=options.contextPath+url;
				$.get(url).always(function(data,state){
					if(state!='success' || isEmpty(data)){							
						return;
					}
					if(isArray(data)){
						$.each(data,function(i,v){
							if(isString(v)){
								$('<option value="'+v+'">'+v+'</option>').appendTo(th);
								return true;
							}
							$('<option value="'+v.value+'">'+v.label+'</option>').appendTo(th);
						});
					}
				});
			}
		});
	}
	
	var generateInput=function(id,value,type,name,cls){
		var str='<input ';
		type=type||'text';
		str+='type="'+type+'" ';
		if(!isEmpty(id)){
			str+='id="'+id+'" ';
			if(isEmpty(name)){
				name=id;
			}
		}
		if(!isEmpty(name)){
			str+='name="'+name+'" ';
		}
		if(!isEmpty(value)){
			str+='value="'+value+'" ';
		}
		cls=cls||'form-control ';
		if(!isEmpty(cls)){
			str+='class="'+cls+'" ';
		}
		str+='/>';
		return str;
	}
	//自动生成表单Form
	var handleGenerate=function(form,obj){
		if(!$(form).is('form')){
			return;
		}
		$(form).empty();
		var token=getToken();
		for(d in token){
			$(generateInput(d,token[d],'hidden')).appendTo($(form));
		}
		
	}
	
	var encapsulationSearch=function(form,json){
		// 排序
		var orderby='';
		var order=json.order;
		var columns=json.columns;
		var tranform,alias;
		if(form.length>0){
			form.each(function(){
				var th=$(this);
				tranform=th.data('tranform');// 是否转换驼峰
				alias=th.data('alias');// 别名
				return false;
			});
		}
		if(!isEmpty(order)&&!isEmpty(columns)){
			$.each(order,function(i,v){
				if(i>0){orderby+=',';}
				var column=columns[i];
				var name=column.data;
				orderby+=' ';
				var dir=v.dir;
				if(!isEmpty(alias)){
					orderby+=alias+'.';
				}
				if(tranform||tranform=='true'){orderby+=tranformStr(name)+' '+dir;}else{orderby+=name+' '+dir;}
			});
			json['orderBy']=orderby;	
		}
		if(isEmpty(form)){
			return json;
		}
		if(form.length>0){
			form.each(function(){
				var th=$(this);
				json=isEmpty(json)?{}:json;
				var data=th.serializeArray();
				$.each(data,function(i,v){
					json[v.name]=v.value;
				});
				return false;
			});
		}
		
		return json;
		// 转换驼峰
		function tranformStr(s){
		    return s.replace(/([A-Z])/g,"_$1").toLowerCase();
		}
	}
	return {
		//启动页面监听
		init:function(form){
			
		},
		open:function(e,data){
			handleOpen(e,data);
		},
		emptyForm:function(){
			emptyForm(form);
		},
		fullForm:function(form,data){
			fullForm(form,data);
		},
		getData:function(id,e){
			var result={};
			var table=$(e).parents('table');
			if(!table.length){
				return result;
			}
			result=table.bootstrapTable('getRowByUniqueId',id);
			return result;
		},
		save:function(e,callback){
			var form=$(e).parents('form');
			if(!form.length){
				swal('你妹的','找不到Form表单,无法提交!','error');
				return;
			}
			if(!form.validate().form()){
				return;
			}
			formSubmit(form,function(title,message,type){
				if(isFunction(callback)){
					callback(title,message,type);
				}
			});
		},
		//转换 
		transformation:function(row,obj){ 
			return transformation(row,obj);
		},
		toDate:function(row){
			return handleLong2Date(row,'yyyy-MM-dd');
		},
		toTime:function(row){
			return handleLong2Date(row);
		},
		//后缀为 '积分'
		toFormatIntegral:function(row){
			return handlePrefixOrSuffix(data,'积分');
		},
		//后缀为 '月'
		toFormatMonth:function(data,rows,index){
			return handlePrefixOrSuffix(data,'月');
		},
		//后缀为 '级'
		toFormatLevel:function(data,rows,index){
			return handlePrefixOrSuffix(data=='-1'?'无限':data=='-2'?'所属区域':data,data=='-2'?'':'级');
		},
		//前缀为 '&yen;'
		toFormatMoney:function(data){
			return handlePrefixOrSuffix(data,'&yen;','prefix');
		},
		//后缀为 '%'
		toFormatPercentage:function(data){
			return handlePrefixOrSuffix(data,'%');
		},
		//转换为图片
		toImage:function(data){
			var title=isEmpty(rows.title)?'展示图片':rows.title;
			return isEmpty(data)?'':'<img alt="'+title+'" src="'+data+'" style="width:70px;height:84px;vertical-align:middle;"/>'
		},
		toSex:function(data){
			return  data==0?'<i class="fa fa-female"></i> 女':data==1?'<i class="fa fa-male"></i> 男':'<i class="fa fa-question-circle"></i> 保密'; ;
		},
		remove:function(url,data,callback){
			handleRemove(url,data,callback);
		},
		isArray:function(obj){
			return (typeof obj=='object') && obj.constructor ==Array; 
		},
		isString:function(obj){
			return (typeof obj=='string')&&obj.constructor==String; 
		},
		isNumber:function(obj){
			return (typeof obj=='number')&&obj.constructor==Number; 
		},
		isDate:function(obj){
			return (typeof obj=='object')&&obj.constructor==Date; 
		},
		isFunction:function(obj){
			return (typeof obj=='function')&&obj.constructor==Function; 
		},
		isObject:function(obj){
			return (typeof obj=='object')&&obj.constructor==Object;
		},
		generateForm:function(form,obj){
			handleGenerate(form,obj);
		},
		encapsulationSearch:function(form,json){
			return encapsulationSearch(form,json);
		}
	}
}();