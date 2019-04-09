(function($) {
	'use strict';
	
	var defaultV={
		'btnClass':'skip_btn',//触发点击事件的按钮
		'container':'#content-tab',//显示的容器
		'tab_container':'#top-menu-tab',//tab菜单容器
		'menu_container':'#menu_ul',//菜单容器
		'max':10,//最多菜单
		'primary':'#primary_tab',//欢迎页
		'ajax':{},//获取菜单数据 ajax
		'refresh':3600,//页面自动刷新 如果小于等于0 则不刷新
		'css':null,//页面样式
		'overflow':'delete',//菜单溢出后的处理方式
		'tabStyleType':'tab1',//tab样式类型
		'uppercase':'系统菜单',
		'primary_container':'',
		'openUrl':'/system/menu/index.htm',
		data:[]
	}
	var skip=function(opts){
		opts=$.extend(defaultV,opts);
		this.menu=$(opts.menu_container);
		this.tabs=$(opts.tab_container);
		this.container=$(opts.container);
		var data=opts.data;
		if(isEmpty(opts.data)&&!isEmpty(opts.ajax)){
			var ajax=$.extend(opts.ajax,{
				type:'GET',
				data:{},
				dataType:'JSON'
			});
			data=getMenuData(ajax);
		}
		if(isEmpty(data)){
			data=$('body').data(systemConstant.menu_cache_key);
		}
		this.data=data;
		this.opts=opts;
		//一定要先销毁再创建
		this.menu.empty();
		buildHtml(data,this.menu,this);
		//console.log(this.menu.find('li').length);
		//事件绑定
		bind(this);
		//初始化
		//init(this);
	}
	
	//事件绑定 一定要先销毁事件再绑定
	function bind(skip){
		//菜单按钮绑定事件
		skip.menu.off('click','li a[data-url]');
		skip.menu.on('click','li a[data-url]',function(){
			var $this=$(this);
			if($this.hasClass('active')){
				return;
			}
			var url=$this.attr('data-url'),title=$this.attr('title'),id=$this.attr('data-id');
			var tab=skip.tabs;
			var container=skip.container;
			var flag=false;
			//查找tab里面是否有该url
			tab.find('li:not(".primary")').each(function(){
				var a=$(this).find('a');
				var tid=a.attr('data-id');
				if(tid==id){
					flag=true;
					//返回到tab页面
					tab.find('li:not(.immovability)').removeClass();
					$(this).addClass('active');
					//container显示
					var flag1=false;
					container.find('iframe').hide();
					container.find('iframe').each(function(){
						var cid=$(this).attr('data-id');
						if(cid==id){
							flag1=true;
							$(this).show();
							return false;
						}
					});
					if(!flag1){
						//生成页面
						buildContainer(url,id,skip);
					}
					return false;
				}
			});
			if(!flag){
				//生成tab 和  页面
				buildTab(url,title,id,skip);
			}
			//按钮active
			changeActive($this,skip);
			return false;
		});
		
		//tab 点击事件 应该要return false 防止外来的js重新注册绑定click事件
		skip.tabs.off('click','li');
		skip.tabs.on('click','li',function(){
			var $this=$(this);
			if($this.hasClass('active')){return;}
			var alink=$this.find('a');
			var id=alink.attr('data-id');
			skip.tabs.find('li').removeClass('active');
			$this.addClass('active');
			//菜单 通过ID来定位
			skip.menu.find('li').removeClass('active');
			change(id,skip);
			return false;
		});
		//关闭按钮
		skip.tabs.off('click','li a span.close-btn');
		skip.tabs.on('click','li a span.close-btn',function(){	
			var a=$(this).parent();
			var id=a.attr('data-id');
			if(!a.parent().hasClass('active')){
				a.parent().remove();
				skip.container.find('iframe[data-id="'+id+'"]').remove();
				return false;
			}
			//菜单左移动 或者右移动
			var num=a.parent().nextAll().length;
			var next=a.parent().next();
			if(num==0){
				//左移动
				next=$(this).parent().parent().prev();
			}
			if(!next){return;}
			var nextA=next.find('a');
			var nid=nextA.attr('data-id');
			a.parent().remove();
			skip.container.find('iframe[data-id="'+id+'"]').remove();
			next.addClass('active');
			change(nid,skip);
			return false;
		});
		
		window.onresize = function(){
			var container=skip.container;
			var height=container.parents('.page-content:first').height();
			var iframe=container.find('iframe');
			iframe.css('min-height',height);
        }
		
	}
	function change(id,skip){
		
		var menuBtn=skip.menu.find('li a[data-id="'+id+'"]');
		changeActive(menuBtn,skip);
		var container=skip.container;
		var containerDiv=container.find('iframe[data-id="'+id+'"]');
		container.find('iframe').hide();
		containerDiv.show();
	}
	//点击按钮改变菜单的class
	function changeActive(e,skip){
		if(!e)return;
		skip.menu.find('li.open >a >span.open').removeClass('open');
		skip.menu.find('li.open').removeClass('open');
		skip.menu.find('li.active').removeClass('active');
		skip.menu.find('li > a > .selected').remove();
		e.parents('li').each(function(){
			var $this=$(this);
			 $this.addClass('active');
			 $this.find('> a > span.arrow').addClass('open');
			 if ($this.parent('ul.page-sidebar-menu').size() === 1) {
				 $this.find('> a').append('<span class="selected"></span>');
             }
			 if ($this.children('ul.sub-menu').size() === 1) {
				 $this.addClass('open');
            }
		});
		skip.menu.find('li:not(.open) ul.sub-menu:visible').slideUp();
		skip.menu.find('li.open ul.sub-menu:hidden').slideDown();
	}
	
	//ajax获取菜单数据
	function getMenuData(opt){
		var r;
		$.ajax({
			async:false,
			cache:false,
			url:opt.url,
			type:opt.type,
			data:opt.data,
			dataType:opt.dataType,
			success:function(result){
				r=result;
			},
			error:function(){
				console.log('get menu data error!');
				r=[];
			}
		});
		return r;
	}
	
	//生成Tab
	function buildTab(url,title,id,skip){
		var tabs=skip.tabs;
		tabs.find('li:not(.immovability)').removeClass();
		var li=$('<li class="active"></li>').appendTo(tabs);		
		$('<a data-id="'+id+'" href="javascript:;" class="nav-tab"><span class="title">'+title+'</span><span class="close-btn"><i class="fa fa-times-circle-o"></i></span></a>').appendTo(li);		
		buildContainer(url,id,skip);
	}
	//生成Container页面
	function buildContainer(url,id,skip){
		var container=skip.container;
		container.find('iframe').hide();
		var height=container.parents('.page-content:first').height();
		var iframe=$('<iframe class="J_iframe" name="iframe_'+id+'" width="100%" height="100%" src="'+url+'" frameborder="0"  seamless data-id="'+id+'"></iframe>').appendTo(container);
		iframe.css('min-height',height);
	}
	
	//生成菜单
	function buildHtml(data,ul,skip){
		if(isEmpty(data))return;
		var opt=skip.opts;
		$.each(data,function(i,v){
			var id=v.id;
			var title=v.title;
			var childs=v.childs;
			var level=isEmpty(v.level)?0:v.level;
			if(isEmpty(id)||isEmpty(title))return true;
			var url=isEmpty(v.url)?'':'data-url="'+v.url+'"  data-id="'+id+'"';
			var li=$('<li class="nav-item"></li>').appendTo(ul);
			if(level==0)li.addClass('first');
			var icon=isEmpty(v.icon)?flag?'icon-home':'':v.icon;
			var btn=$('<a href="javascript:;" '+url+'   class="nav-link" title="'+title+'"></a>').appendTo(li);
			//data-primary 如果是欢迎页则有该属性 data-primary
			if(!isEmpty(icon)){
				$('<i class="'+icon+'"></i>').appendTo(btn);
			}	
			if(!isEmpty(opt.openUrl)&&opt.openUrl==v.url){
				btn.attr('data-primary',true);
			}
			$('<span class="title">'+title+'</span>').appendTo(btn);
			if(childs!=null&&typeof(childs)!='undefined'&&childs.length>0){
				btn.addClass('nav-toggle');
				$('<span class="arrow"></span>').appendTo(btn);
				var el=$('<ul class="sub-menu"></ul>').appendTo(li);
				buildHtml(childs,el,skip);	
			}
		});
	}
	
	//创建Skip对象 
	var skip1=function(opts){
		var data=$('body').data(systemConstant.menu_cache_key);
		var opt=$.extend(defaultV,opts);
		var ul=$(opt.menu_container);
		this.menu=ul;
		var tab=$(opt.tab_container);
		this.tab=tab;
		var container=$(opt.container);
		this.container=container;
		this.data=data;
		//buildMenu(data,ul,true,opt);
		var primary=ul.find('a[data-primary=true]:first');
		if(primary.length==1){
			open(primary,opt);
		}
		var btn=ul.find('a');
		this.skip_btn=btn;
		
		jump(btn,opt);
		//如果有初始化的url
		tab.on('click','li a',function(){
			if($(this).parent().hasClass('active')){
				return true;
			}
			$(this).next().removeClass('hide');
			var id=$(this).attr('data-id');
			var url=$(this).attr('data-url');
			var menuBtn=ul.find('li a[data-id="'+id+'"]');
			menuBtnSkip(menuBtn.parent());
			var cv=container.find('#tab_'+id);
			var title=$(this).attr('title');
			//刷新页面
			buildView(url,cv,title);
		});
		
		tab.on('mouseover mouseout','li',function(e){
			var th=$(this);
			var num=th.parent().find('li').length;
			if(num<=1){
				return;
			}
			var type=e.type;			
			if(type=='mouseout'){
				if(th.hasClass('active')){
					return;
				}
				th.find('.close').addClass('hide');
			}else if(type=='mouseover'){
				th.parent().find('li .close').addClass('hide');
				th.find('.close').removeClass('hide');
			}
		});
		
		//关闭按钮
		tab.on('click','li .close',function(e){
			var tabli=$(this).parent();
			var id=tabli.find('a:first').attr('data-id');
			var containerDiv=container.find('#tab_'+id);
			//显示内容
			var element=tabli.next();
			if(element.length<1){
				element=tabli.prev();
			}
			var showId=element.find('a:first').attr('data-id');
			var showMenu=ul.find('li a[data-id="'+showId+'"]:first');
			var showContainer=container.find('#tab_'+showId);	
			if(tabli.hasClass('active')){
				element.addClass('active');
				showContainer.addClass('active');
				menuBtnSkip(showMenu.parent());
			}	
			tabli.remove();
			containerDiv.remove();
		});
	}
	
	//跳转按钮点击事件
	//改变url 格式为 当前url!/system/menu/index.htm
	function jump(btns,opts){
		btns.on('click',function(e){
			if(typeof($(this).attr("data-url"))=="undefined"){
				return true;
			}
			open($(this),opts);
			menuBtnSkip($(this).parent());
		});
	}
	
	function menuBtnSkip(e){
		e.parent().children('li').removeClass('active');
		e.addClass('active');
		if(e.find('ul').length>0){
			e.addClass('open');
		}
		if(e.hasClass('first')){
			return;
		}
		menuBtnSkip(e.parent().parent());
	}
	//生成菜单链接
	function buildMenu(data,ul,flag,opt){
		if(!ul)return;
		if(!data)return;
		$.each(data,function(i,v){
			var id=v.id;
			var title=v.title;
			var childs=v.childs;
			if(isEmpty(id)||isEmpty(title))return true;
			var url=isEmpty(v.url)?'':'data-url="'+v.url+'"  data-id="'+id+'"';
			var li=$('<li class="nav-item"></li>').appendTo(ul);
			if(flag)li.addClass('first');
			var icon=isEmpty(v.icon)?flag?'icon-home':'':v.icon;
			var btn=$('<a href="javascript:;" '+url+'   class="nav-link" title="'+title+'"></a>').appendTo(li);
			//data-primary 如果是欢迎页则有该属性 data-primary
			if(!isEmpty(icon)){
				$('<i class="'+icon+'"></i>').appendTo(btn);
			}	
			if(!isEmpty(opt.openUrl)&&opt.openUrl==v.url){
				btn.attr('data-primary',true);
			}
			$('<span class="title">'+title+'</span>').appendTo(btn);
			if(childs!=null&&typeof(childs)!='undefined'&&childs.length>0){
				btn.addClass('nav-toggle');
				$('<span class="arrow"></span>').appendTo(btn);
				var el=$('<ul class="sub-menu"></ul>').appendTo(li);
				buildMenu(childs,el,false,opt);	
			}
		});
	}
	//打开链接
	function open(e,opts){
		var container=$(opts.container);
		var tab=$(opts.tab_container);
		if(!container)return;
		var id=e.attr('data-id');
		var url=e.attr('data-url');
		var title=e.attr('title');
		var data_primary=e.attr('data-primary');
		container.find('div.tab-pane').removeClass('active');
		var v=container.find('#tab_'+id);
		if(v.length<1){
			var div=$('<div class="tab-pane active" id="tab_'+id+'"></div>').appendTo(container);
			buildView(e);
/*			buildView(url,div,title);*/
		}else{
			v.addClass('active');
			//是否刷新页面 
		}		
		var max=opts.max;
		if(!tab)return;
		menuBtnSkip(e.parent());
		tab.find('li .close').addClass('hide');
		tab.find('li').removeClass();
		var n=tab.find('li a[data-id="'+id+'"]');
		if(n.length<1){
			var ul=tab;
			if(tab.find('li').length>max){
				//判断是否存在dropdown
				var dropdown=tab.find('li.dropdown');
				if(!dropdown){
					dropdown=$('<li class="dropdown pull-right tabdrop"><a class="dropdown-toggle" data-toggle="dropdown" href="#" aria-expanded="false"><i class="fa fa-ellipsis-v"></i>&nbsp;<i class="fa fa-angle-down"></i> <b class="caret"></b></a><ul class="dropdown-menu"></ul></li>').appendTo(tab);
				}
				ul=dropdown.find('ul.dropdown-menu');
			}
			var li=$('<li class="active"></li>').appendTo(ul);
			$('<a href="#tab_'+id+'" data-toggle="tab" data-id="'+id+'" data-url="'+url+'" title="'+title+'">'+title+'</a>').appendTo(li);
			if(data_primary!='true'){
				//关闭按钮
				$('<span class="close"></span>').appendTo(li);
			}
		}else{
			n.parent().addClass('active');
			n.next().removeClass('hide');
		}	
	}
	
	function buildView(e){
		/*if(!div)return;
		div.empty();*/
		var url=e.attr('data-url'),title=e.attr('title');
		if(isEmpty(title)){return false;}
		
	}
	
	function isEmpty(s){
		return s==null||typeof(s)=="undefined"||s.length<1||$.trim(s)=='';
	}
	
	function openMenu(e){
		e.parent().children('li').removeClass('active');
		e.addClass('active');
		if(e.find('ul').length>0){
			e.addClass('open');
		}
		if(e.hasClass('first')){
			return;
		}
		openMenu(e.parent().parent());
		
	}
	
	jQuery.skip=function(option){
		var instance=$('div').data('skip_plug_object');
		if(!instance){
			$('div').data('skip_plug_object',(instance=new skip(option)));
		}		
		return instance;
	}	
})(jQuery);