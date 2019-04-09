/*
 * 下拉框插件 使用
 *  data-select2属性控制
 *  值支持: 
 *  type 类型 默认角色类型,
 *  state 状态 默认正常/禁用/删除,
 *  sex 性别 统一标准,
 *  resource 资源 ajax获取数据(存放),
 *  icon 图标 统一标准,
 *  whether 是否 统一标准,
 *  step 完善步骤 统一标准,
 *  industry 行业 ajax获取数据
 *  json数组  
 *   
 */
var Select2=function(){	
	var handleData=function(){
		var v={
			'role_type':[{id:1,text:'系统角色'},{id:0,text:'普通角色'}],//角色类型
			'account_state':[{id:0,text:'正常'},{id:1,text:'禁用'},{id:2,text:'删除'}],//帐号状态
			'resource_state':[{id:0,text:'正常'},{id:1,text:'禁用'}],//资源状态
			'account_type':[{id:0,text:'员工'},{id:1,text:'管理员'},{id:2,text:'测试'}],//帐号类型
			'sex':[{id:0,text:'男'},{id:1,text:'女'},{id:2,text:'保密'}],//性别
			'request_type':[{id:'GET',text:'GET'},{id:'POST',text:'POST'},{id:'PUT',text:'PUT'},{id:'DELETE',text:'DELETE'}],//请求类型
			'resource_type':[{id:'1',text:'请求'},{id:'0',text:'链接'}],//资源类型
			'authentication_type':[{id:0,text:'未认证'},{id:1,text:'已认证'}],//认证类型
			'step':[{id:0,text:'未开'},{id:1,text:'注册'},{id:2,text:'完善'},{id:3,text:'等待审核'}],//步骤
			'individual_state':[{id:0,text:'启用'},{id:1,text:'禁用'},{id:2,text:'注销'}],//个人用户状态
			'authentication_auditing_state':[{id:0,text:'未审核'},{id:1,text:'通过'},{id:2,text:'不通过'}],//认证状态
			'whether':[{id:0,text:'是'},{id:1,text:'否'}],//是否选择	
			'order_modular':[{id:'惠民生活',text:'惠民生活'}],//订单模块
			'pay_state':[{id:'0',text:'支付成功'},{id:'1',text:'未支付'},{id:'3',text:'支付失败'}],
			'order_state':[{id:'0',text:'交易成功'},{id:'1',text:'未付款'},{id:'2',text:'商家同意退款'},{id:'3',text:'商家拒绝接单'},{id:'4',text:'已接单/已发货'},{id:'5',text:'待接单/待发货'},{id:'6',text:'用户取消订单'},{id:'7',text:'申请退款/退货中'},{id:'8',text:'商家拒绝退款'},{id:'9',text:'商家拒绝退货'}],
			'order_type':[{id:'1',text:'配送到店'},{id:'2',text:'到店订单'}],//订单类别		
			'joiningFee_key':[{id:'MERCHANT_SERVICE_FEE',text:'商家加盟服务费'},{id:'AGENT_SERVICE_FEE',text:'代理商加盟服务费'}],
			'consumptionRecommendBonus_key':[{id:'COMMON_RECOMMENDED_CONSUMER_DIVIDENDS',text:'普通消费推荐分红'},{id:'VIP_RECOMMENDED_CONSUMER_DIVIDENDS',text:'VIP商城现金消费推荐分红'}],
			'serviceFeeBonus_key':[{id:'VIP_MEMBER_YEAR_FEE_ROYALTY_RATIO',text:'VIP年费提成比'},{id:'STORE_YEAR_TOTAL_FEE_ROYALTY_RATIO',text:'店铺年费提成比'}],
			'serviceFee_key':[{id:'STORE_TRIAL_FEE',text:'店铺试用费'},{id:'STORE_YEAR_FEE',text:'店铺年费'},{id:'VIP_YEAR_FEE',text:'VIP年费'},{id:'PARTNER_TOTAL_FEE',text:'合伙人终生服务费'}],
			'joiningFee_key4':[{id:'STORE_TRIAL_FEE',text:'店铺试用费'},{id:'STORE_YEAR_FEE',text:'店铺年费'},{id:'VIP_YEAR_FEE',text:'VIP年费'},{id:'PARTNER_TOTAL_FEE',text:'合伙人终生服务费'},{id:'VIP_MEMBER_YEAR_FEE_ROYALTY_RATIO',text:'VIP年费提成比'},{id:'STORE_YEAR_TOTAL_FEE_ROYALTY_RATIO',text:'店铺年费提成比'},{id:'MERCHANT_SERVICE_FEE',text:'商家加盟服务费'},{id:'AGENT_SERVICE_FEE',text:'代理商加盟服务费'}, {id:'COMMON_RECOMMENDED_CONSUMER_DIVIDENDS',text:'普通消费推荐分红'},{id:'VIP_RECOMMENDED_CONSUMER_DIVIDENDS',text:'VIP商城现金消费推荐分红'},{id:'RECOMMENDED_PARTNER_TURNOVER_BONUS',text:'合伙人推荐营业额分红'}, {id:'OTHER_RECOMMENDED_TURNOVER_BONUS',text:'其它推荐营业额分红'}],
			'advertisManage_key':[{id:'1',text:'图片'},{id:'2',text:'文字'}],
			'shareMessage_key':[{id:'0',text:'使用中'},{id:'1',text:'屏蔽'}],
			'shareMessageType_key':[{id:'0',text:'用户分享'},{id:'1',text:'活动分享'},{id:'20',text:'优惠券分享'},{id:'21',text:'霸王券分享'},{id:'22',text:'折扣券分享'},{id:'23',text:'礼品券'}],
			'platformPackageUnit_key':[{id:'Y',text:'年'},{id:'M',text:'月'},{id:'D',text:'天'}],
			'platformPackageStatus_key':[{id:'0',text:'启用'},{id:'1',text:'禁用'}],
			'appIndexManageIscenter_key':[{id:'0',text:'是'},{id:'1',text:'否'}],
			'appIndexManageStatus_key':[{id:'0',text:'启用'},{id:'1',text:'禁用'}],
			'appIndexManageIsopen_key':[{id:'0',text:'是'},{id:'1',text:'否'}],
			'appIndexManageVersionType_key':[{id:'0',text:'个人版'},{id:'1',text:'商家版'}],
			'appIndexManageCategory_key':[{id:'0',text:'分类1'},{id:'1',text:'分类2'}],
			'customMsgEnvironment_key':[{id:'0',text:'生产环境'},{id:'1',text:'开发环境'}],
			'customMsgMsgType_key':[{id:'0',text:'点对点'},{id:'1',text:'全网发送'}],
			'platformPackagestore_key':[{id:'vip1year',text:'1年店铺产品'},{id:'sy30day',text:'30天店铺产品'}],
			'sellerStoreState_key':[{id:'0',text:'正常'},{id:'1',text:'关闭(欠费关闭)'},{id:'2',text:'店铺人工关闭'},{id:'3',text:'即将过期'}],
			'userType_key':[{id:'1',text:'个人'},{id:'2',text:'商家'},{id:'3',text:'代理商'},{id:'6',text:'vip会员'},{id:'7',text:'合伙人'}],
			'agentLevel_key':[{id:'1',text:'省代理'},{id:'2',text:'市代理'},{id:'3',text:'县代理'}],
			'agentStatus_key':[{id:'0',text:'正常'},{id:'1',text:'停用'},{id:'2',text:'注销'}],
			'agentAccountType_key':[{id:'0',text:'对公'},{id:'1',text:'对私'}],
			'agentLevel_key':[{id:'1',text:'省代理'},{id:'2',text:'市代理'},{id:'3',text:'县代理'}],
			'agentStatus_key':[{id:'0',text:'正常'},{id:'1',text:'不是代理商'}],
			'goodsSpecpropertyType_key':[{id:'0',text:'文字'},{id:'1',text:'图片'}],
			'goods_state':[{id:'0',text:'上架'},{id:'1',text:'下架'}],
			'goodsClass_state':[{id:'0',text:'正常'},{id:'1',text:'禁用'}],
		}
		return v;
	}
	var iconData=function(){
		return ["icon-bell","fa fa-plus","fa fa-bolt","fa fa-bell-o","fa fa-bullhorn","icon-envelope-open","icon-calendar","fa fa-angle-down","icon-user","icon-rocket","icon-lock","icon-key","icon-logout","icon-close","icon-magnifier","icon-home","icon-bar-chart","icon-bulb","icon-graph","icon-diamond","icon-puzzle","icon-settings","icon-briefcase","icon-wallet","icon-pointer","icon-layers","icon-feed","icon-paper-plane"," icon-wrench","icon-basket","icon-tag","icon-docs","icon-clock","icon-check","icon-envelope","icon-notebook","icon-user-female","icon-user-following","icon-users","icon-lock-open","icon-social-dribbble","icon-info","icon-call-end","icon-wrench","icon-pencil","icon-note","icon-folder","icon-power","icon-star","icon-camera","icon-link","icon-globe","fa fa-circle","icon-shield","icon-bag","fa fa-500px","fa fa-amazon","fa fa-balance-scale","fa fa-battery-0","fa fa-battery-1","fa fa-battery-2","fa fa-battery-3","fa fa-battery-4","fa fa-battery-empty","fa fa-battery-full","fa fa-battery-half","fa fa-battery-quarter","fa fa-battery-three-quarters","fa fa-black-tie","fa fa-calendar-check-o","fa fa-calendar-minus-o","fa fa-calendar-plus-o","fa fa-calendar-times-o","fa fa-cc-diners-club","fa fa-cc-jcb","fa fa-chrome","fa fa-clone","fa fa-commenting","fa fa-commenting-o","fa fa-contao","fa fa-creative-commons","fa fa-expeditedssl","fa fa-firefox","fa fa-fonticons","fa fa-genderless","fa fa-get-pocket","fa fa-gg","fa fa-gg-circle","fa fa-hand-grab-o","fa fa-hand-lizard-o","fa fa-hand-paper-o","fa fa-hand-peace-o","fa fa-hand-pointer-o","fa fa-hand-rock-o","fa fa-hand-scissors-o","fa fa-hand-spock-o","fa fa-hand-stop-o","fa fa-hourglass","fa fa-hourglass-1","fa fa-hourglass-2","fa fa-hourglass-3","fa fa-hourglass-end","fa fa-hourglass-half","fa fa-hourglass-o","fa fa-hourglass-start","fa fa-houzz","fa fa-i-cursor","fa fa-industry","fa fa-internet-explorer","fa fa-map","fa fa-map-o","fa fa-map-pin","fa fa-map-signs","fa fa-mouse-pointer","fa fa-object-group","fa fa-object-ungroup","fa fa-odnoklassniki","fa fa-odnoklassniki-square","fa fa-opencart","fa fa-opera","fa fa-optin-monster","fa fa-registered","fa fa-safari","fa fa-sticky-note","fa fa-sticky-note-o","fa fa-television","fa fa-trademark","fa fa-tripadvisor","fa fa-tv","fa fa-vimeo","fa fa-wikipedia-w","fa fa-y-combinator","fa fa-yc","fa fa-adjust","fa fa-anchor","fa fa-archive","fa fa-area-chart","fa fa-arrows","fa fa-arrows-h","fa fa-arrows-v","fa fa-asterisk","fa fa-at","fa fa-automobile","fa fa-ban","fa fa-bank","fa fa-bar-chart","fa fa-bar-chart-o","fa fa-barcode","fa fa-bars","fa fa-bed","fa fa-beer","fa fa-bell","fa fa-bell-slash","fa fa-bell-slash-o","fa fa-bicycle","fa fa-binoculars","fa fa-birthday-cake","fa fa-bomb","fa fa-book","fa fa-bookmark","fa fa-bookmark-o","fa fa-briefcase","fa fa-bug","fa fa-building","fa fa-building-o","fa fa-bullseye","fa fa-bus","fa fa-cab","fa fa-calculator","fa fa-calendar","fa fa-calendar-o","fa fa-camera","fa fa-camera-retro","fa fa-car","fa fa-caret-square-o-down","fa fa-caret-square-o-left","fa fa-caret-square-o-right","fa fa-caret-square-o-up","fa fa-cart-arrow-down","fa fa-cart-plus","fa fa-cc","fa fa-certificate","fa fa-check","fa fa-check-circle","fa fa-check-circle-o","fa fa-check-square","fa fa-check-square-o","fa fa-child","fa fa-circle-o","fa fa-circle-o-notch","fa fa-circle-thin","fa fa-clock-o","fa fa-close","fa fa-cloud","fa fa-cloud-download","fa fa-cloud-upload","fa fa-code","fa fa-code-fork","fa fa-coffee","fa fa-cog","fa fa-cogs","fa fa-comment","fa fa-comment-o","fa fa-comments","fa fa-comments-o","fa fa-compass","fa fa-copyright","fa fa-credit-card","fa fa-crop","fa fa-crosshairs","fa fa-cube","fa fa-cubes","fa fa-cutlery","fa fa-dashboard","fa fa-database","fa fa-desktop","fa fa-diamond","fa fa-dot-circle-o","fa fa-download","fa fa-edit","fa fa-ellipsis-h","fa fa-ellipsis-v","fa fa-envelope","fa fa-envelope-o","fa fa-envelope-square","fa fa-eraser","fa fa-exchange","fa fa-exclamation","fa fa-exclamation-circle","fa fa-exclamation-triangle","fa fa-external-link","fa fa-external-link-square","fa fa-eye","fa fa-eye-slash","fa fa-eyedropper","fa fa-fax","fa fa-feed","fa fa-female","fa fa-fighter-jet","fa fa-file-archive-o","fa fa-file-audio-o","fa fa-file-code-o","fa fa-file-excel-o","fa fa-file-image-o","fa fa-file-movie-o","fa fa-file-pdf-o","fa fa-file-photo-o","fa fa-file-picture-o","fa fa-file-powerpoint-o","fa fa-file-sound-o","fa fa-file-video-o","fa fa-file-word-o","fa fa-file-zip-o","fa fa-film","fa fa-filter","fa fa-fire","fa fa-fire-extinguisher","fa fa-flag","fa fa-flag-checkered","fa fa-flag-o","fa fa-flash","fa fa-flask","fa fa-folder","fa fa-folder-o","fa fa-folder-open","fa fa-folder-open-o","fa fa-frown-o","fa fa-futbol-o","fa fa-gamepad","fa fa-gavel","fa fa-gear","fa fa-gears","fa fa-gift","fa fa-glass","fa fa-globe","fa fa-graduation-cap","fa fa-group","fa fa-hdd-o","fa fa-headphones","fa fa-heart","fa fa-heart-o","fa fa-heartbeat","fa fa-history","fa fa-home","fa fa-hotel","fa fa-image","fa fa-inbox","fa fa-info","fa fa-info-circle","fa fa-institution","fa fa-key","fa fa-keyboard-o","fa fa-language","fa fa-laptop","fa fa-leaf","fa fa-legal","fa fa-lemon-o","fa fa-level-down","fa fa-level-up","fa fa-life-bouy","fa fa-life-buoy","fa fa-life-ring","fa fa-life-saver","fa fa-lightbulb-o","fa fa-line-chart","fa fa-location-arrow","fa fa-lock","fa fa-magic","fa fa-magnet","fa fa-mail-forward","fa fa-mail-reply","fa fa-mail-reply-all","fa fa-male","fa fa-map-marker","fa fa-meh-o","fa fa-microphone","fa fa-microphone-slash","fa fa-minus","fa fa-minus-circle","fa fa-minus-square","fa fa-minus-square-o","fa fa-mobile","fa fa-mobile-phone","fa fa-money","fa fa-moon-o","fa fa-mortar-board","fa fa-motorcycle","fa fa-music","fa fa-navicon","fa fa-newspaper-o","fa fa-paint-brush","fa fa-paper-plane","fa fa-paper-plane-o","fa fa-paw","fa fa-pencil","fa fa-pencil-square","fa fa-pencil-square-o","fa fa-phone","fa fa-phone-square","fa fa-photo","fa fa-picture-o","fa fa-pie-chart","fa fa-plane","fa fa-plug","fa fa-plus-circle","fa fa-plus-square","fa fa-plus-square-o","fa fa-power-off","fa fa-print","fa fa-puzzle-piece","fa fa-qrcode","fa fa-question","fa fa-question-circle","fa fa-quote-left","fa fa-quote-right","fa fa-random","fa fa-recycle","fa fa-refresh","fa fa-remove","fa fa-reorder","fa fa-reply","fa fa-reply-all","fa fa-retweet","fa fa-road","fa fa-rocket","fa fa-rss","fa fa-rss-square","fa fa-search","fa fa-search-minus","fa fa-search-plus","fa fa-send","fa fa-send-o","fa fa-server","fa fa-share","fa fa-share-alt","fa fa-share-alt-square","fa fa-share-square","fa fa-share-square-o","fa fa-shield","fa fa-ship","fa fa-shopping-cart","fa fa-sign-in","fa fa-sign-out","fa fa-signal","fa fa-sitemap","fa fa-sliders","fa fa-smile-o","fa fa-soccer-ball-o","fa fa-sort","fa fa-sort-alpha-asc","fa fa-sort-alpha-desc","fa fa-sort-amount-asc","fa fa-sort-amount-desc","fa fa-sort-asc","fa fa-sort-desc","fa fa-sort-down","fa fa-sort-numeric-asc","fa fa-sort-numeric-desc","fa fa-sort-up","fa fa-space-shuttle","fa fa-spinner","fa fa-spoon","fa fa-square","fa fa-square-o","fa fa-star","fa fa-star-half","fa fa-star-half-empty","fa fa-star-half-full","fa fa-star-half-o","fa fa-star-o","fa fa-street-view","fa fa-suitcase","fa fa-sun-o","fa fa-support","fa fa-tablet","fa fa-tachometer","fa fa-tag","fa fa-tags","fa fa-tasks","fa fa-taxi","fa fa-terminal","fa fa-thumb-tack","fa fa-thumbs-down","fa fa-thumbs-o-down","fa fa-thumbs-o-up","fa fa-thumbs-up","fa fa-ticket","fa fa-times","fa fa-times-circle","fa fa-times-circle-o","fa fa-tint","fa fa-toggle-down","fa fa-toggle-left","fa fa-toggle-off","fa fa-toggle-on","fa fa-toggle-right","fa fa-toggle-up","fa fa-trash","fa fa-trash-o","fa fa-tree","fa fa-trophy","fa fa-truck","fa fa-tty","fa fa-umbrella","fa fa-university","fa fa-unlock","fa fa-unlock-alt","fa fa-unsorted","fa fa-upload","fa fa-user","fa fa-user-plus","fa fa-user-secret","fa fa-user-times","fa fa-users","fa fa-video-camera","fa fa-volume-down","fa fa-volume-off","fa fa-volume-up","fa fa-warning","fa fa-wheelchair","fa fa-wifi","fa fa-wrench","fa fa-hand-o-down","fa fa-hand-o-left","fa fa-hand-o-right","fa fa-hand-o-up","fa fa-ambulance","fa fa-subway","fa fa-train","fa fa-intersex","fa fa-mars","fa fa-mars-double","fa fa-mars-stroke","fa fa-mars-stroke-h","fa fa-mars-stroke-v","fa fa-mercury","fa fa-neuter","fa fa-transgender","fa fa-transgender-alt","fa fa-venus","fa fa-venus-double","fa fa-venus-mars","fa fa-file","fa fa-file-o","fa fa-file-text","fa fa-file-text-o","fa fa-info-circle fa-lg fa-li","fa fa-cc-amex","fa fa-cc-discover","fa fa-cc-mastercard","fa fa-cc-paypal","fa fa-cc-stripe","fa fa-cc-visa","fa fa-google-wallet","fa fa-paypal","fa fa-bitcoin","fa fa-btc","fa fa-cny","fa fa-dollar","fa fa-eur","fa fa-euro","fa fa-gbp","fa fa-ils","fa fa-inr","fa fa-jpy","fa fa-krw","fa fa-rmb","fa fa-rouble","fa fa-rub","fa fa-ruble","fa fa-rupee","fa fa-shekel","fa fa-sheqel","fa fa-try","fa fa-turkish-lira","fa fa-usd","fa fa-won","fa fa-yen","fa fa-align-center","fa fa-align-justify","fa fa-align-left","fa fa-align-right","fa fa-bold","fa fa-chain","fa fa-chain-broken","fa fa-clipboard","fa fa-columns","fa fa-copy","fa fa-cut","fa fa-dedent","fa fa-files-o","fa fa-floppy-o","fa fa-font","fa fa-header","fa fa-indent","fa fa-italic","fa fa-link","fa fa-list","fa fa-list-alt","fa fa-list-ol","fa fa-list-ul","fa fa-outdent","fa fa-paperclip","fa fa-paragraph","fa fa-paste","fa fa-repeat","fa fa-rotate-left","fa fa-rotate-right","fa fa-save","fa fa-scissors","fa fa-strikethrough","fa fa-subscript","fa fa-superscript","fa fa-table","fa fa-text-height","fa fa-text-width","fa fa-th","fa fa-th-large","fa fa-th-list","fa fa-underline","fa fa-undo","fa fa-unlink","fa fa-angle-double-down","fa fa-angle-double-left","fa fa-angle-double-right","fa fa-angle-double-up","fa fa-angle-left","fa fa-angle-right","fa fa-angle-up","fa fa-arrow-circle-down","fa fa-arrow-circle-left","fa fa-arrow-circle-o-down","fa fa-arrow-circle-o-left","fa fa-arrow-circle-o-right","fa fa-arrow-circle-o-up","fa fa-arrow-circle-right","fa fa-arrow-circle-up","fa fa-arrow-down","fa fa-arrow-left","fa fa-arrow-right","fa fa-arrow-up","fa fa-arrows-alt","fa fa-caret-down","fa fa-caret-left","fa fa-caret-right","fa fa-caret-up","fa fa-chevron-circle-down","fa fa-chevron-circle-left","fa fa-chevron-circle-right","fa fa-chevron-circle-up","fa fa-chevron-down","fa fa-chevron-left","fa fa-chevron-right","fa fa-chevron-up","fa fa-long-arrow-down","fa fa-long-arrow-left","fa fa-long-arrow-right","fa fa-long-arrow-up","fa fa-backward","fa fa-compress","fa fa-eject","fa fa-expand","fa fa-fast-backward","fa fa-fast-forward","fa fa-forward","fa fa-pause","fa fa-play","fa fa-play-circle","fa fa-play-circle-o","fa fa-step-backward","fa fa-step-forward","fa fa-stop","fa fa-youtube-play","fa fa-adn","fa fa-android","fa fa-angellist","fa fa-apple","fa fa-behance","fa fa-behance-square","fa fa-bitbucket","fa fa-bitbucket-square","fa fa-buysellads","fa fa-codepen","fa fa-connectdevelop","fa fa-css3","fa fa-dashcube","fa fa-delicious","fa fa-deviantart","fa fa-digg","fa fa-dribbble","fa fa-dropbox","fa fa-drupal","fa fa-empire","fa fa-facebook","fa fa-facebook-f","fa fa-facebook-official","fa fa-facebook-square","fa fa-flickr","fa fa-forumbee","fa fa-foursquare","fa fa-ge","fa fa-git","fa fa-git-square","fa fa-github","fa fa-github-alt","fa fa-github-square","fa fa-gittip","fa fa-google","fa fa-google-plus","fa fa-google-plus-square","fa fa-gratipay","fa fa-hacker-news","fa fa-html5","fa fa-instagram","fa fa-ioxhost","fa fa-joomla","fa fa-jsfiddle","fa fa-lastfm","fa fa-lastfm-square","fa fa-leanpub","fa fa-linkedin","fa fa-linkedin-square","fa fa-linux","fa fa-maxcdn","fa fa-meanpath","fa fa-medium","fa fa-openid","fa fa-pagelines","fa fa-pied-piper","fa fa-pied-piper-alt","fa fa-pinterest","fa fa-pinterest-p","fa fa-pinterest-square","fa fa-qq","fa fa-ra","fa fa-rebel","fa fa-reddit","fa fa-reddit-square","fa fa-renren","fa fa-sellsy","fa fa-shirtsinbulk","fa fa-simplybuilt","fa fa-skyatlas","fa fa-skype","fa fa-slack","fa fa-slideshare","fa fa-soundcloud","fa fa-spotify","fa fa-stack-exchange","fa fa-stack-overflow","fa fa-steam","fa fa-steam-square","fa fa-stumbleupon","fa fa-stumbleupon-circle","fa fa-tencent-weibo","fa fa-trello","fa fa-tumblr","fa fa-tumblr-square","fa fa-twitch","fa fa-twitter","fa fa-twitter-square","fa fa-viacoin","fa fa-vimeo-square","fa fa-vine","fa fa-vk","fa fa-wechat","fa fa-weibo","fa fa-weixin","fa fa-whatsapp","fa fa-windows","fa fa-wordpress","fa fa-xing","fa fa-xing-square","fa fa-y-combinator-square","fa fa-yahoo","fa fa-yc-square","fa fa-yelp","fa fa-youtube","fa fa-youtube-square","fa fa-h-square","fa fa-hospital-o","fa fa-medkit","fa fa-stethoscope","fa fa-user-md","icon-login","icon-speech","icon-arrow-left","icon-paper-clip","icon-arrow-up"];
	}
	var icon=function(e){
		if(!e||!e.is('select'))return;
		var params={placeholder:'全部',allowClear:false,data:iconData(),templateResult: format,templateSelection: format,width: 'auto', escapeMarkup: function(m) { return m;}};
		var data=iconData();
		$(e).select2(params);
		function format(state) {
	        if (!state.id) { return state.text; }
	        var $state = $(
	         '<span><i class="'+state.text+'"></i> ' + state.text + '</span>'
	        );
	        return $state;
		 }
	}
	var getText=function(key,id){
		var data=handleData();
		var result=data[key];
		var r='';
		if(!isEmpty(result)){
			$.each(result,function(i,v){
				var id1=v.id;
				if(id==id1){
					r=v.text;
					return false;
				}
			});
		}
		return r;
	}
	var getData=function(down,type){
		var data=handleData();
		var result=data[down];
		if(isEmpty(result)){
			return null;
		}
		if(type!='search'){
			return result;
		}
		//添加全部
		result.unshift({id:' ',text:'全部'});
		return result;
	}
	var resource=function(th,role,type){
		$.ajax({
			url:'/resource/getView',
			dataType:'JSON',
			type:'GET',
			data:{type:type},
			success:function(result){
				$.each(result,function(i,v){
					v['text']=v.value;			               
				});
				result.unshift({id:' ',text:'请选择'});
				select2(th,result,role);
			}
		});
	}
	var select2=function(e,data,type){
		if(!e||!e.is('select'))return;
		var params={placeholder:'全部',allowClear:false};
		if(!isEmpty(data)){
			params['data']=data;
		}
		if(type!='search'){
			params['width']='100%';
		}
		$(e).select2(params);
	}
	
	return{
		init:function(){
			//下拉框初始化
			$('select.select2').each(function(){
				Select2.ajaxSelect($(this));
			});
			
			$('body').find('[data-down]').each(function(){
				var th=$(this);
				var down=th.data('down');
				var form=th.parents('form');
				var role=isEmpty(form.data('role'))?'search':form.data('role');
				if(isEmpty(down)){
					select2(th,null,role);
					return true;
				}
				if(down=='icon'){
					icon(th);
					return true;
				}else if(down=='resource'){
					var t=isEmpty(th.data('type'))?0:th.data('type');
					resource(th,role,t);
					return true;
				}
				var data=getData(down,role);
				if(!isEmpty(data)){
					select2(th,data,role);
				}
			});
		},
		ajaxSelect:function(e){
			var th=$(e);
			var url=th.data('url');
			if(isEmpty(url)){
				return true;
			}
			$.get(url).always(function(data,state){
				if(state!='success'||isEmpty(data)){
					return;
				}
				if(!th.hasClass('input-medium')){
					th.addClass('input-medium');
				}
				var whole=th.data('whole');
				whole=isEmpty(whole)?true:whole;
				if(whole){
					$('<option value=" ">全部</option>').appendTo(th);
				}
				$.each(data,function(i,v){
					$('<option value="'+v.value+'">'+v.label+'</option>').appendTo(th);
				});
				th.select2({placeholder:'请选择',allowClear:false});
			});
		},
		getText:function(key,id){
			return getText(key,id);
		}
	}
}();