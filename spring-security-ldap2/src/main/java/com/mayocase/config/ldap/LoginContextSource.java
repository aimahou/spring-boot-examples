package com.mayocase.config.ldap;

import java.util.Hashtable;

import javax.naming.Context;
import javax.naming.NamingException;
import javax.naming.directory.DirContext;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.security.ldap.ppolicy.PasswordPolicyAwareContextSource;

/**
 * 登录环境变量的设置
 */

public class LoginContextSource extends PasswordPolicyAwareContextSource {
	
	@Autowired
	private LdapConfig ldapConfig;
	
	@Autowired
	private Environment env;
	
	@Value("#{ldap.ldapurl}")
	private String ldapUrl;
	
	
    private static final String LDAP_FACTORY = "com.sun.jndi.ldap.LdapCtxFactory";

    public LoginContextSource(String providerUrl) {
        super(providerUrl);

        this.afterPropertiesSet();
    }

    @Override
    protected DirContext getDirContextInstance(Hashtable<String, Object> environment) throws NamingException {
    	
    	
    	
        environment.put(Context.INITIAL_CONTEXT_FACTORY, LDAP_FACTORY);
        environment.put(Context.SECURITY_AUTHENTICATION, "simple");
        environment.put("java.naming.referral", "follow");

        // 这里只是做一个演示，后面其实并不需要公用的帐号登录
        //environment.put(Context.PROVIDER_URL, ldapConfig.getLdapurl());
        environment.put(Context.PROVIDER_URL, "ldap://172.16.160.27:389");
        //environment.put(Context.SECURITY_PRINCIPAL, ldapConfig.getLdapadmin());
        environment.put(Context.SECURITY_PRINCIPAL, "zhuyr@mayocase.com");
        //environment.put(Context.SECURITY_CREDENTIALS, ldapConfig.getLdappassword());
        environment.put(Context.SECURITY_CREDENTIALS, "RFVyhn88");

    	//System.out.println("LoginContextSource:1111111111"+ldapUrl);
        
        return super.getDirContextInstance(environment);
    }
}
