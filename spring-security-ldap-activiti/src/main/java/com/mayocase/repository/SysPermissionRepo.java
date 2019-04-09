package com.mayocase.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mayocase.domain.SysPermission;
import com.mayocase.domain.SysRole;

/**
 * Created by yangyibo on 17/1/20.
 */
public interface SysPermissionRepo extends JpaRepository<SysPermission, Integer> {
    public List<SysPermission> findAll();
    
    SysPermission getById(Integer id);
    
}
