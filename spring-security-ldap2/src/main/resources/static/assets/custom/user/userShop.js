var UserShop=function(){
	//获取页面Table
	return {
		init:function(){
			var field=regulation.getField();
			var modal=$('#payJoiningFeeModel',field);
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
		setPayJoiningFee:function(dmId,userType){
			var field=regulation.getField();
			var modal1=$('#payJoiningFeeModel',field);
			var form = $('#payJoiningFeeForm',modal1);
			regulation.fullForm({dmId:dmId,userType:userType,flag:'add',payJoiningFeeType:'merchant'},form);
			if(!isEmpty(dmId)){
				$.get('/finance/payJoiningFee/findone',{dmId:dmId},function(data,state){
					if (state == "success") {
						data['flag']='update';
						data['payJoiningFeeType']='merchant';
						regulation.fullForm(data,form);
					}
				},'JSON');
			}
			regulation.modal('',modal1);	
		}
	}
}();