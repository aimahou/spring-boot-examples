/**
 * 规则管理JS 模版 
 * 按钮只能点击一次
 */
var TemplateRule=function(){
	//默认参数
	var NEW_DEFAULTS={
		table:'#table',
		modal:'#modal',
		title:'广告管理',
	}
	
	
	var DEFAULTS={
		key:'joiningFee_key',
		table:'#table',
		modal:'#modal',
		name:'规则类型',
		
	}
	//全局变量
	var opt;
	//验证对象
	var validator;
	
	var KEY={
		'joining_fee':'joiningFee_key'	
	}
	//初始化参数
	var handleOptions=function(options){
		opt=$.extend(DEFAULTS,options);
		return opt;
	}
	//表格初始化
	var handleTable=function(){
		if(isEmpty(opt)||!$(opt.table).is('table')){
			return null;
		}
		return $(opt.table).bootstrapTable();
	}
	//初始化表单验证
	var handleValidate=function(){
		var form=getForm();
		if(!isEmpty(form)){
			validator=form.validate();	
		}
	}
	
	//刷新表格
	var refreshTable=function(){
		if(isEmpty(opt)||!$(opt.table).is('table')){
			return;
		}
		var params = $(opt.table).bootstrapTable('getOptions'); 
		$(opt.table).bootstrapTable('refresh', params);
	}
	//modal 事件监听
	var handleModal=function(){
		var modal=getModal();
		if(isEmpty(modal)){
			return;
		}
		//监听模态框隐藏事件做一些动作
		modal.on('hidden.bs.modal',function(){
			//重置表单
			removeFormData();
			//重置验证
			if(!isEmpty(validator)){
				validator.resetForm();
				$('.form-group',modal).removeClass('has-error');
			}
			var l=$(this).data('ladda');
			if(!isEmpty(l)){
				l.stop();
				$(this).removeData('ladda');
			}
		});
	}
	//获取Token name值
	var getTokenName=function(){
		var token=getToken();
		var name='';
		for(t in token){
			name=t;
			break;
		}
		return name;
	}
	//刪除form数据
	var removeFormData=function(form){
		form = form || getForm();
		if(isEmpty(form)){
			return;
		}
		var tokenName=getTokenName();		
		$('input,select,textarea',form).each(function(){
			var th=$(this);
			var name=th.attr('name');
			if(tokenName==name){
				return true;
			}
			th.val('');
			if(th.is('select')){
				th.trigger('change');
			}
		});
	}
	//获取key
	var getKey=function(){
		var key='joiningFee_key';
		if(!isEmpty(opt) && !isEmpty(opt.key)){
			key=opt.key;
		}
		return key;
	}
	//获取modal
	var getModal=function(){
		var modal;
		if(!isEmpty(opt) && $(opt.modal).length>0 && $(opt.modal).hasClass('modal')){
			modal=$(opt.modal);
		}
		return modal;
	}
	//获取Form表单
	var getForm=function(){
		var form;
		var modal=getModal();
		if(!isEmpty(modal)){
			form=$('form',modal);
		}
		return form;
	}
	//获取当前名称
	var getName=function(){
		if(!isEmpty(opt)&&!isEmpty(opt.name)){
			return opt.name;
		}
		return '规则类型1';
	}	
	//填充Form表单
	var fullForm=function(data){
		var form=getForm();
		if(isEmpty(form)){
			return ;
		}
		var tokenName=getTokenName();
		$('input,select,textarea',form).each(function(){
			var th=$(this);
			var name=th.attr('name');
			var id=th.attr('id');
			if(tokenName==name){
				return true;
			}
			for(a in data){
				if(a==name || a==id){
					th.val(data[a]);
					if(th.is('select')){
						th.trigger("change");
					}
					break;
				}
			}
		});
	}
	//修改
	var handleEdit=function(id,e){
		var name=getName();
		var modal=getModal();
		if(isEmpty(modal)){
			return;
		}
		var url=modal.data('findone-url');
		if(isEmpty(url)){
			swal('OMG','获取'+name+'模版 findone URL失败!','error');
			return;
		}
		$('.ladda-spinner',$(e)).remove();
		var l = Ladda.create(e).start();
		
		var jqxhr=$.get(url,{id:id},function(){
		}).done(function(){
		}).fail(function(){
		}).always(function(data,state){
			if(state!='success'){
				swal('OMG','获取'+name+'信息失败!','error');
				return;
			}
			fullForm(data);
			modal.modal();
			modal.data('ladda',l);
		});	
	}
	//更改状态
	var handleUpdateState=function(e,id){
		var name=getName();
		var modal=getModal();
		if(isEmpty(modal)){
			return;
		}
		var url=modal.data('updatestate-url');
		if(isEmpty(url)){
			swal('OMG','获取'+name+'模版修改状态URL失败!','error');
			return;
		}
		var data=getToken();
		data['id']=id;
		$('.ladda-spinner',$(e)).remove();
		var l = Ladda.create(e).start();
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
				  l.stop();
				  return;
			  }
			 var jqxhr=$.post(url,data).always(function(data,state){
				 if(state!='success'){
					swal('OMG','修改状态失败!','error');
					l.stop();
					return;
				 }
				 var flag=data.flag;
				 var type=flag?'success':'error';
				 var message=flag?data.message:data.errorMsg;
				 swal("操作提示", message,type);
				 if(flag){
					 refreshTable();
				 }
				 l.stop();
			 });
		  });
	}
	//提交Form表单
	var handleFormSubmit=function(){
		var modal=getModal();
		if(isEmpty(modal)){
			swal('OMG','模版配置错误,找不到Modal模块,无法提交','error');
			return;
		}
		var form=getForm();
		if(isEmpty(form)){
			swal('OMG','模版配置错误,找不到Form表单,无法提交','error');
			return;
		}
		if(!form.validate().form()){
		  return;
		}
		var url=form.attr('action'),data=form.serialize(),type=isEmpty(form.attr('method'))?'GET':form.attr('method');
		$.post(url,data).always(function(data,state){
			var message='操作出错啦....',type='error',title='OMG!';
			if(state == 'success'){
				var flag=data.flag;
				if(!flag){
					message= data.errorMsg || data.message;
				}else{
					message=data.message;
					type='success',title='操作提示';
					refreshTable();
				}
			}
			modal.modal('hide');
			swal(title,message,type);
		});
	}
	
	return {
		toImage:function(row,rows){
			var title=isEmpty(rows.title)?'展示图片':rows.title;
			return isEmpty(row)?'':'<img alt="'+title+'" src="'+row+'" style="width:70px;height:84px;vertical-align:middle;"/>'
		},
		//百分比
		toFormatPercentage:function(row){
			return (isEmpty(row)?'0':row)+' %'; 
		},
		//金额
		toFormatMoney:function(row){
			return "&yen; "+(isEmpty(row)?'0':row);
		},
		//等级
		toFormatLevel:function(row){
			 return (isEmpty(row)?'0':(row=='-1')?'无限':row)+' 级';
		},
		toFormatMonth:function(row){
			return  (isEmpty(row)?'0':row)+" 月";
		},
		//积分
		toFormatIntegral:function(row){
			return (isEmpty(row)?'0':row)+" 积分"; 
		},
		//日期
		toDate:function(row){
			return LongToDateStr(row,'yyyy-MM-dd');
		},
		//时间
		toTime:function(row){
			return LongToDateStr(row,'yyyy-MM-dd HH:mm:ss');
		},
		
		//状态
		toState:function(row){
			 return !isEmpty(row)&&row==0?'启用':'禁用';
		},
		//按钮
		toBtn:function(row,rows,index){
			var key=getKey();
			var btn='<a class="btn btn-xs grey-cascade ladda-button" onclick="TemplateRule.edit(this,'+rows.dmId+')" data-style="expand-right" data-size="xs">修改 <i class="fa fa-edit"></i></a>';
			if(key=='joiningFee_key'|| key=='consumptionRecommendBonus_key'){
				var state=rows.state;
				if(!(!isEmpty(state)&&state==0)){
					btn+='<a class="btn btn-xs blue-dark ladda-button" onclick="TemplateRule.updateState(this,'+row+');" data-style="expand-right" data-size="xs">启用 <i class="fa fa-check-square-o"></i></a>';
				}
			}
			return btn;
		},
		//下拉框转换
		toSelectText:function(row){
			var key=getKey();
			return Select2.getText(key,row);;
		},
		//初始化
		init:function(option){
			handleOptions(option);
			handleTable();
			handleModal();
			handleValidate();
			
		},
		add:function(e){
			var modal=getModal();
			if(isEmpty(modal)){
				return;
			}
			if(!isEmpty(e)){
				$('.ladda-spinner',$(e)).remove();
				var l = Ladda.create(e).start();
				modal.data('ladda',l);
			}
			modal.modal();
		},
		//修改
		edit:function(e,id){
			handleEdit(id,e);
		},
		save:function(e){
			handleFormSubmit();
		},
		search:function(){
			refreshTable();
		},
		updateState:function(e,id){
			handleUpdateState(e,id);
		}
	}
	
}();