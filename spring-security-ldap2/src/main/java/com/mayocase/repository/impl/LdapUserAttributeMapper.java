package com.mayocase.repository.impl;

import org.springframework.ldap.core.AttributesMapper;

import com.mayocase.domain.LdapPerson;

import javax.naming.NamingException;
import javax.naming.directory.Attributes;
 
/**
 * 将ldap返回的结果，转成指定对象
 */
public class LdapUserAttributeMapper implements AttributesMapper {
 
 
	/**
	 * 将单个Attributes转成单个对象
	 * @param attrs
	 * @return
	 * @throws NamingException
	 */
	public Object mapFromAttributes(Attributes attrs) throws NamingException {
		LdapPerson user  = new LdapPerson();
 
		if(attrs.get("uid") != null){
			user.setUid( attrs.get("uid").get().toString());
		}
		if(attrs.get("cn") != null){
			user.setCn( attrs.get("cn").get().toString());
		}
		if(attrs.get("mobile") != null){
			user.setPhone( attrs.get("mobile").get().toString());
		}
		if(attrs.get("mail") != null){
			user.setMail( attrs.get("mail").get().toString());
		}
		if(attrs.get("employeeNumber") != null){
			user.setEmployeeNumber( attrs.get("employeeNumber").get().toString());
		}
 
		if(attrs.get("smart-type") != null){
			user.setSmarttype( attrs.get("smart-type").get().toString());
		}
		if(attrs.get("smart-py") != null){
			user.setSmartpy(attrs.get("smart-py").get().toString());
		}
		if(attrs.get("smart-alias") != null){
			user.setSmartalias(attrs.get("smart-alias").get().toString());
		}
		if(attrs.get("departmentNumber") != null){
			user.setDepartmentNumber(attrs.get("departmentNumber").get().toString());
		}
		if(attrs.get("departmentName") != null){
			user.setDepartment(attrs.get("departmentName").get().toString());
		}
		if(attrs.get("customized-jobname") != null){
			user.setPositionName(attrs.get("customized-jobname").get().toString());
		}
		if(attrs.get("modifyTimestamp") != null){
			user.setModifyTimestamp(attrs.get("modifyTimestamp").get().toString());
		}
		return user;
	}
}