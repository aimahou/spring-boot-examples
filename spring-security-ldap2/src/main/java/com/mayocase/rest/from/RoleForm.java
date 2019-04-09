package com.mayocase.rest.from;

import java.util.List;

import com.mayocase.domain.SysPermission;

public class RoleForm {

	
    private Integer id;
	
    private String name;
	
	private String descritpion;
	
	private List<Integer> perids;

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescritpion() {
		return descritpion;
	}

	public void setDescritpion(String descritpion) {
		this.descritpion = descritpion;
	}

	public List<Integer> getPerids() {
		return perids;
	}

	public void setPerids(List<Integer> perids) {
		this.perids = perids;
	}

	
	
	
	
}
