!(function() {
	'use strict';
	$.fn.extend({
		
		
		// 生成菜单
		buildMenu : function(data) {
			var flag = false;
			var th = this;
			var currentUrl = window.location.pathname;
			currentUrl = currentUrl.replace(/\//g, ' ').replace(/\s+/g, '\/');
			var openObj;
			build(data, this);
			if(isEmpty(openObj)){
				var menuId=getCurrentMenuId();
				openObj=$('a[data-id="menuId"]',$(this));
			}
			if(!isEmpty(openObj)){
				openMenu(openObj);
			}
			function build(data1, ul, flag) {
				if (isEmpty(data1) || isEmpty(ul)) {
					return;
				}
				$.each(data1, function(i, v) {
					var li = $('<li class="nav-item"></li>').appendTo(ul);
					if (i == 0)
						li.addClass('first');
					var url = 'javascript:;';
					var resource = v.resource;
					if (!isEmpty(resource)) {
						url = resource.value
					}
					;
					var btn = $(
							'<a href="javascript:;" data-id="' + v.id
									+ '"  class="nav-link"  title="' + v.title
									+ '"></a>').appendTo(li);
					if (!isEmpty(v.icon)) {
						$('<i class="' + v.icon + '"></i>').appendTo(btn);
					}
					$('<span class="title">' + v.title + '</span>').appendTo(
							btn);
					var childs = v.childs;
					if (!isEmpty(childs)) {
						btn.addClass('nav-toggle');
						$('<span class="arrow"></span>').appendTo(btn);
						var el = $('<ul class="sub-menu"></ul>').appendTo(li);
						build(childs, el);
					} else {
						btn.attr('href', url);
						url = url.replace(/\//g, ' ').replace(/\s+/g, '\/');
						if (currentUrl == url && !flag) {
							flag = true;
							$('li', th).removeClass('open').removeClass(
									'active');
							$('span.arrow', th).removeClass('open');
							openObj=btn;
						}
						btn.on('click', function() {
							if ($(this).parent().hasClass('active')) {
								return false;
							}
							setMenu(v.id);
							return true;
						});
					}
				});
			}

			function openMenu(a) {
				a.parent().addClass('open').addClass('active');
				a.find('span.arrow').addClass('open');
				var ul = a.parent().parent();
				if (ul.hasClass('sub-menu')) {
					openMenu(ul.parent().find('a:first'));
				}
			}
		}
	});
})(jQuery)