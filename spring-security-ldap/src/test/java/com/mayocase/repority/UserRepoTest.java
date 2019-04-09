/*package com.mayocase.repority;

import static org.junit.Assert.assertEquals;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.context.junit4.SpringRunner;

import com.mayocase.domain.SysPermission;
import com.mayocase.domain.SysRole;
import com.mayocase.domain.SysUser;
import com.mayocase.repository.SysPermissionRepo;
import com.mayocase.repository.SysRoleRepo;
import com.mayocase.repository.SysUserRepo;

@RunWith(SpringRunner.class)
@SpringBootTest
public class UserRepoTest {
	
	
	@Autowired
	private SysUserRepo sysUserRepo;
	
	
	@Autowired
	private SysRoleRepo sysRoleRepo;
	@Autowired
	private SysPermissionRepo permissionRepo;
	
	//初始化权限、角色、用户表
	@Test
	public void add() {
		
		//权限
		SysPermission permission1 = new SysPermission();
		permission1.setDescritpion("desc_权限1");
		permission1.setUrl("url_1");
				
		SysPermission permission2 = new SysPermission();
		permission2.setDescritpion("desc_权限2");
		permission2.setUrl("url_2");
		
		SysPermission permission3 = new SysPermission();
		permission3.setDescritpion("desc_权限3");
		permission3.setUrl("url_3");
		
		SysPermission permission4 = new SysPermission();
		permission4.setDescritpion("desc_权限4");
		permission4.setUrl("url_4");
		
		permissionRepo.save(permission1);
		permissionRepo.save(permission2);
		permissionRepo.save(permission3);
		permissionRepo.save(permission4);
		
		List<SysPermission> permissions1 = new ArrayList<>();
		permissions1.add(permission1);
		permissions1.add(permission2);
		
		List<SysPermission> permissions2 = new ArrayList<>();
		permissions2.add(permission2);
		permissions2.add(permission3);
		
		List<SysPermission> permissions3 = new ArrayList<>();
		permissions3.add(permission3);
		permissions3.add(permission4);
		
		//角色
		SysRole role1 = new SysRole();
		role1.setName("ROLE_ADMIN");
		role1.setDescritpion("管理员");
		
		SysRole role2 = new SysRole();
		role2.setName("ROLE_USER");
		role2.setDescritpion("普通用户");
		
		SysRole role3 = new SysRole();
		role3.setName("ROLE_GUEST");
		role3.setDescritpion("访客");
		
		role1.setSyspermissions(permissions1);
		
		role2.setSyspermissions(permissions2);
		
		role3.setSyspermissions(permissions3);
		
		
		
		sysRoleRepo.save(role1);
		sysRoleRepo.save(role2);
		sysRoleRepo.save(role3);
		
		SysUser user1 = new SysUser();
		user1.setUsername("root");
		user1.setEmail("root@qq.com");
		user1.setAddress("软件园二期望海路61号");
		user1.setNickname("管理员");
		user1.setSex(1);
		
		BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
		// 加密
		user1.setPassword(passwordEncoder.encode("root"));
		
		user1.setSysrole(role1);
		
		
		SysUser user2 = new SysUser();
		user2.setUsername("zhuyr");
		user2.setEmail("zhuyr@qq.com");
		user2.setAddress("软件园二期望海路69号");
		user2.setNickname("小朱");
		
		// 加密
		user2.setPassword(passwordEncoder.encode("zhuyr"));		
				
		
		user2.setSysrole(role2);
		
		sysUserRepo.save(user1);
		sysUserRepo.save(user2);
		
		
		
	}
	@Test
	public void test89() {
		
		SysUser user = sysUserRepo.findByUsername("zhuyr");
		
		
		BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
		// 加密
		String encodedPassword = passwordEncoder.encode(user.getPassword().trim());
		user.setPassword(encodedPassword);
		
		sysUserRepo.save(user);
	}
	
	
	@Test
	public void test7() {
		
		Optional<SysUser> user =  sysUserRepo.findById(1);
		if(user.isPresent()) {
			System.out.println("用户名： "+user.get().getUsername());
			List<SysRole>  roles = user.get().getRoles();
			for(SysRole role : roles) {
				System.out.println("角色： "+role.getName());
				List<SysPermission> permissions = role.getSyspermissions();
				for(SysPermission permission :permissions) {
					System.out.println("权限： "+permission.getName());
				}
			}
			
			
		}
		
		
		
		
	}
	
	
	
	
	@Test
	public void test8() {
		
		//List<SysPermission>  list = sysUserRepo.findByUsername("user1");
				
		
		List<SysPermission> permissions = sysUserRepo.findByUsername("user1");
		if(permissions !=null && permissions.size()>=0) {
			for(SysPermission permission:permissions) {
				System.out.println(permission.getName());
			}
		}
		
		
		

		
	}
}
*/