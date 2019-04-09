package com.mayocase.rest;

import java.util.List;
import java.util.Map;
import java.util.Properties;

import javax.naming.Context;
import javax.naming.directory.BasicAttribute;
import javax.naming.directory.DirContext;
import javax.naming.directory.ModificationItem;
import javax.naming.ldap.InitialLdapContext;
import javax.naming.ldap.LdapContext;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.util.StringUtils;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import com.mayocase.domain.OrganizationalUnit;
import com.mayocase.domain.Person;
import com.mayocase.repository.OrganizationalUnitRepo;
import com.mayocase.repository.PersonRepo;
import com.mayocase.rest.from.PersonForm;

@Controller
@RequestMapping("/admin")
public class LdapController {
	
	private static final Logger LOGGER = LoggerFactory.getLogger(LdapController.class);
	
	@Autowired
	private PersonRepo personRepo;
	
	@Autowired
	private OrganizationalUnitRepo organizationalUnitRepo;
	
	@Value("${ldap.searchDn}")
    public String searchDn;
	
	@Value("${ldap.keystore}")
	public String keystore;
		
	@RequestMapping("/ouList")
    public ModelAndView ouList(	Map<String, Object> map){
    	
		List<OrganizationalUnit> oulist = organizationalUnitRepo.findAll(searchDn);
    	map.put("oulist", oulist);
        return new ModelAndView("admin/ou_list",map);
    }
	
	//AD用户列表
    @RequestMapping("/personList")
    public ModelAndView personList(@RequestParam(value = "searchDn", required = false) String searchDn,
    						Map<String, Object> map) {
    	
    	List<Person>  persons= personRepo.findAll(searchDn);
    	map.put("persons", persons);
    	return new ModelAndView("admin/person_list",map);
    }
	
    
    //修改AD用户
    @RequestMapping("/personModify")
    public ModelAndView personModify(	@RequestParam(value = "cn", required = false) String cn,
    						Map<String, Object> map) {
    	if (StringUtils.isEmpty(cn)) {
            return new ModelAndView("admin/personList");
    	}else {
    		Person person = personRepo.findOne(cn);
    		map.put("person", person);
    		return new ModelAndView("admin/person_modify.html",map);
    	}
    }
	
    //修改AD用户-保存数据
    @PostMapping("/personModifySave")
    public String personModifySave(@Valid @ModelAttribute("person") PersonForm  personForm,BindingResult result,
    									ModelMap model, HttpServletRequest request) {
    	
    	if (result.hasErrors()) {
    		LOGGER.info("修改时，格式有错");
            return "admin/person_modify.html";
        }
        try {
            //如果cn不为空, 说明是修改的
            if (!StringUtils.isEmpty(personForm.getCn())) {
            	
            	Person person = personRepo.findOne(personForm.getCn());
            	person.setMail(personForm.getMail());
            	person.setTelephoneNumber(personForm.getTelephoneNumber());
            	person.setUserAccountControl(personForm.getUserAccountControl());
            	personRepo.update(person);
            } 
        } catch (RuntimeException e) {
        	e.printStackTrace();
            return "redirect:/admin/personModify?cn="+ personForm.getCn();
        }
        return "redirect:/admin/personModify?cn="+ personForm.getCn();
    	
    }
    
    /*@RequestMapping("/test1")
    public String test() {
    	Person person = new Person();
    	person.setCn("test999");
    	person.setSn("测试");
    	person.setUserAccountControl("66048");
    	person.setTelephoneNumber("15880277638");
    	person.setUserPassword("Maks.123".getBytes());
    	person.setMail("test999@mayocase.com");
    	person.setsAMAccountName("test999");
    	
    	System.out.println("密码二进制："+"Maks.123".getBytes());
    	//personRepo.create(person);
    	personRepo.changePassword("test999", "Maks.333");
    	return "redirect:ouList";
    }*/
	
	/*
	public List<String> getPersonNamesByLastName(String lastName) {
	      LdapQuery query = query()
	    		  			.base("ou=maksad")	//Base LDAP path 基本路径（search应该从LDAP树的哪里开始）
	    		  			.attributes("cn", "sn")   //返回的属性
	    		  			.where("objectclass").is("person")
	    		  			.and("sn").is(lastName);
	      return ldapTemplate.search(query, new AttributesMapper<String>() {
	                                            public String mapFromAttributes(Attributes attrs)throws NamingException {
	                                                  return attrs.get("cn").get().toString(); //查询每一个entry的"cn"值
	                                            }
	                                 });
	}
	*/
    
    @RequestMapping("/test2")
    public String test2() {
    	//certinit();
    	return "redirect:ouList";
    }
    
    
    /*public void certinit() {
    	
    	
		LdapContext dc = null;
	
        Properties env = new Properties();
        //String adminName = "cn=zhuyr,cn=Maksad,dc=mayocase,dc=com";
        String adminName = "zhuyr@mayocase.com";
		String adminPassword = "RFVyhn88";// password
		String ldapURL = "ldap://172.16.160.27:636";// ip:port
        env.put(Context.INITIAL_CONTEXT_FACTORY,"com.sun.jndi.ldap.LdapCtxFactory");
        env.put(Context.SECURITY_AUTHENTICATION, "simple");//LDAP访问安全级别："none","simple","strong"
        env.put(Context.SECURITY_PRINCIPAL, adminName);
        env.put(Context.SECURITY_CREDENTIALS, adminPassword);
        env.put(Context.PROVIDER_URL, ldapURL);
        env.put("javax.net.ssl.trustStore", keystore);  
        
        LOGGER.info("证书路径："+keystore);
        //System.setProperty("javax.net.ssl.trustStore", keystore);  
        env.put(Context.SECURITY_PROTOCOL, "ssl");
        
        try {
        	dc = new InitialLdapContext(env, null);
        	System.out.println("AD域ssl身份认证成功");
        	
        	ModificationItem[] mods = new ModificationItem[1]; 
        	//mods[0] = new ModificationItem(DirContext.REPLACE_ATTRIBUTE,new BasicAttribute("userAccountControl", "66048"));
        	mods[0] = new ModificationItem(DirContext.REPLACE_ATTRIBUTE,new BasicAttribute("userPassword", getPasswordInByte("Maks.zhu")));

        	dc.modifyAttributes("cn="+"test999" + "," + "OU=maksad,DC=mayocase,DC=com", mods);
        	System.out.println("启用用户成功！");
            
            
        } catch (Exception e) {
            System.out.println("AD域ssl身份认证失败");
            e.printStackTrace();
        }
    }
    
    private byte[] getPasswordInByte(String quotedPassword) {
        System.out.println("The user updated password is"+"Maks.zhu");
        char unicodePwd[] = quotedPassword.toCharArray();
        byte pwdArray[] = new byte[unicodePwd.length * 2];
        for (int i = 0; i < unicodePwd.length; i++) {
            pwdArray[i * 2 + 1] = (byte) (unicodePwd[i] >>> 8);

            pwdArray[i * 2 + 0] = (byte) (unicodePwd[i] & 0xff);
        }
        return pwdArray;
    }*/
    
}
