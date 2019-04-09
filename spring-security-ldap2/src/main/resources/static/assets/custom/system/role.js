var Role=function(){
	return {
		edit:function(e,field){
			var id=$(e).parents('.data').data('id');
			var data=$hmsh.table.getData(id);
			$unit.open(field,data);
			var resources=data.resources;
			var arr=['/index.htm'];
			if(!$unit.isEmpty(resources)){
				$.each(resources,function(i,v){
					if(v!='/index.htm'){
						arr.push(v);
					}
				});	
			}
			$('#power,#resource_power').multiSelect('deselect_all');
			$('#power,#resource_power').multiSelect('select',arr,'init');
		},
		add:function(){
			var add=$('#role_add');
			$unit.open(add);
			$('#power').multiSelect('deselect_all');
			$('#power').multiSelect('select',['/index.htm'],'init');
		},
		toBtn:function(data,rows,index){
			var btn='<div data-id="'+rows.id+'" class="data">';
    		// 修改
    		btn += '<a class="blue-hoki btn btn-xs ladda-button" href="javascript:;" onclick="Role.edit(this,\'#role_add\');" data-style="expand-right" data-size="xs" title="修改">修改<i class="fa fa-edit"></i></a>';
    		btn += '<a class="blue-hoki btn btn-xs ladda-button" href="javascript:;" onclick="Role.edit(this,\'#role_power\');" data-style="expand-right" data-size="xs" title="修改">设置资源<i class="fa fa-edit"></i></a>';
    		btn+='</div>';
    		return btn;
		},
		save:function(e){
			var power=$('#power').val(),str='';
			console.log(power);
			if($unit.isArray(power)){
				str=power.join(",");
			}
			console.log(str);
			$('#resources').val(str);
			$unit.submit($('#role_add_form'),function(opt,data,state){
				if(opt.type=='success'){
					$hmsh.table.refresh();
					$unit.open($('#role_list'));
					return ;
				}
				swal(opt.title,opt.message,opt.type);
			});
		},
		setPower:function(){
			
		}
	}	
}();