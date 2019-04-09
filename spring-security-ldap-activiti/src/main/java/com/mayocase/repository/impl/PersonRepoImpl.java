package com.mayocase.repository.impl;

import static org.springframework.ldap.query.LdapQueryBuilder.query;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.List;

import javax.naming.Name;
import javax.naming.directory.Attribute;
import javax.naming.directory.Attributes;
import javax.naming.directory.BasicAttribute;
import javax.naming.directory.BasicAttributes;
import javax.naming.directory.DirContext;
import javax.naming.directory.ModificationItem;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.ldap.core.DirContextAdapter;
import org.springframework.ldap.core.DistinguishedName;
import org.springframework.ldap.core.LdapTemplate;
import org.springframework.ldap.filter.AndFilter;
import org.springframework.ldap.filter.EqualsFilter;
import org.springframework.ldap.query.LdapQuery;
import org.springframework.ldap.query.LdapQueryBuilder;
import org.springframework.ldap.support.LdapNameBuilder;
import org.springframework.stereotype.Component;

import com.mayocase.domain.Person;
import com.mayocase.repository.PersonRepo;

@Component
public class PersonRepoImpl implements PersonRepo {

	@Autowired
	private LdapTemplate ldapTemplate;
	    
	@Override
	public Person findOne(String cn) {
		LdapQuery query = query()
				.where("cn").whitespaceWildcardsLike(cn);
		return ldapTemplate.findOne(query, Person.class);
	}

	@Override
	public List<Person> findAll(String searchDn) {
		Name baseDn = LdapNameBuilder.newInstance(searchDn).build();
		
		LdapQueryBuilder query = query()
								.base(baseDn);
		//这里的baseDn不能再多DC=mayocase,DC=com，不然会报javax.naming.NameNotFoundException: [LDAP: error code 32 - 0000208D: NameErr: DSID-0310020A, problem 2001 (NO_OBJECT)
		AndFilter filter = new AndFilter();
        filter.and(new EqualsFilter("objectclass", "person"));//设置类型是person，可以添加多个过滤器filter.and(new EqualsFilter("sAMAccountName", "zhuyr"));
        query.filter(filter);
		
		return ldapTemplate.find(query, Person.class);
	}
	

	@Override
	public void update(Person person) {
		ldapTemplate.update(person);
		
	}
	
	/*//添加AD用户
	@Override
	public void create(Person person) {
		
	        Attribute objectClass = new BasicAttribute("objectClass");
	        {
	        	objectClass.add("top");
	            objectClass.add("person");
	            objectClass.add("organizationalPerson");
	            objectClass.add("user");

	        }
	        	        
	        Attributes userAttributes = new BasicAttributes();
	        userAttributes.put(objectClass);
	        userAttributes.put("cn", person.getCn());
	        userAttributes.put("sn", person.getSn());
	        userAttributes.put("telephoneNumber", person.getTelephoneNumber());
	        userAttributes.put("mail", person.getMail());
	        userAttributes.put("sAMAccountName", person.getsAMAccountName());
	        //userAttributes.put("userPassword", person.getUserPassword());
	        userAttributes.put("userPassword", generatePassword("Maks.123"));
	        //userAttributes.put("memberOf", "CN=Account Operators,CN=Builtin,DC=mayocase,DC=com");
	        //userAttributes.put("uid", person.getUid());
	        //userAttributes.put("userAccountControl", person.getUserAccountControl());
	        ldapTemplate.bind(bindDN(person.getCn()), null, userAttributes);
		
			DirContextAdapter context = new DirContextAdapter();
			mapToContext(person, context);
			ldapTemplate.bind(buildDn(person), context, null);
	
	}
	
	@Override
	public void changePassword(String username, String newPassword) {
		//Create a modification item, replacing the password
		ModificationItem modItem = new ModificationItem(DirContext.REPLACE_ATTRIBUTE,
				new BasicAttribute("userPassword", generatePassword(newPassword)));

		//Send the modification object
		ldapTemplate.modifyAttributes("cn=" + username + ",ou=maksad", new ModificationItem[]{modItem});
	}
	
	
	private static String generatePassword(String password) {
		try {
			MessageDigest md = MessageDigest.getInstance("SHA");
			md.update(password.getBytes());
			byte[] digest = md.digest();
			String result = Base64.getEncoder().encodeToString(digest);
			return "{SHA}" + result;
		} catch (NoSuchAlgorithmException e) {
			e.printStackTrace();
			return null;
		}
}
	
	
	public static javax.naming.Name bindDN(String _x){
        Name name = new DistinguishedName("cn=" + _x + ",ou=maksad");
        return name;
	}
	
	
	
	public Name buildDn(Person person) {
	      return buildDn(person.getCn());
	}
	
	public Name buildDn(String cn) {
	      DistinguishedName dn = new DistinguishedName();
	      dn.add("dc","com");
	      dn.add("dc", "mayocase");
	      dn.add("ou", "maksad");
	      dn.add("cn", cn);
	      return dn;
	}
	public void mapToContext(Person person, DirContextAdapter context) {
	      context.setAttributeValues("objectClass", new String[] {"organizationalPerson", "person", "top","user"});
	      context.setAttributeValue("memberOf", "CN=Account Operators,CN=Builtin,DC=mayocase,DC=com");
	      context.setAttributeValue("cn", person.getCn());
	      context.setAttributeValue("sn", person.getSn());
	      context.setAttributeValue("userAccountControl", person.getUserAccountControl());
	      context.setAttributeValue("telephoneNumber", person.getTelephoneNumber());
	      context.setAttributeValue("userPassword", person.getUserPassword());
	      context.setAttributeValue("mail", person.getMail());
	}*/
	
	
	
	
	
	
	@Override
	public List<Person> getAllPersons() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<Person> findByName(String name) {
		// TODO Auto-generated method stub
		return null;
	}

	

	@Override
	public Person findPerson(String dn) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<String> getPersonNamesByLastName(String lastName) {
		// TODO Auto-generated method stub
		return null;
	}

	

	@Override
	public void delete(Person p) {
		// TODO Auto-generated method stub
		
	}


	@Override
	public void updateDescription(Person p) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public Person findByPrimaryKey(String name, String company, String country) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void create2(Person person) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void update2(Person person) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public List<Person> getAllPersons2() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<Person> getPersonByUserName(String username) {
		// TODO Auto-generated method stub
		return null;
	}
	
	

}
