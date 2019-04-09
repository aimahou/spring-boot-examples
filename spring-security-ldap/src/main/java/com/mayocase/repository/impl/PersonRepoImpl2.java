package com.mayocase.repository.impl;

import static org.springframework.ldap.query.LdapQueryBuilder.query;

import java.util.List;

import javax.naming.Name;
import javax.naming.NamingException;
import javax.naming.directory.Attribute;
import javax.naming.directory.Attributes;
import javax.naming.directory.BasicAttribute;
import javax.naming.directory.BasicAttributes;
import javax.naming.directory.DirContext;
import javax.naming.directory.ModificationItem;
import javax.naming.directory.SearchControls;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.ldap.core.AttributesMapper;
import org.springframework.ldap.core.ContextMapper;
import org.springframework.ldap.core.DirContextAdapter;
import org.springframework.ldap.core.DirContextOperations;
import org.springframework.ldap.core.LdapTemplate;
import org.springframework.ldap.core.support.AbstractContextMapper;
import org.springframework.ldap.filter.AndFilter;
import org.springframework.ldap.filter.EqualsFilter;
import org.springframework.ldap.query.LdapQuery;
import org.springframework.ldap.support.LdapNameBuilder;
import org.springframework.ldap.support.LdapUtils;
import org.springframework.stereotype.Component;

import com.mayocase.domain.Person;
import com.mayocase.repository.PersonRepo;

//@Component
public class PersonRepoImpl2{
   
	@Autowired
	private LdapTemplate ldapTemplate;
	
    @Value("${ldap.searchBaseDn}")
    public String BaseDn;
    
    
	
    //使用 LdapNameBuilder 动态创建 LdapName
   	protected Name buildDn(Person p) {
	    return LdapNameBuilder.newInstance(BaseDn)
	    				.add("cn",p.getCn())
//	    					.add("c", p.getCountry())
//	                          .add("ou", p.getCompany())
//	                          .add("cn", p.getFullName())
	                          .build();
	}
   	
   	protected Name buildDn(String name, String company, String country) {
	    return LdapNameBuilder.newInstance(BaseDn)
	    					.add("c", country)
	                          .add("ou", company)
	                          .add("cn", name)
	                          .build();
	}
   	
   	//用 LdapUtils 获取属性值
   	protected Person buildPerson(Name dn, Attributes attrs) {
   	  Person person = new Person();/*
   	  person.setCountry(LdapUtils.getStringValue(dn, "c"));
   	  person.setCompany(LdapUtils.getStringValue(dn, "ou"));
   	  person.setFullName(LdapUtils.getStringValue(dn, "cn"));*/
   	  // Populate rest of person object using attributes.

   	  return person;
   	}
    
   /*
    * 1.使用AttributesMapper进行search和lookup
    *   在ldap中，有两个"查询"概念，search和lookup。
    *   search是ldaptemplate对每一个entry进行查询
    *   lookup是通过DN直接找到某个条目。
    *1.1定义一个AttributesMapper
    **/
   private class PersonAttributesMapper implements AttributesMapper<Person> {
      public Person mapFromAttributes(Attributes attrs) throws NamingException {
         Person person = new Person();/*
         person.setFullName((String)attrs.get("cn").get());
         person.setLastName((String)attrs.get("sn").get());*/
         person.setDescription((String)attrs.get("description").get());
         return person;
      }
   }

   //1.2 search   通过search返回一个Person对象   //有问题
   public List<Person> getAllPersons() {
      return ldapTemplate.search(query()
          .where("objectclass").is("person"), new PersonAttributesMapper());
   }
   
   public List<Person> findByName(String name) {
       LdapQuery query = query()
          .where("objectclass").is("person")
          .and("cn").whitespaceWildcardsLike("name");

       return ldapTemplate.search(query, new PersonAttributesMapper());
    }

    public List<Person> findAll() {
       EqualsFilter filter = new EqualsFilter("objectclass", "person");
       return ldapTemplate.search(LdapUtils.emptyLdapName(), filter.encode(), new PersonAttributesMapper());
    }
   
   //1.3 lookup   通过lookup返回一个Person对象
   public Person findPerson(String dn) {
	      return ldapTemplate.lookup(dn, new PersonAttributesMapper());
   }
   
   
   
   public List<String> getPersonNamesByLastName(String lastName) {

	      LdapQuery query = query()
	    		  			.base("ou=maksad")	//Base LDAP path 基本路径（search应该从LDAP树的哪里开始）
	      //这里不能再多DC=simper,DC=com，不然会报javax.naming.NameNotFoundException: [LDAP: error code 32 - 0000208D: NameErr: DSID-0310020A, problem 2001 (NO_OBJECT)
	    		  			.attributes("cn", "sn")   //返回的属性
	    		  			.where("objectclass").is("person")
	    		  			.and("sn").is(lastName);

	      return ldapTemplate.search(query, new AttributesMapper<String>() {
	                                            public String mapFromAttributes(Attributes attrs)throws NamingException {
	                                                  return attrs.get("cn").get().toString(); //查询每一个entry的"cn"值
	                                            }
	                                 });
	}
   
   
   	/*
   	 * 2. 新删改
   	 * 
   	 * */
   	   
   	//在Ldap中，新增与删除叫做绑定和解绑。
   	//新增数据-使用bind
   	public void create(Person p) {
        Name dn = buildDn(p);
        ldapTemplate.bind(dn, null, buildAttributes(p));
     }

     private Attributes buildAttributes(Person p) {
        Attributes attrs = new BasicAttributes();
        BasicAttribute ocattr = new BasicAttribute("objectclass");
        ocattr.add("top");
        ocattr.add("person");
        attrs.put(ocattr);
        attrs.put("cn", "Some Person");
        attrs.put("sn", "Person");
        return attrs;
     }
     
     //删除数据-使用 unbind
     public void delete(Person p) {
         Name dn = buildDn(p);
         ldapTemplate.unbind(dn);
     }
     
     //更新数据-使用 rebind
     public void update(Person p) {
         Name dn = buildDn(p);
         ldapTemplate.rebind(dn, null, buildAttributes(p));
      }
     
     //更新数据-使用 modifyAttributes
     public void updateDescription(Person p) {
         Name dn = buildDn(p);
         Attribute attr = new BasicAttribute("description", p.getDescription());
         ModificationItem item = new ModificationItem(DirContext.REPLACE_ATTRIBUTE, attr);
         ldapTemplate.modifyAttributes(dn, new ModificationItem[] {item});
      }
     
     /*
      * 3. 简化 Attribute 的获取和 DirContextAdapter 的操作
      * Java LDAP API 可以注册一个DirContextAdapter来自动创建对象。
      * spring-ldap使用了这个特点，在search和lookup中返回DirContextAdapter实例。
      * 任何时候，想要在LDAP数据树中查找entry，spring-ldap都会使用这个entry的DN和Attributes来构建一个DirContextAdapter，
      * 这使得我们不再需要使用 AttributesMapper，而是使用ContextMapper来对获取的属性值进行转换。
      * 
      * 3.1 通过ContextMapper来search 和lookup
      * */
     
      public Person findByPrimaryKey(String name, String company, String country) {
         Name dn = buildDn(name, company, country);
         return (Person)ldapTemplate.lookup(dn, new MyPersonContextMapper());
      }
      
      
      //3.2 使用DirContextAdapter新增和更新数据
      //注意新增的时候用的是：DirContextAdapter。更新的时候用的是：DirContextOperations。
      //二者的关系：DirContextAdapter实现了DirContextOperations接口。
      public void create2(Person person) {
          Name dn = buildDn(person);
          DirContextAdapter context = new DirContextAdapter(dn);
          //和获取一样，set也可以有多值
          context.setAttributeValues("objectclass", new String[] {"top", "person"});
          
          
          /*context.setAttributeValue("cn", person.getFullName());
          context.setAttributeValue("sn", person.getLastName());
          context.setAttributeValue("description", person.getDescription());*/
          mapToContext(person, context);

          ldapTemplate.bind(context);
       }
      
      public void update2(Person person) {
          Name dn = buildDn(person);
          DirContextOperations context = ldapTemplate.lookupContext(dn);

          /*context.setAttributeValue("cn", person.getFullName());
          context.setAttributeValue("sn", person.getLastName());
          context.setAttributeValue("description", person.getDescription());*/
          mapToContext(person, context);
          ldapTemplate.modifyAttributes(context);
       }
      
      //将已知对象Person的属性设置成context的对应属性，用于更新或新增AD对象
      protected void mapToContext (Person p, DirContextOperations context) {
          context.setAttributeValue("description", p.getDescription());
       }
      
      public List<Person> getAllPersons2() {
          return ldapTemplate.search(query()
              .where("objectclass").is("person"), new MyPersonContextMapper());
       }

      
      public List<Person> getPersonByUserName(String username) {
    	  
    	  SearchControls searchControls = new SearchControls();
    	  searchControls.setSearchScope(SearchControls.SUBTREE_SCOPE);
    	  
    	  AndFilter filter = new AndFilter();
          filter.and(new EqualsFilter("sAMAccountName", username));
          filter.and(new EqualsFilter("objectclass", "person"));
    	  
          Person person = new Person();
          person.setCn("zhuyr");
          
    	  List<Person> persons  = ldapTemplate.find(buildDn(person), filter, searchControls, Person.class);
    	  
    	  return persons;
      }
}
