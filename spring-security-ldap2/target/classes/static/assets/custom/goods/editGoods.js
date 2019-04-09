var Goods = function() {
	var handleGoodsClass = function() {
		$('#goodsClass').selectsplitter({
			selectSize : 4
		});
		$('#goodsClass').on('change', function() {
			var selected = $('option[selected=selected]', $(this));
	
			var fine = selected.parent('optgroup').attr('label');
			var second = selected.text();
			var id = selected.val();
            $('#goodsClassId').val(id);
			$('#goodsClassTitle').val(fine + ' > ' + second);
			alertApp('您当前的类目选择是:' + fine + ' > ' + second);
			$(this).nextAll('.help-block-error').addClass('hide');
		});
	}

	var alertApp = function(message) {
		App.alert({
			message : message,
			type : 'success',
			container : '#goodsClass_title',
			place : 'append',
			close : false,
			reset : true,
			focus : false,
			closeInSeconds : '0',
			icon : 'none'
		});
	}

	// 步骤调整
	var handleWizard = function(e) {
		var form = $('#add_goods_form', e);
		$(e).bootstrapWizard({
			'nextSelector' : '#button-next',
			'previousSelector' : '#button-previous',
			onTabClick : function() {
				return false;
			},
			onNext : function(tab, navigation, index) {
				if (form.valid() == false
						|| (index == 1 && validateGoodsClass())
						|| (index == 2 && (validateMallSupplier() || validateImage()))) {
					return false;
				}
				return true;
			},
			onPrevious : function(tab, navigation, index) {

				return true;
			},
			onTabShow : function(tab, navigation, index) {
				var total = navigation.find('li').length, current = index + 1, $percent = (current / total) * 100;
				$('.progress-bar', $(e)).css({
					width : $percent + '%'
				});
				if(total==current){
					goodsDetails();
				}
				handleTitle($(e), tab, navigation, index);
			}
		});
	}
	// 更改wizard Title 和 按钮的显示隐藏
	var handleTitle = function(wizard, tab, navigation, index) {
		// 改变步骤
		var total = navigation.find('li').length, current = index + 1;
		// set wizard title
		$('.step-title', wizard).text(' - 步骤 ' + (index + 1) + ' / ' + total);
		// set done steps
		$('li', wizard).removeClass("done");
		$('li:lt(' + index + ')', wizard).addClass('done');
		$('.button-previous,.button-next,.button-submit', wizard).removeClass(
				'hide');
		if (current == 1) {
			$('.button-previous', wizard).addClass('hide');
		}
		if (current >= total) {
			$('.button-next', wizard).addClass('hide');
		} else {
			$('.button-submit', wizard).addClass('hide');
		}
		App.scrollTo($('.page-title', wizard));
	}
	// 验证GoodsClass
	var validateGoodsClass = function() {
		var flag = false;
		var goodsClass = $('#goodsClassId');
		var goodsClassId = goodsClass.val();
		goodsClass.parents('.form-group').removeClass('has-error');
		goodsClass.nextAll('.help-block-error').addClass('hide');
		if (isEmpty(goodsClassId)) {
			flag = true;
			goodsClass.parents('.form-group').addClass('has-error');
			goodsClass.nextAll('.help-block-error').removeClass('hide')
					.removeAttr('style').html('请选择商品分类.');
		}
		return flag;
	}
	// 选择供应商
	var validateMallSupplier = function() {
		var flag = false;
		var mallSupplier = $('#mallSupplierId');
		var mallSupplierId = mallSupplier.val();
		mallSupplier.parents('.form-group').removeClass('has-error');
		mallSupplier.nextAll('.help-block-error').addClass('hide');
		if (isEmpty(mallSupplierId) || mallSupplierId == '0') {
			flag = true;
			mallSupplier.parents('.form-group').addClass('has-error');
			mallSupplier.nextAll('.help-block-error').removeClass('hide')
					.removeAttr('style').html('请选择供应商.');
		}
		return flag;
	}
	var validateImage = function() {
		var res = false;
		var message = '';
		var pickfiles = $('#pickfiles');
		pickfiles.parents('.form-group').removeClass('has-error');
		pickfiles.nextAll('.help-block-error').addClass('hide');
		var flag = $('.image_uploader',$('#show_image')).length>0;
		if (!flag) {
			res = true;
			pickfiles.parents('.form-group').addClass('has-error');
			pickfiles.nextAll('.help-block-error').removeClass('hide')
					.removeAttr('style').html('主人,至少需要上传一张图片哦   : )');
		}
		return res;
	}
	// 验证
	var validate = function(form) {
		form.validate({
			ignore: ':hidden',
			'rules' : {
				goodsClass : {
					required : true
				},
				purchasePrice : {
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
				name : { // 
					required : true
				},
				mallSupplierId : {
					required : true
				},
				returnPointPercent : {
					money : true,
					range : [ 0, 100 ],
				},
				deductPricePercent : {
					money : true,
					range : [ 0, 100 ],
				},
				rebateConsumers : {
					money : true,
					range : [ 0, 100 ],
				},
				rebateSeller : {
					money : true,
					range : [ 0, 100 ],
				},
				rebateSupply : {
					money : true,
					range : [ 0, 100 ],
				},
				rebateProvince : {
					money : true,
					range : [ 0, 100 ],
				},
				rebateCity : {
					money : true,
					range : [ 0, 100 ],
				},
				rebateArea : {
					money : true,
					range : [ 0, 100 ],
				},
				shelfLifePeriod : {
					digits:true,
					range : [ 0, 100000],
				},
				weight : {
					money : true,
					range : [ 0, 100000 ],
				},
				volume : {
					money : true,
					range : [ 0, 100000 ],
				},
			},
			messages : { // custom messages for radio buttons and checkboxes
				goodsClass : {
					required : '请选择商品分类'
				},
				purchasePrice : {
					required : '请填写市场价',
					money : '请输入正确的数字格式,小数点精度为2',
					range : '请输入 {0} 至 {1}直接的数字.',

				},
				price : {
					required : '请填写零售价',
					money : '请输入正确的数字格式,小数点精度为2',
					range : '请输入 {0} 至 {1}之间的数字.',

				},
				name : {
					required : '请填写商品名称',
				},
				mallSupplierId : {
					required : '请选择供应商',
				},
				returnPointPercent : {
					money : '请输入正确的数字格式,小数点精度为2',
					range : '请输入 {0} 至 {1}之间的数字.',
				},
				deductPricePercent : {
					money : '请输入正确的数字格式,小数点精度为2',
					range : '请输入 {0} 至 {1}之间的数字.',
				},
				rebateConsumers : {
					money : '请输入正确的数字格式,小数点精度为2',
					range : '请输入 {0} 至 {1}之间的数字.',
				},
				rebateSeller : {
					money : '请输入正确的数字格式,小数点精度为2',
					range : '请输入 {0} 至 {1}之间的数字.',
				},
				rebateSupply : {
					money : '请输入正确的数字格式,小数点精度为2',
					range : '请输入 {0} 至 {1}之间的数字.',
				},
				rebateProvince : {
					money : '请输入正确的数字格式,小数点精度为2',
					range : '请输入 {0} 至 {1}之间的数字.',
				},
				rebateCity : {
					money : '请输入正确的数字格式,小数点精度为2',
					range : '请输入 {0} 至 {1}之间的数字.',
				},
				rebateArea : {
					money : '请输入正确的数字格式,小数点精度为2',
					range : '请输入 {0} 至 {1}之间的数字.',
				},
				shelfLifePeriod : {
					digits:'请输入整数',
					range : '请输入 {0} 至 {1}之间的数字.',
				},
				weight : {
					money : '请输入正确的数字格式,小数点精度为2',
					range : '请输入 {0} 至 {1}之间的数字.',
				},
				volume : {
					money : '请输入正确的数字格式,小数点精度为2',
					range : '请输入 {0} 至 {1}之间的数字.',
				},
			},
		});
	}
	var handleMaxlength = function() {
		$('#name').maxlength({
			limitReachedClass : "label label-danger",
			alwaysShow : true,
		});
	}
	// 供应商
	var handleMallSupplier = function() {
		var mallSupplier = $('#mallSupplierId');
		mallSupplier.select2({
			placeholder : '请选择',
			allowClear : false,
			width : '100%'
		});
		mallSupplier.on('change', function() {
			if (!isEmpty($(this).val()) && $(this).val() != '0') {
				$(this).parents('.form-group').removeClass('has-error');
				$(this).nextAll('.help-block-error').addClass('hide');
				$('#mallSupplierTitle').val($('option:selected',$(this)).text());
			} else {
				$(this).parents('.form-group').addClass('has-error');
				$(this).nextAll('.help-block-error').removeClass('hide')
						.removeAttr('style').html('请选择供应商.');
				$('#mallSupplierTitle').val('');
			}
		});
	}
	var imageHtml='<div class="col-md-4 image_uploader">'
		+'<div class="dz-preview dz-processing  dz-complete dz-image-preview">'
		+'<div class="dz-image"></div>'
		+'<div class="dz-details"><div class="dz-size"></div></div>'
		+'<a href="javascript:;" class="btn red btn-sm btn-block remove-btn">删除</a>'
		+'</div></div>';
	// 图片上传
	var handleUpload = function() {
		var pickfiles = $('#pickfiles');
		pickfiles.myUpload();
		pickfiles.off().on('uploader.complete', function(event, files,uploader) {
			$('#show_image').empty();
			var images='';
			$.each(files,function(i,file){
				if(i>0){
					images+=',';
				}
				var path=file.path;
				var size=file.size.toFixed(2);
				var unit=file.unit;
				var html=$(imageHtml);
				images+=path;
				$('<img src="'+path+'@120h_120w" alt="'+file.name+'" style="width:120px;height:120px;"/>').appendTo($('.dz-image',html));
				var details=$('.dz-details',html);
				$('.dz-size',details).html('<strong>'+size+'</strong>'+unit+'<div class="dz-filename">'+file.name+'</div>');
				html.appendTo($('#show_image'));
				$('a.remove-btn',html).on('click',function(){
					$(this).parents('.image_uploader').remove();
					uploader.removeFile(file.id);
				});
			});
			$('#images').val(images);
		});
	}
	var formToJson=function(form){
		var o = {};    
		   var a = form.serializeArray();    
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
		   return o;    
	}
	
	var goodsDetails=function(){
		var form=$('#add_goods_form');
		var data=formToJson(form);
		var images=data['images'];
		if(!isEmpty(images)){
			var photoList=[];
			var arr=images.split(',');
			$.each(arr,function(i,v){
				photoList.push({path:v});
			});
			data['photoList']=photoList;
		}
		var e=$('#goods_details');
		handleDetails(data,e);
	}
	//商品详情
	var handleDetails=function(data,e){
		var goodsSkuList=data.goodsSkuList;
		var first={};
		if(!isEmpty(goodsSkuList)){
			first=goodsSkuList[0];
		}
		var goods=$.extend(data,first);
		$('[data-type]',e).each(function(){
			var type=$(this).data('type');
			switch(type){
			case 'goodsName':
				$(this).html(goods.name);
				break;
			case 'spec':
				$(this).html(handleSpec(goods));
				break;
			case 'thumbnails':
				$(this).html(handleThumbnails(goods)); 
				break;
			case 'image':
				$(this).html(handleImage(goods));
				break;
			default:
				break;
			}
		});
		var photoList=goods.photoList;
		//if(!isEmpty(photoList)&&photoList.length>4){
			$('.scroll-right',e).removeClass('disabled');
		//}
	}
	var handleImage=function(goods){
		var html='';
		var photoList=goods.photoList;
		if(!isEmpty(photoList)){
			var v=photoList[0];
			html='<img src="'+v.path+'@400h_400w" alt="'+goods.name+'" width="400px;" height="400px;"/>';
		}
		return html;
	}
	//处理小图
	var handleThumbnails=function(goods){
		var ul=$('<div></div>');
		var photoList=goods.photoList;
		if(!isEmpty(photoList)){
			//7张图 
			var length=photoList.length;
			var max=7;
			for(var i=0;i<max;i++){
				var div=$('<div onmouseover="Goods.thumbnails(this);" class="thumbnails"></div>').appendTo(ul);
				if(i==0){
					div.addClass('active');
				}
				if(length>i){
					var v=photoList[i];
					$('<img src="'+v.path+'@70h_70w" alt="'+goods.name+'" width="70px;" height="70px;"/>').appendTo(div);
				}
				if(i>3){
					div.addClass('hide');
				}
			}
		}
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
		var mallSupplierTitle=goods.mallSupplierTitle;
		var unit=isEmpty(goods.unit)?'':goods.unit;
		var spec=[
			{'id':'purchasePrice','name':'成本价','value':obj2number(goods.purchasePrice,goods.price),unit:'&yen;',position:'prefix'},
			{'id':'price','name':'零售价','value':goods.price,unit:'&yen;',position:'prefix'},
			/* {'id':'rebateConsumers','name':'消费者返利','value':goods.rebateConsumers,unit:'%',position:'Suffix',type:'slider'},
			{'id':'rebateSeller','name':'商家返利','value':goods.rebateSeller,unit:'%',position:'Suffix',type:'slider'},
			{'id':'rebateSupply','name':'供应链返利','value':goods.rebateSupply,unit:'%',position:'Suffix',type:'slider'},
			{'id':'rebateProvince','name':'代理商(县)返利','value':goods.rebateProvince,unit:'%',position:'Suffix',type:'slider'},
			{'id':'rebateCity','name':'代理商(市)返利','value':goods.rebateCity,unit:'%',position:'Suffix',type:'slider'},
			{'id':'rebateArea','name':'代理商(县/区)返利','value':goods.rebateArea,unit:'%',position:'Suffix',type:'slider'},*/
			{'id':'returnPointPercent','name':'现金消费返积分比例','value':goods.returnPointPercent,unit:'%',position:'Suffix',type:'slider'},
			{'id':'deductPricePercent','name':'积分消费抵扣百分比','value':goods.deductPricePercent,unit:'%',position:'Suffix',type:'slider'},
			{'id':'weight','name':'重   量','value':goods.weight,unit:'kg',position:'Suffix',type:'nonessential',},
			{'id':'volume','name':'体  积','value':goods.volume,unit:'M<sup>3</sup>',position:'Suffix',type:'nonessential'}, 
			{'id':'volume','name':'库  存','value':stockNum,unit:unit,position:'Suffix'},
			{'id':'volume','name':'供应商','value':mallSupplierTitle,type:'text',unit:''},
			{'id':'volume','name':'保质期','value':goods.shelfLifePeriod,type:'nonessential',unit:'天',position:'Suffix'}  
		    ];
		var ul=handleDescription(spec);
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
			var type=v.type;
			if(type!='text'){
				value=obj2number(value);
			}
			if('nonessential'==type){
				if(value<1){
					return true;
				}
			}
			var li=$('<li></li>').appendTo(ul);
			var span=$('<span class="title">'+v.name+'：</span>').appendTo(li);
			var position=v.position;
			if(position=='Suffix'){
				$('<span class="sbold">'+value+v.unit+'</span>').appendTo(li);
			}else{
				$('<span class="sbold">'+v.unit+value+'</span>').appendTo(li);
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
		$('li',ul).addClass('hide');
		$('li',ul).each(function(i){
			if(i>=start&&i<=end){
				$(this).removeClass('hide');
			}
		});
	}
	return {
		init : function() {
			handleGoodsClass();
			var wizard = $('#add_goods_wizard');
			handleWizard(wizard);
			validate($('#add_goods_form', wizard));
			handleMaxlength();
			handleMallSupplier();
			handleUpload();
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
		thumbnails:function(e){
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
		},
		scrollImg:function(e){
			var th=$(e);
			if(th.hasClass('disabled')){
				return;
			}
			var container=th.parent();
			var images=$('.image-menu',container);
			$('.scroll-right,.scroll-left',container).addClass('disabled');
			var show=$('.thumbnails:not(".hide")',container);
			var hide=$('.thumbnails.hide',container);
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
		},
		submit:function(e){
			console.log(123123);
			var form=$('#add_goods_form');
			if(!form.validate().form()){
				return;
			 }
			swal({
   				title: "Are you sure?",  
   		        text: '确定要提交商品吗',  
   		        type: "warning", 
   		        showCancelButton: true, 
   		        closeOnConfirm: false, 
   		        closeOnCancel:false,
   		        cancelButtonText:'我再考虑一下',
   		        confirmButtonText: "是的，我要提交", 
   		        confirmButtonColor: "#ec6c62",
   		        showLoaderOnConfirm:true,
   			},function(isConfirm){
   				if(isConfirm){
   					$unit.submit(form,function(opt,data,state){
   						if(state=='success'){
   							window.location.href='/goods/index.htm';
   						}
   					});
   				}else{
   					swal.close();
   				}	
   			});
		}	
	}
}();