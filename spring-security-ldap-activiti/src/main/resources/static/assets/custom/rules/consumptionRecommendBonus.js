var ConsumptionRecommendBonus = function() {
	var validate=function(form){
		var params=regulation.validateParams({
			rules: {
				name:{
					required:true
				},
				key:{
					required:true
				},
				memberBonusRatio:{
					required:true
				},
				partnerBonusRatio:{
					required:true
				},
				agentBonusRatio:{
					required:true
				},
				memberBonusSeries:{
					required:true
				},
				partnerBonusSeries:{
					required:true
				},
				agentBonusSeries:{
					required:true
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
					required:'请输入该字段'
				},
				partnerBonusRatio:{
					required:'请输入该字段'
				},
				agentBonusRatio:{
					required:'请输入该字段'
				},
				memberBonusSeries:{
					required:'请输入该字段'
				},
				partnerBonusSeries:{
					required:'请输入该字段'
				},
				agentBonusSeries:{
					required:'请输入该字段'
				}
			}
		});
		form.validate(params);
	}
	return {
		init : function() {
			var form = regulation.getField('form');
			if (isForm(form)) {
				validate(form);
				$("#memberBonusRatio,#partnerBonusRatio,#agentBonusRatio",form).TouchSpin({
		            min: 0,
		            max: 100,
		            step: 0.1,
		            decimals: 2,
		            boostat: 5,
		            maxboostedstep: 10,
		            postfix: '%'
		        });
				$('#memberBonusSeries',form).TouchSpin({
					min: -1,
		            max: 100000,
		           // stepinterval: 50,
		            maxboostedstep: 10000000,
		            prefix: '<i class="fa fa-angle-double-right"></i>'
				});
				$('#partnerBonusSeries,#agentBonusSeries',form).TouchSpin({
					min: -2,
		            max: 100000,
		            //stepinterval: 50,
		           // maxboostedstep: 10000000,
		            prefix: '<i class="fa fa-angle-double-right"></i>'
				})
			}
		},
		edit:function(dmid){
			$.get('/rule/consumptionRecommendBonus/findone',{id:dmid},function(data,state){
				if (state == "success") {
					regulation.fullForm(data);
					regulation.modal();
				}
			},'JSON');
		},
		remove:function(id,name,token){
			var data={'id':id};
	    	data[name]=token;
	    	var opt={url:'/rule/consumptionRecommendBonus/remove',type:'POST',data:data};
			regulation.remove(opt);
		}	
	}

}();
