package com.mayocase.config.ldap;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.ldap.core.DirContextOperations;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.ldap.userdetails.LdapAuthoritiesPopulator;
import org.springframework.stereotype.Service;

import com.mayocase.domain.SysUser;
import com.mayocase.repository.SysUserRepo;


/**
 * Spring Secutity 登陆时，获取权限的实现
 */
@Service("ldapAuthoritiesPopulator")
@Scope("prototype")
public class PortalLdapAuthoritiesPopulator implements LdapAuthoritiesPopulator {

	@Autowired
	private SysUserRepo sysUserRepo;

    @Override
    public Collection<? extends GrantedAuthority> getGrantedAuthorities(DirContextOperations userData,
            String username) {

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

        return WhAuthorities;
    }
}
