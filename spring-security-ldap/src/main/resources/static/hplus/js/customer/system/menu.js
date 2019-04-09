var Menu=function(){
	var jstree_select_menu_id;
	var remove_flag=false;
	var getMenuById=function(id){
		var data=$('body').data('menu_data');
		var res;
		recursion(data,id);
		return res;
		function recursion(data,val,parent){
			if(App.isEmpty(data)){
				return;
			}
			$.each(data,function(i,v){
				if(v.id==val){
					if(!App.isEmpty(parent))v['parent_title']=parent.title;
					res=v;
					return false;
				}
				var childs=v.childs;
				if(App.isEmpty()){
					recursion(childs,val,v);
				}
			});
			return;
		}		
	}
	var initialize=function(){
		App.ajax({
			url:'/system/menu/getMenuAllData',
			success:function(result){
				convertTree(result);
				$('body').data('menu_data',result);
				initializeTree(result,$('#menu_tree'));
			}
		});
		//转换成Tree需要的数据
		function convertTree(data){
			$.each(data,function(i,v){
				var result={'text':v.title,'id':v.id};
				v['text']=v.title;
				var childs=v.childs;
				v['children']=childs;
				if(childs!=null&&childs.length>0){
					convertTree(childs);
				}
			});
		}
	}
	var initializeTree=function(data,e){
		if(!e)return;
		e.jstree("destroy");
		e.jstree({
			'core':{'multiple':true,'animation':0,'data':data,'themes':{ "stripes" : true }},
			'checkbox':{'three_state':false,'cascade':'undetermined'},//禁用级联选中 cascade:三个选项，up, down, undetermined; 使用前需要先禁用three_state 
			'plugins':['wholerow', 'search','contextmenu','dnd'],//如果使用checkbox效率会降低, 'wholerow'会把线隐藏掉
			'contextmenu':{
				'items':{
					'create':{
						label:'添加下级',
						action:function(data){
							App.modal($('#add_menu'));	
						}
					},
					"rename":{
						label:'修改',
						action:function(data){
							App.fullForm($('#add_menu').find('form'),getMenuById(jstree_select_menu_id));
							App.modal($('#add_menu'));
						}
					},  
		            "remove":{
		            	label:'删除',
		            	action:function(data){
		            		if(!remove_flag){
		            			sweetAlert("错误信息...", "该菜单还有下级菜单,不能删除!", "error");
		            			return;
		            		}
		            		remove_flag=false;
		            		swal({
		            	        title: "您确定要删除这条信息吗",
		            	        text: "删除后将无法恢复，请谨慎操作！",
		            	        type: "warning",
		            	        showCancelButton: true,
		            	        confirmButtonColor: "#DD6B55",
		            	        confirmButtonText: "删除",
		            	        closeOnConfirm: false,
		            	        cancelButtonText:'让我再考虑一下…',
		            	        confirmButtonText:"是的，我要删除！"
		            	    }, function () {
		            	    	remove(jstree_select_menu_id,function(result){
		            	    		var flag=result.flag;
		            	    		if(flag||flag=='true'){
				            	        swal("删除成功！", "您已经永久删除了这条信息。", "success");
				            	        initialize();
		            	    		}else{
				            	        swal("删除失败！", result.message, "error");
		            	    		}
		            	    	});
		            	    	
		            	    });
		            	}
		            },  
		            "ccp":null, 
				}
			}
		});
		bindJstree(e);
	}
	
	var bindJstree=function(e){
		//监控tree选择事件 主要做删除处理
		e.on('changed.jstree',function(e,data){
			var node=data.node;
			if(!App.isEmpty(node)){
				var data=getMenuById(node.id);
				rendering(data);
				var children=node.children;
				if(children.length<1){
					remove_flag=true;
					jstree_select_menu_id=node.id;
				}
			}			
		});
	}
	var rendering=function(data){
		var div=$('#menu_view');
		if(!div)return;
		div.empty();
		console.log(data);
		var icon=App.isEmpty(data.icon)?'':'<i class="'+data.icon+'"></i>';
		var str='';
  		 $.each(data.childs,function(i,v){
  			str+='<span class="" style="margin-left:10px;">';
  			if(!App.isEmpty(v.icon)){
  				str+='<i class="'+v.icon+'"></i>';
  			}
  			str+=v.title+'</span>';
  		 });
		$('<div class="ibox-title"><h5 id="menu_title">'+icon+data.title+'</h5> </div>').appendTo(div);
		div=$('<div class="ibox-content"></div>').appendTo(div);
		$('<h4>菜单名称: <small>'+data.title+'</small></h4>').appendTo(div);
		$('<h4>菜单图标: <small>'+icon+'</small></h4>').appendTo(div);
		$('<h4>等级: <small>'+(App.isEmpty(data.level)?0:data.level)+'</small></h4>').appendTo(div);
		$('<h4>上级菜单: <small>'+(App.isEmpty(data.parent_title)?'':data.parent_title)+'</small></h4>').appendTo(div);
		$('<h4>下级菜单:  <small>'+str+'</small></h4>').appendTo(div);
		$('<h4>排序号: <small>'+data.sequence+'</small></h4>').appendTo(div);
		$('<h4>备注: <small>'+data.info+'</small></h4>').appendTo(div);
	}
	//删除menu
	var remove=function(id,callback){
		var form=$('#delete_menu');
		form.find('#id').val(id);
		App.ajax({form:form,success:function(result){
			if(typeof(callback)=='function'){
				callback(result);
			}
		}});
	}
	
	return {
		init:function(){
			jstree_select_menu_id=[];
			initialize();
		}
	}	
}();

jQuery(document).ready(function() {
	Menu.init();
});