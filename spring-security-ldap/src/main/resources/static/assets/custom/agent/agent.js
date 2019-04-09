var Agent=function(){
	//获取页面Table
	return {
		init:function(){
			var field=regulation.getField();
			var modal=$('#payJoiningFeeAgentModel',field);
			$('#earnestMoney',modal).TouchSpin({
				min: 0,
	            max: 999999999,
	            step: 100,
	            decimals: 2,
	            forcestepdivisibility:'none',
	            boostat: 5,
	            maxboostedstep: 10,
	            prefix: '&yen;'
			});
		},
		setPayJoiningFee:function(dmId){
			var field=regulation.getField();
			var modal1=$('#payJoiningFeeAgentModel',field);
			var form = $('#payJoiningFeeAgentForm',modal1);
			regulation.fullForm({dmId:dmId,userType:3,flag:'add',payJoiningFeeType:'agent'},form);
			if(!isEmpty(dmId)){
				$.get('/finance/payJoiningFee/findone',{dmId:dmId},function(data,state){
					if (state == "success") {
						data['flag']='update';
						data['payJoiningFeeType']='agent';
						regulation.fullForm(data,form);
					}
				},'JSON');
			}
			regulation.modal('',modal1);
		},
		add:function(e){
			var field=regulation.getField();
			var modal=$(e,field);
			if(isEmpty(modal)){
				modal=$('#AgentModel',field);
			}
			regulation.modal('',modal);
		}
	}
}();