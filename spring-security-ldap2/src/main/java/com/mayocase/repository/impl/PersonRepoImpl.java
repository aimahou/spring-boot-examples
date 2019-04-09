package com.mayocase.repository.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.ldap.core.LdapTemplate;
import org.springframework.ldap.filter.AndFilter;
import org.springframework.ldap.filter.EqualsFilter;
import org.springframework.stereotype.Component;

import com.mayocase.domain.LdapPerson;
//import com.mayocase.repository.PersonRepo;

/*@Component
public class PersonRepoImpl implements PersonRepo {

	@Autowired
    private LdapTemplate ldapTemplate;
	
	@Autowired
	private Environment env;
	
	@Override
	public void listPerson() {
		AndFilter filter = new AndFilter();
        filter.and(new EqualsFilter("objectClass", "person"));
 
        //查询所有内部人员
        List<LdapPerson> users = ldapTemplate.search(env.getProperty("ldap.searchBase"), filter.encode(), new LdapUserAttributeMapper());
        for (LdapPerson user: users ) {
            System.out.println(user);
        }

	}

}*/
