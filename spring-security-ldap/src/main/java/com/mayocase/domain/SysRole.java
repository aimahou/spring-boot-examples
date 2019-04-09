package com.mayocase.domain;

import java.io.Serializable;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.Table;

@Entity
@Table(name = "sys_role")
public class SysRole {

	/**
	 * 
	 */
	//private static final long serialVersionUID = 1093323903176521507L;

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false, updatable = false)
    private Integer id;
	
	@Column(name = "name", nullable = false, unique = true)
    private String name;
	
	//描述
	@Column(name = "descritpion")
	private String descritpion;

	@ManyToMany(fetch = FetchType.EAGER,targetEntity=SysPermission.class)
	@JoinTable(name="role_and_permission",
		joinColumns=@JoinColumn(name="sysrole_id",referencedColumnName="id",nullable=false,updatable=false),
		inverseJoinColumns =@JoinColumn(name="syspermission_id",referencedColumnName = "id",nullable = false,updatable = false))
	private List<SysPermission> syspermissions;
	
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
	@Override
	public String toString() {
		return "SysRole [id=" + id + ", name=" + name + ",descritpion="+ descritpion +", syspermissions=" + syspermissions + "]";
	}
	public List<SysPermission> getSyspermissions() {
		return syspermissions;
	}
	public void setSyspermissions(List<SysPermission> syspermissions) {
		this.syspermissions = syspermissions;
	}
}
