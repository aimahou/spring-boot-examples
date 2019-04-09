!function($) {
	'use strict';
	var MyUpload = function(e, options) {
		this.options = options;
		this.$el = e;
		this.files=[];
		this.init();
	}
	MyUpload.DEFAULT = {
		upload:{
			runtimes : 'html5,flash,silverlight,html4',
			filters : {
				mime_types : [ {
					title : "图片选择",
					extensions : "jpg,gif,png,jpeg"
				}, ],
				max_file_size : '400mb', // 最大只能上传400mb的文件
				prevent_duplicates : true
			// 不允许选取重复文件
			},
			multipart : true,
			/*
			 * 可以使用该参数对将要上传的图片进行压缩，该参数是一个对象，里面包括5个属性：width：指定压缩后图片的宽度，如果没有设置该属性则默认为原始图片的宽度
			 * height：指定压缩后图片的高度，如果没有设置该属性则默认为原始图片的高度 crop：是否裁剪图片
			 * quality：压缩后图片的质量，只对jpg格式的图片有效，默认为90。quality可以跟width和height一起使用，但也可以单独使用，单独使用时，压缩后图片的宽高不会变化，但由于质量降低了，所以体积也会变小
			 * preserve_headers：压缩后是否保留图片的元数据，true为保留，false为不保留,默认为true。删除图片的元数据能使图片的体积减小一点点
			 */
		/*
		 * resize : { width : 100, height : 100, crop : true, quality : 60,
		 * preserve_headers : false },
		 */
			max_retries:0,
			unique_names:false,
			multi_selection:false
		},
		sign_url : '/oss/sign',
		debug:true,
		// 是否生成随机
		random:true,
		piefix:'',
		// 类型 single:单选上传  wait:等待上传  multiselect:多选（默认）
		type:'multiselect',
		max:7,
		wait:false
	}

	// 初始化上传插件(使用upload+阿里云oss图片管理)
	MyUpload.prototype.init = function(options) {
		var opt = $.extend(MyUpload.DEFAULT, this.options);
		this.opt = opt;
		var data=this.sign();
		if(!data.flag){
			if (opt && opt.debug && window.console) {console.warn("后台获取sing失败,无法上传图片");}
			return ;
		}
		this.sign=data;
		var system=window.hmsh_system;
		var prefix=(isEmpty(system)||isEmpty(system.prefix))?'':system.prefix;
		var flash_swf_url=prefix+'/assets/global/plugins/plupload/js/Moxie.swf',silverlight_xap_url=prefix+'/assets/global/plugins/plupload/js/Moxie.xap',params=this.opt.upload;
		params['browse_button']=this.$el[0];
		params['flash_swf_url']=flash_swf_url;
		params['silverlight_xap_url']=silverlight_xap_url;
		params['url']=this.sign.host;
		var type=this.opt.type;
		if(type=='multiselect'){
			params['multi_selection']=true;
		}
		console.log('myUpload',params);
		this.uploader = new plupload.Uploader(params);
		this.uploader.init();
		// 监控
		this.monitor();
	}
	
	// 监控
	MyUpload.prototype.monitor=function(){		
		var btn=this.$el;
		var max=this.opt.max;
		var type=this.opt.type;
		var myUpload=this;
		var wait=this.opt.wait;
		// 初始化 根据类型生成文件显示框  
		this.uploader.bind('Init',function(uploader){
			btn.trigger($.Event('uploader.init'),[uploader,wait]);
		});
		// 当队列中的某一个文件正要开始上传前触发
		this.uploader.bind('BeforeUpload',function(uploader,file){
		 var uploadData=myUpload.sign;
		  var arr=file.name.split('.');
		  var fix=arr.length>1?arr[arr.length-1]:'';
		  var key=uploadData.dir+'/'+myUpload.random_string(10)+'.'+fix;
		  var multipart_params={
			  'key':key,
			  'policy':uploadData.policy,
			  'OSSAccessKeyId':uploadData.accessid,
			  'success_action_status':200,
			  'signature':uploadData.signature
		  }	  
		  uploader.setOption({'multipart_params':multipart_params});
		  file.src=key;
		  file.replaceUrl=uploadData.replaceUrl;
		  file.path=uploadData.replaceUrl+'/'+key;
		  btn.trigger($.Event('uploader.before'),[file]);
		});
		// 当文件从上传队列移除后触发:删除图片
		this.uploader.bind('FilesRemoved',function(uploader,file){
			btn.trigger($.Event('uploader.removed'),[file]);
		});
		// 当文件添加到上传队列后触发:显示图片
		this.uploader.bind('FilesAdded',function(uploader,files){
			var data=[];
			var uf=uploader.files;
			if(uf.length>max){
				swal('OMG!','最多只可以上传'+max+'张哦.','error');
				$.each(files,function(i,file){
					uploader.removeFile(file.id);
				});
				return;
			}
			if(type=='single'){
				var file1=files[0];
				$.each(uf,function(i,file2){
					if(isEmpty(file2)){
						return true;
					}
					var id2=file2.id;
					if(file1.id==id2){
						return true;
					}
					uploader.removeFile(id2);
				});
			}		
			$.each(files,function(i,file){
				if(!file||!/image\//.test(file.type)){
					return true;
				}
				var size=(file.size/1024)/1024,unit='MB';
				unit=size<0.1?'KB':unit,size = size<0.1 ? file.size/1024:size;
				file.size=size;
				file.unit=unit;
				
			});
			if(!wait){
				uploader.start();
			}
			myUpload.$el.trigger($.Event('uploader.FilesAdded'),[files,uploader]);
		});
		// 当队列中的某一个文件上传完成后触发:完成进度条
		this.uploader.bind('FileUploaded',function(uploader,file,responseObject){
			btn.trigger($.Event('uploader.FileUploaded'),[file]);
		});
		// 当上传队列中所有文件都上传完成后触发 :上传按钮禁用 上传按钮字体恢复正常
		this.uploader.bind('UploadComplete',function(uploader,files){
			myUpload.$el.trigger($.Event('uploader.complete'),[files,uploader]);
		});
		// 当发生错误时触发
		this.uploader.bind('Error',function(uploader,errObject){
			
		});
		this.uploader.bind('Destroy',function(uploader){
		});	
	}
	// 获取随机字符串
	MyUpload.prototype.random_string=function(len){
	   len = len || 32;
	　　var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';   
	　　var maxPos = chars.length;
	　　var pwd = '';
	　　for (var i = 0; i < len; i++) {
	    　　		pwd += chars.charAt(Math.floor(Math.random() * maxPos));
	   }
	   return pwd;
	}
	
	// 从admin获取上传参数,每次上传都需要重新获取
	MyUpload.prototype.sign = function() {
		var data = {flag : false};
		$.ajax({
			url : this.opt.sign_url,
			dataType : 'JSON',
			type : 'GET',
			data : {},
			async : false,
			complete : function(XMLHttpRequest, textStatus) {
				var state = XMLHttpRequest.status;
				var result = eval('(' + XMLHttpRequest.responseText + ')');
				data = state == '200' ? result : data;
				
			}
		});
		return data;
	}
	
	 $.fn.extend({
		 myUpload:function(options){ 
			  var $this=$(this);
			  var data=$this.data('myUpload.data');
			  if(!data){
				  $this.data('myUpload.data', (data = new MyUpload($this, options)));
			  }		  
			  return data;
		  }
	  });
}(jQuery);