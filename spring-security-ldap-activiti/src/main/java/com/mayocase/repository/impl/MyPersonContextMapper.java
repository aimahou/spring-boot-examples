package com.mayocase.repository.impl;

import org.springframework.ldap.core.DirContextOperations;
import org.springframework.ldap.core.support.AbstractContextMapper;

import com.mayocase.domain.Person;

/**
 * @author zhuyr
 *	将ldap返回的结果，封装成一个Person对象
 */
public class MyPersonContextMapper extends AbstractContextMapper<Person> {

	@Override
	protected Person doMapFromContext(DirContextOperations ctx) {
		Person p = new Person();
	     p.setDescription(ctx.getStringAttribute("description"));
	     p.setsAMAccountName(ctx.getStringAttribute("sAMAccountName"));
	     p.setCn(ctx.getStringAttribute("cn"));
	     p.setTelephoneNumber(ctx.getStringAttribute("telephoneNumber"));
	     p.setMail(ctx.getStringAttribute("mail"));
	     return p;
	}
}
/*private static class PersonContextMapper implements ContextMapper<Person>{
	public Person mapFromContext(Object ctx) {
	   DirContextAdapter context = (DirContextAdapter)ctx;
	   Person p = new Person();
	   p.setFullName(context.getStringAttribute("cn"));
	   p.setLastName(context.getStringAttribute("sn"));
	   p.setDescription(context.getStringAttribute("description"));
		//当属性具有多值时，可以通过getStringAttributes（）来获取。
	   	//p.setRoleNames(context.getStringAttributes("roleNames"));
	   return p;
	}
}

//3.1 自定义的的PersonContextMapper
private static class PersonContextMapper2 extends AbstractContextMapper<Person> {
	public Person doMapFromContext(DirContextOperations ctx) { 
		 Person p = new Person();
		 p.setFullName(ctx.getStringAttribute("cn"));
		 p.setLastName(ctx.getStringAttribute("sn"));
		 p.setDescription(ctx.getStringAttribute("description"));
		 p.setsAMAccountName(ctx.getStringAttribute("sAMAccountName"));
		 p.setCn(ctx.getStringAttribute("cn"));
		 p.setTelephoneNumber(ctx.getStringAttribute("telephoneNumber"));
		 p.setMail(ctx.getStringAttribute("mail"));
		 return p;
	}
}*/