var GoodsSpecproperty = function() {
	var validate = function(form) {
		
		
		
	}
	return {
		init : function() {
			var form = regulation.getField('form');
			if (isForm(form)) {
				validate(form);
			}
		},
		edit:function(dmid){
			$.get('/goods/goodsSpecproperty/findone',{id:dmid},function(data,state){
				if (state == "success") {
					regulation.fullForm(data);
					regulation.modal();
				}
			},'JSON');
		},
		remove:function(id,name,token){
			var data={'id':id};
	    	data[name]=token;
	    	var opt={url:'/goods/goodsSpecproperty/remove',type:'POST',data:data};
	    	regulation.remove(opt);
		}
	}

}();
