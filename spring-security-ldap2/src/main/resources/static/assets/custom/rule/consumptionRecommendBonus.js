var ConsumptionRecommendBonus=function(){
	var validate=function(){
		return $('#modal form').validate({
			rules: {
				name:{
					required:true
				},
				key:{
					required:true
				},
				memberBonusRatio:{
					required:true,
					money:true,
					range:[0,100]
				},
				partnerBonusRatio:{
					required:true,
					money:true,
					range:[0,100]
				},
				agentBonusRatio:{
					required:true,
					money:true,
					range:[0,100]
				},
				memberBonusSeries:{
					required:true,
					integer:true,
					range:[-1,9999]
				},
				partnerBonusSeries:{
					required:true,
					integer:true,
					range:[-2,9999]
				},
				agentBonusSeries:{
					required:true,
					integer:true,
					range:[-2,9999]
				}
			},
			messages:{
				name:{
					required:'请输入消费分红规则名称。'
				},
				key:{
					required:'请选择规则类型。'
				},
				memberBonusRatio:{
					required:'请输入普通会员分红比例',
					money:'请输入有效的数字',
					range:'请输入范围在 {0} 到 {1} 之间的数值'
				},
				partnerBonusRatio:{
					required:'请输入合伙人分红比例',
					money:'请输入有效的数字',
					range:'请输入范围在 {0} 到 {1} 之间的数值'
				},
				agentBonusRatio:{
					required:'请输入代理分红比例',
					money:'请输入有效的数字',
					range:'请输入范围在 {0} 到 {1} 之间的数值'
				},
				memberBonusSeries:{
					required:'请输入普通会员分级数',
					integer:'只能输入整数',
					range:'请输入范围在 {0} 到 {1} 之间的数值'
				},
				partnerBonusSeries:{
					required:'请输入合伙人分级数',
					integer:'只能输入整数',
					range:'请输入范围在 {0} 到 {1} 之间的数值'
				},
				agentBonusSeries:{
					required:'请输入代理分级数',
					integer:'只能输入整数',
					range:'请输入范围在 {0} 到 {1} 之间的数值'
				}
			}
		});
	}
	
	
	return {
		init:function(){
			var validator=validate();
			//重置表单
			$('#modal').on('hide.bs.modal',function(){
				validator.resetForm();
			}); 
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
		},
		
	}
}();