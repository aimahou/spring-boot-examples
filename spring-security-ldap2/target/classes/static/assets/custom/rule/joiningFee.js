var JoiningFee=function(){
	var handleInit=function(){
		$('#joiningFee_table').bootstrapTable({
			columns:[
			         {field:'name'},
			         {field:'key',formatter:function(row){
			        	 return Select2.getText('joiningFee_key',row);
			         }},
			         {field:'fullCost',formatter:function(row){
			        	 return "&yen; "+(isEmpty(row)?'0':row);
			         }},
			         {field:'earnestMoney',formatter:function(row){
			        	return "&yen; "+(isEmpty(row)?'0':row);
			         }},
			         {field:'deductionRatio',formatter:function(row){
			        	 return (isEmpty(row)?'0':row)+' %'; 
			         }},
			         {field:'state',formatter:function(row){
			        	 return isEmpty(row)||row==0?'正常':'禁用';
			         }},
			         {field:'dmId',width:270,formatter:function(row,rows,index){
			        	var btn='<a class="btn btn-xs grey-cascade" onclick="JoiningFee.edit('+row+')">修改<i class="fa fa-edit"></i></a>';
			        	//启用/禁用
			        	if(rows.state==1){
			        		btn+='<a class="btn btn-xs red" onclick="JoiningFee.updateState('+row+');">启用<i class="fa fa-delete"></i></a>';
			        	}
						return btn;
			         }}
			         ]
		});
	}	
	var validate=function(){
		return $('#modal form').validate({
			rules: {
				name:{
					required:true
				},
				key:{
					required:true
				},
				fullCost:{
					required:true,
					money:true,
					range:[0,99999999]
				},
				earnestMoney:{
					required:true,
					money:true,
					range:[0,99999999]
				},
				deductionRatio:{
					required:true,
					money:true,
					range:[0,100]
				}
			},
			messages:{
				name:{
					required:'请输入消费分红规则名称。'
				},
				key:{
					required:'请选择规则类型。'
				},
				fullCost:{
					required:'请输入全额费用',
					money:'请输入有效的数字',
					range:'请输入范围在 {0} 到 {1} 之间的数值'
				},
				earnestMoney:{
					required:'请输入诚意金',
					money:'请输入有效的数字',
					range:'请输入范围在 {0} 到 {1} 之间的数值'
				},
				deductionRatio:{
					required:'请输入收益扣除比例',
					money:'请输入有效的数字',
					range:'请输入范围在 {0} 到 {1} 之间的数值'
				},
				memberBonusSeries:{
					required:'请输入普通会员分级数',
					integer:'只能输入整数',
					range:'请输入范围在 {0} 到 {1} 之间的数值'
				}				
			}
		});
	}
	var refreshTable=function(){
		$('#joiningFee_table').bootstrapTable('refresh'); 
	}
	return {
		init:function(){
			handleInit();
			var validator=validate();
			//重置表单
			$('#modal').on('hide.bs.modal',function(){
				validator.resetForm();
			}); 
		},
		search:function(){
			refreshTable();
		},
		edit:function(id){
			var modal=$('#modal');
			var url=modal.data('findone-url');
			var jqxhr=$.get(url,{id:id});
			jqxhr.error(function(){
				swal('OMG','获取规则类型失败','error');
			});
			jqxhr.success(function(data){
				fullForm(data,$('form',modal));
				modal.modal();				
			})
		},
		updateState:function(id){
			var modal=$('#modal');
			var url=modal.data('updatestate-url');
			var data=getToken();
			data['id']=id;
			swal({
				title: "Are you sure?",  
		        text: "确定要启用这条规则吗！",  
		        type: "warning", 
		        showCancelButton: true, 
		        closeOnConfirm: false, 
		        closeOnCancel:false,
		        cancelButtonText:'我再考虑一下',
		        confirmButtonText: "是的，我要启用", 
		        confirmButtonColor: "#ec6c62",
		        showLoaderOnConfirm:true,
			  },function(isConfirm){
				  if(!isConfirm){
					  swal("取消", "感谢您的高抬贵手 :)", "error");
					  return;
				  }
				 var jqxhr=$.post(url,data);
				 jqxhr.error(function(){
					swal('OMG','修改状态失败','error');
				 });
				 jqxhr.success(function(data){
					var flag=data.flag;
					var type=flag?'success':'error';
					var message=flag?data.message:data.errorMsg;
					 refreshTable();
					 swal("操作提示", message,type);  			
				});
			  });
			
		},
		add:function(){
			//读取规则类型,从系统字典里面读取 把select2迁入到系统字典里面去
			$('#modal').modal();			
		},
		save:function(){
			var modal=$('#modal');
			var form=$('form:first');
			  if(!form.validate().form()){
				  return;
			  }
			  var url=form.attr('action'),data=form.serialize(),type=isEmpty(form.attr('method'))?'GET':form.attr('method');
			  $.ajax({
				 url:url,
				 type:type,
				 dataType:'JSON',
				 data:data,
				 complete:function(XMLHttpRequest, textStatus){
					 var state=XMLHttpRequest.status;
					  if(state=='200'){
					  	var result=eval('('+XMLHttpRequest.responseText+')');
					  	var flag=result.flag;
					  	var type='success';
					  	if(!flag){
					  		type='error';
					  	}
					  	refreshTable();
						modal.modal('hide');
					  	swal("操作提示", result.message,type);
					  }
				 }
			  });
		}
	}
}();