/*package com.mayocase.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.mayocase.domain.SysUser;
import com.mayocase.repository.SysUserRepo;


*//**
 * @author zhuyr
 * 20180911
 *//*
@Service
public class CustomUserService implements UserDetailsService { //自定义UserDetailsService 接口

	private static final Logger logger = LoggerFactory.getLogger(CustomUserService.class);
	
    @Autowired
    SysUserRepo sysUserRepo;
   
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException{//可加可不加throws UsernameNotFoundException
    	
    	//1.判断用户名是否正确
    	SysUser user = sysUserRepo.findByUsername(username);//根据登录用户名，获取用户详细信息（userdetails 类型的）
        if (user == null) {
            //throw new UsernameNotFoundException("用户名不存在");
        	logger.warn("登录用户名不存在");
        	return null;
        }
        return user;  
        //https://blog.csdn.net/u012702547/article/details/54319508
        //用户重复登录https://blog.csdn.net/qq_19707521/article/details/53585006
    }
    

}
*/