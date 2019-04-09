var Goods=function(){
	//SKU列表
	var handleSkuList=function(id,e){
		if(!e||$(e).length<1){
			return;
		}
		var obj=$('[data-role="skuList"]',$(e));		
		obj.empty();
		$.get('/goods/goods/findSkuById',{id:id},function(data,state){
			if (state != "success"||isEmpty(data)) {
				swal('OMG','获取SKU商品信息失败,请重试','error');
				return;
			}
			var goodsSkuList=data.goodsSkuList;
			var first=goodsSkuList[0];
			var width=400,height=400;
			//商品分类
			var goodsClassId=data.goodsClassId;
			var goodsClassObj=$('<div class="col-md-12 col-sm-12 col-xs-12 goods-class-container"><div class="goods-class"></div></div>').appendTo(obj);
			if(!isEmpty(goodsClassId)){
				var goodsClass=findGoodsClassById(goodsClassId);
				if(!isEmpty(goodsClass)){
					var parent=goodsClass.parent;
					var title=parent.title;
					$('<a href="javascript:;" title="'+title+'" data-id="'+parent.dmId+'">'+title+'</a><i class="fa fa-angle-right"></i>').appendTo($('.goods-class',goodsClassObj));
					$('<a href="javascript:;" title="'+goodsClass.title+'" data-id="'+goodsClass.dmId+'">'+goodsClass.title+'</a>').appendTo($('.goods-class',goodsClassObj));
				}
			}
			$('<div class="col-md-12 col-sm-12 col-xs-12 dividing-line"></div>').appendTo(obj);
			//商品明细
			var div=$('<div class="col-md-4 col-sm-6 col-xs-12"></div>').appendTo(obj);
			var imageShow=$('<div class="margin-left-10"></div>').appendTo(div);
			var minImage=$('<div class="small-img"><div class="goods scroll scroll-left disabled" ><i class="fa fa-chevron-left"></i></div><ul class="image-menu"></ul><div class="goods scroll scroll-right"><i class="fa fa-chevron-right"></i></div></div>').appendTo(div);
			if(isEmpty(first)){
				first={};
			}
			var mainImage=first.mainImage;
			var photoList=first.photoList;
			var flag=true;
			if(!isEmpty(photoList)){
				$.each(photoList,function(i,v){
					flag=false;
					var path=v.path;
					if(mainImage==path){						
						photoList.splice(i, 1);
						return false;
					}
				});
			}
			if(flag){
				photoList=[{path:mainImage}];
			}else{
				photoList.unshift({path:mainImage});
			}
			
			if(photoList.length<=4){
				$('div.scroll-right').addClass('disabled');
			}
			if(!isEmpty(mainImage)){
				$.each(photoList,function(i,v){			
					var li=$('<li></li>').appendTo($('ul',minImage));
					$('<img src="'+v.path+'" alt="'+data.name+'" width="70px;" height="70px;"/>').appendTo(li);
					if(i==0){
						$('<img src="'+v.path+'" width="400" height="400" alt="'+data.name+'" />').appendTo(imageShow);
						li.addClass('active');
					}
					if(i>=4){
						li.addClass('hide');
					}
					li.data('src',v.path);
				});
			}else{
				$('.scroll',minImage).addClass('hide');
				$('<p><a>点击</a>重新上传图片</p>').appendTo(minImage);
			}
			
			var goods=$.extend(data,first);
			var right=$('<div class="col-md-6 col-sm-6 col-xs-12"><h1 class="goods-title">'+goods.name+'</h1></div>').appendTo(obj);
			var shopList=goods.shopList;
			var stockNum=0;
			if(!isEmpty(shopList)){
				$.each(shopList,function(i,v){
					stockNum+=obj2number(v.stockNum,0);
				})
			}
			var unit=isEmpty(data.unit)?'':data.unit;
			var prices=[{'id':'purchasePrice','name':'成本价','value':obj2number(goods.purchasePrice,goods.price),unit:'&yen;',position:'prefix'},
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
			            
			]
			var ul=handleGoodsPrice(prices).appendTo(right);
			var specList=data.specList;
			if(!isEmpty(specList)){
				$.each(specList,function(i,v){
					var title=v.title;
					var goodsSpecpropertyList=v.goodsSpecpropertyList;
					if(isEmpty(goodsSpecpropertyList)){
						return true;
					}
					var li=$('<li></li>').appendTo(ul);
					$('<span class="title">'+title+'：</span>').appendTo(li);
					var specul=$('<span class="spec"></span>').appendTo(li);
					$.each(goodsSpecpropertyList,function(i,v){
						var item=$('<span class="item"><b></b><a href="javascript:;" title="'+v.value+'" data-id="'+v.dmId+'"><i>'+v.value+'</i></a></span>').appendTo(specul);
						if(i==0){
							item.addClass('selected');
						}
					});
				});
			}
			/**
			 * 商品详情
			 */
			var detailsList=goods.goodsDetailsList;
			var detailHtml=goods.details;
			if(!isEmpty(detailsList)){
				detailHtml='';
				$.each(detailsList,function(i,v){
					var context=v.context;
					detailHtml+=context;
				});
			}
			if(isEmpty(detailHtml)){
				detailHtml='<span>暂无详情,点击编辑</span>';
			}
			var tab_main=$('<div class="col-md-12 col-sm-12 col-xs-12 tab-main" ><ul><li class="active" data-tab="details">商品详情</li><li data-tab="pack">规格和包装</li><li data-tab="evaluate">商品评价</li></ul></div>').appendTo(obj);
			var detailsObj=$('<div class="col-md-12 col-sm-12 col-xs-12 tab-main-html" data-tab="details">'+detailHtml+'</div>').appendTo(obj);
			var packObj=$('<div class="col-md-12 col-sm-12 col-xs-12 hide tab-main-html" data-tab="pack">暂无</div>').appendTo(obj);
			var evaluateObj=$('<div class="col-md-12 col-sm-12 col-xs-12 hide tab-main-html" data-tab="evaluate">暂无评价</div>').appendTo(obj);
			$('ul>li',tab_main).on('click',function(){
				if($(this).hasClass('active')){
					return true;
				}
				$('ul>li',tab_main).removeClass('active');
				$(this).addClass('active');
				var tab=$(this).data('tab');
				$('div.tab-main-html').addClass('hide');
				$('div.tab-main-html[data-tab="'+tab+'"]').removeClass('hide');
			});
			$('ul>li',minImage).hover(function(){
				var active=$(this);
				if(active.hasClass('active')){
					return true;
				}
				$('ul li',minImage).removeClass('active');
				active.addClass('active');
				var img=$('img',active);
				var src=active.data('src');
				src=src+'';
				$('img',imageShow).attr('src',src);
			});
			$('.scroll',minImage).on('click',function(){
				if($(this).hasClass('disabled')){
					return true;
				}
				$('.scroll-right,.scroll-left',minImage).removeClass('disabled');
				$('ul li',minImage).addClass('hide');
				if($(this).hasClass('scroll-right')){
					$('ul>li',minImage).each(function(){
						var th=$(this);
						var index=th.index();
						if(index>=4){
							th.removeClass('hide');
						}
					});
				}else{
					$('ul>li',minImage).each(function(){
						var th=$(this);
						var index=th.index();
						if(index<4){
							th.removeClass('hide');
						}
					});
				}
			});
		},'JSON');
	}
	//处理商品详情描述
	var handleGoodsPrice=function(data){
		var ul=$('<ul class="nav nav-stacked goods-ul"></ul>');
		if(isEmpty(data)){
			return ul;
		}
		$.each(data,function(i,v){
			var value=obj2number(v.value);
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
				$('<span class="sbold">'+value+v.unit+'</span>').appendTo(li);
			}else{
				$('<span class="sbold">'+v.unit+value+'</span>').appendTo(li);
			}	
		});
		return ul;
	}
	//转换成数字
	var obj2number=function(obj,defaultV,len){
		defaultV= defaultV || 0;
		obj=isEmpty(obj)?defaultV:obj;
		obj=parseInt(obj);
		obj=isNaN(obj)?defaultV:obj;
		return obj;
	}
	//更改wizard Title 和 按钮的显示隐藏
	var handleTitle=function(wizard,tab, navigation, index,form){
		//改变步骤
	    var total = navigation.find('li').length,current = index + 1;
        // set wizard title
        $('.step-title', wizard).text('步骤 ' + (index + 1) + ' / ' + total);
        // set done steps
        $('li',wizard).removeClass("done");
        $('li:lt('+index+')',wizard).addClass('done');
        $('.button-previous,.button-next,.button-submit',wizard).removeClass('hide');
        if(current==1){
        	$('.button-previous',wizard).addClass('hide');
        }
        if (current >= total) {
        	$('.button-next',wizard).addClass('hide');
        }else{
        	$('.button-submit',wizard).addClass('hide');
        }
        App.scrollTo($('.page-title',wizard));
	}
	//步骤添加
	var handleWizard=function(field,type,data){
		var field=regulation.getField();
		var wizard=$('#goods-add',field);
		var form=$('#add_goods_form',field);
		
		form.find('select,textarea,input[name!="_csrf"]').each(function(){
		  var th=$(this);
		  if(th.is('select')){
			  th.val('').trigger('change');
			  return true;
		  }
		  th.val('');
	   });
		//regulation.emptyForm(form);
		var next=$('a.button-next',form),prev=$('a.button-prev',form),submit=$('a.button-submit',form);
		//表单验证
		formValidate(form);
		wizard.bootstrapWizard({
			'nextSelector': next,
            'previousSelector': prev,
            onTabClick: function (tab, navigation, index, clickedIndex) {
            	return false;
            },
            onNext: function (tab, navigation, index) {
            	if (form.valid() == false) {
                    return false;
                }
            	if(index==1){
            		var goodsClassId=$('#goodsClassId',wizard).val();
            		if(isEmpty(goodsClassId)){
            			swal('提示','必须选择商品分类,才能进行下一步操作','warning');
                		return false;
            		}
            	}else if(index==2){
            		//至少上传一张商品图片
            		var flag=$('#pickfiles',field).data('flag');
            		if(type=='update'){
            			if(flag=='rough'){
            				var message='主人,动动你的小手点一下上传吧,点一下就好    : )';
            				swal('提示',message,'warning');
                			return false;
                		}
            		}else
            		if(flag!='success'){
            			var message='主人,至少需要上传一张图片哦   : )';
            			if(flag=='rough'){
            				message='主人,动动你的小手点一下上传吧,点一下就好    : )';
                		}
            			swal('提示',message,'warning');
            			return false;
            		}
            		// 如果没有SKU属性 则直接跳到第5步
            		wizard.bootstrapWizard('show',4);
            	}
            	wizardMonitor(index,form);
            },
            onPrevious: function (tab, navigation, index) {
            	if(index==0){
            		var goodsClassId=$('#goodsClassId',wizard).val();
            		//$('#goodsClass',wizard).selectsplitter(goodsClassId);
            	}
            },
            onTabShow: function (tab, navigation, index) {
                var total = navigation.find('li').length,current = index + 1,$percent = (current / total) * 100;
                wizard.find('.progress-bar').css({width: $percent + '%'});
            	handleTitle(wizard,tab, navigation, index,form);
            }
		});
		wizard.bootstrapWizard('show',0);
		 $('#update_field_image',field).addClass('hide');
		if(type=='update'){
			handleTouchSpin(form);
			var sku=data.goodsSkuList[0];
			data['price']=sku.price;
			data['purchasePrice']=sku.purchasePrice;
			data['deductPricePercent']=sku.deductPricePercent;
			data['returnPointPercent']=sku.returnPointPercent;
			data['goodsClassTitle']=data.goodsClassName;
			data['skuId']=sku.dmId;
			data['name']=sku.name;
			console.log(sku);
			var shopList=sku.shopList;
			var stockNum=0;
			if(!isEmpty(shopList)){			
				var shop=shopList[0];
				stockNum=shop.stockNum;
			}
			data['stockNum']=stockNum;
			//填充数据
			 form.find('select,textarea,input[name!="_csrf"]').each(function(){
				  var th=$(this);
				  var name=th.attr('name');
				  var id=th.attr('id');
				  for(var key in data){
					  if(name==key||id==key){
						  if(th.is('select')){
							  th.val(data[key]).trigger('change');
						  }else{
							  th.val(data[key]);
						  }
						  break;
					  }
				  }
			  });
			 $('#update_field_image',field).removeClass('hide');
			 $('#update_field_image_show',field).empty();
			 var image=sku.photoList;
			 $.each(image,function(i,v){
				 $(' <div class="col-md-4 main-image"><div class="dz-preview dz-processing  dz-complete dz-image-preview"><img src="'+v.path+'" width="120" height="120" /></div></div>').appendTo( $('#update_field_image_show',field));
			 });
			wizard.bootstrapWizard('show',1);
		}
	}
	//步骤监听 初始化数据
	var wizardMonitor=function(index,form){
		//商品主题录入
		if(index==1){
			handleTouchSpin(form);
		}else if(index==2){
			handleSkuClass();
		}else if(index==4){
			handleAffirm(form);
		}	
	}
	//确认信息
	var handleAffirm=function(form){
		
	}
	var findGoodsClassById=function(id){
		var data=getGoodsClass();
		var result;
		diguiGoodsClass(data,id);
		return result;
		
		function diguiGoodsClass(data,id,parent){
			if(!isEmpty(result)){
				return;
			}
			if(!isEmpty(data)){
				$.each(data,function(i,v){
					if(!isEmpty(parent)){
						v['parent']=parent;
					}
					var dmId=v.dmId;
					if(id==dmId){	
						result=v;
						return true;
					}
					var childs=v.childs;
					if(!isEmpty(childs)){
						diguiGoodsClass(childs,id,v);
					}
				});
			}
		}
		
	}
	
	//把商品分类信息缓存下来
	var getGoodsClass=function(){
		var field=regulation.getField();
		var goodsClass=field.data('goodsClass');
		if(isEmpty(goodsClass)){
			$.ajaxSetup({
				async : false
			});
			$.get('/goods/goods/getGoodsClass',function(data,state){
				if(state == "success"&&!isEmpty(data)){
					field.data('goodsClass',(goodsClass=data));
				}
			},'JSON');
		}
		return goodsClass;
	}
	//商品分类选择
	var buildGoodsClass=function(e,data){
		e.empty();
		$.each(data,function(i,v){
			var childs=v.childs;
			if(isEmpty(childs)){
				return true;
			}
			var optgroup=$('<optgroup label="'+v.title+'"></optgroup>').appendTo(e);
			$.each(childs,function(k,o){
				$('<option value="'+o.dmId+'">'+o.title+'</option>').appendTo(optgroup);
			});
		});
		var len=e.find('option').length;
		if(len<1){
			swal('OMG','获取SKU商品分类信息失败,请重试或者添加分类信息','error');
			return;
		}
		e.selectsplitter('destroy');
		e.selectsplitter({selectSize: 4});
		e.addClass('data-load');
		e.off().on('change',function(){
			var selected=$('option:selected',$(this));
			var fine=selected.parent('optgroup').attr('label');
			var second=selected.text();
			var id=$(this).val();
			$('#goodsClassTitle',$(this).parents('form')).val(fine+' > '+second);
			$('#goodsClassId',$(this).parents('form')).val(id);
		});
	}
	//SKU选择
	var handleSkuClass=function(){
		$.get('/goods/goods/getSpec',function(data,state){
			
			if(state == "success"&&!isEmpty(data)){
				
			}
		},'JSON');
	}
	//编辑器
	var handleEditor=function(){
		
	}
	//拆分SKU商品
	var handleSplitSku=function(){
		
	}
	//商品详情模板
	var handleTemplate=function(){
		
	}	
	//商品查询
	var handleSearch=function(){
		
	}
	//查看SKU详情
	var showSku=function(data){
		
	}
	
	var formValidate=function(form){
		
	}
	//表格形式
	var handleTable=function(data){
		if(!isEmpty(data)&&!isEmpty(data.data)){
			
		}
	}
	
	//图表形式
	var handleChart=function(data){
		if(!isEmpty(data)&&!isEmpty(data.data)){
			
		}
	}
	var handleInit=function(start,length,data){
		start=start||0,length=length||12,data=data||{};
		var field=regulation.getField();
		var paging1=$('#goods-paging',field);
		start=isEmpty(paging1.data('paging-start'))?1:paging1.data('paging-start');
		length=isEmpty(paging1.data('paging-length'))?length:paging1.data('paging-length');
		start=start-1;
		start=start*length;
		data['start']=start,data['length']=length;
		var field=regulation.getField();
		var token=field.data('token');
		var csf=field.data('name');
		var falls=$('#goods-list-falls',field);
		var url=falls.attr('action');
		falls.empty();
		$.get(url,data,function(data,state){
			if(state=='success'){
				if(!isEmpty(data)&&!isEmpty(data.data)){
					$.each(data.data,function(i,v){
						var div=$('<div class="col-lg-3 col-md-4 col-sm-6 col-xs-12"><div class="mt-card-item"><div class="mt-card-avatar mt-overlay-1"></div><div class="mt-card-content"></div></div></div>').appendTo(falls);
						var goodsSkuList=v.goodsSkuList;
						var price=v.price;
						var image='';
						var name=v.name;
						var forVipMall=v.forVipMall;
						if(!isEmpty(goodsSkuList)){
							var firstSku=goodsSkuList[0];
							var image=firstSku.mainImage;
							price=firstSku.price;
							name=firstSku.name;
							forVipMall=firstSku.forVipMall;
						}
						name=name.substring(0,30);
						var state=v.state;
						var btnStr='上架';
						var stateus=0;
						var icon='fa fa-arrow-circle-up';
						if(state==0){
							icon='fa fa-arrow-circle-down';
							var btnStr='下架';
							stateus=1;
						}
						$('<img src="'+image+'" class="fixed" alt="'+v.name+'"/><div class="mt-overlay"></div>').appendTo($('.mt-card-avatar',div));
						var ul=$('<ul class="mt-info"><li><a class="btn default btn-outline show" href="javascript:;"><i class="icon-magnifier"></i></a></li></ul>').appendTo($('.mt-overlay',div));
						$('<p class="mt-card-desc font-grey-mint mt-card-price">&yen;'+price+'</p>').appendTo($('.mt-card-content',div));
						$('<a class="mt-card-name" href="javascript:;" title="'+name+'">'+name+'</a>').appendTo($('.mt-card-content',div));
						var btns=$('<div class="mt-card-social"><ul><li><a href="javascript:;" class="edit" title="修改商品"><i class="fa fa-edit"></i></a></li></ul></div>').appendTo($('.mt-card-content',div));
						$('<li><a href="javascript:;" class="remove" title="删除"><i class="fa fa-remove"></i></a></li>').appendTo($('ul',btns));
						$('<li><a href="javascript:;" class="updateState" title="'+btnStr+'"><i class="'+icon+'"></i></a></li>').appendTo($('ul',btns));
						$('a.edit',btns).on('click',function(){
							//修改
							var field=regulation.getField();
							$('.goods-tab',field).addClass('hide');
							$('#goods-add',field).removeClass('hide');
							handleWizard($('#goods-add',field),'update',v);
							monitor();
						});
						$('a.show',ul).on('click',function(){
							Goods.showSkuList(v.dmId,'#goods-sku');
						});
						$('a.remove',btns).on('click',function(){
							//删除
							var data={'id':v.dmId};
					    	data[csf]=token;
					    	var opt={url:'/goods/remove',type:'POST',data:data};
					    	console.log(opt);
							regulation.remove(opt,function(result){
								handleInit();
							}); 
						});
						$('a.updateState',btns).on('click',function(){
							var data={'id':v.dmId,'state':stateus};
							data[csf]=token;
							var opt={url:'/goods/updateState',type:'POST',data:data};
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
									  regulation.ajax(opt,true,function(){
										  handleInit();
									  });
								  }else{
									  swal("取消", "感谢您的高抬贵手 :)", "error");
								  }			  
							  }); 
						});
					});
					paging(data);
				}
			}
		},'JSON');		
	}
	//分页
	var paging=function(data){
		
		var field=regulation.getField();
		var paging=$('#goods-paging',field);
		var selectRow=$('#goods-paging-select',field);
		var lens=[12,24,48,96];
		var start=isEmpty(paging.data('paging-start'))?1:paging.data('paging-start');
		var length=isEmpty(paging.data('paging-length'))?lens[0]:paging.data('paging-length');
		var filtered=data.recordsFiltered;//过滤后的总记录数
		var total=data.recordsTotal;//总记录数
		var result=data.data;
		var count=result.length;
		var infoStr='显示 '+(start+1)+' 至 '+count+' 共 '+total+' 条数据';
		var isInit=paging.data('isInit');
		var select=$('.paging_select',paging);
		var info=$('.paging_info',paging);
		var pagination=$('ul.pagination',paging);
		var prev=$('li.prev',pagination);
		var next=$('li.next',pagination);
		var pageTotal=Math.ceil(total/length);
			paging.empty();
			//selectRow.empty();
			var col3=$('<div class="col-md-12 col-sm-12 "><div class="dataTables_paginate paging_bootstrap_number"><ul class="pagination" style="visibility: visible;"></ul><div class="paging_info"></div></div></div>').appendTo(paging);
			pagination=$('.pagination',col3);
			info=$('.paging_info',col3);
			prev=$('<li class="prev"><a href="javascript:;" title="上一页"><i class="fa fa-angle-left"></i></a></li>').appendTo(pagination);
			var pageIndex=start;
			var max=5;
			var end=pageTotal;
			
			if(pageTotal>max){
				var a=Math.ceil(max/2);
				if(pageIndex>=(max+2)&&pageIndex<(pageTotal-a)){
					end=max;
					loopTop(pagination);
					start=pageIndex-a+1;
					end=start+max-1;
					loopPage(start,end,pageIndex,pagination);
					$('<li class="break">...</li>').appendTo(pagination);
				}else if(pageIndex>=(pageTotal-a)){
					loopTop(pagination);
					start=pageTotal-max+1;
					loopPage(start,end,pageIndex,pagination);
				}else{
					end=max+2;
					loopPage(1,end,pageIndex,pagination);
				}
			}else{
				loopPage(start,end,pageIndex,pagination);
			}
			next=$('<li class="next"><a href="javascript:;" title="下一页"><i class="fa fa-angle-right"></i></a></li>').appendTo(pagination);
			info.html('共'+pageTotal+'页,到第<input type="text" name="jumpto" class="skipTo" size="3" value="'+pageIndex+'"/>页<button type="button" class="ui-btn-s" >确定</button>');
			$('li:not(".prev,.next")>a',pagination).off().on('click',function(){
				var th=$(this);
				if(th.parent().hasClass('active')){
					return true;
				}
				var page=th.data('page');
				paging.data('paging-start',page);
				handleInit((page-1)*length,length);
				$('li',pagination).removeClass('active');
				th.parent().addClass('active');
			});
			paging.data('isInit','init');
			$('button',info).off().on('click',function(){
				var skipTo=$('input.skipTo',info);
				var skip=parseInt(skipTo.val());
				if(isNaN(skip)||skip<=0){
					skip=1;
				}else if(skip>pageTotal){
					skip=pageTotal;
				}
				handleInit((skip-1)*length,length);
				paging.data('paging-start',skip);
			});
			$('li.prev a,li.next a',pagination).off().on('click',function(){
				var th=$(this);
				if(th.parent().hasClass('disabled')){
					return true;
				}
				var page=isEmpty(paging.data('paging-start'))?1:paging.data('paging-start');
				if(th.parent().hasClass('prev')){
					page=page-1;
				}else{
					page=page+1;
				}
				handleInit((page-1)*length,length);
				$('li',pagination).removeClass('active');
				$('li>a[data-page="'+page+'"]').parent().addClass('active');
				paging.data('paging-start',page);
			});
		prev.removeClass('disabled');
		if(start==1){
			prev.addClass('disabled');
		}
		next.removeClass('disabled');
		if(start==pageTotal){
			next.addClass('disabled');
		}
		
	}
	var loopTop=function(ul){
		for(var i=1;i<=2;i++){
			var li=$('<li><a href="javascript:;" title="第'+i+'页" data-page="'+i+'">'+i+'</a></li>').appendTo(ul);
		}
		$('<li class="break">...</li>').appendTo(ul);
	}
	var loopPage=function(start,end,current,ul){
		for(var i=parseInt(start) ;i <= parseInt(end);i++){
			var li=$('<li><a href="javascript:;" title="第'+i+'页" data-page="'+i+'">'+i+'</a></li>').appendTo(ul);
			if(i==current){
				li.addClass('active');
			}
		}	
	}
	//验证
	var validate=function(form){
		jQuery.validator.addMethod("gtTo", function(value, element, param) {
			var obj=$(param);
			if(isEmpty(obj)){
				return false;
			}
			var value1=obj.val();
			value=parseInt(value);
			value1=parseInt(value1);
			if(value<value1){
				return false;
			}
			return true;
		},$.validator.format("零售价应该大于等于成本价"));
		var success = $('.alert-success', form);
		var error = $('.alert-danger', form);
		form.validate({
            doNotHideMessage: true, //this option enables to show the error/success messages on tab switch.
            errorElement: 'span', //default input error message container
            errorClass: 'help-block help-block-error', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            rules: {
            	goodsClassId: {
                    required: true
                },
                purchasePrice:{
                	required: true
                },
                price:{
                	required: true,
                	gtTo:'#purchasePrice'
                },
                name:{
                	required: true	
                },
                stockNum:{
                	required: true	
                }
            },
            messages: { // custom messages for radio buttons and checkboxes
            	goodsClassId:{
            		required: '请选择商品分类'
            	},
            	marketPrice:{
                	required: '请填写市场价'
                },
                price:{
                	required: '请填写零售价'
                },
                name:{
                	required: '请填写商品名称'	
                },
                stockNum:{
                	required: '请设置商品库存'	
                }
            },

            errorPlacement: function (error, element) { // render error placement for each input type
            	var parent=$(element).parent();
            	if(parent.hasClass('bootstrap-touchspin')){
            		error.insertAfter(parent);
            	}else{
            		 error.insertAfter(element); // for other inputs, just perform default behavior
            	}
            },

            invalidHandler: function (event, validator) { //display error alert on form submit   
                success.hide();
                error.show();
                App.scrollTo(error, -200);
            },

            highlight: function (element) { // hightlight error inputs
                $(element)
                    .closest('.form-group').removeClass('has-success').addClass('has-error'); // set error class to the control group
            },

            unhighlight: function (element) { // revert the change done by hightlight
                $(element)
                    .closest('.form-group').removeClass('has-error'); // set error class to the control group
            },

            success: function (label) {
            	label
                .addClass('valid') // mark the current input as valid and display OK icon
            .closest('.form-group').removeClass('has-error').addClass('has-success'); // set success class to the control group
            },

            submitHandler: function (form) {
                success.show();
                error.hide();
                //add here some ajax code to submit your form or just call form.submit() if you want to submit the form without ajax
            }

        });
	}
	
	//点击添加商品的时候
	var handleAdd=function(){
		var field=regulation.getField();
		var btn=$('#add_goods_btn',field);
		var content=$('#add_goods_step_content',field);
		var wizard=$('#form_wizard_add_goods',field);
		btn.on('click',function(){
			var goodsClass=$('#goodsClassId',content);
			handleGoodsSelect(goodsClass,content);
		});
	}
	
	//刷新商品分类
	var reloadSelect=function(){
		var field=regulation.getField();
		var content=$('#add_goods_step_content',field);
		var goodsClass=$('#goodsClassId',content);
		//goodsClass.removeClass('load');
		//handleGoodsSelect(goodsClass,content);
	}
	//计算SKU商品数量
	var product=function(array) {
	    if(array instanceof Array) {
	        var len = array.length;
	        var result = 1;
	        for(var i = 0; i < len; i++) {
	        	var specproperty=array[i].specproperty;
	            result *= specproperty.length;
	        }
	        return result;
	    }
	    return null;
	}
	var splitSku=function(){
		var field=regulation.getField();
		var form=$('#add_goods_form',field);
		var spec=$('#specIds',form);
		var sku=spec.data('select.result');
		if(!isEmpty(sku)){
			
			var num=product(sku);
			
		}	
	}
	//初始化TouchSpin插件
	var handleTouchSpin=function(form){
		var flag=form.data('touchSpin');
		if(!isEmpty(flag)){
			return;
		}
		form.data('touchSpin',true);
		$('#price,#marketPrice,#purchasePrice',form).TouchSpin({
			min: 0,
            max: 999999999,
            step:1,
            forcestepdivisibility:'none',
            boostat: 5,
            maxboostedstep: 10,
            maxboostedstep: 10000000,
            prefix: '&yen;'
		});
		$('#limited',form).TouchSpin({
			min: 0,
			max: 999999999,
            step:1,
            boostat: 5,
            maxboostedstep: 10,
            maxboostedstep: 10000000,
		});
		$('#volume',form).TouchSpin({
			min: 0,
			max: 999999999,
            step:1,
            forcestepdivisibility:'none',
            boostat: 5,
            maxboostedstep: 10,
            maxboostedstep: 10000000,
            postfix: 'M<sup>3</sup>'
		});
		$('#weight',form).TouchSpin({
			min: 0,
			max: 999999999,
			forcestepdivisibility:'none',
            step:1,
            boostat: 5,
            maxboostedstep: 10,
            maxboostedstep: 10000000,
            postfix: 'kg'
		});
		$('.percent',form).TouchSpin({
			min: 0,
            max: 100,
            step: 0.1,
            decimals: 4,
            boostat: 5,
            maxboostedstep: 10,
            postfix: '%'
		});
		$('#shelfLifePeriod',form).TouchSpin({
			min: 0,
            max: 99999,
            step: 1,
            boostat: 5,
            maxboostedstep: 10,
            maxboostedstep: 10000000,
            postfix: '天'
		});
		$('#stockNum',form).TouchSpin({
			min: 0,
            max: 99999,
            step: 1,
            boostat: 5,
            maxboostedstep: 10,
            maxboostedstep: 10000000,
		});
	}
	//SKU下拉框
	var handleSpecSelect=function(){
		var field=regulation.getField();	
		var form=$('#add_goods_form',field);
		var spec=$('#specIds',form);
		if(!spec)return;
		if(spec.hasClass('load'))return;
		var goodsClass=$('#goodsClassId',form);
		var data={goodsClassId:goodsClass.val()};
		$.ajax({
			 url:'/goods/goods/getSpec',			
			 dataType:'JSON',
			 data:data,
			 type:'GET',
			 async:false,
			 beforeSend:function(){
				spec.empty();
				App.blockUI({
		          target: form,
		          message:'加载商品分类...'
		        });
			 },
			 complete:function(XMLHttpRequest, textStatus){
				 var state=XMLHttpRequest.status;
				 if(state!='200'){
					 App.unblockUI(form);
					 swal('OMG','没有获取到SKU属性,请直接去编辑返现规则','error'); 
				 }else{
					 App.unblockUI(form);
				     var result=eval('('+XMLHttpRequest.responseText+')');
		             if(!isEmpty(result)){
						$.each(result,function(i,v){
							var childs=v.goodsSpecpropertyList;
							if(!isEmpty(childs)){
								var optgroup=$('<optgroup label="'+v.title+'" data-id="'+v.id+'"></optgroup>').appendTo(spec);
								$.each(childs,function(i1,v1){
									$('<option value="'+v1.dmId+'">'+v1.value+'</option>').appendTo(optgroup);
								});
							}
						});
						var length=spec.find('option').length;
						spec.multiSelect('destroy');
						spec.multiSelect({selectableOptgroup: true});
						spec.off().on('change',function(){
							var th=$(this);
							//$('#goodsClassTitle',content).val($(this).find("option:selected").text());
							var option=$(this).find("option:selected");
							var optgroup=option.parent();
							var specificationId=optgroup.data('id');
							var specpropertyId=option.val();
							var value=$(this).val();
							$(this).data('select.result',[]);
							if(!isEmpty(value)){
								var data=[];
								$.each(value,function(i,v){
									var opt=th.find("optgroup option[value='"+v+"']");
									var group=opt.parent();
									var specificationId=group.data('id');
									var specproperty=[];
									var flag=true;
									$.each(data,function(i1,v1){
										var specificationId1=v1.specificationId;
										if(specificationId1==specificationId){
											v1.specproperty.push(v);
											flag=false;
											return false;
										}
									});
									if(flag){
										data.push({'specificationId':specificationId,'specproperty':[v]})
									}
								});								
								$(this).data('select.result',data);
							}		
						});
						if(length>0){
							spec.addClass('load');				
						}
					}
				 }
			 }
		});
		return spec;
	}
	
	var serializeObject=function(){
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
		   return o;    
		};
	}
	
	var monitor=function(){
		var field=regulation.getField();
		var tab=$('.goods-tab',field);
		
	}
	var loadmallSupplier=function(){
		var field=regulation.getField();
		var mall=$('#mallSupplierId',field);
		$.get('/goods/getMallSupplier',function(data,state){
			console.log(state);
			if(state!='success'||isEmpty(data)){
				return ;
			}
			$.each(data,function(i,v){
				$('<option value="'+v.dmId+'">'+v.name+'</option>').appendTo(mall);
			});
			mall.select2({placeholder:'全部',allowClear:false,width:'100%'});
		},'JSON');
	}
	return {
		init:function(token,name){
			var field=regulation.getField();
			handleAdd();
			field.data('token',token);
			field.data('name',name);
			handleInit();
			//隐藏所有.ignore
			$('.form-group.ignore').hide();
			//添加商品时离开即是放弃
			
			validate($('#add_goods_form',field));
			$('.make-switch').bootstrapSwitch();
			$('#pickfiles',field).myUpload();
			//检查是否有没上传的
			$('#pickfiles',field).on('myUpload.upload',function(event,urls,flag,replaceUrl,divs){
				$('#images',field).val(urls);
				if(flag==true){
					$(this).data('flag','success');
				}else{
					$(this).data('flag','rough');
				}
			});
			//myUpload.filesAdded
			$('#pickfiles',field).on('myUpload.filesAdded',function(event){
				$(this).data('flag','rough');
			});
			serializeObject();
			monitor();
			loadmallSupplier();
		},
		searchSku:function(id,e){
			var goods=$(e).data('data').replace(/\'/g,'\"');
			var goodsObj=JSON.parse(goods);
			var field=regulation.getField();
			$.get('/shop/goods/findSkuById',{id:id},function(data,state){
				if (state == "success") {
					var note=$('#sku_note',field);
					note.hide();
					var btn=$('#skuList',field);
					btn.click();
					build(data,goodsObj);
				}
			},'JSON');			
		},
		toGoodsList:function(e){
			var field=regulation.getField();
			var btn=$(e,field);
			if(isEmpty(btn)){
				btn=$('#goodsList',field);
			}
			btn.click();
		},
		reload:function(){
			var current=currentStep();
			if(current.index()==0){
				reloadSelect();
			}
		},
		//添加商品
		add:function(id){
			var field=regulation.getField();
			$('.goods-tab',field).addClass('hide');
			$(id,field).removeClass('hide');
			//初始化商品分类
			buildGoodsClass($('#goodsClass',$(id,field)),getGoodsClass());
			handleWizard($(id,field));
			
		},
		//查看SKU商品
		showSkuList:function(id,e){
			var field=regulation.getField();
			$('.goods-tab',field).addClass('hide');
			$(e,field).removeClass('hide');
			//根据id获取SKU商品的数据
			handleSkuList(id,$(e,field));
			monitor();
			
		},
		toList:function(){
			var field=regulation.getField();
			$('.goods-tab',field).addClass('hide');
			$('#goods-list',field).removeClass('hide');	
		},
		submit:function(e){
			var field=regulation.getField();
			var form=$('#add_goods_form',field);
			regulation.submit(form,$(e),function(){
				location.reload();	
			});
		}		
	}
}();