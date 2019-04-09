var Wms=function(){
	//获取页面Table
	var getOTableObj=function(){
		var field=App.getCurrentField();
		return field.find('#wms_table');
	}
	//获取页面Table
	var getQueryStorageTableObj=function(){
		return getModalObjQuery().find('#wms_query_storage_table');
	}
	//获取页面Table
	var getGoodTableObj=function(){
		return getModalObjAdd().find('#wms_goods_table');
	}
	//获取modal
	var getModalObjAdd=function(){
		var field=App.getCurrentField();
		return field.find('#add_wms_model');
	}
	//获取modal
	var getModalObjQuery=function(){
		var field=App.getCurrentField();
		return field.find('#query_wms_model');
	}
	//获取modal里面的Form
	var getModalAddForm=function(){
		return getModalObjAdd().find('form:first');
	}
	var initWmsTable=function(){
		var oTable = getOTableObj().dataTable(App.table({
			columns:colums(),
			buttons:button(),
			serverSide:true,
			processing:true,
			ajax:{
				url:getOTableObj().attr('action'),
				type:'GET',
				data:function(json){
					return App.tableOrder(json);
				},
				dataSrc:function(json){
					return json.data;
				}
			}
		}));
		return oTable;
		//Table列
		function colums(){
			return [
					{data: "id", bSortable: false,visible:false,searchable:false},
					{title:'发货单编号',bSortable:false,data:function(row,type,set){
						 if(!Common.isEmpty(row.storageNo)){
							 return row.storageNo;
						 }
						 return '';	 
					}},
					{title:'供应商编号',bSortable:false,data:function(row,type,set){
						 if(!Common.isEmpty(row.supplierNo)){
							 return row.supplierNo;
						 }
						 return '';	 
					}},
					{title:'供应商名称',bSortable:false,data:function(row,type,set){
						 if(!Common.isEmpty(row.supplierName)){
							 return row.supplierName;
						 }
						 return '';	 
					}},
					{title:'客户编号',bSortable:false,data:function(row,type,set){
						 if(!Common.isEmpty(row.customerNo)){
							 return row.customerNo;
						 }
						 return '';	 
					}},
					{title:'客户名称',bSortable:false,searchable:false,data:function(row,type,set){
						 if(!Common.isEmpty(row.customerName)){
							 return row.customerName;
						 }
						 return '';	 
					}},
					{title:'单据日期',bSortable:false,searchable:false,data:function(row,type,set){
						 if(!Common.isEmpty(row.storageDate)){
							 return row.storageDate;
						 }
						 return '';	 
					}},
					{title:'状态',bSortable:false,data:function(row,type,set){
					    return row.status==0?'正常':'关闭';	 
					}},
					{title:'操作',bSortable:false,data:function(row,type,set){
						 return '<a class="btn grey-cascade btn-xs"  href="javascript:;" onclick="Wms.findStorage('+row.storageNo+','+row.customerNo+');"><i class="fa fa-barcode"> </i> 查看发货单</a><br/>';
					}}   
			    ];
		}
		//按钮
		function button(){
			return [{
				className : 'btn blue btn-outline',
				text : '创建发货单','action':function( e, dt, node, config){
					if(e.type=='click'){
						App.modal(getModalObjAdd());
						getGoodTableObj().dataTable().api().ajax.reload();
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
			}];
		}
	}
	var AddWmsTable=function(){
		var oTable = getGoodTableObj().dataTable(App.table({
			columns:colums(),
			buttons:[],
			serverSide:true,
			processing:true,
			ajax:{
				url:getGoodTableObj().attr('action'),
				type:'GET',
				data:function(json){
					return App.tableOrder(json);
				},
				dataSrc:function(json){
					return json.data;
				}
			}
		}));
		return oTable;
		//Table列
		function colums(){
			return [
					 {data: "id", bSortable: false,visible:false},
			         {title:'商品编码',bSortable:false,data:function(row,type,set){
		            	 if(!Common.isEmpty(row.goodsID)){
		            		 return row.goodsID;
		            	 }
		            	 return '';
		             },className:'all'},
		             {title:'商品名称',bSortable:false,data:function(row,type,set){
		            	 if(!Common.isEmpty(row.goodsName)){
		            		 return '<input type="hidden" name="goodsNames" value="'+row.goodsName+'"/>'+row.goodsName;
		            	 }
		            	 return '';
		             }},
		             {title:'零售价',bSortable:false,data:function(row,type,set){
		            	 if(!Common.isEmpty(row.retailPrice)){
		            		 return row.retailPrice;
		            	 }
		            	 return '';
		             }},
		             {title:'市场价',bSortable:false,data:function(row,type,set){
		            	 if(!Common.isEmpty(row.marketPrice)){
		            		 return row.marketPrice;
		            	 }
		            	 return '';
		             }},
		             {title:'成本价',bSortable:false,data:function(row,type,set){
		            	 if(!Common.isEmpty(row.costPrice)){
		            		 return row.costPrice;
		            	 }
		            	 return '';
		             }},
		             {title:'  数     量   ',bSortable:false,data:function(row,type,set){
		            	 var str='<input type="text" name="goodsNums" class="form-control" placeholder="数量" value="" />';
		            	 if(!Common.isEmpty(row.id)){
		            		 return str+'<input type="hidden" name="goodsIDs" value="'+row.goodsID+'"/><input type="hidden" name="skuIDs" value="'+row.id+'"/>';
		            	 }
		            	 return '';
				     }},
		             {title:'最小单位',bSortable:false,data:function(row,type,set){
		            	 if(!Common.isEmpty(row.unit)){
		            		 return row.unit;
		            	 }
		            	 return '';
		             }},
		             {title:'体积',bSortable:false,data:function(row,type,set){
		            	 if(!Common.isEmpty(row.volume)){
		            		 return row.volume;
		            	 }
		            	 return '';
		             }},
		             {title:'重量',bSortable:false,data:function(row,type,set){
		            	 if(!Common.isEmpty(row.weight)){
		            		 return row.weight;
		            	 }
		            	 return '';
		             }},
		             {title:'保质期(天)',bSortable:false,data:function(row,type,set){
		            	 if(!Common.isEmpty(row.shelfLifePeriod)){
		            		 return row.shelfLifePeriod;
		            	 }
		            	 return '';
		             }},
		             {title:'出厂日期',bSortable:false,data:function(row,type,set){
		            	 if(!Common.isEmpty(row.dateOfProduction)){
		            		 return row.dateOfProduction;
		            	 }
		            	 return '';
		             }},
		             {title:'消费者返现比例',bSortable:false,data:function(row,type,set){
		            	 if(!Common.isEmpty(row.custmrRebateRatio)){
		            		 return row.custmrRebateRatio+' %';
		            	 }
		            	 return '';
		             }},
		             {title:'商家返现比例',bSortable:false,data:function(row,type,set){
		            	 if(!Common.isEmpty(row.shopProfitRatio)){
		            		 return row.shopProfitRatio+' %';
		            	 }
		            	 return '';
		             }},
		             {title:'供应商返现比例',bSortable:false,data:function(row,type,set){
		            	 if(!Common.isEmpty(row.supplyRebateRatio)){
		            		 return row.supplyRebateRatio+' %';
		            	 }
		            	 return '';
		             }},
		             {title:'省级代理返现比例',bSortable:false,data:function(row,type,set){
		            	 if(!Common.isEmpty(row.rebateProvince)){
		            		 return row.rebateProvince+' %';
		            	 }
		            	 return '';
		             }},
		             {title:'市级代理返现比例',bSortable:false,data:function(row,type,set){
		            	 if(!Common.isEmpty(row.rebateCity)){
		            		 return row.rebateCity+' %';
		            	 }
		            	 return '';
		             }},
		             {title:'县级代理返现比例',bSortable:false,data:function(row,type,set){
		            	 if(!Common.isEmpty(row.rebateArea)){
		            		 return row.rebateArea+' %';
		            	 }
		            	 return '';
		             }},
		             {title:'商品简介',bSortable:false,data:function(row,type,set){
		            	 if(!Common.isEmpty(row.intro)){
		            		 return row.intro;
		            	 }
		            	 return '';
		             }},
		             {title:'税率',bSortable:false,data:function(row,type,set){
		            	 if(!Common.isEmpty(row.taxRate)){
		            		 return row.taxRate;
		            	 }
		            	 return '';
		             }},
		             {title:'',bSortable:false,data:function(row,type,set){
		            	 if(!Common.isEmpty(row.goodsInfos)){
		            		 return buildTablePhotoHtml(row.goodsInfos);
		            	 }
		            	 return '';
		             },className:'none'}
			    ];
		}
	}
	var buildTablePhotoHtml=function(data){
		if(Common.isEmpty(data)){
			return '';
		}
		var html="";
		$.each(data,function(i,v){
			 html+='<div class="form-group">图片：<div style="width:100px;height:100px;"><input type="hidden" name="goodsImgs" value="'+v.image+'"/><img src="'+v.image+'" class="img-responsive" alt=""></div></div>';
		});
		return html;
	}
	
	var queryStorageTable=function(storageNo){
		var oTable = getQueryStorageTableObj().dataTable(App.table({
			columns:colums(),
			buttons:button(),
			serverSide:true,
			processing:true,
			ajax:{
				url:getQueryStorageTableObj().attr('action')+"?storageNo="+storageNo,
				type:'GET',
				data:function(json){
					return App.tableOrder(json);
				},
				dataSrc:function(json){
					return json.data;
				}
			}
		}));
		return oTable;
		//Table列
		function colums(){
			return [
					 {data: "id", bSortable: false,visible:false},
		             {title:'商品编号',bSortable:false,data:function(row,type,set){
		            	 if(!Common.isEmpty(row.goodsID)){
		            		 return row.goodsID;
		            	 }
		            	 return '';
		             },className:'all'},
		             {title:'商品名称',bSortable:false,data:function(row,type,set){
		            	 if(!Common.isEmpty(row.goodsName)){
		            		 return row.goodsName;
		            	 }
		            	 return '';
		             }},
		             {title:'商品主图',bSortable:false,data:function(row,type,set){
		            	 if(!Common.isEmpty(row.goodsImg)){
		            		 return '<div style="width:80px;height:80px;"><img src="'+row.goodsImg+'" class="img-responsive" alt=""> </div>';
		            	 }
		            	 return '';
		             }},
		             {title:'数量',bSortable:false,data:function(row,type,set){
		            	 if(!Common.isEmpty(row.num)){
		            		 return row.num;
		            	 }
		            	 return '';
				     }},
		             {title:'',bSortable:false,data:function(row,type,set){
		            	 if(!Common.isEmpty(row.goodsSkuInfos)){
		            		 return buildTableHtml(row.goodsSkuInfos);
		            	 }
		            	 return '';
		             },className:'none'}
			    ];
		}
		//按钮
		function button(){
			return [{
					extend : 'print',
					className : 'btn dark btn-outline',
					text : '打印'
				}, {
					extend : 'pdf',
					className : 'btn green btn-outline'
				}, {
					extend : 'csv',
					className : 'btn purple btn-outline '
				}];
		}
	}
	var buildTableHtml=function(data){
		if(Common.isEmpty(data)){
			return '';
		}
		var html="<table class='table table-striped table-bordered table-hover dt-responsive' width='100%'>";
		$.each(data,function(i,v){
			 var retailPrice=Common.isEmpty(v.retailPrice)?'':v.retailPrice;
			 var marketPrice=Common.isEmpty(v.marketPrice)?'':v.marketPrice;
			 var costPrice=Common.isEmpty(v.costPrice)?'':v.costPrice;
			 var unit=Common.isEmpty(v.unit)?'':v.unit;
			 var volume=Common.isEmpty(v.volume)?'':v.volume;
			 var weight=Common.isEmpty(v.weight)?'':v.weight;
			 var size=Common.isEmpty(v.size)?'':v.size;
			 var specification=Common.isEmpty(v.specification)?'':v.specification;
			 var shelfLifePeriod=Common.isEmpty(v.shelfLifePeriod)?'':v.shelfLifePeriod;
			 var dateOfProduction=Common.isEmpty(v.dateOfProduction)?'':v.dateOfProduction;
			 var custmrRebateRatio=Common.isEmpty(v.shopProfitRatio)?'':v.custmrRebateRatio;
			 var shopProfitRatio=Common.isEmpty(v.shopProfitRatio)?'':v.shopProfitRatio;
			 var supplyRebateRatio=Common.isEmpty(v.supplyRebateRatio)?'':v.supplyRebateRatio;
			 var rebateProvince=Common.isEmpty(v.rebateProvince)?'':v.rebateProvince;
			 var rebateCity=Common.isEmpty(v.rebateCity)?'':v.rebateCity;
			 var rebateArea=Common.isEmpty(v.rebateArea)?'':v.rebateArea;
			 var intro=Common.isEmpty(v.intro)?'':v.intro;
			 var taxRate=Common.isEmpty(v.taxRate)?'':v.taxRate;
			 var goodsPhotoInfos=Common.isEmpty(v.goodsPhotoInfos)?'':v.goodsPhotoInfos;
			 html+='<tr>';
			 html+='<td><input type="hidden" name="skuIds" value="'+v.id+'"/><div class="form-group">零售价 : '+retailPrice+'</div></td>';
			 html+='<td><div class="form-group">市场价 : '+marketPrice+'</div></td>';
			 html+='<td><div class="form-group">成本价 : '+costPrice+'</div></td>';
			 html+='<td><div class="form-group">最小单位 : '+unit+'</div></td>';
			 html+='<td><div class="form-group">体积 : '+volume+'</div></td>';
			 html+='<td><div class="form-group">重量 : '+weight+'</div></td>';
			 html+='</tr>';
			 html+='<tr>';
			 html+='<td><div class="form-group">尺寸尺码 : '+size+'</div></td>';
			 html+='<td><div class="form-group">颜色 : '+specification+'</div></td>';
			 html+='<td><div class="form-group">保质期 : '+shelfLifePeriod+'天</div></td>';
			 html+='<td><div class="form-group">出厂日期 : '+dateOfProduction+'</div></td>';
			 html+='<td><div class="form-group">商品简介：'+intro+'</div></td>';
			 html+='<td><div class="form-group">税率: '+taxRate+'</div></td>';
			 html+='</tr>';
			 html+='<tr>';
			 html+='<td><div class="form-group">消费者返现比例 : '+custmrRebateRatio+'%</div></td>';
			 html+='<td><div class="form-group">商家返现比例 : '+shopProfitRatio+'%</div></td>';
			 html+='<td><div class="form-group">供应商返现比例 : '+supplyRebateRatio+'%</div></td>';
			 html+='<td><div class="form-group">省级代理返现比例 : '+rebateProvince+'%</div></td>';
			 html+='<td><div class="form-group">市级代理返现比例 : '+rebateCity+'%</div></td>';	
			 html+='<td><div class="form-group">县级代理返现比例 : '+rebateArea+'%</div></td>';
			 html+='</tr>';
			 html+='<tr>';
			 html+='<td><div class="form-group">图片：</div></td>';
			 var imgPhoto="";
			 html+='<td colspan="5"><div style="width:100px;height:100px;"><img src="'+goodsPhotoInfos+'" class="img-responsive" alt=""> </div></td>';
			 html+='</tr>';
		});
		html+='</table>';
		return html;
	}
	return {
		init:function(){
			initWmsTable();
			AddWmsTable();
			getModalObjAdd().on("hidden.bs.modal", function() {
				App.emptyForm(getModalAddForm());
			});
		},
		save:function(e){
			$('#customerName').val($('#customerNo option:selected').text());
			$('#supplierName').val($('#supplierNo option:selected').text());
			var form=getModalAddForm();
			var data=App.getFormData(form);
			App.ajax({
				form:form,
				success:function(msg){
					var str='新增成功';							
					swal("操作成功！", str,"success");
					getModalObjAdd().modal("hide");
					getOTableObj().dataTable().api().ajax.reload(null,false);
				},
				error:function(XMLHttpRequest, textStatus, errorThrown){
					swal("操作失败！", "新增失败!系统错误,请联系管理员", "error");
				}
			});
		},
		findStorage:function(storageNo,customerNo){
			App.modal(getModalObjQuery());
			$.ajax({
				url:'/wms/queryStorageInfo',
				data:"storageNo="+storageNo,
				dataType:'JSON',
				type:'get',
				success:function(data){
					var data = eval(data);
					var json=data.data;
					var obj = eval('(' + json + ')');
					$('#queryStorageNo').val(obj.storageNo);
					$('#queryStorageDate').val(obj.storageDate);
					$('#queryCustomerName').val(obj.customerName);
					$('#querySupplierName').val(obj.supplierName);
				},
				error:function(XMLHttpRequest, textStatus, errorThrown){
						var v={type:'error',message:'查看信息失败!系统错误,请联系管理员.'};
        			Common.tips(v);
				}
			});
			$('#code').empty();
			$('#code').qrcode({width: 100, height:100,correctLevel:0,text:storageNo+","+customerNo});
			queryStorageTable(storageNo);
		}
	}
}();
jQuery(document).ready(function() {
	Wms.init();
});

