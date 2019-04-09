package com.mayocase.rest.from;

import java.util.List;

import javax.naming.Name;
import javax.validation.constraints.Email;
import javax.validation.constraints.Pattern;

import org.hibernate.validator.constraints.Range;
import org.springframework.ldap.odm.annotations.Attribute;

public class PersonForm {

	/**
     * 必填属性，帐户名
     */
    private String cn;
	
	/**
     * 邮箱
     */
	@Email(message = "邮箱地址不对")
    private String mail;
    
    /**
     * 电话号码
     */
    @Pattern(regexp = "(^$|[0-9]{11})", message = "电话号码错误")
    private String telephoneNumber;

    @Range(min=20,max=66148,message = "代码错误")
    private String userAccountControl;
    
    /**
     * 全称
     */
    private String name;
    
    private Name dn;
    private String distinguishedName;
    private List<String> objectclass;
    /**
     * 描述
     */
    private String description;
    
    /**
     * 显示名称 
     */
    private String displayName; 
    
	public String getCn() {
		return cn;
	}

	public void setCn(String cn) {
		this.cn = cn;
	}

	public String getMail() {
		return mail;
	}

	public void setMail(String mail) {
		this.mail = mail;
	}

	public String getTelephoneNumber() {
		return telephoneNumber;
	}

	public void setTelephoneNumber(String telephoneNumber) {
		this.telephoneNumber = telephoneNumber;
	}

	public String getUserAccountControl() {
		return userAccountControl;
	}

	public void setUserAccountControl(String userAccountControl) {
		this.userAccountControl = userAccountControl;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Name getDn() {
		return dn;
	}

	public void setDn(Name dn) {
		this.dn = dn;
	}

	public String getDistinguishedName() {
		return distinguishedName;
	}

	public void setDistinguishedName(String distinguishedName) {
		this.distinguishedName = distinguishedName;
	}

	public List<String> getObjectclass() {
		return objectclass;
	}

	public void setObjectclass(List<String> objectclass) {
		this.objectclass = objectclass;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getDisplayName() {
		return displayName;
	}

	public void setDisplayName(String displayName) {
		this.displayName = displayName;
	}
    
    
}
