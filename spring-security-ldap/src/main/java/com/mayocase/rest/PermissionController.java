package com.mayocase.rest;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.util.StringUtils;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import com.mayocase.domain.SysPermission;
import com.mayocase.repository.SysPermissionRepo;
import com.mayocase.rest.from.PermissionForm;

@Controller
@RequestMapping("/admin")
public class PermissionController {

private static final Logger LOGGER = LoggerFactory.getLogger(PermissionController.class);
    
    @Autowired
    private SysPermissionRepo sysPermissionRepo;
       
    //权限列表
    @RequestMapping("/permissionList")
    public ModelAndView permissionList(				//@RequestParam(value = "status", required = false) Integer status,
    		@RequestParam(value = "pageNum", defaultValue = "1") Integer pageNum,
            @RequestParam(value = "totalPages", defaultValue = "3") Integer totalPages,
            Map<String, Object> map){
    	
    	Page<SysPermission> permissions= sysPermissionRepo.findAll(PageRequest.of(pageNum-1, totalPages));
    	map.put("permissions", permissions);
    	map.put("pageNum", pageNum);
        map.put("totalPages", totalPages);
        //System.out.println("当前页pageNum： "+pageNum+"总页数totalPages："+totalPages+"总共几页："+permissions.getTotalPages());
        return new ModelAndView("admin/permission_list",map);
    }
        
    //创建权限
    @RequestMapping("/permissionCreate")
    public String permissionCreate(ModelMap model,@ModelAttribute("permissionForm") PermissionForm permissionForm) {
    	List<SysPermission>   sysPermissions  =sysPermissionRepo.findAll();
    	model.addAttribute("sysPermissions", sysPermissions);
        return "admin/permission_create.html";
    }
    //新增权限-保存数据
    @RequestMapping(value="/permissionCreateSave", method=RequestMethod.POST)
    public String permissionCreateSave(@Valid @ModelAttribute("permissionForm") PermissionForm permissionForm,BindingResult result,
    							ModelMap model, HttpServletRequest request) {
    	List<SysPermission>   sysPermissions  =sysPermissionRepo.findAll();
    	model.addAttribute("sysPermissions", sysPermissions);
    	if (result.hasErrors()) {
    		LOGGER.info("创建权限时，提交的格式出错。");
            return "admin/user_create.html";
        }
    	SysPermission syspermission = new SysPermission();
        try {
            //如果permissionId为空, 说明是新增
            LOGGER.info("保存权限");
            BeanUtils.copyProperties(permissionForm, syspermission);
            sysPermissionRepo.save(syspermission);
          
        } catch (RuntimeException e) {
        	e.printStackTrace();
            return "admin/user_create.html";
        	//redirectAttributes.addFlashAttribute("errors", "Korisnički id ne postoji u formi. Nije moguće ažurirati korisnika.");
        }
        return "redirect:/admin/permissionList";
    	
    }
    
    
    //修改权限
    @RequestMapping("/permissionModify")
    public String permissionModify(@RequestParam(value = "status", required = false) Integer status,
    								@RequestParam(value = "id", required = false) Integer id,
    								ModelMap model) {
    	if (StringUtils.isEmpty(id)) {
            return "admin/permission_list.html";
    	}else {
    		SysPermission syspermission = sysPermissionRepo.getById(Integer.valueOf(id));
    		model.addAttribute("syspermission", syspermission);
    		return "admin/permission_modify.html";
    	}
    }
    //修改权限-保存数据
    @PostMapping("/permissionModifySave")
    public String permissionModifySave(@Valid @ModelAttribute("permissionForm") PermissionForm permissionForm,BindingResult result,
    									ModelMap model, HttpServletRequest request) {
    	if (result.hasErrors()) {
    		LOGGER.info("修改角色时，格式有错");
            return "admin/user_modify.html";
        }
        try {
        	SysPermission syspermission = new SysPermission();
            BeanUtils.copyProperties(permissionForm, syspermission);
            
            sysPermissionRepo.saveAndFlush(syspermission);
        } catch (RuntimeException e) {
        	e.printStackTrace();
            return "redirect:/admin/permissionModify?id="+ permissionForm.getId();
        	//redirectAttributes.addFlashAttribute("errors", "Korisnički id ne postoji u formi. Nije moguće ažurirati korisnika.");
        }
        return "redirect:/admin/permissionList";
    	
    }
        
    //根据ID查权限
    @RequestMapping("/permissionGet")
    public String getpermissionById(@RequestParam(value = "id", required = false) String id,ModelMap map) {
    	map.put("permission", sysPermissionRepo.getById(Integer.valueOf(id)));
        
        return "admin/permission_get";
    }
    
    //删除权限
    @RequestMapping("/permissionDelete")
    public String permissionDelete(@RequestParam(value = "id", required = false) String id,ModelMap model) {
    	sysPermissionRepo.deleteById(Integer.valueOf(id));
        return "redirect:/admin/permissionList";
    }
}
