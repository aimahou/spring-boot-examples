var CustomMsg = function() {
	var validate = function(form) {
		jQuery.validator.addMethod("username", function(value, element) {
			return this.optional(element)
					|| /^[a-zA-Z][a-zA-Z0-9_-]{3,20}$/.test(value);
		}, $.validator.format('支持字母、数字、“-”“_”的组合，4-20个字符,且以字母开头'));
		var params = regulation.validateParams({
			rules : {
				username : {
					required : true,
					username : true,
					remote : {
						url : form.find('#username').attr('action'),
						type : "GET",
						dataType : "JSON",
						data : {
							'type' : 'username',
							'name' : function() {
								return $('#username').val();
							}
						},
						dataFilter : function(msg) {
							var data = JSON.parse(msg);
							var code = data.code;
							var flag = data.flag;
							return flag && code == '000';
						}
					}
				},
				password : {
					required : true,
					minlength : 4
				},
				repassword : {
					required : true,
					equalTo : '#password'
				}
			},
			messages : {
				username : {
					required : '请输入用户名.',
					username : '支持字母、数字、“-”“_”的组合，4-20个字符,且以字母开头',
					remote : '用户名已经存在'
				},
				password : {
					required : '请输入密码.',
					minlength : '最少要输入 {0} 个字符'
				},
				repassword : {
					required : '请确认密码',
					equalTo : '两次密码输入不一致'
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
			}
		},
		add : function() {
			Stencil.modal();
		},
		save:function(){
			
		}
	}

}();
