var App=function(){
	//封装ajax请求 处理一些加载过程
	var ajax=function(options){
		var opts=$.extend({
			url:'',
			dataType:'JSON',
			type:'GET',
			async:true,
			timeout:10000,
			cache:false,
			data:{},
			global:true,
			ifModified:false,
			username:'',
			password:'',
			form:'',
			beforeSend:function(){
				
			},
			complete:function(){
				
			},
			success:function(result){
				
			},
			error:function(XMLHttpRequest, textStatus, errorThrown){
				console.error('XMLHttpRequest',XMLHttpRequest);
				console.error('textStatus',textStatus);
			}
		},options);
		var form=$(opts.form);
		if(form.is('form')){
			var url=form.attr('action');
			var data=form.serialize();
			var type=form.attr('method');
			$.extend(opts,{
				url:url,
				data:data,
				type:type,
			});
		}	
		return $.ajax(opts);
	}
	var isEmpty=function(s){
		var flag=false;
		var type=typeof(s);
		switch(type){
			case 'string':
				flag=$.trim(s)==''||$.trim(s).length<=0;
				break;
			case 'undefined':
				flag=true;
				break;
			default:
				flag= s==null||s.length<=0;
				break;
		}
		return flag;
	}
	var fullForm=function(form,data){
		
		form.find('input').each(function(i,v){
			var th=$(this);
			var name=th.attr('name');
			if(App.isEmpty(name)){
				name=th.attr('id');
			}				
			for(var key in data){
				if(name==key){
					th.val(data[key]);
					break;
				}
			}
		});
		form.find('textarea').each(function(i,v){
			var th=$(this);
			var id=th.attr('name');
			for(var key in data){
				if(id==key){
					th.val(data[key]);
					break;
				}
			}
		});
	}
	var handelModel=function(e){
		e.modal({
			keyboard: false,
			backdrop:'static'
		});		
	}
	//菜单生成
	var buildMenu=function(){
		//菜单ul
		var ul=$('#side-menu');
		ajax({
			url:'/system/menu/getMenuAllData',
			success:function(result){
				
			}
		});
		//递归生成
		function recursionBuildMenu(data,ul,i){
			if(isEmpty(data))return;
			$.each(data,function(i,v){
				var id=v.id;
				var title=v.title;
				var childs=v.childs;
				if(isEmpty(id)||isEmpty(title))return true;
				var url=isEmpty(v.url)?'javascript:;':v.url;
				var li=$('<li></li>').appendTo(ul);
				var a=$('<a href="'+url+'" class="skip_iframe_url"></a>').appendTo(li);
				if(i==0){li.addClass('first')};
				if(!isEmpty(v.icon)){$('<i class="'+v.icon+'"></i>').appendTo(a)};
				$('<span class="nav-label">'+title+'</span>').appendTo(a);
				
			});
		}		
	}
	
	return {
		//自己封装ajax请求
		ajax:function(options){
			return ajax(options);
		},
		//是否为空
		isEmpty:function(s){
			return isEmpty(s);
		},
		modal:function(e){
			if(!e)return;
			handelModel(e);
		},
		fullForm:function(e,data){
			fullForm(e,data);
		}
		
	}
}();