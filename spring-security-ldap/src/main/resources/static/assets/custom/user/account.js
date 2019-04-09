var Account=function(){
	var oTable;
	
	var buttons=function(){
		return [ {
			className : 'btn blue btn-outline',
			text : '添加帐号','action':function( e, dt, node, config){
				if(e.type=='click'){
					$('#add_account').modal({
						keyboard: false,
						backdrop:'static'
					});
					
				}
			}
		}, {
			extend : 'print',
			className : 'btn dark btn-outline',
			text : '打印'
		}, {
			extend : 'pdf',
			className : 'btn green btn-outline'
		}, {
			extend : 'csv',
			className : 'btn purple btn-outline '
		} ];
	}
	
	var getColums=function(){
		return [
		         CONSTANT.DATA_TABLES.COLUMN.CHECKBOX,
		         {data: "id", bSortable: false,visible:false,searchable:false},
	             {title:'帐号',bSortable:false,data:'username'},
	             {title:'头像',bSortable:false,searchable:false,data:function(row,type,set){
	            	 if(Common.isEmpty(row.userInfo)||Common.isEmpty(row.userInfo.headimage)){
	            		 return '';
	            	 }
	            	 return row.userInfo.headimage;
	             }},
	             {title:'姓名',bSortable:false,className:'',searchable:false,data:function(row,type,set){
	            	 if(Common.isEmpty(row.userInfo)||Common.isEmpty(row.userInfo.name)){
	            		 return '';
	            	 }
	            	 return row.userInfo.name;
	             }},
	             {title:'昵称',bSortable:false,data:function(row,type,set){
	            	 if(Common.isEmpty(row.userInfo)||Common.isEmpty(row.userInfo.nickname)){
	            		 return '';
	            	 }
	            	 return row.userInfo.nickname;
	             }},
	             {title:'性别',bSortable:false,data:function(row,type,set){
	            	 if(Common.isEmpty(row.userInfo)||Common.isEmpty(row.userInfo.sex)){
	            		 return '<i class="fa fa-question"></i>保密';
	            	 }
	            	 return row.userInfo.sex==0?'<i class="fa fa-female"><i>女':'<i class="fa fa-male"></i>男';
	             }},
	             {title:'部门',bSortable:false,data:function(row,type,set){
	            	 if(Common.isEmpty(row.job)||Common.isEmpty(row.job.dept)||Common.isEmpty(row.job.dept.title)){
	            		 return '';
	            	 }
	            	 return row.job.dept.title;
	             }},
	             {title:'职位',bSortable:false,data:function(row,type,set){
	            	 if(Common.isEmpty(row.job)||Common.isEmpty(row.job.title)){
	            		 return '';
	            	 }
	            	 return row.job.title;
	             }},
	             {title:'身份证',bSortable:false,data:function(row,type,set){
	            	 if(Common.isEmpty(row.cardNo)){
	            		 return '';
	            	 }
	            	 return row.cardNo;
	             }},
	             {title:'状态',bSortable:false,data:function(row,type,set){
	            	 return row.state==0?'<span class="label label-sm label-success">正常</span>':row.state==1?'<span class="label label-sm label-warning">限制登录</span>':'<span class="label label-sm label-danger">删除</span>';
	             }},
	             {title:'帐号类型',bSortable:false,data:function(row,type,set){
	            	 return row.type==0?'<span class="label label-sm label-success">员工帐号</span>':row.type==1?'<span class="label label-sm label-primary">管理员帐号</span>':'<span class="label label-sm label-warning">测试帐号</span>';
	             }},
	             {title:'注册时间',data:function(row,type,set){
	            	 if(Common.isEmpty(row.createTime)){
	            		 return '';
	            	 }
	            	 return row.createTime;
	             }},
	             {title:'备注',bSortable:false,data:function(row,type,set){
	            	 if(!Common.isEmpty(row.info)){
	            		 return row.info;
	            	 }
	            	 return '';
	             }}    
	            ];
	}
	var initRoleTable=function(){
		var table=$('#account_table');
		if(typeof(oTable)!='undefined'){
			oTable.destroy();
			table.empty();
		}
		//查询参数列表:
		var params=Common.table({
			columns:getColums(),
			serverSide:true,
			processing:true,
			buttons:buttons(),
			ajax:$.fn.dataTable.pipeline({url:table.attr('action'),pages:'20'}),
		});
		oTable = table.dataTable(params);	
	}
	
	var handleDatePickers=function(){
		if (jQuery().datepicker) {
			$('#hiredate').datepicker('destroy');
            $('#hiredate').datepicker({
            	maxDate:'+2d',
                rtl: App.isRTL(),
                orientation: "left",
                autoclose: true,
                defaultDate:'+1'
            });
            //$('body').removeClass("modal-open"); // fix bug when inline picker is used in modal
        }
		$(document).scroll(function(){
            $('#add_account .date-picker').datepicker('place'); //#modal is the id of the modal
        });
	}
	
	var validate=function(form){
		jQuery.validator.addMethod("username",function(value,element){
            return this.optional(element) || /^[a-zA-Z0-9_-]{4,20}$/.test(value);  
           },$.validator.format('支持字母、数字、“-”“_”的组合，4-20个字符')
         );
		var params=Common.validate({
			 rules: {
				 username: {
                    required: true,
                    username:true,
                    remote: {
                    	url: form.find('#username').attr('action'),
                    	type: "GET",
	                    dataType: "JSON",
	                    data: {'type':'username','name':function(){return $('#username').val();}},
	                    dataFilter:function(msg){
	                    	var data=JSON.parse(msg);
	                    	var code=data.code;
	                    	var flag=data.flag;
	                    	return flag&&code=='000';
	                    }
                    }
                },
                password: {
                    required: true,
                    minlength:4
                },
                repassword:{
                	 required: true,
                	 equalTo:'#password'
                }
			 },
			 messages:{
				username: {
	                required: '请输入用户名.',
	                username:'支持字母、数字、“-”“_”的组合，4-20个字符',
	                remote:'用户名已经存在'
                },
                password: {
                    required: '请输入密码.',
                    minlength:'最少要输入 {0} 个字符'
                },
                repassword:{
                	required:'请确认密码',
                	equalTo:'两次密码输入不一致'
                }
			 }
		});
		form.validate(params);
	}
	var refresh=function(){
		initRoleTable();  
	}
	
	return {
		init:function(){
			initRoleTable();
			$("#add_account").on("hidden.bs.modal", function() {
				Common.empty($('#account_form'));
			});	
			handleDatePickers();
			validate($('#account_form'));
		},
		search:function(){
			var oTable=table.dataTable();
			if(oTable){
				oTable.fnDestroy();
			}
			initRoleTable();
		},
		save:function(e){
			var form=$('#account_form');
			var validate=form.validate().form();
			if(!validate){
				return;
			}
			$.ajax({
				url:form.attr('action'),
				data:form.serialize(),
				dataType:'JSON',
				type:form.attr('method'),
				success:function(msg){
					//添加完毕
					$('#add_account').modal('hide');
					var type=msg.flag?'success':'error';
					//注册成功
					var v={message:msg.message,type:type};
					Common.tips(v);
					refresh();
				}
			});
		}
	}
}();
jQuery(document).ready(function() {
	Account.init();
});

/*var cacheFlag=false;
var Account=function(){
	
	var bootstrapTableData=function(){
		var params={
			url:$('#account_table').attr('action'),
			method:'GET',
			striped:true,//是否显示行间隔色
			cache: cacheFlag,//是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性
			pagination:true, //是否显示分页
			sortable: false,//是否启用排序
			sortOrder: "desc",//排序方式
			sidePagination:'server',//分页方式：client客户端分页，server服务端分页
			pageNumber:1,//初始化加载第一页，默认第一页
			pageSize: 10,//每页的记录行数
			pageList: [10,20, 50, 100],//可供选择的每页的行数
			clickToSelect: true,  //是否启用点击选中行
			strictSearch: true,
			uniqueId: "id",   //每一行的唯一标识，一般为主键列
			cardView: false,   //是否显示详细视图
			detailView: false,   //是否显示父子表
			search:false,//是否显示表格搜索
			showRefresh:false,//是否显示刷新按钮
			showToggle:false,//是否显示详细视图和列表视图
			//设置为undefined可以获取pageNumber，pageSize，searchText，sortName，sortOrder  
            //设置为limit可以获取limit, offset, search, sort, order  
            queryParamsType : "undefined", 
            responseHandler:function(res){
            	console.log(res);
            	return res;
            },
            queryParams: function queryParams(params) { //设置查询参数 
            	var p={
            		pageIndex:params.pageNumber,
                	pageSize: params.pageSize
            	}
            	return p;
            },
			columns: [
		      {field:'',checkbox:true},    
	          {field:'username',title:'帐号'},
	          {field:'userInfo.headimage',title:'头像',formatter: function(e){return e;}}, 
	          {field:'userInfo.name',title:'姓名'},
	          {field:'userInfo.nickname',title:'昵称'},
	          {field:'userInfo.sex',title:'性别',formatter: function(e){return e==0?'<i class="fa fa-female"><i>女':e==1?'<i class="fa fa-male"></i>男':'<i class="fa fa-question"></i>保密';}},
	          {field:'job.dept.title',title:'部门'},
	          {field:'job.title',title:'职位'},
	          {field:'cardNo',title:'身份证'},
	          {field:'state',title:'状态',formatter: function(e){return e==0?'<span class="label label-sm label-success">正常</span>':e==1?'<span class="label label-sm label-warning">限制登录</span>':'<span class="label label-sm label-danger">删除</span>';}},
	          {field:'type',title:'帐号类型',formatter: function(e){return e==0?'<span class="label label-sm label-success">员工帐号</span>':e==1?'<span class="label label-primary">管理员帐号</span>':'<span class="label label-warning">测试帐号</span>';}},
	          {field:'createTime',title:'注册时间',formatter: function(e){return e;}},
	          {field:'',title:'操作',formatter: function(e,row,i){
	        	  
	        	  return '';
	          }}
		   ]	
		}
		$('#account_table').bootstrapTable(params);	
	}
	var handleDatePickers=function(){
		if (jQuery().datepicker) {
            $('.date-picker').datepicker({
                rtl: App.isRTL(),
                orientation: "left",
                autoclose: true
            });
            //$('body').removeClass("modal-open"); // fix bug when inline picker is used in modal
        }
		$( document ).scroll(function(){
            $('#add_account .date-picker').datepicker('place'); //#modal is the id of the modal
        });
	}
	//打开modal
	var openModal=function(){
		$('#add_account').modal({
			keyboard: false,
			backdrop:'static'
		});
	}
	var emptyForm=function(){
		//清空数据
		$('#account_form input.form-control').val('');
		$('#account_form select').val(null).trigger("change");
	}
	var tips=function(type,title,msaage){
		toastr[type](msaage, title);
		toastr.options = {
		  "closeButton": true,
		  "debug": false,
		  "positionClass": "toast-top-right",
		  "onclick": null,
		  "showDuration": "1000",
		  "hideDuration": "1000",
		  "timeOut": "5000",
		  "extendedTimeOut": "1000",
		  "showEasing": "swing",
		  "hideEasing": "linear",
		  "showMethod": "fadeIn",
		  "hideMethod": "fadeOut"
		}
	}
	//绑定按钮事件
	var btnBind=function(){
		$('#addBtn').bind('click',function(){
			emptyForm();
			openModal();
		});
		
		$('#submitBtn').bind('click',function(){
			if($('#account_form').validate().form()){
				$.ajax({
					url:$('#account_form').attr('action'),
					data:$('#account_form').serialize(),
					dataType:'JSON',
					type:$('#account_form').attr('method'),
					success:function(msg){
						//添加完毕
						$('#add_account').modal('hide');
						emptyForm();
						var type=msg.flag?'success':'error';
						//注册成功
						tips(type,'操作提示',msg.message);
						$('#account_table').bootstrapTable('refresh', {url: $('#account_table').attr('action')});
						
					}
				});
			}
		});
	}
	//验证字段
	var validate=function(){
		jQuery.validator.addMethod("username",function(value,element){
            return this.optional(element) || /^[a-zA-Z0-9_-]{4,20}$/.test(value);  
           },$.validator.format('支持字母、数字、“-”“_”的组合，4-20个字符')
         );
		
		$('#account_form').validate({
			errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            rules: {
                username: {
                    required: true,
                    username:true,
                    remote: {
                    	url: $('#username').attr('action'),
                    	type: "GET",
	                    dataType: "JSON",
	                    data: {'type':'username','name':function(){return $('#username').val();}},
	                    dataFilter:function(msg){
	                    	var data=JSON.parse(msg);
	                    	var code=data.code;
	                    	var flag=data.flag;
	                    	return flag&&code=='000';
	                    }
                    }
                },
                password: {
                    required: true,
                    minlength:4
                },
                repassword:{
                	 required: true,
                	 equalTo:'#password'
                }
            },
            messages: {
                username: {
                    required: '请输入用户名.',
                    username:'支持字母、数字、“-”“_”的组合，4-20个字符',
                    remote:'用户名已经存在'
                },
                password: {
                    required: '请输入密码.',
                    minlength:'最少要输入 {0} 个字符'
                },
                repassword:{
                	required:'请确认密码',
                	equalTo:'两次密码输入不一致'
                }
            },
            invalidHandler: function (event, validator) { //display error alert on form submit   
                $('.alert-danger', $('.login-form')).show();
            },
            highlight: function (element) { // hightlight error inputs
                $(element)
                    .closest('.form-group').addClass('has-error'); // set error class to the control group
            },
            success: function (label) {
                label.closest('.form-group').removeClass('has-error');
                label.remove();
            },
			errorPlacement: function (error, element) {
				 error.insertAfter(element.closest('.input-icon'));
			}
		});		
	}
	
	return{
		init:function(){
			bootstrapTableData();
			handleDatePickers();
			btnBind();
			validate();
		}
	}
}();

jQuery(document).ready(function() {
	Account.init();
});*/