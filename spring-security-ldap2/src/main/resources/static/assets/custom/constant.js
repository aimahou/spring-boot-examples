/*
 * 系统常量
 */
var systemConstant={
	//菜单图标
	menu_icon:[],
	//菜单缓存key
	menu_cache_key:'menu_data',
	
	system_config_key:'system_config_data',
	
	personal_config_key:'personal_config_data'
	
}

var CONSTANT={		
	//datatables常量  	
	DATA_TABLES : {
		//DataTables初始化选项  
		DEFAULT_OPTION :{
			LANGUAGE:{
				sProcessing : "处理中...",  
                sLengthMenu : "显示 _MENU_ 项结果",  
                sZeroRecords : "没有匹配结果",  
                sInfo : "显示第 _START_ 至 _END_ 项结果，共 _TOTAL_ 项",  
                sInfoEmpty : "显示第 0 至 0 项结果，共 0 项",  
                sInfoFiltered : "(由 _MAX_ 项结果过滤)",  
                sInfoPostFix : "",  
                sSearch : "搜索:",  
                sUrl : "",  
                sEmptyTable : "表中数据为空",  
                sLoadingRecords : "载入中...",  
                sInfoThousands : ",",  
                oPaginate : {  
                    sFirst : "首页",  
                    sPrevious : "上页",  
                    sNext : "下页",  
                    sLast : "末页"  
                },  
                "oAria" : {  
                    "sSortAscending" : ": 以升序排列此列",  
                    "sSortDescending" : ": 以降序排列此列"  
                }  
			},
			// 禁用自动调整列宽  
            autoWidth : false,  
            // 为奇偶行加上样式，兼容不支持CSS伪类的场合  
            stripeClasses : [ "odd", "even" ],  
            // 取消默认排序查询,否则复选框一列会出现小箭头  
            order : [],  
            // 隐藏加载提示,自行处理  
            processing : false,  
            // 启用服务器端分页  
            serverSide : true,  
            // 禁用原生搜索  
            searching : false 
		},
		COLUMN:{
			CHECKBOX:{
				className: "td-checkbox",  
                orderable : false,  
                bSortable : false,  
                data : "id",
                title:'',
                render : function(data, type, row, meta) {
                	return '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"><input type="checkbox" class="group-checkable" value="'+data+'"><span></span></label>';
                }
			}		
		},
		// 常用render可以抽取出来，如日期时间、头像等  
		RENDER:{
			//一般的string都要用到该方法 设置
			ELLIPSIS:function(data, type, row, meta){
				data = data || "";
				return '<span title="' + data + '">' + data + '</span>'; 
			},
			//数字
			NUMBER:function(data, type, row, meta){
				return isNaN(parseInt(data))?0:parseInt(data);				
			},
			//时间戳
			TIME:function(data,type,row,meta){
				
			},
			//日期
			DATE:function(data,type,row,meta){
				
			}
		}
	}		
}