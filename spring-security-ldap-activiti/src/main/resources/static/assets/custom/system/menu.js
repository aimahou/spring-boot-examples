var Menu=function(){
	//修改后的提示
	var alert=function(message){
		App.alert({
			 message:message,
			 type:'warning',
			 container:'#menu_message_alert',
			 place:'append',
			 close:true,
			 reset:true,
			 focus:true,
			 closeInSeconds:'0',
			 icon:'warning'
		 });
	}
	
	//字段验证
	var handleValidate=function(){
		var form=$('#menu_add_form');
		if(form.length<1||!form.is('form')){
			return;
		}
		if(!$().validate){
			return;
		}
		form.validate({
			rules: {
				title:{
   				required: true,
   				rangelength:[1,15],
   				 remote: {
   					url: '/menu/check',
                  	type: "GET",
                    dataType: "JSON",
                    data: {'parentId':function(){return form.find('#parentId').val();},'id':function(){return form.find('#id').val();},'name':function(){return form.find('#title').val();}}
                 }
			 		},
			 	sequence:{
			 		required: true,
			 		digits:true,
			 		range:[0,99999]
			 	}
		 },
			 messages:{
				 title:{
	            		required:'请填写菜单名称',
	            		rangelength:'请输入长度在 {0} 到 {1} 之间的字符串',
	            		remote:'菜单名称已经存在'
	            	},
	            sequence:{
	            	required:'请填写菜单权重',
	            	digits:'只能输入自然数',
	            	range:'请输入范围在 {0} 到 {1} 之间的数值'
	            }
			 }	
		});
	}
	
	var toName=function(data,rows,index){
		var childs=rows.childs;
		var result='';
		var icon=rows.icon;
		if(!isEmpty(icon)){
			result=result+'<i class="'+icon+'"></i>';
		}
		result=result+'<span> '+data+'</span>';
		return result;
	}
	var tobtn=function(row,rows,index,flag){
		//操作 禁用|启用 添加下级 修改 删除(只能删除禁用状态)
		var btns='<div class="btns" data-id="'+rows.id+'">';
		btns=btns+'<a class="btn btn-xs grey-cascade edit" title="修改菜单" href="javascript:;"  onclick="Menu.edit(this);"><i class="fa fa-edit"></i>修改</a>';
		if(isEmpty(flag)){	
			btns=btns+'<a class="btn btn-xs dark addSub" title="添加下级"  href="javascript:;" onclick="Menu.addSub(this);"><i class="icon-link"></i>添加下级</a>';
		}	
		var state=rows.state,c='btn btn-xs red state',t='禁用',i='fa fa-ban';				
		if(state!=0){
			c='btn btn-xs purple state',t='正常',i='fa fa-circle-o';
		}
		btns+='<a class="'+c+'" title="'+t+'" href="javascript:;" onclick="Menu.updateState(this);"><i class="'+i+'"></i>'+t+'</a>';
		if(isEmpty(rows.childs)&&state!=0){
			btns=btns+'<a class="btn btn-xs green remove" title="删除"  href="javascript:;" onclick="Menu.remove(this);"><i class="fa fa-times"></i>删除</a>';
		}
		btns=btns+'</div>';
		return btns;
	}
	
	var handleOpenDetailView=function(e,d,colspan){
		var data=$unit.isNumber(d)?$hmsh.table.getData(d):$unit.isArray(d)?d:[];
		data=$unit.isJson(data)?$unit.isEmpty(data.childs)?[]:data.childs:data;
		if(!$unit.isEmpty(e)&&e.is('tr')&&!$unit.isEmpty(data)){
			var parentId;
			$.each(data,function(i,v){
				if(i==0){
					parentId=$unit.isJson(d)?d.id:v.parentId
				}
				var parentTitle=$unit.isJson(d)?d.title:v.parentTitle;
				var nowTr=$('<tr class="detail-view" data-parent-id="'+parentId+'" data-uniqueid="'+v.id+'" ></tr>').data('data',v);
				$('<td colspan="2"></td>').appendTo(nowTr);
				//var checkbox=$('<td  class="bs-checkebox"><label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"><input name="btSelectItemChild" type="checkbox"><span></span></label></td>').appendTo(nowTr);				
				$('<td >'+Menu.toName(v.title,v)+'</td>').appendTo(nowTr);
				$('<td >'+parentTitle+'</td>').appendTo(nowTr);
				$('<td >'+v.sequence+'</td>').appendTo(nowTr);
				$('<td >'+Menu.toResource(v.resource,v)+'</td>').appendTo(nowTr);
				$('<td >'+Menu.toState(v.state,v)+'</td>').appendTo(nowTr);
				$('<td>'+v.info+'</td>').appendTo(nowTr);
				$('<td>'+Menu.toBtn(v.id,v,0,false)+'</td>').appendTo(nowTr);
				$('tr.detail-view:last',e.parents('table')).after(nowTr);
			});
			$('tr.detail-view:last',e.parents('table')).after($('<tr class="detail-view" data-parent-id="'+parentId+'" ><td colspan="'+colspan+'" align="center" bgcolor="#E1E5EC"></td></tr>'));
		}
	}
	//Tab切换
	return {
		init:function(opt){
			$('#menu_table').on('expand-row.bs.table',function(event,index, row, $detail){
				$detail.empty();
				var colspan=$detail.attr('colspan'),tr=$detail.parent();
				tr.attr('data-parent-id',row.id);
				var childs=row.childs;
				if(!$unit.isEmpty(childs)){
					$.each(childs,function(i,v){
						v.parentTitle=row.title,v.parentId=row.id;
					});
				}
				handleOpenDetailView(tr,childs,colspan);
			}).on('collapse-row.bs.table',function(event,index,row){
				$('tr.detail-view[data-parent-id="'+row.id+'"]',$(this)).remove();
			});
			handleValidate();
		},
		addSub:function(id){
			var menuData=$hmsh.table.getData(id);
			var form=$('#menu_add_form');
			$('#parentId',form).empty();
			$unit.open('#menu_add');
			var sd=[{id:menuData.id,text:menuData.title}];
			$('#parentId',form).select2({data:sd});
		},
		edit:function(e){
			var th=$(e);
			var id=th.parents('.btns').data('id');
			var data=$hmsh.table.getData(id);
			var placeholder='无上级菜单';
			var menuData=[];
			if(!isEmpty(data.parentId)){
				menuData=[{id:data.parentId,text:data.parentTitle}];
			}	
			$('#parentId',$('#menu_add_form')).empty().select2({
				data:menuData,
				placeholder:placeholder,
				width:'100%'
			});		
			$unit.open('#menu_add',data);
		},
		updateState:function(e){
			var id=$(e).parent().data('id');
			var data=$hmsh.table.getData(id);
			var state=data.state;
			var message=state==0?'禁用':'恢复';
			swal({
   				title: "Are you sure?",  
   		        text: '确定要'+message+'该菜单吗',  
   		        type: "warning", 
   		        showCancelButton: true, 
   		        closeOnConfirm: false, 
   		        closeOnCancel:false,
   		        cancelButtonText:'我再考虑一下',
   		        confirmButtonText: "是的，我要"+message, 
   		        confirmButtonColor: "#ec6c62",
   		        showLoaderOnConfirm:true,
   			},function(isConfirm){
   				if(!isConfirm){
   					swal.close();
   					return;
   				}
   				$unit.submit({
   					url:'/menu/updateState',
   					data:{id:data.id}
   				},function(opt,data,state){
   					swal(opt.title,opt.message,opt.type);
   					$hmsh.table.refresh();
   					alert('修改菜单后需要刷新页面,对应的菜单才会刷新!');
   				})
   			});
		},
		remove:function(e){
			var id=$(e).parent().data('id');
			var data={id:id};
			$unit.remove('/menu/remove',data,function(){
				
			});
		},
		toBtn:function(row,rows,index,flag){
			return tobtn(row,rows,index,flag);
		},
		toState:function(data,rows,index){
			return data==0?'正常':'禁用';
		},
		toResource:function(data,rows,index){
			var url=!isEmpty(data)?data.value:isEmpty(rows.url)?'':rows.url;
			return url;
		},
		toName:function(data,rows,index){
			return toName(data,rows,index);
		},
		openDetailView:function(index,row){
			$('#menu_table').bootstrapTable('collapseAllRows');
			if($unit.isEmpty(row.childs)){
			  return '暂无下级分类'; 
		    }
			return row;
		},
		save:function(e,field){
			Auxiliary.save(e,function(title,message,type){
				if(type=='success'){
					Auxiliary.open(field);
					alert('菜单修改后需要刷新页面才会更新!');
					//刷新表格
					refreshTable();
				}
				swal(title,message,type);
			});
		}
	}
}();
