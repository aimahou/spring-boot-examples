var Account=function(){
	var validate=function(form){	
		form.validate({rules: {
			 username: {
                 required: true,
                 username:true,
                 remote: {
                 	url:'/account/check',
                 	type: "GET",
	                    dataType: "JSON",
	                    data: {'type':'username','name':function(){return $('#username').val();}}, 
                 }
             },
             password: {
                 required: true,
                 minlength:4
             },
             repassword:{
             	 required: true,
             	 equalTo:'#password'
             },
				type : {
					required : true,
				}
			 },
			 messages:{
				username: {
	                required: '请输入用户名.',
	                username:'支持字母、数字、“-”“_”的组合，4-20个字符,且以字母开头',
	                remote:'用户名已经存在'
             },
             password: {
                 required: '请输入密码.',
                 minlength:'最少要输入 {0} 个字符'
             },
             repassword:{
             	required:'请确认密码',
             	equalTo:'两次密码输入不一致'
             },
				type : {
					required : '请选择账号类型'
				}
			 }});
	}
	return {
		init:function(){			
			validate($('#add_form'));
		},
		toCardNo:function(data,rows,index){
			return !$unit.isEmpty(rows.userInfo)&&!$unit.isEmpty(rows.userInfo.cardNo)?rows.userInfo.cardNo:'';
		},
		toNickname:function(data,rows,index){
			return !$unit.isEmpty(rows.userInfo)&&!$unit.isEmpty(rows.userInfo.nickname)?rows.userInfo.nickname:'';
		},
		toBtn:function(data,rows,index){
		  var btn='';
       	  btn=btn+'<a class="btn btn-xs red" onclick="Account.remove('+data+');"><i class="fa fa-times"></i> 设置权限</a>';
       	  if(rows.type==0){
       		  btn=btn+'<a class="btn btn-xs red" onclick="Account.remove('+data+');"><i class="fa fa-times"></i> 删除</a>';
       	  }
       	  return btn;
		},
		edit:function(id){
			var table=$hmsh.bootstrapTable();
			$unit.open($('#account_add'),table.getData(id));
		}
	}
}();