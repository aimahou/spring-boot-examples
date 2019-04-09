/*package com.mayocase.service;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.servlet.ModelAndView;
import org.thymeleaf.util.StringUtils;

import com.mayocase.domain.SysPermission;
import com.mayocase.domain.SysRole;
import com.mayocase.domain.SysUser;
import com.mayocase.repository.SysUserRepo;

@Component("rbacService")
public class RbacServiceImpl implements RbacService {
	
	private static final Logger logger = LoggerFactory.getLogger(RbacServiceImpl.class);

	@Autowired
	private SysUserRepo sysuserRepo;
	
	private AntPathMatcher antPathMatcher = new AntPathMatcher();
	
	@Override
	public boolean hasPermission(HttpServletRequest request,Authentication authentication) {
		
		Object principal = authentication.getPrincipal();
		boolean hasPermission = false;
		if(principal instanceof SysUser) {
				//读取用户所拥有的权限的所有URL
				String username = ((SysUser)principal).getUsername();
				SysUser user = sysuserRepo.findByUsername(username);
				SysRole role = user.getSysrole();
				List<SysPermission> permissions = new ArrayList<>();//访问权限集合
				permissions.addAll(role.getSyspermissions());

				//判断用户所拥有的权限里的所有URL 是否包含（匹配）要访问的URL，如果是表示有权限访问
				for(SysPermission permission: permissions) {
					logger.info("用户:"+username+"，拥有以下访问权限:"+permission.getUrl()+"，正试图访问："+request.getRequestURI());
					if(antPathMatcher.match(permission.getUrl(), request.getRequestURI())) {
						logger.info("用户:"+username+"拥有访问"+permission.getUrl()+"的权限"+request.getRequestURI());
						hasPermission = true;
						break;
					}
				}
			
		}
		
		return hasPermission;
	}

}
*/