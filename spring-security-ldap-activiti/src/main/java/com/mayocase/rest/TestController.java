/*package com.mayocase.rest;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Enumeration;
import java.util.List;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.core.session.SessionRegistryImpl;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.mayocase.domain.SysUser;
import com.mayocase.repository.SysUserRepo;


@Controller
@RequestMapping("/test")
public class TestController {

	 @Autowired
	 private final SysUserRepo userService;
	 
	 @Autowired
	 public TestController(SysUserRepo userService) {
	        this.userService = userService;
	 }
	 
	@Autowired
	// @Qualifier("sessionRegistry")
	private SessionRegistry sessionRegistry;

	// @Bean(name="sessionRegistry",value="sessionRegistry")
	@Bean
	// @Bean(name="sessionRegistry")
	public SessionRegistry getSessionRegistry() {
		return new SessionRegistryImpl();
	}
	
	@RequestMapping("/all")
	public String printalluser() {
		List<Object> principals = sessionRegistry.getAllPrincipals();
  		List<String> usersNamesList = new ArrayList<String>();
  		for (Object principal: principals) {
  		    if (principal instanceof SysUser) {
  		        usersNamesList.add(((SysUser) principal).getUsername());
  		    }
  		}
  		return "已经认证通过的用户数:"+usersNamesList.size()+"，     已经认证通过用户："+usersNamesList.toString();
	}
	
	
	//判断当前用户是否是管理员
    @RequestMapping("/is")
    public String isUserInRole(HttpServletRequest request){
        boolean bl = request.isUserInRole("ROLE_ADMIN");
        if(bl == true) {
        	return "true";
        }
        return "false";
        
    }
    //获取当前用户1
    @RequestMapping("/user")
    public String getPrincipal(){
        String userName = null;
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
 
        if (principal instanceof UserDetails) {
            userName = ((UserDetails)principal).getUsername();
        } else {
            userName = principal.toString();
        }
        return userName;
    }
    
    //获取当前用户2
    @RequestMapping("/user2")
    public String getPrincipal2(){
        String userName = SecurityContextHolder.getContext().getAuthentication().getName();
        return userName;
    }
    
    //获取当前用户的所有角色
    @RequestMapping("/roles")
    public List<String> getRole() {
    	List<String> list = new ArrayList<>();
     	
    	Collection<? extends GrantedAuthority>   grantedAuthoritys =    SecurityContextHolder.getContext().getAuthentication().getAuthorities();
    	for(GrantedAuthority grantedAuthority :grantedAuthoritys) {
    		String authority = grantedAuthority.getAuthority();
    		list.add(authority);
    		System.out.println(authority);
    	}
    	return list;
    }
    
    //获取所有session的值
    @RequestMapping("/session")
    public void showsession(HttpServletRequest request) {
    	//获取session  
    	HttpSession   session   =   request.getSession();    
    	// 获取session中所有的键值  
    	Enumeration<String> attrs = session.getAttributeNames();  
    	// 遍历attrs中的
    	while(attrs.hasMoreElements()){
    	// 获取session键值  
    	    String name = attrs.nextElement().toString();
    	    // 根据键值取session中的值  
    	    Object vakue = session.getAttribute(name);
    	    // 打印结果 
    	    System.out.println("--sessionID: "+session.getId());
    	    System.out.println("--名字：" + name +",    --值：" + vakue +"--------\n");
    	}
    	
    }
    
    @RequestMapping("/coo1")
    public String  setcookie(HttpServletRequest request,HttpServletResponse response) {
    	String cookieName = "cookie_Name";
    	String value = "第一次设置";
    	Cookie cookie = new Cookie(cookieName,value);
        cookie.setPath("/");
        cookie.setMaxAge(3600);
        response.addCookie(cookie);
        return "设置：cookie名："+cookie.getName()+",  cookie值："+cookie.getValue();
    }
    
    @RequestMapping("/coo2")
    public String  getcookie2(HttpServletRequest request,HttpServletResponse response) {
    	
    	Cookie[] cookies =  request.getCookies();
        if(cookies != null){
            for(Cookie cookie : cookies){
                return "获取：cookie名："+cookie.getName()+",  cookie值："+cookie.getValue();
            }
        }
        return "空";
    }
    
    @RequestMapping("/coo3")
    public String  changecookie3(HttpServletRequest request,HttpServletResponse response) {
    	String cookieName = "cookie_Name";
    	Cookie[] cookies =  request.getCookies();
    	if(cookies != null){
            for(Cookie cookie : cookies){
                if(cookie.getName().equals(cookieName)){
                	cookie.setValue("修改COOKIE");
                	response.addCookie(cookie);
                	return "修改后的：cookie名："+cookie.getName()+",  cookie值："+cookie.getValue();
                }
            }
        }
    	return "空";
    }
    
    @RequestMapping("/coo4")
    public String  delcookie4(HttpServletRequest request,HttpServletResponse response) {
    	String cookieName = "cookie_Name";
    	Cookie[] cookies =  request.getCookies();
    	if(cookies != null){
            for(Cookie cookie : cookies){
                if(cookie.getName().equals(cookieName)){
                	cookie.setMaxAge(0);
                	response.addCookie(cookie);
                	return "删除后的：cookie名："+cookie.getName()+",  cookie值："+cookie.getValue();
                }
            }
        }
    	return "空";
    }
    
    
    使用@PreAuthorize注解
    记得WebSecurityConfigurerAdapter类要添加注解@EnableGlobalMethodSecurity(prePostEnabled = true)  
	
  	@PreAuthorize("hasRole('ROLE_ADMIN')")  //此方法只允许 ROLE_ADMIN 角色访问
    @RequestMapping("/admin")
    @ResponseBody
    public String helloadmin(){
        return "hello admin";
    }
  	
  	
    使用@Secured注解
    记得WebSecurityConfigurerAdapter类要添加注解@EnableGlobalMethodSecurity(securedEnabled = true)  
	
  	@Secured("ROLE_ADMIN")//此方法只允许 ROLE_USER 角色访问
    @RequestMapping("/admin")
    @ResponseBody
    public String helloadmin(){
        return "hello admin";
    }
  	
  	@Secured({"ROLE_ADMIN","ROLE_USER"})//此方法只允许 ROLE_ADMIN 和ROLE_USER 角色 访问
  	@RequestMapping(value="/get" ,method = RequestMethod.GET)
    @ResponseBody
    public String getUsers() {
        return "getUsers";
    }
  	

    @RequestMapping("/common")
    public  String login2(ModelMap map){
    	map.put("users", userService.findAll());
        return "admin/index.html";
    }

    @RequestMapping("/info")
    public String  getUsersinfo() {
    	return "/common/info.html";
    }
    
}
*/