package com.mayocase.repository.impl;

import static org.springframework.ldap.query.LdapQueryBuilder.query;

import java.util.List;

import javax.naming.Name;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.ldap.core.LdapTemplate;
import org.springframework.ldap.filter.AndFilter;
import org.springframework.ldap.filter.EqualsFilter;
import org.springframework.ldap.query.LdapQueryBuilder;
import org.springframework.ldap.support.LdapNameBuilder;
import org.springframework.stereotype.Component;

import com.mayocase.domain.OrganizationalUnit;
import com.mayocase.repository.OrganizationalUnitRepo;

@Component
public class OrganizationalUnitRepoImpl implements OrganizationalUnitRepo {

	@Autowired
	private LdapTemplate ldapTemplate;
	
    @Value("${ldap.baseDn}")
    public String baseDn;

	@Override
	public List<OrganizationalUnit> findAll(String searchBaseDn) {
		Name baseDn = LdapNameBuilder.newInstance(searchBaseDn).build();
		
		LdapQueryBuilder query = query()
								.base(baseDn);
		
		AndFilter filter = new AndFilter();
        //filter.and(new EqualsFilter("sAMAccountName", "zhuyr"));
        filter.and(new EqualsFilter("objectclass", "organizationalUnit"));
        query.filter(filter);
		
		return ldapTemplate.find(query, OrganizationalUnit.class);
	}
    
    
	
}
