package com.mayocase.rest;

import java.util.LinkedList;
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
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.util.StringUtils;
import org.springframework.validation.BindingResult;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import com.mayocase.domain.SysPermission;
import com.mayocase.domain.SysRole;
import com.mayocase.domain.SysUser;
import com.mayocase.repository.SysPermissionRepo;
import com.mayocase.repository.SysRoleRepo;
import com.mayocase.repository.SysUserRepo;
import com.mayocase.rest.from.RoleForm;
import com.mayocase.rest.from.UserForm;

@Controller
@RequestMapping("/admin")
public class RolesController {

    private static final Logger LOGGER = LoggerFactory.getLogger(RolesController.class);
    

    @Autowired
    private SysRoleRepo sysRoleRepo;
    
    @Autowired
    private SysPermissionRepo sysPermissionRepo;
       
    //角色列表
    @RequestMapping("/roleList")
    public ModelAndView roleList(				//@RequestParam(value = "status", required = false) Integer status,
    		@RequestParam(value = "pageNum", defaultValue = "1") Integer pageNum,
            @RequestParam(value = "totalPages", defaultValue = "3") Integer totalPages,
            Map<String, Object> map){
    	
    	Page<SysRole> roles= sysRoleRepo.findAll(PageRequest.of(pageNum-1, totalPages));
    	map.put("roles", roles);
    	map.put("pageNum", pageNum);
        map.put("totalPages", totalPages);
        return new ModelAndView("admin/role_list",map);
    }
        
    //创建角色
    @RequestMapping("/roleCreate")
    public String roleCreate(ModelMap model,@ModelAttribute("roleForm") RoleForm roleForm) {
    	List<SysPermission>   sysPermissions  =sysPermissionRepo.findAll();
    	model.addAttribute("sysPermissions", sysPermissions);
        return "admin/role_create.html";
    }
    //新增角色-保存数据
    @RequestMapping(value="/roleCreateSave", method=RequestMethod.POST)
    public String roleCreateSave(@Valid @ModelAttribute("roleForm") RoleForm roleForm,BindingResult result,
    							ModelMap model, HttpServletRequest request) {
    	List<SysPermission>   sysPermissions  =sysPermissionRepo.findAll();
    	model.addAttribute("sysPermissions", sysPermissions);
    	if (result.hasErrors()) {
    		LOGGER.info("创建角色时，提交的格式出错。");
            return "admin/user_create.html";
        }
    	SysRole sysRole = new SysRole();
        try {
            //如果roleId为空, 说明是新增
            LOGGER.info("保存角色");
            BeanUtils.copyProperties(roleForm, sysRole);
            List<SysPermission> pers=new LinkedList<>();
            for(Integer perid : roleForm.getPerids()) {
            	pers.add(sysPermissionRepo.getOne(perid));
            }
            sysRole.setSyspermissions(pers);
            sysRoleRepo.save(sysRole);
          
        } catch (RuntimeException e) {
        	e.printStackTrace();
            return "admin/user_create.html";
        	//redirectAttributes.addFlashAttribute("errors", "Korisnički id ne postoji u formi. Nije moguće ažurirati korisnika.");
        }
        return "redirect:/admin/roleList";
    	
    }
    
    
    //修改角色
    @RequestMapping("/roleModify")
    public String roleModify(@RequestParam(value = "status", required = false) Integer status,
    								@RequestParam(value = "id", required = false) Integer id,
    								ModelMap model) {
    	if (StringUtils.isEmpty(id)) {
            return "admin/role_list.html";
    	}else {
    		List<SysPermission>   permissions  =sysPermissionRepo.findAll();
        	model.addAttribute("permissions", permissions);
        	SysRole sysRole = sysRoleRepo.getOne(id);
        	model.addAttribute("sysRole", sysRole);
    		return "admin/role_modify.html";
    	}
    }
    //修改角色-保存数据
    @PostMapping("/roleModifySave")
    public String roleModifySave(@Valid @ModelAttribute("roleForm") RoleForm roleForm,BindingResult result,
    									ModelMap model, HttpServletRequest request) {
    	List<SysPermission>   sysPermissions  =sysPermissionRepo.findAll();
    	model.addAttribute("sysPermissions", sysPermissions);
    	
    	if (result.hasErrors()) {
    		LOGGER.info("修改角色时，格式有错");
            return "admin/user_modify.html";
        }
        try {
        	SysRole sysRole = new SysRole();
            BeanUtils.copyProperties(roleForm, sysRole);
            List<SysPermission> pers=new LinkedList<>();
            for(Integer perid : roleForm.getPerids()) {
            	pers.add(sysPermissionRepo.getOne(perid));
            }
            sysRole.setSyspermissions(pers);
            sysRoleRepo.saveAndFlush(sysRole);
        } catch (RuntimeException e) {
        	e.printStackTrace();
            return "redirect:/admin/roleModify?id="+ roleForm.getId();
        	//redirectAttributes.addFlashAttribute("errors", "Korisnički id ne postoji u formi. Nije moguće ažurirati korisnika.");
        }
        return "redirect:/admin/roleList";
    	
    }
        
    //根据ID查角色
    @RequestMapping("/roleGet")
    public String getRoleById(@RequestParam(value = "id", required = false) String id,ModelMap map) {
    	map.put("role", sysRoleRepo.getById(Integer.valueOf(id)));
        
        return "admin/role_get";
    }
    
    //删除用户
    @RequestMapping("/roleDelete")
    public String roleDelete(@RequestParam(value = "id", required = false) String id,ModelMap model) {
    	sysRoleRepo.deleteById(Integer.valueOf(id));
        return "redirect:/admin/roleList";
    }

}
