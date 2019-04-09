package com.mayocase.config;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ldap.core.DirContextOperations;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.ldap.userdetails.LdapUserDetailsMapper;
import org.springframework.stereotype.Component;

import com.mayocase.domain.SysRole;
import com.mayocase.domain.SysUser;
import com.mayocase.repository.SysRoleRepo;
import com.mayocase.repository.SysUserRepo;
 
/**
 * @author zhuyr
 * 用户为登录用户设置角色权限
 */
@Component
public class MyLdapUserDetailsMapper extends LdapUserDetailsMapper {
 
	@Autowired
	private SysUserRepo sysUserRepo;
	
	@Autowired
	private SysRoleRepo sysRoleRepo;
	
	@Override
	public UserDetails mapUserFromContext(DirContextOperations ctx, String username, Collection<? extends GrantedAuthority> authorities) {
		
		// 根据username读取用户信息，级联查询用户的角色的名称
		SysUser sysUser = sysUserRepo.findByUsername(username);
		
		//将角色添加到集合里即可  
		List<SimpleGrantedAuthority> WhAuthorities = new ArrayList<>();
		
		if(sysUser == null ) {
			WhAuthorities.add(new SimpleGrantedAuthority("ROLE_USER"));
		}else {
			// 新建N个角色
			WhAuthorities.add(new SimpleGrantedAuthority(sysUser.getSysrole().getName()));
		}
		return super.mapUserFromContext(ctx, username, WhAuthorities);
	}
}
