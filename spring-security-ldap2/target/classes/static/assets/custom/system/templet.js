//页面模版
var Templet=function(){
	var opt={
		table_url:'/templet/table/',
		hide:['id','dmId','crtime','createTime','create_time','updateTime','update_time','createBy','create_by','updateBy','update_by','_id'],
		isAdd:['_id','crtime','createTime','create_time','updateTime','update_time','createBy','create_by','updateBy','update_by'],
		operation_data:[
			  {id:'modify',init:true,text:'修改'},
		      {id:'updateState',text:'修改状态'},
		      {id:'remove',text:'删除'},
		      {id:'showView',text:'查看详情'},
		      {id:'more',text:'更多',action:'Templet.more'}
		               ],
		operation_btn:'#operation_btn',               
		resource:'#resource',
		table:'#tables',
		table_data:'#tab2_table',
		btn:'#btns',
		action:'/resource/getAction',
		transformations:[{'id':'toDate','text':'时间转换'},
		                 {'id':'toTime','text':'时间戳转换'},
		                 {'id':'toFormatMoney','text':'金钱转换'},
		                 {'id':'toImage','text':'图片转换'},
		                 {'id':'toBtn','text':'基础按钮',action:'Templet.selectBtn'},
		                 {'id':'other','text':'其它',action:'Templet.selectOther'}],
		btns:[{id:'add',init:true,text:'添加'},
		      {id:'batchRemove',text:'批量删除'},
		      {id:'batchUpdate',text:'批量修改状态'},
		      {id:'print',text:'打印'},
		      {id:'export',text:'导出'},
		      {id:'export',text:'导入',action:'Templet.exports'},
		      {id:'more',text:'更多',action:'Templet.more'}],
		select_transformations:'#transformations'      
		      
	};
	var transformation_tr;
	//解析Table
	var analysisTable=function(table){
		$.ajaxSetup({  
		    async : false  
		});
		var result=[];
		var tableUrl=opt.table_url;
		tableUrl+=table;
		$.get(tableUrl).always(function(data,state){
			if(state!='success'||isEmpty(data)){
				return;
			}
			$.each(data,function(i,v){
				var columnKey=v.columnKey;
				var fieldName=v.fieldName;
				var fieldType=v.fieldType;
				var note=v.note;
				var required=v.required;
				var name=note || fieldName;
				required=required=='NO';
				var colum={title:name,required:required,fieldType:fieldType,length:v.length,decimal:v.decimal,name:fieldName,source:'Table'};
				result.push(colum);
			});
		});
		return result;
	}
	//解析 Url
	var analysisUrl=function(url){
		$.ajaxSetup({  
		    async : false  
		});
		var result=[];
		$.get(url).always(function(data,state){
			if(state!='success'||isEmpty(data)||isEmpty(data.data)){
				return;
			}
			var res=data.data[0];
			for(v in res){
				var colum={title:v,name:v,source:'Url'};
				result.push(colum);
			}
		});
		return result;
	}
	//组合
	var assemble=function(){
		var colums=[];
		if(!$(opt.table).length && !$(opt.resource).length){
			return colums;
		}	
		var table=$(opt.table).val(); 		
		var url=$(opt.resource).val();
		if(isEmpty(table)&&!isEmpty(url)){
			colums=analysisUrl(url);
		}else if(!isEmpty(table)&&isEmpty(url)){
			colums=analysisTable(table);
		}else if(!isEmpty(table)&&!isEmpty(url)){
			colums=analysisTable(table);
			var urlColums=analysisUrl(url);
			if(!isEmpty(colums)){
				$.each(colums,function(i,v){
					var name=v.name;
					name=name.replace('_','');
					name=name.toLocaleUpperCase();
					if(!isEmpty(urlColums)){
    					$.each(urlColums,function(k,d){
    						var un=d.name.toLocaleUpperCase();
    						if(name==un){
    							v['name']=d.name;
    							urlColums.splice(k,1);
    							return false;
    						}   						
    					});
					}
				});
				if(!isEmpty(urlColums)){
					$.each(urlColums,function(k,d){
						colums.push(d);
					});
				}
			}
		}
		if(!isEmpty(colums)){
			$.each(colums,function(i,v){
				v['isShow']=false;
				v['isAdd']=false;
				v['sort']=(i+1);
				if($.inArray(v.name,opt.hide)==-1){
					v['isShow']=true;
				}
				if($.inArray(v.name,opt.isAdd)==-1){
					v['isAdd']=true;
				}
			});
		}
		return colums;
	}
	
	//判断是否选择Url
	var judgeCondition=function(callback){
		var table=$(opt.table).val(); 		
		var url=$(opt.resource).val();
		if(isEmpty(table)&&isEmpty(url)){
			swal({
				title:'Are you sure?',
				text:'没有选用Table和查询URL将会影响配置页面的准确性.加大配置的难度,确定要继续配置下一步吗?',
				type: "warning",
				showCancelButton: true,
				confirmButtonColor: "#DD6B55",
				    confirmButtonText: "进行下一步",
				    cancelButtonText: "继续选择",
				    closeOnConfirm: false,
			        closeOnCancel: false
			},function(flag){
				sweetAlert.close();
				if(typeof(callback)=='function'){
					callback(flag);
				}
			});
		}else{
			if(typeof(callback)=='function'){
				callback(true);
			}
		}
	}
	
	var handleWizard=function(){
		$(opt.wizard).bootstrapWizard({
			'nextSelector': '.button-next',
            'previousSelector': '.button-previous',
            onTabClick: function (tab, navigation, index, clickedIndex) {
            	return false;
            },
            onNext: function (tab, navigation, index) {
            	if(index==1){
            		judgeCondition(function(flag){
            			if(flag){
            				loadTable();
            				$(opt.wizard).bootstrapWizard('show',index);            				
            			}
            		});
            		return false;
            	}
            	
            }
		});
	}
	
	var loadTable=function(){
		var colums=assemble();
		var oTable=$(opt.table_data).DataTable({
			'destroy':true,
			'data':colums,
			'columnDefs':compatibleBootstrpTable($(opt.table_data)),
			rowReorder: {
				update:true
			},
	        rowCallback:function(row, data, index ){
	        	//console.log(data);
	        	
	        }
		});
		return oTable;
	}
	
	var compatibleBootstrpTable=function(table){
		var columnDefs=[];
		$('th',table).each(function(i,v){
			var th=$(this);
			var render=th.data('formatter');
			var ordering=th.data('ordering');
			if(isEmpty(render)){
				return true;
			}
			if(ordering=='true'){
				
			}
			render=eval(render);
			columnDefs.push({targets: i,render:function(a, b, c, d){
				return render(a, c, d);
			}});  		
		});
		return columnDefs;
	}
	//初始化表格
	var initTable=function(){
		 $.extend( $.fn.dataTable.defaults, {
			 'paging':false,
			 'ordering':true,
			 'processing':true,
			 'searching':false,
			 'serverSide':false,
			 'autoWidth':true,
			 'deferRender':false,
			  "language": {
				  "sProcessing": "处理中...",
			        "sLengthMenu": "显示 _MENU_ 项结果",
			        "sZeroRecords": "没有匹配结果",
			        "sInfo": "显示第 _START_ 至 _END_ 项结果，共 _TOTAL_ 项",
			        "sInfoEmpty": "显示第 0 至 0 项结果，共 0 项",
			        "sInfoFiltered": "(由 _MAX_ 项结果过滤)",
			        "sInfoPostFix": "",
			        "sSearch": "搜索:",
			        "sUrl": "",
			        "sEmptyTable": "表中数据为空",
			        "sLoadingRecords": "载入中...",
			        "sInfoThousands": ",",
			        "oPaginate": {
			            "sFirst": "首页",
			            "sPrevious": "上页",
			            "sNext": "下页",
			            "sLast": "末页"
			        },
			        "oAria": {
			            "sSortAscending": ": 以升序排列此列",
			            "sSortDescending": ": 以降序排列此列"
			        }
	         }   
		 }); 
	}
	
	var handleSelect=function(){
		$.get(opt.action).always(function(data,state){
			if(state!='success'||isEmpty(data)){
				return;
			}
			$('<option value="">请选择</option>').appendTo($(opt.resource));
			$.each(data,function(i,v){
				$('<option value="'+v.value+'" data-request-type="'+v.requestType+'">'+v.value+'</option>').appendTo($(opt.resource));
			});
		});
		
		$('<option value="">请选择</option>').appendTo($(opt.btn));
		$.each(opt.btns,function(i,v){
			var c=v.init==true?'selected="selected"':'';
			var action=v.action;
			action=isEmpty(action)?'':'data-action="'+action+'"';
			$('<option value="'+v.id+'" '+c+' '+action+'>'+v.text+'</option>').appendTo($(opt.btn));
		})
		
		$.each(opt.transformations,function(i,v){
			var action=v.action;
			action=isEmpty(action)?'':'data-action="'+action+'"';
    		$('<option value="'+v.id+'" '+action+'>'+v.text+'</option>').appendTo($(opt.select_transformations));
    	})
		
    	$.each(opt.operation_data,function(i,v){
    		var c=v.init==true?'selected="selected"':'';
    		var action=v.action;
			action=isEmpty(action)?'':'data-action="'+action+'"';
    		$('<option value="'+v.id+'" '+c+' '+action+'>'+v.text+'</option>').appendTo($(opt.operation_btn));
    	});
		
		
		$('.select2').select2();
		
		$(".select2-allow-clear").select2({
            allowClear: true,
            width: null
        });	
		
		$('.select2,.select2-allow-clear').on('change',function(){
			var th=$(this);
			var option=$('option:selected',th);
			var flag=false;
			option.each(function(){
				var action=$(this).data('action');
				if(!isEmpty(action)){
					var fun=eval(action);
					if(typeof(fun)=='function'){
						fun($(this),th);
						flag=true;
					}
				}
			});
			if(!flag){
				Templet.close($(this),th);
			}
		});
	}
	
	var parameterSelect2=function(){
		var select=$('#parameter');
		var oTable=$(opt.table_data).DataTable();
		var data=oTable.data();
		select.empty();
		$.each(data,function(i,v){
			$('<option value="'+v.name+'">'+v.name+'</option>').appendTo(select);
		})
		
		select.select2({
			allowClear: true,
            width: null
		});
	}
	
	var registerFormObject=function(){
		$.fn.serializeObject = function()    
		{    
		   var o = {};    
		   var a = this.serializeArray();    
		   $.each(a, function() {    
		       if (o[this.name]) {    
		           if (!o[this.name].push) {    
		               o[this.name] = [o[this.name]];    
		           }    
		           o[this.name].push(this.value || '');    
		       } else {    
		           o[this.name] = this.value || '';    
		       }    
		   });  
		   var $radio = $('input[type=radio],input[type=checkbox]',this);
		    $.each($radio,function(){
		        if(!o.hasOwnProperty(this.name)){
		            o[this.name] = false;
		        }
		    });
		    return o; 
		};  
	}
	//是否是JSON
	var isJson=function(obj){
		var isjson = typeof(obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length; 
		return isjson;
	}
	//添加数据
	var pushDataTable=function(obj){
		var oTable=$(opt.table_data).DataTable();
		var data=oTable.data();
		obj['sort']=data.length+1;
		oTable.row.add(obj).draw().node();
		parameterSelect2();
	}
	//监听
	var monitor=function(){
		
	}
	return {
		init:function(options){
			$.extend(opt,options);
			initTable();
			handleSelect();
			handleWizard(opt.wizard);
			registerFormObject();
			monitor();
		},
		open:function(e,th){
			if(!$(e).length){
				return;
			}
			transformation_tr=null;
			var tr=$(th).parents('tr');
			if(!isEmpty(tr)){
				transformation_tr=tr;
				var oTable=$(opt.table_data).DataTable();
				var data=oTable.row(tr).data();
				var transformations=data.transformations;
				if(!isEmpty(transformations)){
					$('#transformations',$(e)).val(transformations).trigger("change");
				}
			}
			$(e).modal();
		},
		//添加行
		plus:function(e){
			var modal=$(e).parents('.modal');
			var form=$('form',modal);
			var title=$('#title',form).val();
			var name=$('#name',form).val();
			if(isEmpty(title)){
				swal({
					title:'提示!',
					text:'请输入标题!',
					type:'warning',
					timer:2000
				});
				return;
			}
			if(isEmpty(name)){
				swal({
					title:'提示!',
					text:'请输入字段名!',
					type:'warning',
					timer:2000
				});
				return ;
			}
			
			var data=form.serializeObject();
			data['source']='Add';
			if(data.isAdd =='on'){
				data.isAdd=true;
			}
			if(data.isShow =='on'){
				data.isShow=true;
			}
			pushDataTable(data);
			$('#isShow,#isAdd',form).attr('checked','checked');
			modal.modal('hide');
		},
		remove:function(e){
			swal({
			  title: "Are you sure?",
			  text: "确定要删除该条记录吗?",
			  type: "warning",
			  showCancelButton: true,
			  confirmButtonColor: "#DD6B55",
			  confirmButtonText: "是的, 我要删除!",
			  cancelButtonText: "不, 我只是点错了!",
			  closeOnConfirm: false,
			  closeOnCancel: false
			},
			function(isConfirm){
			  swal.close();
			  if (isConfirm) {
			   var oTable=$(opt.table_data).DataTable();
			   oTable.row( $(e).parents('tr') ).remove().draw();
			  } 
			});
		},
		more:function(e,th){
			var form=$(th).parents('form');
			$('.more',form).removeClass('hide');
			parameterSelect2();
		},
		close:function(e,th){
			var form=$(th).parents('form');
			$('.more',form).addClass('hide');
		},
		save:function(e){
			 var oTable=$(opt.table_data).DataTable();
			 var modal=$(e).parents('.modal');
			 var tr=$(transformation_tr);
			 var data=oTable.row(tr).data();
			 var form=$('form',modal);
			 var formData=form.serializeObject();
			 for(i in formData){
				 data[i]=formData[i];
			 }
			 modal.modal('hide');
		}
	}	
}();