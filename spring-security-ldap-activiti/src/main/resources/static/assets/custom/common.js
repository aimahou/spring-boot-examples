var Common = function() {

	var button = function() {
		var button = [ {
			className : 'btn blue btn-outline',
			text : '添加'
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
		return button;
	}
	var isEmpty=function(s){	
		return s==null||typeof(s)=="undefined"||$.trim(s)==''||$.trim(s).length<1;
	}
	var handelIconSelect2 = function(e,val) {
		 
		function format(state) {
	        if (!state.id) { return state.text; }
	        var $state = $(
	         '<span><i class="'+state.text+'"></i> ' + state.text + '</span>'
	        );
	        return $state;
		 }
		var data = [ 
		         'icon-home', 'icon-puzzle', 'icon-settings', 'icon-bulb',
				'icon-briefcase', 'icon-wallet', 'icon-bar-chart',
				'icon-pointer', 'icon-layers', 'icon-feed', 'icon-paper-plane',
				' icon-wrench', 'icon-basket', 'icon-docs', 'icon-user',
				'icon-social-dribbble', 'icon-folder', 'fa fa-commenting',
				'icon-graph', 'fa fa-navicon', 'fa fa-users', 'fa fa-retweet',
				'fa fa-cubes', 'fa fa-gg', 'fa fa-user', 'fa fa-gg-circle',
				'fa fa-clone', 'fa fa-volume-up', 'fa fa-dollar',
				'fa fa-money', 'fa fa-chain', 'fa fa-sliders', 'fa fa-warning' 
				];
		$('<option>请选择</option>').appendTo(e);
		$.each(data,function(I,v){
			var opt=$('<option id="'+v+'">'+v+'</option>').appendTo(e);
			if(!isEmpty(val)&&v==val){
				opt.attr('selected','selected');
			}
		});
		$.fn.select2.defaults.set("theme", "bootstrap");
		return e.select2({placeholder:'&nbsp;请选择菜单图标',templateResult: format,templateSelection: format,width: 'auto', escapeMarkup: function(m) { return m;}});
	}
	var handleResourceSelect2=function(data,e,val){
		
		if(data==null||data.length<0){
			return;
		}
		$.each(data,function(i,v){
			var opt=$('<option id='+v.value+'>'+v.value+'</option>').appendTo(e);
			if(!isEmpty(val)&&val==v.value){
				opt.attr('selected','selected');
			}					               
		});
		$.fn.select2.defaults.set("theme", "bootstrap");
		return e.select2({placeholder:'请选择',width: 'auto'});
	}
	
	var language = function() {
		return {
			aria : {
				/*
				 * 默认值为activate to sort column ascending
				 * 当一列被按照升序排序的时候添加到表头的ARIA标签，注意列头是这个字符串的前缀
				 */
				"sSortAscending" : " - click/return to sort ascending",
				/*
				 * 默认值为activate to sort column ascending
				 * 当一列被按照升序降序的时候添加到表头的ARIA标签，注意列头是这个字符串的前缀
				 */
				"sSortDescending" : ": 激活排序列递减"
			},
			/*
			 * paginate:{ /* 默认值为First 当使用全数字类型的分页组件的时候，到第一页按钮上的文字
			 * 
			 * sFirst:'首页',
			 * 
			 * 默认值为Last 当使用全数字类型的分页组件的时候，到最后一页按钮上的文字
			 * 
			 * sLast:'末页',
			 * 
			 * 默认值为Next 当使用全数字类型的分页组件的时候，到下一页按钮上的文字
			 * 
			 * sNext:'下一页',
			 * 
			 * 默认值为Previous 当使用全数字类型的分页组件的时候，到前一页按钮上的文字
			 * 
			 * sPrevious:'上一页', },
			 */
			/*
			 * 默认值activate to sort column ascending为
			 * 当表格中没有数据（无视因为过滤导致的没有数据）时，该字符串年优先与sZeroRecords显示
			 * 注意这是个可选参数，如果没有指定，sZeroRecrods会被使用（既不是默认值也不是给定的值）
			 */
			emptyTable : '没有检索到数据',
			/*
			 * 默认值为Showing _START_ to _END_ of _TOTAL_ entries
			 * 该属性给终端用户提供当前页面的展示信息，字符串中的变量会随着表格的更新被动态替换，而且可以被任意移动和删除
			 */
			info : '显示 _START_ 到 _END_ 共 _TOTAL_ 条数据',
			/*
			 * 默认值为Showing 0 to 0 of 0 entries
			 * 当表格中没有数据时展示的表格信息，通常情况下格式会符合sInfo的格式
			 */
			infoEmpty : '没有数据',
			/*
			 * 默认值为(filtered from _MAX_ total entries)
			 * 当用户过滤表格中的信息的时候，该字符串会被附加到信息字符串的后面，从而给出过滤器强度的直观概念
			 */
			infoFiltered : '(从 _MAX_ 条记录中查询)',
			/*
			 * 默认值为空字符串 使用该属性可以很方便的向表格信息字符串中添加额外的信息，被添加的信息在任何时候都会被附加到表格信息组件的后面
			 * sInfoEmpty和sInfoFiltered可以以任何被使用的方式进行结合
			 */
			infoPostFix : '',
			/*
			 * 默认值为',' DataTable有内建的格式化数字的工具，可以用来格式化表格信息中较大的数字
			 * 默认情况下会自动调用，可以使用该选项来自定义分割的字符
			 */
			infoThousands : ',',
			/*
			 * 默认值为Show _MENU_ entries
			 * 描述当分页组件的下拉菜单的选项被改变的时候发生的动作，'_MENU_'变量会被替换为默认的10，25，50，100
			 * 如果需要的话可以被自定义的下拉组件替换
			 */
			lengthMenu : '每页_MENU_ 条',
			/*
			 * 默认值为Loading... 当使用Ajax数据源和表格在第一次被加载搜集数据的时候显示的字符串，该信息在一个空行显示
			 * 向终端用户指明数据正在被加载，注意该参数在从服务器加载的时候无效，只有Ajax和客户端处理的时候有效
			 */
			loadingRecords : '加载中...',
			/*
			 * 默认值为Processing... 当表格处理用户动作（例如排序或者类似行为）的时候显示的字符串
			 */
			processing : '处理中...',
			/*
			 * 默认为Search: 描述用户在输入框输入过滤条件时的动作，变量'_INPUT_',如果用在字符串中
			 * DataTable会使用用户输入的过滤条件替换_INPUT_为HTML文本组件，从而可以支配它（即用户输入的过滤条件）出现在信息字符串中的位置
			 * 如果变量没有指定，用户输入会自动添加到字符串后面
			 */
			search : '搜索:',
			/*
			 * 默认值为空字符串，即：无效 所有语言信息可以被存储在服务器端的文件中，DataTable可以根据该参数指定的URL去寻找
			 * 必须保存语言文件的URL信息，必须是JSON格式，对象和初始化中使用的oLanguage对象具有相同的属性
			 * 请参考示例文件来了解该参数是如何工作的 sUrl":
			 * "http://www.sprymedia.co.uk/dataTables/lang.txt",
			 */
			url : '',
			/*
			 * 默认值为No matching records found
			 * 当对数据进行过滤操作后，如果没有要显示的数据，会在表格记录中显示该字符串
			 * sEmptyTable只在表格中没有数据的时候显示，忽略过滤操作
			 */
			zeroRecords : '没有检索到数据'
		};
	}

	return {
		validate : function(params) {
			var v = {
				errorElement : 'span', // default input error message container
				errorClass : 'help-block', // default input error message class
				focusInvalid : false, // do not focus the last invalid input
				invalidHandler : function(event, validator) { // display error
																// alert on form
																// submit
					$('.alert-danger', $('.login-form')).show();
				},
				highlight : function(element) { // hightlight error inputs
					$(element).closest('.form-group').addClass('has-error'); // set																
				},
				success : function(label) {
					label.closest('.form-group').removeClass('has-error');
					label.remove();
				},
				errorPlacement : function(error, element) {
					error.insertAfter(element.closest('.input-icon'));
				}
			};
			$.extend(v, params);
			return v;
		},
		table : function(params) {
			var v = {
				language : language(),
				lengthMenu : [ [ 10, 20, 50, 100 ], [ 10, 20, 50, 100 ] ],// change// per// page// values// here
				pageLength : 10,
				dom : "<'row' <'col-md-12'B>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r><'table-scrollable't><'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>",
				buttons : button(),
				processing : true,
				// 延迟渲染数据，有效提高Datatables处理能力
				deferRender : true,
				// 取消默认排序查询,否则复选框一列会出现小箭头  
	            order : [],
	            // 禁用原生搜索  
	            searching : false,
	            //如果需要重新加载的时候请加上这个
	            destroy:true
			}
			$.extend(v, params);
			return v;
		},
		handleIconSelect2:function(e){
			return handelIconSelect2(e,null);
		},
		changeSelect2:function(s,val){
			s.val(val).trigger('change');
		},
		handleResourceSelect2:function(data,e){
			return handleResourceSelect2(data,e,null);
		},
		isEmpty:function(s){
			return isEmpty(s);
		},
		empty:function(e){
			if(e.is('form')){
				e.find('input[name!="_csrf"]').val('');
				e.find('textarea').val('');
			}
		},
		tips:function(opts){
			toastr.options={
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
			};
			var v={
				type:'success',
				message:'成功!',
				title:'操作提示'
			}
			$.extend(v, opts);
			toastr[v.type](v.message,v.title);
			
		},
		fullForm:function(form,data){
			form.find('input').each(function(i,v){
				var th=$(this);
				var name=th.attr('name');
				if(Common.isEmpty(name)){
					name=th.attr('id');
				}				
				for(var key in data){
					if(name==key){
						th.val(data[key]);
						break;
					}
				}
			});
			form.find('textarea').each(function(i,v){
				var th=$(this);
				var id=th.attr('name');
				for(var key in data){
					if(id==key){
						th.val(data[key]);
						break;
					}
				}
			});
		}
	}
}();