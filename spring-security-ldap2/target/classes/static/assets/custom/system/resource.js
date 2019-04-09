var Resource=function(){
	var handleSynchronize=function(){
		var data=getToken();
		swal({
			title : "您确定要同步吗？",
			text : "您确定要同步数据？",
			type : "warning",
			showCancelButton : true,
			closeOnConfirm : false,
			confirmButtonText : "是的，我要同步",
			confirmButtonColor : "#ec6c62"
		}, function() {
			$.ajax({
				url : "/resource/synchronous",
				type : "POST",
				data : data,
			}).done(function(d) {
				swal("操作成功!", "已成功同步数据！", "success");
			}).error(function(d) {
				swal("OMG", "同步操作失败了!", "error");
			});
		});
	}
	var handleInit=function(table,url){
		var number_pattern=/^[\u4e00-\u9fa5a-zA-Z0-9-_]{0,20}$/; 
		var info_pattern=/^[\u4e00-\u9fa5a-zA-Z0-9-_]{0,200}$/; 
		table.bootstrapTable({
			url:url,
			pagination:true,
			sidePagination:'server',
			uniqueId:'id',
			toolbar:'#resource_search_form',
			columns:[
				{'field':'alias',editable:{type:'text',title:'别名',validate:function(v){var r = v.match(number_pattern);if(r==null){return '只能输入中英文,数字和"-","_",20个字符以内';}}}},
				{'field':'value'},
				{'field':'type',formatter:function(row,rows,index){
					 return row==0?'链接':'请求';
				}},
				{'field':'name'},
				{'field':'method'},
				{'field':'requestType'},
				{'field':'state',formatter:function(row,rows,index){
					 return row==0?'正常':'禁用';
				}},
				{'class':'table-desc','field':'info','width':200,editable:{type:'textarea',title:'别名',validate:function(v){var r = v.match(info_pattern);if(r==null){return '只能输入中英文,数字和"-","_",200个字符以内';}}}},
				{'field':'id','width':300,'formatter':function(row,rows,index){
					if(rows.state!=0){
	            		 var btn='<a class="btn btn-xs red" onclick="Resource.remove('+row+');" ><i class="fa fa-times"></i> 删除</a>';
	            		 return btn;
	            	} 
					return '';
				}}
			  ],
			  onEditableSave: function (field, row, oldValue, $el) {
				var data={'id':row.id,'alias':row.alias,'info':row.info};
				ajaxForm('/resource/update',data,function(flag){
				},true);
			 }
		});
	}
	var refreshTable=function(){
		var table=$('#resource_table');
		var url=table.attr('action');
		table.bootstrapTable('refresh');  
	}
	
	return {
		init:function(){
			var table=$('#resource_table');
			var url=table.attr('action');
			handleInit(table,url);
			$('button#search',$('#resource_search_form')).on('click',function(){
				var params = table.bootstrapTable('getOptions'); 
				table.bootstrapTable('refresh', params)  
			});
		},
		synchronize:function(){
			handleSynchronize();
		},
		edit : function(id) {
			$.ajax({
				url : "/resource/findone",
				data : {id : id},
				type : "GET",
				success : function(b) {
					if (isEmpty(b)) {
						swal("无法修改！", "数据异常,请刷新页面后再试!", "error");
						return;
					}
					var c = b.state;
					b["state_str"] = c == 0 ? "正常" : "禁用";
					var modal=$('#edit_resource');
					var form=$('form:first',modal);
					fullForm(b,form);
					modal.modal();
				},
				error : function(b, d, c) {
					swal("无法修改！", "数据异常,请刷新页面后再试!", "error")
				}
			})
		},
		remove : function(id) {
			var data=getToken();
	    	data['id']=id;
			remove('/resource/remove',data,function(){
				refreshTable();
			}); 
		}
	}
}();