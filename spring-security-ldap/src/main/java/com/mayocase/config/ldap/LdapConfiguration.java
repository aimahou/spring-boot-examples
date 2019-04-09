package com.mayocase.config.ldap;

import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

import javax.naming.Context;
import javax.naming.NamingException;
import javax.naming.ldap.InitialLdapContext;
import javax.naming.ldap.LdapContext;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.ldap.core.AuthenticationSource;
import org.springframework.ldap.core.LdapTemplate;
import org.springframework.ldap.core.support.LdapContextSource;

@PropertySource("ldap.properties")
@Configuration
public class LdapConfiguration {

  @Autowired
  private Environment env;

  private LdapContext ldapContext;
  private LdapTemplate ldapTemplate;
  
 /* @Bean
  public LdapContextSource contextSource() {
    LdapContextSource contextSource = new LdapContextSource();
    
    contextSource.setUrl(env.getProperty("ldap.url"));
    contextSource.setBase(env.getProperty("ldap.base"));
    //https://blog.csdn.net/t894690230/article/details/52928369
    contextSource.setUrl("ldap://172.16.160.27:389");
    contextSource.setBase("DC=mayocase,DC=com");
    //contextSource.setUserDn(env.getProperty("ldap.user"));
    //contextSource.setPassword(env.getProperty("ldap.password"));
    contextSource.setCacheEnvironmentProperties(false);
    
    contextSource.setAuthenticationSource(new AuthenticationSource() {
		
		@Override
		public String getPrincipal() {
			//return env.getProperty("ldap.password");
			return "Root.123";
		}
		
		@Override
		public String getCredentials() {
			//return env.getProperty("ldap.user");
			return "read-only-admin@mayocase.com";
		}
    }
	);
       
    Map<String, Object> config = new HashMap<>();
    //  解决 乱码 的关键一句
    config.put("java.naming.ldap.attributes.binary", "objectGUID");
    contextSource.setPooled(true);
    contextSource.setBaseEnvironmentProperties(config);
    
    return contextSource;
  }

  @Bean
  public LdapTemplate ldapTemplate() {
	  
	  if (null == ldapTemplate)
          ldapTemplate = new LdapTemplate();
      return ldapTemplate;
	  
  }*/
  
  
  	/*@Bean
	public LdapContext ldapContext() {
		Properties env = new Properties();
	      env.put(Context.INITIAL_CONTEXT_FACTORY,"com.sun.jndi.ldap.LdapCtxFactory");
	      env.put(Context.SECURITY_AUTHENTICATION, "simple");//LDAP访问安全级别："none","simple","strong"
	      env.put(Context.SECURITY_PRINCIPAL, env.getProperty("ldap.user"));
	      env.put(Context.SECURITY_CREDENTIALS, env.getProperty("ldap.password"));
	      env.put(Context.PROVIDER_URL, env.getProperty("ldap.url"));
	      LdapContext dc = null;
			try {
				dc = new InitialLdapContext(env, null);
				System.out.println("AD域帐户密码认证成功");
			} catch (NamingException e) {
	
	          System.out.println("AD域帐户密码认证失败");
				e.printStackTrace();
			}
	      return dc;
	  }

	  @Bean
	  public LdapTemplate ldapTemplate() {
		  
		  if (null == ldapTemplate)
	          ldapTemplate = new LdapTemplate();
		  ldapTemplate.setContextSource(contextSource);
	      return ldapTemplate;
		  
	  }*/

}
