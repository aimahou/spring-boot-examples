var Dictionaries=function(){
	var validate=function(form){
		var params=regulation.validateParams({
			rules: {
				value:{
            		required: true,	
            	},
            	label:{
            		required: true,		
            	},
            	type:{
            		required: true,
            		rangelength:[1,20],
            	},
            	sequence:{
            		digits:true,
            		range:[0,9999999]
            	}
            },
            messages: {
            	label:{
            		required:'这是必填字段',
            	},
            	value:{
            		required:'这是必填字段',
            	},
            	type:{
            		required:'这是必填字段',
            		rangelength:'请输入长度在 {0} 到 {1} 之间的字符串',
            	},
            	sequence:{
            		digits:'必须输入整数',
            		range:'输入值必须介于 {0} 和 {1} 之间'
            	}
            }
		});
		form.validate(params);
	}
	
	return {
		edit:function(id){
			$.get('/system/dictionaries/findone',{id:id},function(data,state){
				if (state == "success") {
					regulation.fullForm(data);
					regulation.modal();
				}
			},'JSON');
		},
		remove:function(id,name,token){
			var data={'id':id};
	    	data[name]=token;
	    	var opt={url:'/system/dictionaries/remove',type:'POST',data:data};
			regulation.remove(opt); 	
		},
		init:function(){
			var form=regulation.getField('form');
			if(isForm(form)){
				validate(form);
			}
		},
		search:function(val){
			var search=regulation.getField('search');
			$('#type',search).val(val).trigger('change');
			regulation.search();
		},
		add:function(type){
			var form=regulation.getField('form');
			$('#type',form).val(type);
			regulation.modal();			
		}
	}
}();