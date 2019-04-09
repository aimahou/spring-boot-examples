/**
 * 数据转换 
 * 用于转换成table表格的数据
 */
var Conversion = function() {
	var hide=['id','dmId','status','state','crtime','createTime','uptime'];
	//默认table
	var table=$('#table');
	var overall_spec=[];
	var uploader=$('#uploder');
	var up=null;
	var ignore=null;
	//前缀 或者 后缀转换
	var handlePrefixOrSuffix=function(row,suffix,position){
		position=position||'suffix';
		suffix=suffix || '';
		if(isEmpty(row)){
			return 'none';
		}
		if(position=='suffix'){
			return row+' '+suffix;
		}
		return suffix+' '+row;
	}
	//按钮
	var handleBtn=function(data,rows,index){
		var str=escape(JSON.stringify(rows));
		var btn='<div data-rows="'+str+'" class="data">';
		// 修改
		btn += '<a class="blue-hoki btn btn-xs ladda-button" href="javascript:;" onclick="Conversion.edit(this,'+data+');" data-style="expand-right" data-size="xs" title="修改">修改<i class="fa fa-edit"></i></a>';
		// 修改状态 启用/禁用
		var state=rows.state;
		if(!isEmpty(state)){
			if(state!=0){
				btn +='<a class="green-sharp btn btn-xs ladda-button" href="javascript:;" onclick="Conversion.state(this,'+data+');" data-style="expand-right" data-size="xs" title="启用状态">启用<i class="fa fa-edit"></i></a>';
			}
		}		
		btn+='</div>';
		return btn;
	}
	
	//获取数据
	var getData=function(e){
		var div=$(e).parent();
		return JSON.parse(unescape(div.data('rows')));
	}
	
	//监控ladda-button 按钮
	var handleLadda=function(){
		$('body').on('click','.ladda-button',function(){
			Ladda.stopAll();
			var th=$(this)[0];
			Ladda.create(th).start();
		});
		$('body').on('hidden.bs.modal','.modal',function(){
			Ladda.stopAll();
		});
	}
	
	var handleImage=function(){
		$('body table').on('click','img',function(){
			var th=$(this);
			if(!$().viewer){
				return true;
			}
		});
	}
	//是否存在
	var inArray=function(value,data){
		var index={};
		$.each(data,function(i,v){
			var id=v.id;
			var arr=id.split(',');
			var flag=false;
			if(arr.length>1){
				$.each(arr,function(k,d){
					if(d==value){
						index=v;
						flag=true;
						return false;
					}
				});				
			}
			if(flag){
				return false;
			}
			if(id==value){
				index=v;
				return false;
			}
		});
		return index;
	}
	//修改modal
	var handleModalHtml=function(e,data,type){
		var th=$('thead>tr>th',table);
		var modal=$(e);
		modal.empty();
		th.each(function(){
			var th=$(this);
			var field=th.data('field');
			var value='';
			var title=th.text();
			if(isEmpty(title)||$.inArray(field, hide)!=-1){
				return true;
			}
			var spec=inArray(field,overall_spec);
			var type='';
			if(!isEmpty(spec)){
				type=spec.type;						
			}
			handleHtml(type,modal,title,field,value,spec);
		});
			
		var token=getToken();
		for(i in token){
			$('<input type="hidden" name="'+i+'" id="'+i+'" value="'+token[i]+'"/>').appendTo(modal);
		}
		$('<input type="hidden" name="id" id="id" value=""/><input type="hidden" name="dmId" id="dmId" value=""/>').appendTo(modal);
		handleModalSwitch(modal);
		handleModalSelect(modal);
		handleModalImage(modal);
		fullForm(modal,data,type);
	}
	//Switch
	var handleModalSwitch=function(modal){
		if (!$().bootstrapSwitch) {
			return;
		}
		$('.make-switch',$(modal)).bootstrapSwitch();
	}
	//Select2
	var handleModalSelect=function(modal){
		$('.select2',$(modal)).each(function(){
			Select2.ajaxSelect($(this));
		});
	}
	//图片监听
	var handleModalImage=function(modal){
		//清除图片
		$('input.image',$(modal)).on('conversion.empty',function(){
			var fileinput=$('div.fileinput',$(this).parent());
			if(fileinput.length<1){
				return true;
			}
			
			$('.thumbnail',fileinput).empty();
			var btnTitle='选择图片',btnClass='btn green-sharp uploader';
			$('a.uploader',fileinput).removeClass().addClass(btnClass).html(btnTitle);
			$('a.remove-image').addClass('hide');
		});
		//填充图片
		$('input.image',$(modal)).on('conversion.full',function(){	
			handleModalImageMonitor($(this),'');
		});
	
		$('input.image',$(modal)).on('conversion.filesAdded',function(){	
			handleModalImageMonitor($(this),'图片');
			$(this).val('');
		});
	}
	
	var handleModalImageMonitor=function(input,type){
		var value=$(input).val();
		if(isEmpty(value)){
			return true;
		}
		var fileinput=$('div.fileinput',$(input).parent());
		if(fileinput.length<1){
			return true;
		}
		type=isEmpty(type)?value:type;
		$('.thumbnail',fileinput).empty();
		$('<img alt="'+type+'" src="'+value+'" style="height:100%;width:100%;display: block;"/>').appendTo($('.thumbnail',fileinput));
		var btnTitle='更改',btnClass='btn yellow uploader';
		$('a.uploader',fileinput).removeClass().addClass(btnClass).html(btnTitle);
		$('a.remove-image').removeClass('hide');
	}
	//生成html
	var handleHtml=function(type,e,title,i,value,spec){
		var group=$('<div class="form-group"></div>').appendTo($(e));
		$('<label class="col-md-3 control-label" for="'+i+'">'+title+':</label>').appendTo(group);
		switch(type){
		case 'image':
			var btnTitle='选择图片',btnClass='btn green-sharp uploader',removeClass='btn red remove-image fileinput-exists hide';
			if(!isEmpty(value)){
				btnTitle='更改',btnClass='btn yellow uploader',removeClass='btn red remove-image fileinput-exists';
			}
			var fileinput=$('<div class="col-md-9"><div class="fileinput fileinput-new" data-provides="fileinput" ><div class="fileinput-preview thumbnail" data-trigger="fileinput" style="width: 200px; height: 150px;"></div></div></div>').appendTo(group);
			$('<div class="clearfix"><a class="'+btnClass+'" href="javascript:;" title="'+btnTitle+'" onclick="Conversion.uploader(this);">'+btnTitle+'</a><a href="javascript:;" class="'+removeClass+'" data-dismiss="fileinput" style="margin-left:5px;" onclick="Conversion.removeImage(this);"> 删除 </a></div>').appendTo($('.fileinput',fileinput));
			if(!isEmpty(value)){
				$('<img alt="'+value+'" src="'+value+'" style="height:100%;width:100%;display: block;"/>').appendTo($('.thumbnail',fileinput));
			}
			$('<input type="hidden" name="'+i+'" id="'+i+'" value="'+value+'" class="image"/>').appendTo(group);
			break;
		case 'textarea':
			$('<div class="col-md-9"><textarea class="form-control" rows="3" name="'+i+'" id="'+i+'" placeholder="'+title+'" >'+value+'</textarea></div>').appendTo(group);
			break;
		case 'select':
			var url=spec.url;
			var data_url='';
			if(!isEmpty(url)){
				data_url='data-url="'+url+'"';
			}
			var select=$('<div class="col-md-9"><select class="form-control select2" name="'+i+'" id="'+i+'" '+data_url+' data-width="100%" data-whole="false"></select></div>').appendTo(group);
			break;
		case 'whether':
			var checked='';
			if(value==0){
				checked='checked="checked"';
			}
			var chenk=$('<div class="col-md-9"><input type="checkbox" class="make-switch" '+checked+' data-on-text="是" data-off-text="否" id="'+i+'" name="'+i+'" /></div>').appendTo(group);
			break;
		default:
			$('<div class="col-md-9"><input type="text" id="'+i+'" name="'+i+'" class="form-control"  placeholder="请输入'+title+'" value="'+value+'"></div>').appendTo(group);
			break;
		}
	}
	//生成modal
	var buildModal=function(data,type){
		var modal=$('div.modal#modal');
		var title=$('title',$('head')).html();
		if(type=='add'){
			title+='新增';
		}else{
			title+='修改';
		}
		if(modal.length>0){
			$('.modal-title').html(title);
			//填充数据
			fullForm(modal,data,type);
			modal.modal();
			return modal;
		}
		if(table.length<=0){
			return;
		}
		var modifyUrl=table.data('modify-url');
		if(isEmpty(modifyUrl)){
			return;
		}
		modal=$('<div class="modal fade in" tabindex="-1" aria-hidden="true" id="modal" style="display:none;" data-backdrop="static" data-keyboard="false"></div>').appendTo($('body'));
		var dialog=$('<div class="modal-dialog"><div class="modal-content"><div class="modal-header"></div><div class="modal-body"></div><div class="modal-footer"></div></div></div>').appendTo(modal);
		$('<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button><h4 class="modal-title">'+title+'</h4>').appendTo($('.modal-header',dialog));
		var form=$('<form class="form-horizontal form-bordered" autocomplete="off" role="form" method="POST" action="'+modifyUrl+'"></form>').appendTo($('.modal-body',dialog));
		$('<button type="button" title="关闭Modal" data-dismiss="modal" class="btn dark btn-outline">关闭</button>').appendTo($('.modal-footer',dialog));
		$('<button type="button" title="保存本次修改" onclick="Conversion.save(this);" class="btn green">保存</button>').appendTo($('.modal-footer',dialog));
		handleModalHtml(form,data,type);
		modal.modal();
	}
	
	var handleTable=function(){
		if(isEmpty(table) || table.length<=0 || !table.is('table')){
			return;
		}
		table.bootstrapTable();
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
	//清空Form表单
	var emptyForm=function(modal){
		var form=$('form',modal);
		if(form.length<1){
			return;
		}
		var tokenName=getTokenName();
		$('input,select,textarea',form).each(function(){
			var th=$(this);
			var name=th.attr('name');
			var id=th.attr('id');
			if(tokenName==name){
				return true;
			}
			if(open_modal_type=='add'&&!isEmpty(ignore)){
				var flag=false;
				$.each(ignore,function(i,v){
					var arr=v.split('|');					
					if(arr[0]==name || arr[0]==id){
						flag=true;
						if(arr.length==2){
							var operation=arr[1];
							if(operation=='+'){
								var int=isNaN(parseInt(th.val()))?0:parseInt(th.val())+1;
								th.val(int).trigger($.Event('conversion.empty'));
							}
						}
						return true;
					}
				});
				if(!flag){
					th.val('').trigger($.Event('conversion.empty'));
					if(th.is('select')){
						th.trigger('change');
					}	
				}
			}else{
				th.val('').trigger($.Event('conversion.empty'));
				if(th.is('select')){
					th.trigger('change');
				}	
			}	
		});
		open_modal_type='';
	}
	var open_modal_type='';
	//填充Form表单
	var fullForm=function(modal,data,type){
		var form=modal;
		if(!modal.is('form')){
			form=$('form',modal);
		}
		if(form.length<1){
			return;
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
					th.val(data[a]).trigger($.Event('conversion.full'));
					if(th.is('select')){
						th.trigger("change");
					}
					break;
				}
			}
		});
		if(!isEmpty(type)&&type=='add'){
			open_modal_type='add';
		}
	}
	//刷新表格
	var refreshTable=function(){
		if(isEmpty(table)){
			return;
		}
		var params = table.bootstrapTable('getOptions'); 
		table.bootstrapTable('refresh');
	}
	
	var handleFormSubmit=function(e){
		var modal=$(e).parents('.modal');
		if(isEmpty(modal)){
			swal('OMG','模版配置错误,找不到Modal模块,无法提交','error');
			return;
		}
		var form=$('form',modal);
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
		init:function(opt){
			if(!isEmpty(opt)){
				overall_spec=opt.spec;
				if(!isEmpty(opt.uploder)){
					uploader=opt.uploder;
					uploader.on('uploader.init',function(event,upload,wait){
						if(wait){
							up=upload;
						}
					});	
				}
				if(!isEmpty(opt.table)){
					table=opt.table;
				}
				if(!isEmpty(opt.ignore)){
					ignore=opt.ignore;
				}
			}
			handleTable();
			handleLadda();
			handleImage();
			$('body').on('hidden.bs.modal','div.modal#modal',function(){
				emptyForm($(this));
			});
		},
		//转换为图片
		toImage:function(data,rows,index){
			var title=isEmpty(rows.title)?'展示图片':rows.title;
			return isEmpty(data)?'':'<img alt="'+title+'" src="'+data+'" style="width:70px;height:84px;vertical-align:middle;"/>'
		},
		//后缀为 '%'
		toFormatPercentage:function(data,rows,index){
			return handlePrefixOrSuffix(data,'%');
		},
		//前缀为 '&yen;'
		toFormatMoney:function(data,rows,index){
			return handlePrefixOrSuffix(data,'&yen;','prefix');
		},
		//后缀为 '级'
		toFormatLevel:function(data,rows,index){
			return handlePrefixOrSuffix(data=='-1'?'无限':data=='-2'?'所属区域':data,data=='-2'?'':'级');
		},
		//后缀为 '月'
		toFormatMonth:function(data,rows,index){
			return handlePrefixOrSuffix(data,'月');
		},
		//后缀为 '积分'
		toFormatIntegral:function(data,rows,index){
			return handlePrefixOrSuffix(data,'积分');
		},
		//转换为日期 'yyyy-MM-dd'
		toDate:function(data,rows,index){
			return LongToDateStr(data,'yyyy-MM-dd');
		},
		//转换为时间 'yyyy-MM-dd HH:mm:ss'
		toTime:function(data,rows,index){
			return LongToDateStr(data,'yyyy-MM-dd HH:mm:ss');
		},
		//转换为状态 (0:启用/1:禁用) 其他状态需要自定义方法
		toState:function(data,rows,index){
			return isEmpty(data)?'禁用':data==0?'启用':'禁用';
		},
		//按钮 (修改/修改状态) 有其他的按钮需要自定义方法
		toBtn:function(data,rows,index){
			return handleBtn(data,rows,index);
		},
		toWhether:function(data,rows,index){
			return data==0?'是':'否';
		},
		toDictionaries:function(data,rows,index){
			var fileds=$(this)[0];
			var filedname=fileds.field;
			return '';
		},
		//修改
		edit:function(e,id){
			var  data=getData(e);
			//打开modal 
			var findOneUrl=table.data('find-one');
			if(!isEmpty(findOneUrl)){
				$.get(url,{id:id}).always(function(data,state){
					if(state!='success' || isEmpty(data)){
						swal('系统错误!','获取信息失败,请联系管理员处理!','error');
						setTimeout(function(){
							sweetAlert.close();
						},2000);
						return;
					}
					buildModal(data);
				});			
				return;
			}
			buildModal(data);
		},
		//更改状态
		state:function(e){
			console.log(getData(e));
		},
		save:function(e){
			if(!isEmpty(up)){
				up.start();
			}
			handleFormSubmit(e);
		},
		add:function(){
			buildModal({},'add');
		},
		search:function(){
			refreshTable();
		},
		//上传
		uploader:function(e){
			if(isEmpty(uploader)){
				return;
			}
			uploader.click();
			var fileinput=$(e).parents('.fileinput');
			if(!isEmpty(up)){
				up.bind('FilesAdded',function(uploader,files){
					if(!isEmpty(files)){
						var file=files[0];
						var fr = file.type == 'image/gif'?new mOxie.FileReader():new mOxie.Image();
						fr.onload=function(e){
							var imgsrc = file.type == 'image/gif'?fr.result:fr.type=='image/jpeg' ? fr.getAsDataURL('image/jpeg',80) : fr.getAsDataURL(); 
							$('.thumbnail',fileinput).empty();
							$('input.image',fileinput.parents('.form-group')).val(imgsrc).trigger($.Event('conversion.filesAdded'));
							fr.destroy();
							fr = null;
						}
						fr.load(file.getSource());		
					}
				});
			}
			uploader.off().on('uploader.complete',function(event,data){
				if(!isEmpty(data)){
					console.log(data);
					var image=data[0];
					var path=image.path;
					$('.thumbnail',fileinput).empty();
					$('input.image',fileinput.parents('.form-group')).val(path).trigger($.Event('conversion.full'));
				}					
			});
		},
		getData:function(e){
			return getData(e);
		},
		//删除
		removeImage:function(e){
			var fileinput=$(e).parents('.fileinput');
			$('.thumbnail',fileinput).empty();
			$('input.image',fileinput.parents('.form-group')).val('').trigger($.Event('conversion.empty'));
		},
		getBtn:function(data,rows,index){
			return handleBtn(data,rows,index);
		}
	}
}();