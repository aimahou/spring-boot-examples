package com.mayocase.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.mayocase.domain.SysPermission;
import com.mayocase.domain.SysRole;
import com.mayocase.domain.SysUser;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;

import org.jboss.logging.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface SysUserRepo extends JpaRepository<SysUser, Integer> {
	
	//public void create(SysUser sysUser);
	
	/*@Modifying
	@Query(value="update SysUser u set u.address=:user.address,"
			+" u.email=:user.email, u.nickname=:user.nickname, "
			+" u.sex=:user.sex, u.tel=:user.tel, u.username=:user.username where id=:user.id")
	public void update(@Param(user)SysUser user);*/
	
	SysUser findByUsername(String username);
	
	
	SysUser getById(Integer id);

    Optional<SysUser> findOneByEmail(String email);
    
    public Page<SysUser> findAll(Pageable pageable);
    
    /*@Query(value = "select distinct  SysPermission from SysUser u" + 
    		"		LEFT JOIN user_and_role uar on u.id= uar.sysuser_id " + 
    		"        LEFT JOIN SysRole r on uar.sysrole_id=r.id " + 
    		"        LEFT JOIN role_and_permission rap on rap.sysrole_id=r.id " + 
    		"        LEFT JOIN SysPermission p on p.id =rap.syspermission_id " + 
    		"        where u.username='user1'")
    List<SysPermission> findByUsername(String username);*/
    
    /*public List<SysPermission> getByUsername(String username) {
		
		List<SysPermission> syspermissions = new ArrayList<>();
		
		Optional<SysUser> sysuser = sysUserRepo.findOneByUsername(username);
		if(sysuser.isPresent()) {
			List<SysRole> roles = sysuser.get().getRoles();
			Iterator<SysRole> iterator = roles.iterator();
			while(iterator.hasNext()) {
				List<SysPermission> list=iterator.next().getSyspermissions();
				for(SysPermission syspermission :list) {
					syspermissions.add(syspermission);
				}
			}
		}
		for(SysPermission syspermission :syspermissions) {
			System.out.println(syspermission.getUrl());
		}
		
		return syspermissions;
	}*/
}
