/**
 * 商品页面模版 商品页面和添加商品页面都需要显示商品详情 所以抽象出来 做统一的处理
 */
var GoodsTemplate = function() {
	var template = '<div><div class="row" style="width:98%;">'
			+'<input type="file" style="display:none;" class="goods-upload" accept="image/jpeg,image/gif,image/png"/>'
			+ '<div class="mt-element-card mt-element-overlay">'
			+ '<div class="col-md-4 col-sm-6 col-xs-12" style="min-width:480px;">'
			+ '<div class="margin-left-10" data-type="image"></div>'
			+ '<div class="small-img">'
			+ '<div class="scroll scroll-left disabled" onclick="GoodsTemplate.scrollImg(this);"><i class="fa fa-chevron-left"></i></div>'
			+ '<div class="image-menu"  data-type="thumbnails"></div>'
			+ '<div class="scroll scroll-right" onclick="GoodsTemplate.scrollImg(this);"><i class="fa fa-chevron-right"></i></div>'
			+ '</div>'
			+ '</div>'
			+ '<div class="col-md-6 col-sm-6 col-xs-12">'
			+ '<h1 class="goods-title" data-type="goodsName"></h1>'
			+ '<ul class="nav nav-stacked goods-ul" data-type="spec" ></ul>'
			+ '</div>'
			+'<div class="col-md-12 col-sm-12 col-xs-12 goods_edit">'
			+'<span class="goods-title" style="font-size:14px;color:#000000;">点击 <a class=" grey-cascade" href="javascript:;" onclick="GoodsTemplate.update(this,\'image\');" title="编辑图片顺序。"><i class="fa fa-edit"></i></a> 编辑图片顺序和主图</span>'
			+'<p><span class="goods-title" style="font-size:12px;color:red;"><span class="label label-danger">note:</span> 图片上传会自动提交,上传后无法找回原来的图片,请谨慎操作！！</span></p>'
			+'</div>'
			+ '<div class="col-md-12 col-sm-12 col-xs-12 tab-main">'
			+ '<ul><li class="active" data-tab="details" onclick="GoodsTemplate.tab(this);">商品详情</li><li data-tab="pack" onclick="GoodsTemplate.tab(this);">规格和包装</li><li data-tab="evaluate" onclick="GoodsTemplate.tab(this);">商品评价</li></ul>'
			+ '</div>'
			+ '<div class="col-md-12 col-sm-12 col-xs-12 tab-main-html" data-tab="details" data-type="details">暂无详情</div>'
			+ '<div class="col-md-12 col-sm-12 col-xs-12 hide tab-main-html" data-tab="pack" data-type="pack">暂无</div>'
			+ '<div class="col-md-12 col-sm-12 col-xs-12 hide tab-main-html" data-tab="evaluate" data-type="evaluate">暂无评价</div>'
			+ '</div>' + '</div></div>';
	var modalHtml='<div class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'
		+'<div class="modal-dialog">'
		+'<div class="modal-content">'
		+'<div class="modal-header">'
		+'<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'
		+'<h4 class="modal-title" id="myModalLabel">修改商品</h4>'
		+'</div>'
		+'<div class="modal-body"></div>'
		+'<div class="modal-footer">'
		+'<button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>'
		+'<button type="button" class="btn btn-primary" id="submit">提交</button>'
		+'</div>'
		+'</div>'
		+'</div>'
		+'</div>';
	var max=7;
	var file;
	var goods_spec;
	var goods_data;
	var analysis = function(data,file,i) {
		var goodsSkuList = data.goodsSkuList;
		i = isEmpty(i) ? 0 : i;
		var first = {};
		if (!isEmpty(goodsSkuList)) {
			i = goodsSkuList.length >= (parseInt(i) + 1) ? i
					: (goodsSkuList.length - 1);
			first = goodsSkuList[i];
		}
		var goods = $.extend(data, first);
		var html = $(template);
		goods_data=goods;
		$('[data-type]', html).each(function() {
			var th = $(this);
			var type = th.data('type');
			
			analysisType(type,th,goods,file);
		});
		return html;
	}
	
	var analysisType = function(type, e, data,file) {
		switch (type) {
		case 'goodsName':
			e.html(data.name+' <a class=" grey-cascade goods_edit" href="javascript:;" onclick="GoodsTemplate.update(this,\'goods\');" title="编辑商品名称，属性"><i class="fa fa-edit"></i></a>');/*<a class=" grey-cascade" href="javascript:;" onclick="GoodsTemplate.update(this);" title="编辑商品名称，属性"><i class="fa fa-edit"></i></a>*/
			break;
		case 'spec':
			e.html(handleSpec(data,e));
			break;
		case 'thumbnails':
			e.html(handleThumbnails(data,file));
			break;
		case 'image':
			e.html(handleImage(data));
			break;
		case 'details':
			var detailsList=data.goodsDetailsList;
			var detailHtml=data.details;
			if(!isEmpty(detailsList)){
				detailHtml='';
				$.each(detailsList,function(i,v){
					var context=v.context;
					detailHtml+=context;
				});
			}
			if(isEmpty(detailHtml)){
				detailHtml='<span>暂无详情  <a class=" grey-cascade goods_edit" href="javascript:;" onclick="GoodsTemplate.update(this,\''+type+'\');" title="修改详情"><i class="fa fa-edit"></i></a></span>';
			}			
			e.html(detailHtml);
			break;
		case 'pack':
			e.html('<span>暂无内容  <a class=" grey-cascade goods_edit" href="javascript:;" onclick="GoodsTemplate.update(this,\''+type+'\');" title="编辑包装"><i class="fa fa-edit"></i></a></span>');
			break;
		default:
			break;
		}
	}
	//大图
	var handleImage=function(data){
		var html='';
		var photoList=data.photoList;
		if(!isEmpty(photoList)){
			var v=photoList[0];
			html='<img src="'+v.path+'@400h_400w" alt="'+data.name+'" width="400px;" height="400px;"/>';
		}
		return html;
	}
	//小图
	var handleThumbnails=function(goods,file){
		var id;
		if(!isEmpty(file)){
			id=file.attr('id');
		}
		var ul=$('<div></div>');
		var photoList=goods.photoList;
		//if(!isEmpty(photoList)){ 
			var length=photoList.length;
			for(var i=0;i<max;i++){
				var div=$('<div onmouseover="GoodsTemplate.thumbnails(this);" onmouseout="GoodsTemplate.thumbnailsOut(this);"  class="thumbnails"></div>').appendTo(ul);
				if(i==0){
					div.addClass('active');
				}else{
					/*var topBtn=$('<span class="mt-overlay top  hide dropdown"></span>').appendTo(div);
					$('<a class=" dropdown-toggle" data-toggle="dropdown" >设为i</a>').appendTo(topBtn);
					$('<ul class="dropdown-menu" role="menu"><li>123</li></ul>').appendTo(topBtn);*/
				}
				//$('<a class="mt-overlay top upload " href="javascript:;" onclick="GoodsTemplate.upload(this);" title="删除图片"></a>').appendTo(div);
				$('<a class="mt-overlay none upload goods_edit" href="javascript:;">添加图片</a>').appendTo(div);
				if(length>i){
					var v=photoList[i];
					$('<img src="'+v.path+'@70h_70w" alt="'+goods.name+'" style="width:70px;height:70px;" class="img-thumbnail"/>').appendTo(div);
					if(i==0){
						$('img',div).attr('title','主图');
						div.addClass('main');
						
					}else{
						$('.mt-overlay.top',div).removeClass('hide');
					}
					$('.mt-overlay.none',div).html('替换图片').removeClass('none').attr('onclick','GoodsTemplate.upload(this,\''+id+'\');');
				}else{
					div.attr('onclick','GoodsTemplate.upload(this,\''+id+'\');');
				}
				if(i>3){
					div.addClass('hide');
				}
			}
	//	}
		return ul.html();
	}
	//处理规格
	var handleSpec=function(goods,e){
		var shopList=goods.shopList;
		var stockNum=0;
		if(!isEmpty(shopList)){
			$.each(shopList,function(i,v){
				stockNum+=obj2number(v.stockNum,0);
			})
		}
		var unit=isEmpty(goods.unit)?'':goods.unit;
		var spec=[
			{'id':'purchasePrice','name':'成本价','value':obj2number(goods.purchasePrice,goods.price),unit:'&yen;',position:'prefix'},
			{'id':'price','name':'零售价','value':goods.price,unit:'&yen;',position:'prefix'},
			/*{'id':'rebateConsumers','name':'消费者返利','value':goods.rebateConsumers,unit:'%',position:'Suffix',type:'nonessential'},
			{'id':'rebateSeller','name':'商家返利','value':goods.rebateSeller,unit:'%',position:'Suffix',type:'nonessential'},
			{'id':'rebateSupply','name':'供应链返利','value':goods.rebateSupply,unit:'%',position:'Suffix',type:'nonessential'},
			{'id':'rebateProvince','name':'代理商(县)返利','value':goods.rebateProvince,unit:'%',position:'Suffix',type:'nonessential'},
			{'id':'rebateCity','name':'代理商(市)返利','value':goods.rebateCity,unit:'%',position:'Suffix',type:'nonessential'},
			{'id':'rebateArea','name':'代理商(县/区)返利','value':goods.rebateArea,unit:'%',position:'Suffix',type:'nonessential'},*/
			{'id':'returnPointPercent','name':'现金消费返积分比例','value':goods.returnPointPercent,unit:'%',position:'Suffix',type:'slider'},
			{'id':'deductPricePercent','name':'积分消费抵扣百分比','value':goods.deductPricePercent,unit:'%',position:'Suffix',type:'slider'},
			{'id':'weight','name':'重   量','value':goods.weight,unit:'kg',position:'Suffix',type:'slider',},
			{'id':'volume','name':'体  积','value':goods.volume,unit:'M<sup>3</sup>',position:'Suffix',type:'slider'}, 
			{'id':'stockNum','name':'库  存','value':stockNum,unit:unit,position:'Suffix'}  
		    ];
		goods_spec=spec;
		var ul=handleDescription(spec);
		goods_spec.unshift({'id':'name','name':'商品名称','value':goods.name,unit:'',position:''});
		return ul.html();
	}
	var obj2number=function(obj,defaultV,len){
		defaultV= defaultV || 0;
		obj=isEmpty(obj)?defaultV:obj;
		obj=parseInt(obj);
		obj=isNaN(obj)?defaultV:obj;
		return obj;
	}
	//处理详情
	var handleDescription=function(data){
		var ul=$('<ul class="nav nav-stacked goods-ul"></ul>');
		if(isEmpty(data)){
			return ul;
		}
		$.each(data,function(i,v){
			var value=v.value;
			if(isEmpty(value)){
				value=0;
			}
			var type=v.type;
			if('nonessential'==type){
				if(value<1){
					return true;
				}
			}
			var li=$('<li></li>').appendTo(ul);
			var span=$('<span class="title">'+v.name+'：</span>').appendTo(li);
			var position=v.position;
			if(position=='Suffix'){
				$('<span class="sbold">'+value+v.unit+'</span> ').appendTo(li);
			}else{
				$('<span class="sbold">'+v.unit+value+' </span> ').appendTo(li);
			}	
		});
		return ul;
	}
	//获取大图
	var getMaxImg=function(src){
		var arr=src.split('@');
		var maxImg='';
		for(var i=0;i<(arr.length-1);i++){
			if(i>0){
				maxImg=maxImg+'@';
			}
			maxImg=maxImg+arr[i];
		}
		return maxImg+'@400h_400w';
	}
	//滑动
	var scroll=function(ul,start,end){
		$('.thumbnails',ul).addClass('hide');
		$('.thumbnails',ul).each(function(i){
			if(i>=start&&i<=end){
				$(this).removeClass('hide');
			}
		});
	}
	var thumbnailsActive=function(e){
		var th=$(e);
		if(th.hasClass('active')){
			return ;
		}
		var container=th.parent();
		$('.thumbnails.active',container).removeClass('active');
		th.addClass('active');
		var img=$('img',th).first();
		if(img.length==0){
			return;
		}
		var src=img.attr('src');
		var maxImg=getMaxImg(src);
		$('div.margin-left-10[data-type="image"] img',$(e).parents('.col-xs-12')).attr('src',maxImg);
	}
	var handleScrollImg=function(e){
		var th=$(e);
		if(th.hasClass('disabled')){
			return;
		}
		var container=th.parent();
		var images=$('.image-menu',container);
		$('.scroll-right,.scroll-left',container).addClass('disabled');
		var show=$('.thumbnails:visible',container);
		var hide=$('.thumbnails:hidden',container);
		if(th.hasClass('scroll-right')){
			var index=show.last().index();
			var start=index+1;
			var end=index+4;
			scroll(images,start,end);
		}else{
			var index=show.first().index();
			var start=index-4;
			var end=index-1;
			scroll(images,start,end);
		}
		var thumbnails=$('.thumbnails',images);
		if(thumbnails.last().hasClass('hide')){
			$('.scroll-right',container).removeClass('disabled');
		}
		if(thumbnails.not('.hide').first().prevAll().length>0){
			$('.scroll-left',container).removeClass('disabled');
		}
	}
	var openImage=function(e){
		var image=getImage(e);
		var arr=image.split(',');
		var modal=$('div#goods-image.modal');
		if(modal.length<1){
			modal=$(modalHtml).appendTo($('body'));
			modal.attr('id','goods-image');			
		}
		$('.modal-body',modal).empty();
		var form=$('<form action="" class="form-horizontal" autocomplete="off"  novalidate="novalidate" role="form" method="post"></form>');
		$('<input type="hidden" value="'+goods_data.dmId+'" name="skuId" id="skuId"/>').appendTo(form);
		$('<input type="hidden" value="'+goods_data.goodsId+'" name="goodsId" id="goodsId"/>').appendTo(form);
		$('<input type="hidden" value="" name="images" id="images"/>').appendTo(form);
		var row=$('<div class="mt-element-card mt-element-overlay"><div class="row"></div></div>').appendTo(form);
		$.each(arr,function(i,v){
			if(isEmpty(v)){
				return true;
			}
			var html=getImageHtml(v,i);
			$(html).appendTo($('.row',row));
		});
		var token=getToken();
		for(t in token){
			$('<input type="hidden" value="'+token[t]+'" name="'+t+'" id="'+t+'"/>').appendTo(form);
		}
		form.appendTo($('.modal-body',modal));
		form.attr('action','/goods/modify/photo');
		modal.modal();
		$('#submit',modal).off().on('click',function(){
			var th=$(this);
			var modal=th.parents('.modal');
			var image=$('img',$('.thumbnails-modal',modal));
			var images='';
			image.each(function(i){
				if(i>0){
					images+=',';
				}
				images+=$(this).attr('src');
			});
			$('#images',modal).val(images);
			var btn=$(this);
			$.ajax({
				type:'POST',
				url:form.attr('action'),
				cache:false,
				data:form.serialize(),
				dataType:'JSON',
				beforeSend:function(){
					btn.addClass('disabled');
				},
				success:function(data){
					var flag=data.flag;
					var message=isEmpty(data.message)?'操作成功':data.message;
					if(flag==true){
						swal(': )',message,'success');
					}else{
						swal('OMG!',message,'error');
					}
				},
				error:function(XMLHttpRequest, textStatus, errorThrown){
					swal('OMG!','系统错误,请联系管理员处理该错误.','error');
				},
				complete:function(){
					btn.removeClass('disabled');
					modal.modal('hide');
					//刷新数据 表格
					$('body').trigger($.Event('goods.modify'),['refresh']);
				}
			});
		});
	}
	
	var getImageHtml=function(path,i){
		if(isEmpty(path)||isEmpty(i)){
			return;
		}
		var html='<div class="col-lg-3 col-md-4 col-sm-6 col-xs-12 thumbnails-modal ">';
			html+='<div class="mt-card-item">';
			if(i!=0){
				html+='<div class="mt-card-avatar mt-overlay-1 mt-scroll-down">';
			}
			html+='<img src="'+path+'" alt="'+goods_data.name+'_'+i+'" style="width: 100%;height: 100%;"/><div class="mt-overlay mt-top">';
		if(i!=0){
			html+='<ul class="mt-info"><li><a class="btn default btn-outline " href="javascript:;" title="删除" onclick="GoodsTemplate.remove(this);"><i class="fa fa-times"></i></a></li><li><a class="btn default btn-outline" href="javascript:;" title="设为主图" onclick="GoodsTemplate.setMain(this);"><i class="fa fa-share-alt"></i></a></li></ul>';
		}
		html+='</div>';
		if(i!=0){
			html+='</div>';
		}
		if(i!=0){
			html+='<div class="mt-card-content"><div class="mt-card-social"><ul><li><span>详情图</span></li></ul></div></div>';
		}else{
			html+='<div class="mt-card-content"><div class="mt-card-social"><ul><li><span>主图</span></li></ul></div></div>';
		}
		
		html=html+'</div></div>';
		
		return html;
		
	}
	//商品规格 名称 修改modal
	var openSpec=function(e){
		var modal=$('div#goods-spec.modal');
		if(modal.length<1){
			modal=$(modalHtml).appendTo($('body'));
			modal.attr('id','goods-spec');			
		}
		$('.modal-body',modal).empty();
		var shopId=0;
		if(!isEmpty(goods_data.shopList)){
			var shop=goods_data.shopList[0];
			shopId=shop.dmId;
		}
		var form=$('<form action="" class="form-horizontal" autocomplete="off"  novalidate="novalidate" role="form" method="post"></form>');
		$('<input type="hidden" value="'+goods_data.dmId+'" name="skuId" id="skuId"/>').appendTo(form);
		$('<input type="hidden" value="'+goods_data.goodsId+'" name="goodsId" id="goodsId"/>').appendTo(form);
		$('<input type="hidden" value="'+shopId+'" name="shopId" id="shopId"/>').appendTo(form);
		$.each(goods_spec,function(i,v){
			var id=v.id;
			var name=v.name;
			var value=v.value;
			var unit=v.unit;
			var position=v.position;
			var group=$('<div class="form-group"></div>').appendTo(form);
			$('<label class="col-md-3 control-label" for="'+id+'">'+name+'</label>').appendTo(group);
			var div=$('<div class="col-md-9"></div>').appendTo(group);
			if(!isEmpty(unit)){
				div=$('<div class="input-group"></div>').appendTo(div);
				if(position=='prefix'){
					$('<span class="input-group-addon">'+unit+'</span>').appendTo(div);
				}
			}
			$('<input type="text" id="'+id+'" name="'+id+'" class="form-control" placeholder="'+name+'" value="'+value+'" />').appendTo(div);
			if(!isEmpty(unit)&&position!='prefix'){
				$('<span class="input-group-addon">'+unit+'</span>').appendTo(div);
			}
		});
		var group=$('<div class="form-group"></div>').appendTo(form);
		$('<label class="col-md-3 control-label" for="mallSupplierId">供应商</label>').appendTo(group);
		var div=$('<div class="col-md-9"><select class="form-control select2-multiple" id="mallSupplierId" name="mallSupplierId"></select></div>').appendTo(group);
		gys(div,goods_data.mallSupplierId);
		validate(form);
		form.attr('action','/goods/modify/goods');
		var token=getToken();
		for(t in token){
			$('<input type="hidden" value="'+token[t]+'" name="'+t+'" id="'+t+'"/>').appendTo(form);
		}
		form.appendTo($('.modal-body',modal));
		$('#submit',modal).on('click',function(){
			if(!form.validate().form()){
				return;
			}
			if(isEmpty($('#mallSupplierId',form).val())){
				swal('OMG!','请选择供应商','error');
				return;
			}
			var btn=$(this);
			$.ajax({
				type:'POST',
				url:form.attr('action'),
				cache:false,
				data:form.serialize(),
				dataType:'JSON',
				beforeSend:function(){
					btn.addClass('disabled');
				},
				success:function(data){
					var flag=data.flag;
					var message=isEmpty(data.message)?'操作成功':data.message;
					if(flag==true){
						swal(': )',message,'success');
					}else{
						swal('OMG!',message,'error');
					}
				},
				error:function(XMLHttpRequest, textStatus, errorThrown){
					swal('OMG!','系统错误,请联系管理员处理该错误.','error');
				},
				complete:function(){
					btn.removeClass('disabled');
					modal.modal('hide');
					//刷新数据 表格
					$('body').trigger($.Event('goods.modify'),['refresh']);
				}
			});
		});
		modal.modal();
		
	}
	
	var gys=function(e,id){
		var select=$('select',e);
		var data=getmallSupplier();
		var flag=false;
		$.each(data,function(i,v){
			var option=$('<option value="'+v.dmId+'">'+v.name+'</option>').appendTo(select);
			if(id==v.dmId){
				option.attr('selected','selected');
				flag=true;
			}
		})
		if(!flag){
			$('<option value=" " selected="selected">请选择</option>').prependTo(select);
		}
		select.select2({
			placeholder : '请选择',
			allowClear : false,
		});
	}
	
	var validate=function(form){
		var params={
			rules: {
				name:{
					required:true,
					rangelength:[1,80]
				},
				purchasePrice:{
					required : true,
					money : true,
					range : [ 0, 999999999 ]
				},
				price : {
					required : true,
					money : true,
					range : [ 0, 999999999 ],
					gtTo : '#purchasePrice'
				},
				weight : {
					money : true,
					range : [ 0, 100000 ],
				},
				volume : {
					money : true,
					range : [ 0, 100000 ],
				},
				returnPointPercent:{
					money : true,
					range : [ 0, 100 ],
				},deductPricePercent:{
					money : true,
					range : [ 0, 100 ],
				}
			},
			messages:{
				name:{
					required:'请输入商品名称',
					rangelength:'请输入长度在 {0} 到 {1} 之间的字符串(汉字算一个字符)'
				},
				purchasePrice:{
					required : '请输入成本价',
					money : '请输入正确的数字格式,小数点精度为2',
					range :'请输入 {0} 至 {1}之间的数字.',
				},
				price : {
					required : '请输入零售价',
					money : '请输入正确的数字格式,小数点精度为2',
					range : '请输入 {0} 至 {1}之间的数字.',
				},
				weight : {
					money : '请输入正确的数字格式,小数点精度为2',
					range :'请输入 {0} 至 {1}之间的数字.',
				},
				volume : {
					money : '请输入正确的数字格式,小数点精度为2',
					range :'请输入 {0} 至 {1}之间的数字.',
				},
				returnPointPercent:{
					money : '请输入正确的数字格式,小数点精度为2',
					range :'请输入 {0} 至 {1}之间的数字.',
				},deductPricePercent:{
					money : '请输入正确的数字格式,小数点精度为2',
					range :'请输入 {0} 至 {1}之间的数字.',
				}
			}
		}
		form.validate(params);
	}
	var modifyPhoto=function(images){
		var data=getToken();
		var skuId=goods_data.dmId;
		data['skuId']=skuId;
		data['images']=images;
		data['goodsId']=goods_data.goodsId;
		$.ajax({
			type:'POST',
			url:'/goods/modify/photo',
			cache:false,
			data:data,
			dataType:'JSON',
			success:function(data){
				var flag=data.flag;
				var message=isEmpty(data.message)?'操作成功':data.message;
				if(flag!=true){
					swal('OMG!','图片上传失败,图片文件丢失,请重新上传后刷新页面!','error');
				}
			},
			error:function(XMLHttpRequest, textStatus, errorThrown){
				swal('OMG!','系统错误,请联系管理员处理该错误.','error');
			},
			complete:function(){
				//刷新数据 表格
				$('body').trigger($.Event('goods.modify'),['images']);
			}
		});
	}
	var getImage=function(e){
		var images='';
		var image_menu=$('.image-menu',$(e).parents('.mt-element-card'));
		var thumbnails=$('.thumbnails',image_menu);
		var i=0;
		thumbnails.each(function(){
			var flag=false;
			var $this=$(this);
			var img=$('img',$this);
			if(img.length>0){
				var src=img.attr('src');
				src=src.split('@')[0];
				images=images+src;
				i++;
				flag=true;
			}
			if(i>0&&flag){
				images=images+',';
			}
		});	
		return images;
	}
	return {
		init : function(data,file) {
			if (isEmpty(data)) {
				return;
			}
			var html=analysis(data,file);
			var imageMenu=$('.image-menu',html);
			if(isEmpty(file)){
				$('.goods_edit',html).remove();
			}
			return html.html();
		},
		scrollImg:function(e){
			handleScrollImg(e);
		},
		thumbnails:function(e){
			thumbnailsActive(e);
			$('.mt-overlay',$(e).parent()).removeClass('active');
			$('.mt-overlay',$(e)).addClass('active');
			
		},
		thumbnailsOut:function(e){
			var th=$('.mt-overlay',$(e));
			if(th.hasClass('none')){
				return;
			}
			th.removeClass('active');
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
		upload:function(e,id){
			var th=$(e);
			var file=$('#'+id);
			if(!isEmpty(file)&&file.length>0){
				var uploader=file.myUpload().uploader;
				var btn=$('input[type="file"]',$(e).parents('.row'));
				btn.click();
				btn.off().on('change',function(){
					var files=$(this)[0].files;
					uploader.addFile(files[0]);
				});	
			}
			file.off().on('uploader.complete',function(event,files,uploader){
				if(!isEmpty(file)&&file.length>0){
					var imgData=files[0];
					var path=imgData.path;
					var parent=th.parent();
					if(th.hasClass('thumbnails')){
						parent=th;
					}
					var img=$('img',parent);
					if(img.length<1){
						img=$('<img src="" alt="" style="width:70px;height:70px;" class="img-thumbnail"/>').appendTo(parent);
					}
					img.attr('src',path+'@70w_70h');
					$('.mt-overlay.hide',parent).removeClass('hide');
					var none=$('.mt-overlay.none',parent);
					none.removeClass('none').html('替换图片');
					var onclick=parent.attr('onclick');
					parent.removeAttr('onclick');
					none.attr('onclick',onclick);
					$('div.margin-left-10[data-type="image"] img',th.parents('.mt-element-card')).attr('src',path+'@400w_400h');
					
					//统计图片
					var images=getImage(th);
					modifyPhoto(images);
					$.each(files,function(i,v){
						uploader.removeFile(v);
					});
				}
			});
			//uploader.init()
		},
		//设为主图
		setMain:function(e){
			var th=$(e);
			var parent=th.parents('.thumbnails-modal');
			$('.mt-overlay.mt-top',parent).empty();
			$('.mt-card-social ul li',parent).empty().html('<span>主图</span>');
			var down=$('.mt-card-avatar.mt-overlay-1.mt-scroll-down',parent).html();
			$(down).prependTo($('.mt-card-item',parent));
			$('.mt-card-avatar.mt-overlay-1.mt-scroll-down',parent).remove();
			var main=$('.thumbnails-modal',parent.parent()).first();			
			var img=$('img',main);
			main.empty();
			var item=$('<div class="mt-card-item"></div>').appendTo(main);
			var scroll=$('<div class="mt-card-avatar mt-overlay-1 mt-scroll-down"></div>').appendTo(item);
			img.appendTo(scroll);
			var top=$('<div class="mt-overlay mt-top"></div>').appendTo(scroll);
			var ul=$('<ul class="mt-info"><li><a class="btn default btn-outline" href="javascript:;" title="删除" onclick="GoodsTemplate.remove(this);"><i class="fa fa-times"></i></a></li><li class="main"><a class="btn default btn-outline" href="javascript:;" title="设为主图" onclick="GoodsTemplate.setMain(this);"><i class="fa fa-share-alt"></i></a></li></ul>').appendTo(top);
			var content=$('<div class="mt-card-content"></div>').appendTo(item);
			var social=$('<div class="mt-card-social"></div>').appendTo(content);
			$('<ul><li><span>详情图</span></li></ul>').appendTo(social)
			parent.prependTo(parent.parent());
		},
		//删除图片
		remove:function(e){
			var th=$(e);
			var parent=th.parents('.thumbnails-modal');
			parent.remove();
		},
		update:function(e,type){
			switch(type){
			case 'image':
				openImage(e);
				break;
			case 'details':
				break;
			case 'pack':
				break;
			case 'goods':
				openSpec(e);
				break;
			default:
				break;
			}
			
		}
	}

}();