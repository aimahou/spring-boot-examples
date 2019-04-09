var Goods=function(){
	
	var refreshTable=function(){
		var table=$('#goods_table');
		table.bootstrapTable('refresh'); 
	} 
	return {
		init:function(e){	
			$('button#search',$('#goods_search_form')).on('click',function(){
				refreshTable();
			});
			$('body').on('goods.modify',function(event,type){
				if(type=='refresh'){
					refreshTable();
				}
			});
		},
		toState:function(data,rows,index){
			 return data==0?'上架':'下架';
		},
		openDetailView:function(e,id){
			var th=$(e);
    		var i=$('i',th);
    		var tr=th.parents('tr');
    		var colspan=$('thead tr th',tr.parents('table')).length;
    		$('tr.detail-view',tr.parents('table')).remove();
    		//展开
    		if(i.hasClass('fa-plus-circle')){
    			th.attr('title','收回');
    			var btn=$('.detail-view-btn',tr.parents('table')).attr('title','展开');
    			$('i',btn).removeClass('fa-minus-circle font-green').addClass('fa-plus-circle bg-font-default');
    			i.removeClass('fa-plus-circle bg-font-default').addClass('fa-minus-circle font-green');
    			var nowTr=$('<tr class="detail-view"><td colspan="'+colspan+'"></td></tr>');
    			var data=JSON.parse(unescape(th.data('data')));
    			var html=GoodsTemplate.init(data,$('#files'));
    			$('td',nowTr).html(html);
    			tr.after(nowTr);
    		}else{
    			th.attr('title','展开');
    			i.removeClass('fa-minus-circle font-green').addClass('fa-plus-circle bg-font-default');
    		}
		},
		toName:function(data,rows,index){
			var str=escape(JSON.stringify(rows));
    		return '<span style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;"  title="'+data+'"><a data-data="'+str+'" class="detail-view-btn" title="展开" onclick="Goods.openDetailView(this);" href="javascript:;"><i class="fa fa-plus-circle bg-font-default" ></i></a> '+data+'</span>';
		},
		toBtns:function(data,rows,index){
    	  var str=escape(JSON.stringify(rows));
    	  var btn='<div data-data="'+str+'">';
      	  if(rows.state==0){
      		  btn=btn+'<a class="btn btn-xs red" href="javascript:;" onclick="Goods.updateState('+rows.id+','+rows.state+');"><i class="fa fa-times"></i> 下架</a>';
      	  }else{
      		  btn=btn+'<a class="btn btn-xs red" href="javascript:;" onclick="Goods.updateState('+rows.id+','+rows.state+');"><i class="fa fa-times"></i> 上架</a>';
      		  btn=btn+'<a class="btn btn-xs red" href="javascript:;" onclick="Goods.remove('+rows.id+');"><i class="fa fa-times"></i> 删除</a>';
      	  }
      	  btn+='</div>';
      	  return btn;
    	},
		tab:function(e){
			if($(e).hasClass('active')){
				return;
			}
			var tab=$(e).data('tab');
			$(e).parent().find('li').removeClass('active');
			$(e).addClass('active');
			$('div.tab-main-html[data-tab]',$(e).parent().parent().parent()).addClass('hide');
			$('div.tab-main-html[data-tab="'+tab+'"]',$(e).parent().parent().parent()).removeClass('hide');
		},
		updateState:function(id,state){
			var status=state==0?1:0;
			var data={'id':id,'state':status};
			var btnStr=state==0?'下架':'上架';
			$.extend(data,getToken());
			var url='/goods/updateState',type='POST';
			swal({
				title: "Are you sure?",  
		        text: "确定要"+btnStr+"这个商品吗！",  
		        type: "warning", 
		        showCancelButton: true, 
		        closeOnConfirm: false, 
		        closeOnCancel:false,
		        cancelButtonText:'我再考虑一下',
		        confirmButtonText: "是的，我要"+btnStr, 
		        confirmButtonColor: "#ec6c62",
		        showLoaderOnConfirm:true,
			  },function(isConfirm){
				  if(isConfirm){
					  $.post(url,data).always(function(data,state){
						  if(state!='success'&&isEmpty(data)){
							  swal("操作提示", '系统错误','error'); 
							  return;
						  }
						  swal("操作提示", data.message,'warning');  	
						  refreshTable();
					  });
				  }else{
					  swal("取消", "感谢您的高抬贵手 :)", "error");
				  }			  
			  }); 
		},
		remove:function(id){
			var data=getToken();
	    	data['id']=id;
			remove('/goods/remove',data,function(){
				refreshTable();
			}); 
		}
	}
}();