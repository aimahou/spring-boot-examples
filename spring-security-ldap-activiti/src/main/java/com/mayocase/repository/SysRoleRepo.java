package com.mayocase.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mayocase.domain.SysRole;

public interface SysRoleRepo extends JpaRepository<SysRole, Integer> {

	
	SysRole getById(Integer roleid);
}
