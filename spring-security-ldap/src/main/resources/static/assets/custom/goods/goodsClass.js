var GoodsClass=function(){
	var validate=function(form){
		form.validate({
			rules: {title:{
				 required: true,
				 remote: {
					url: '/menu/check',
					type: "GET",
					dataType: "JSON",
					data: {'parentId':function(){return form.find('#parentId').val();},'id':function(){return form.find('#dmId').val();},'name':function(){return form.find('#title').val();}}
				  }
			 }},
			 messages:{
				 title:{
	            		required:'请填写菜单名称',
	            		remote:'菜单名称已经存在'
	            	}
			 }	
		});
	}
	var handleOpenDetailView=function(id,e){
		var th=$(e),i=$('i',th),tr=th.parents('tr'),table=tr.parents('table'),data=table.bootstrapTable('getRowByUniqueId',id),colspan=$('thead tr th',table).length;
		$('tr.detail-view',table).remove();
		if(isEmpty(data)){
			return;
		}
		if($('i',th).hasClass('fa-plus-circle')){
			var btn=$('.detail-view-btn',tr.parents('table')).attr('title','展开') ;
			$('i',btn).removeClass('fa-minus-circle font-green').addClass('fa-plus-circle bg-font-default');
			th.attr('title','关闭');
			i.removeClass('fa-plus-circle bg-font-default').addClass('fa-minus-circle font-green');
			var childs=data.childs;
			if(isEmpty(childs)){
				return;
			}
			var nowTrV=$('<tr class="detail-view" ><td colspan="'+colspan+'" align="center" bgcolor="#E1E5EC"></td></tr>');
			tr.after(nowTrV);
			$.each(childs,function(i,v){
				v.parent=data;
				v.parentId=data.dmId;
				v.parent_title=data.title;
				var nowTr=$('<tr class="detail-view" data-uniqueid="'+v.id+'" ></tr>').data('data',v);
				$('<td class="bs-checkebox"><label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"><input name="btSelectItem" type="checkbox"><span></span></label></td>').appendTo(nowTr);
				$('<td class="table-title td-nobr">'+GoodsClass.toTitle(v.title,v)+'</td>').appendTo(nowTr);
				$('<td class="table-title td-nobr">'+v.sequence+'</td>').appendTo(nowTr);
				$('<td class="table-title td-nobr">'+data.title+'</td>').appendTo(nowTr);
				$('<td class="table-title td-nobr">'+GoodsClass.toState(v.state,v)+'</td>').appendTo(nowTr);
				$('<td class="bs-checkbox">'+GoodsClass.toSelfMall(v.selfMall,v,'selfMall')+'</td>').appendTo(nowTr);
				$('<td class="bs-checkbox">'+GoodsClass.toPointsMall(v.pointsMall,v,'pointsMall')+'</td>').appendTo(nowTr);
				$('<td class="table-title td-nobr">'+v.remarks+'</td>').appendTo(nowTr);
				$('<td class="table-title td-nobr">'+GoodsClass.toBtn(v.dmId,v)+'</td>').appendTo(nowTr);
				$('tr.detail-view:last',table).after(nowTr);
			});
			$('tr.detail-view:last',table).after(nowTrV);
		}else{
			th.attr('title','展开');
			i.removeClass('fa-minus-circle font-green').addClass('fa-plus-circle bg-font-default');
		}
	}
	var toMall=function(data,id,name){
		var html='<label class="mt-checkbox mt-checkbox-outline"><input type="checkbox"  class="mall icheck" data-on-text="是" data-off-text="否" value="0" data-id="'+id+'" name="'+name+'"';
		var flag=data==1?false:true;
		if(flag){
			html+='checked="checked"';
		}
		html+='/><span></span></label>';
		return html;
	}
	
	var handleUpdateState=function(e){
		var id=$(e).parent().data('id');
		swal({
				title: "Are you sure?",  
		        text: '该操作不可逆。确定要恢复该分类吗?',  
		        type: "warning", 
		        showCancelButton: true, 
		        closeOnConfirm: false, 
		        closeOnCancel:false,
		        cancelButtonText:'我再考虑一下',
		        confirmButtonText: "是的，我了解了", 
		        confirmButtonColor: "#ec6c62",
		        showLoaderOnConfirm:true,
			},function(isConfirm){
				if(isConfirm){
					var url=$('#add_form').attr('action');
	   				$unit.submit({
	   					url:url,
	   					data:{dmId:id,state:0}
	   				},function(opt,data,state){
	   					swal(opt.title,opt.message,opt.type);
	   					if(opt.type=='success'){
	   						$hmsh.table.refresh();
	   					}
	   				});
				}else{
					swal.close();
				}	
			});
	}
	return {		
		init:function(){
			validate($('form',$('#goodsclass_add')));
			var addBtn=$unit.getDom('addBtn');
			if(!$unit.isEmpty(addBtn)&&addBtn.length>0){
				addBtn.on('click',function(){
					$hmsh.upload.setImage($('#image'));
					return true;
				});
			}
			
			$('#goodsClass_table').on('change','input.mall',function(){
				var $this=$(this),id=$this.data('id'),check=$this.is(':checked')?0:1,name=$this.attr('name');
				var data={id:id}
				data[name]=check;
				$unit.submit({data:data,url:$('#add_form').attr('action')},function(opt,data,state){
					if(opt.type!='success'){
						swal(opt.title,opt.message,opt.type);
					}
					var rows=$hmsh.table.getData(id);
					rows[name]=check;
					$('#goodsClass_table').bootstrapTable('updateRow',rows);
				})
			});
		},
		addSub:function(e){
			var $table=$hmsh.table;
			var id=$(e).parent().data('id');
			var data=$table.getData(id);
			var res={parent_title:data.title,parentId:data.dmId};
			$('#image,#dmId').val('');
			$unit.open('#goodsclass_add',res);
			
			$hmsh.upload.setImage($('#image'));
		},
		edit:function(e){
			var $table=$hmsh.table;
			var id=$(e).parent().data('id');
			var data=$table.getData(id);
			if(!$unit.isEmpty(data)){
				$unit.open('#goodsclass_add',data);
				$hmsh.upload.setImage($('#image'));
			}
		},
		updateState:function(e){
			handleUpdateState(e);
		},
		remove:function(e){
			var data=$(e).parents('[data-id]');
			if(!isEmpty(data)){
				var id=data.data('id');
				var removeUrl=$('#goodsClass_table').data('remove-url');
				$unit.remove(removeUrl,{id:id});	
			}		
		},
		toState:function(data,rows,index){
			return data==0?'正常':'禁用';
		},
		toBtn:function(data,rows,index){
			var btns='<div data-id="'+data+'">';
			btns=btns+'<a class="btn btn-xs grey-cascade edit" title="修改分类" href="javascript:;" onclick="GoodsClass.edit(this);"><i class="fa fa-edit"></i>修改</a>';
			if(isEmpty(rows.parent)){
				btns=btns+'<a class="btn btn-xs dark addSub" title="添加下级"  href="javascript:;" onclick="GoodsClass.addSub(this);"><i class="icon-link"></i>添加下级</a>';
			}	
			var state=rows.state,c='btn btn-xs red state',t='禁用',i='fa fa-ban';				
			if(state!=0){
				c='btn btn-xs purple state',t='正常',i='fa fa-circle-o';
			}
			if(state!=0){
				btns=btns+'<a class="btn btn-xs purple state" title="正常"  href="javascript:;" onclick="GoodsClass.updateState(this);"><i class="fa fa-circle-o"></i>正常</a>';
				if(isEmpty(rows.childs)){
					btns=btns+'<a class="btn btn-xs green remove" title="删除"  href="javascript:;" onclick="GoodsClass.remove(this);"><i class="fa fa-times"></i>删除</a>';
				}
			}
			btns=btns+'</div>';
			return btns;
		},
		toTitle:function(data,rows,index){
			var icon=rows.image,result=isEmpty(rows.childs)?'':'<a class="detail-view-btn" title="展开" onclick="GoodsClass.openDetailView(\''+rows.dmId+'\',this);" href="javascript:;"><i class="fa fa-plus-circle bg-font-default" ></i></a>';
			if(!isEmpty(icon)){
				result=result+'<a rel="group" href="javascript:;" onclick="$.initialization().unit().viewPhoto(this);" title="'+data+'"><img src="'+icon+'" alt="'+data+'" width="70px;" height="30px;" onerror="$unit.nofind(this);"/></a>';
			}
			result=result+'<span> '+data+'</span>';
			return result;
		},
		toParent:function(data,rows,index){
			return !isEmpty(data)?data.title:'';
		},
		toSelfMall:function(data,rows,index){
			return toMall(data,rows.dmId,'selfMall');
		},
		toPointsMall:function(data,rows,index){
			return toMall(data,rows.dmId,'pointsMall');
		},
		openDetailView:function(id,e){
			handleOpenDetailView(id,e);
		}
	}
}();