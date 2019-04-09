var GoodsCategoryApply=function(){
	var handleTable=function(table){
		table.bootstrapTable({
			url:table.attr('action'),
			uniqueId: "dmId",   //每一行的唯一标识，一般为主键列
			sidePagination:'server',
			columns: [
			          {field:'goodsName'}, 
			          {field:'oneCategoryName'},
			          {field:'twoCategoryName'},
			          {field:'applyTime',formatter:function(row){return getFormatDateByLong(row,'yyyy-MM-dd hh:mm:ss');}},
			          {field:'applyId'},
			          {field:'telephone'},
			          {field:'applyReason'},
			          {field:'status',formatter:function(row){return row==1?'正常':row==2?'通过':'不通过'}},
			          {field:'auditTime',formatter:function(row){return getFormatDateByLong(row,'yyyy-MM-dd hh:mm:ss');}},
			          {field:'auditId'},
			          {field:'dmId',title:'操作',width:'300',formatter:function(row,rows,i){
			        	  var btn='<div data-id="'+row+'">';
			        	  if(rows.status==1){
			        		  btn+='<a  class="btn btn-xs btn-success" onclick="GoodsCategoryApply.auditing(this,2);"><i class="fa fa-smile-o"></i>通过</a>';
			  				  btn+='<a  class="btn btn-xs btn-danger" onclick="GoodsCategoryApply.auditing(this,3);"><i class="fa fa-meh-o"></i>不通过</a>';
			        	  }
			        	  btn=btn+'</div>';
			        	  return btn;
			          }}
			   ]
		});
	}
	var refreshTable=function(){
		var table=$('#goodsCategoryApply_table');
		var url=table.attr('action');
		table.bootstrapTable('refresh',{url:url});  
	}
	return {
		init:function(){
			var table=$('#goodsCategoryApply_table');
			handleTable(table);
		},
		auditing:function(id,state){
			var data={'id':id,'status':state};
			var str='确定要同意该请求吗?';
			if(state==3){
				str='确定要拒绝该请求吗?';
			}
			 swal({
		        title: "Are you sure?",
		        text: str,
		        type: "warning",
		        showCancelButton: true,
		        closeOnConfirm: false,
		        closeOnCancel: false,
		        cancelButtonText: '我再考虑一下',
		        confirmButtonText: "嗯,朕批了",
		        confirmButtonColor: "#ec6c62",
		        showLoaderOnConfirm: true,
		    }, function(isConfirm) {
		        if (!isConfirm) {
		            swal.close();
		            return;
		        }
		        $unit.submit({url:$unit.setUpUrl('/goodsCategoryApply/save'),data:$unit.setToken(data)}, function(opt,data,state){
		        	swal(opt.title,opt.message,opt.type);
		        	if(opt.type=='success'){
		        		$hmsh.table.refresh();
		        	}
		        });
		    });
		}
	}
}();