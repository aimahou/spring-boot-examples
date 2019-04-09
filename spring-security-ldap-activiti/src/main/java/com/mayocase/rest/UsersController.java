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
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
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

import com.mayocase.domain.SysRole;
import com.mayocase.domain.SysUser;
import com.mayocase.repository.SysRoleRepo;
import com.mayocase.repository.SysUserRepo;
import com.mayocase.rest.from.UserForm;



@Controller
@RequestMapping("/admin")
public class UsersController {

    private static final Logger LOGGER = LoggerFactory.getLogger(UsersController.class);
    private final SysUserRepo sysUserRepo;

    @Autowired
    private SysRoleRepo sysRoleRepo;
    
    
    @Autowired
    public UsersController(SysUserRepo sysUserRepo) {
        this.sysUserRepo = sysUserRepo;
    }    
    
    
    /*
    @Secured({"ROLE_ADMIN"})//此方法只允许 ROLE_ADMIN 和ROLE_USER 角色 访问
    @RequestMapping("/show")
    public ModelAndView showcurrentuser(ModelMap model) {
    	model.addAttribute("currentuser", getPrincipal());
    	return new ModelAndView("showuser",model);
    }
    
    //获取当前用户
    private String getPrincipal(){
        String userName = null;
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
 
        if (principal instanceof UserDetails) {
            userName = ((UserDetails)principal).getUsername();
        } else {
            userName = principal.toString();
        }
        return userName;
    }*/
    
    //用户管理
    @RequestMapping("/userList")
    public ModelAndView userList(				//@RequestParam(value = "status", required = false) Integer status,
    		@RequestParam(value = "pageNum", defaultValue = "1") Integer pageNum,
            @RequestParam(value = "totalPages", defaultValue = "3") Integer totalPages,
            Map<String, Object> map){
    	
    	Page<SysUser> users= sysUserRepo.findAll(PageRequest.of(pageNum-1, totalPages));
    	map.put("users", users);
    	map.put("pageNum", pageNum);
        map.put("totalPages", totalPages);
        return new ModelAndView("admin/user_list",map);
    }
        
    //创建用户
    @RequestMapping("/userCreate")
    public String createUser(ModelMap model,@ModelAttribute("userForm") UserForm userForm) {
    	List<SysRole> sysRoles = sysRoleRepo.findAll();
    	model.addAttribute("sysRoles",sysRoles);
        return "admin/user_create.html";
    }
    //新增用户-保存数据
    @RequestMapping(value="/userCreateSave", method=RequestMethod.POST)
    public String userCreateSave(@Valid @ModelAttribute("userForm") UserForm userForm,BindingResult result,
    							ModelMap model, HttpServletRequest request) {
    	
    	List<SysRole> sysRoles = sysRoleRepo.findAll();
    	model.addAttribute("sysRoles",sysRoles);
    	if (result.hasErrors()) {
    		LOGGER.info("创建用户时，提交的格式出错。");
    		
            return "admin/user_create.html";
        }else if(!userForm.getNewPassword().equals(userForm.getNewPasswordConfirm())) {
        	LOGGER.info("创建用户时，两次输入的密码不匹配。");
        	model.addAttribute("MSG","两次输入的密码不匹配");
            return "admin/user_create.html";
        }
        SysUser user = new SysUser();
        try {
            //如果userId为空, 说明是新增
            if (StringUtils.isEmpty(userForm.getId())) {
            	LOGGER.info("保存");
            	if(userForm.getNewPassword().equals(userForm.getNewPasswordConfirm())) {
            		
            		BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
            		userForm.setPassword(passwordEncoder.encode(userForm.getNewPassword()));
            		BeanUtils.copyProperties(userForm, user);
            		user.setSysrole(sysRoleRepo.getById(Integer.valueOf(userForm.getSysroleid())));
                    sysUserRepo.save(user);
            	}
            }
        } catch (RuntimeException e) {
        	e.printStackTrace();
            return "/admin/user_create.html";
        	//redirectAttributes.addFlashAttribute("errors", "Korisnički id ne postoji u formi. Nije moguće ažurirati korisnika.");
        }
        return "redirect:/admin/userGet?id="+ user.getId();
    	
    }
    
    
    //修改用户
    @RequestMapping("/userModify")
    public String userAlter(@RequestParam(value = "status", required = false) Integer status,
    								@RequestParam(value = "id", required = false) String id,
    								ModelMap model) {
    	if (StringUtils.isEmpty(id)) {
    		List<SysRole> sysRoles = sysRoleRepo.findAll();
        	model.addAttribute("sysRoles",sysRoles);
            return "/admin/user_list.html";
    	}else {
    		List<SysRole> sysRoles = sysRoleRepo.findAll();
    		SysUser userForm = sysUserRepo.getById(Integer.valueOf(id));
    		model.addAttribute("userForm",userForm);
    		model.addAttribute("sysRoles",sysRoles);
    		return "admin/user_modify.html";
    	}
    }
    //修改用户-保存数据
    @PostMapping("/userModifySave")
    public String userModifySave(@Valid @ModelAttribute("userForm") UserForm userForm,BindingResult result,
    									ModelMap model, HttpServletRequest request) {
    	List<SysRole> sysRoles = sysRoleRepo.findAll();
    	model.addAttribute("sysRoles",sysRoles);
    	if (result.hasErrors()) {
    		LOGGER.info("修改时，格式有错");
            return "admin/user_modify.html";
        }
        try {
        	SysUser user = new SysUser();
            //如果userId不为空, 说明是修改的
            if (!StringUtils.isEmpty(userForm.getId())) {
            	user = sysUserRepo.getById(userForm.getId());
            	LOGGER.info("修改");
            	userForm.setUsername(user.getUsername());
            	userForm.setPassword(user.getPassword());
                BeanUtils.copyProperties(userForm, user);
                user.setSysrole(sysRoleRepo.getById(Integer.valueOf(userForm.getSysroleid())));
                sysUserRepo.saveAndFlush(user);
            } 
        } catch (RuntimeException e) {
        	e.printStackTrace();
            return "redirect:/admin/userModify?id="+ userForm.getId();
        	//redirectAttributes.addFlashAttribute("errors", "Korisnički id ne postoji u formi. Nije moguće ažurirati korisnika.");
        }
        return "redirect:/admin/userGet?id="+ userForm.getId();
    	
    }
        
    //根据ID查用户信息
    @RequestMapping("/userGet")
    public String getUserById(@RequestParam(value = "id", required = false) String id,ModelMap map) {
    	map.put("userinfo", sysUserRepo.getById(Integer.valueOf(id)));
        
        return "admin/user_get";
    }
    
    //删除用户
    @RequestMapping("/userDelete")
    public String userDelete(@RequestParam(value = "id", required = false) String id,ModelMap model) {
    	sysUserRepo.deleteById(Integer.valueOf(id));
        return "redirect:/admin/userList";
    }

}
