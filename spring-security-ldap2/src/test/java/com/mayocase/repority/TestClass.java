package com.mayocase.repority;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.test.context.junit4.SpringRunner;

import com.mayocase.config.ldap.LdapConfig;

@RunWith(SpringRunner.class)
@SpringBootTest
public class TestClass {

	
	@Autowired
	private LdapConfig ldapConfig;
	
	@Autowired
	private Environment env;
	
	@Test
	public void test() {
		System.out.println(env.getProperty("ldap.ldapurl"));
		System.out.println(ldapConfig.getLdapbase());
	}
	
}
