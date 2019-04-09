var Authentication=function(){
	//获取页面Table
	var getTableObj=function(){
		var field=App.getCurrentField();
		return field.find('#authentication_table');
	}
	//获取搜索form
	var getSearchForm=function(){
		var field=App.getCurrentField();
		return field.find('#search_form');
	}
	var initIndividualTable=function(){
		var oTable = getTableObj().dataTable(App.table({
			columns:colums(),
			buttons:[],
			serverSide:true,
			processing:true,
			ajax:{
				url:getTableObj().attr('action'),
				type:'GET',
				data:function(json){
					var form=getSearchForm();
					var data=App.tableOrder(json,form,'',true);
					return data;
				},
				dataSrc:function(json){
					return json.data;
				}
			},
			//表格加载渲染完毕后执行的方法
			initComplete:initComplete
		}));
		return oTable;
		//该方法只执行一次
		function initComplete(settings, json){
			
		}
		
		function colums(){
			return [
				{title:'头像',bSortable:false,searchable:false,data:'user.headimg',render:function(row,type,set){
					var img='<ul class="viewer_img">';
					img+='<li ><img src="'+row+'" alt="'+set.dmId+'" onerror="Authentication.nofind(this);"/></li>';
					var images=set.pnoImg;
					if(!App.isEmpty(images)){
						var str=images.split(',');
						$.each(str,function(i,v){
							img+='<li class="hide"><img src="'+v+'" alt="'+set.dmId+'" onerror="Authentication.nofind(this);"/></li>';
						});
					}
					
					img+='</ul>';
					return img;
				}},
				{title:'姓名',bSortable:false,className:'',searchable:false,data:'name',render:function(row,type,set){
					return App.isEmpty(row)?'':row; 
				}},
				{title:'身份证',bSortable:false,searchable:false,data:'pno',render:function(row,type,set){
					 return App.isEmpty(row)?'':row;
				}},
				{title:'昵称',bSortable:false,searchable:false,data:'user.nickname',render:function(row,type,set){
					 return App.isEmpty(row)?'':row;
				}},
				{title:'手机号码',bSortable:false,data:'user.mphonenum',render:function(row,type,set){
					return  App.isEmpty(row)?'':row;
				}},
				
				{title:'审核状态',bSortable:false,data:'applyStatus',render:function(row,type,set){
					return row==1?'<span class="label label-sm label-success">通过</span>':row==2?'<span class="label label-sm label-danger">不通过</span>':'<span class="label label-sm label-warning">待审核</span>';
				}},
				{title:'申请时间',bSortable:true,data:'applyTime',render:function(row,type,set){
					 return App.LongToDateStr(row);
				}},
				{title:'证件图片',bSortable:false,data:'pnoImg',render:function(row,type,set){
					if(App.isEmpty(row)){
						return '';
					}
					var str=row.split(',');
					var img='<ul class="viewer_img">';
					$.each(str,function(i,v){
						img+='<li ><img src="'+v+'" alt="'+set.dmId+'" onerror="Authentication.nofind(this);"/></li>';
					});
					img+='</ul>';
					 return  img;
				}},
				{title:'状态',bSortable:false,data:'status',render:function(row,type,set){
					return  row==0?'<span class="label label-sm label-success">正常</span>':'<span class="label label-sm label-danger"> 失效</span>';
				}},
				{title:'操作',bSortable:false,data:'dmId',render:function(row,type,set){
					var btn='<a>重置密码</a>';
					var state=set.state;
					btn+='<a></a>';
					btn='';
					 return  btn;
				}}
			        ];
		}
	}
	var searchInit=function(form){
		form.find('#search_time').daterangepicker({
			format:'YYYY-MM-DD',
	        maxDate:new Date(),
	        autoUpdateInput:false,
	        separator : ' to ',
	        cancelClass : 'btn-small',
	        applyClass : 'btn-small btn-primary blue', 
	        buttonClasses : [ 'btn btn-default' ], 
	        opens : 'right',//日期选择框的弹出位置
	        timePicker : false,//是否显示小时和分钟
	        showDropdowns : true,  
            showWeekNumbers : false, //是否显示第几周 
	        ranges : {  
                //'最近1小时': [moment().subtract('hours',1), moment()],  
                '今日': [moment().startOf('day'), moment()],  
                '昨日': [moment().subtract('days', 1).startOf('day'), moment().subtract('days', 1).endOf('day')],  
                '最近7日': [moment().subtract('days', 6), moment()],  
                '最近30日': [moment().subtract('days', 29), moment()]  
            },
	        locale:{
	            applyLabel: '确认',
	            cancelLabel: '取消',
	            fromLabel: '起始时间',
	            toLabel: '结束时间',
	            weekLabel: 'W',
	            customRangeLabel: '自定义',
	            daysOfWeek:["日","一","二","三","四","五","六"],
	            monthNames: ["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"],
	        }
		},function(start, end, label){
			getSearchForm().find('#search_time').val(start.format('YYYY-MM-DD') + ' 至 ' + end.format('YYYY-MM-DD'));
		});
		form.find("#search_time").on('cancel.daterangepicker',function(){
			getSearchForm().find('#search_time').val('');
		});
		form.find(".select2-multiple").select2({
            placeholder: '请选择',
            width: '200px'
        });	
	}
	return {
		init:function(){
			initIndividualTable();
			searchInit(getSearchForm());
			getTableObj().on( 'draw.dt', function (e, settings) {
				getTableObj().find('.viewer_img').viewer({zIndex:9999,minZoomRatio:0.5,maxZoomRatio:5});
			} );
		},
		nofind:function(e){
			var src='http://img01.yw01.com/1393194794993664/FuOBmAP-e4wE-TqqKWhVcRMMM9c61449307666.jpg';
			$(e).attr('src',src);
			return false;
		},
		search:function(){
			getTableObj().dataTable().api().ajax.reload();
		}
	}
}();