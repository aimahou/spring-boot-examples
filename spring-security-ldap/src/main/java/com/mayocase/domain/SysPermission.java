package com.mayocase.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * Created by yangyibo on 17/1/20.
 */
@Entity
@Table(name = "sys_permission")
public class SysPermission {

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false, updatable = false)
    private Integer id;
    
	
    //权限描述
	@Column(name = "descritpion")
    private String descritpion;

    //授权链接
	@Column(name = "url", nullable = false, unique = true)
    private String url;

    public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getDescritpion() {
        return descritpion;
    }

    public void setDescritpion(String descritpion) {
        this.descritpion = descritpion;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public SysPermission() {
		super();
		
	}
    
	public SysPermission(Integer id,String descritpion, String url) {
		super();
		this.id = id;
		this.descritpion = descritpion;
		this.url = url;
	}


}
