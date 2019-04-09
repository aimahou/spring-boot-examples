package com.mayocase.repository;

import java.util.List;

import javax.naming.Name;

import com.mayocase.domain.Person;

/**
 * @author zhuyr
 *
 */
public interface PersonRepo {
	
	
	//根据用户名cn查找某个人的AD信息
	public Person findOne(String cn);
	
	
	//查找某个组织OU下的所有用户
	public List<Person> findAll(String DN);

	//修改AD个人信息
	public void update(Person p);

	//添加AD用户
	//public void create(Person person);
	
	//修改AD用户的密码
	//public void changePassword(String username, String newPassword);
	
	public List<Person> getAllPersons();
	public List<Person> findByName(String name);
	public Person findPerson(String dn);
	public List<String> getPersonNamesByLastName(String lastName);
	public void delete(Person person);
	public void updateDescription(Person p);
	public Person findByPrimaryKey(String name, String company, String country);
	public void create2(Person person);
	public void update2(Person person);
	public List<Person> getAllPersons2();
	
	public List<Person> getPersonByUserName(String username);
}

