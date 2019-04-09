package com.mayocase.config.ldap;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.ldap.core.LdapTemplate;
import org.springframework.ldap.core.support.LdapContextSource;
import org.springframework.security.ldap.authentication.SpringSecurityAuthenticationSource;

@Configuration
public class LdapConfig {

	@Value("${ldap.url}")
    private String ldapUrl;
    @Value("${ldap.baseDn}")
    private String ldapBaseDn;
    
    
    @Value("${ldap.groupSearchBase}")
    private String ldapGroupSearchBase;
    @Value("${ldap.userDnPattern}")
    private String ldapUserDnPattern;
    @Value("${ldap.passwordAttribute}")
    private String ldapPasswordAttribute;

    @Value("${ldap.managerUser}")
    private String ldapManagerUser;
    @Value("${ldap.managerPassword}")
    private String ldapManagerPassword;
	
    @Bean
    public LdapContextSource getContextSource() throws Exception{
        LdapContextSource ldapContextSource = new LdapContextSource();
        ldapContextSource.setUrl(ldapUrl);
        ldapContextSource.setBase(ldapBaseDn);
        //ldapContextSource.setAnonymousReadOnly(true);
        //使用已经登录的信息来配置ldapContextSource
        ldapContextSource.setAuthenticationSource(springSecurityAuthenticationSource());
        return ldapContextSource;
    }

    @Bean
    public LdapTemplate ldapTemplate() throws Exception{
        LdapTemplate ldapTemplate = new LdapTemplate(getContextSource());
        ldapTemplate.setIgnorePartialResultException(true);
        return ldapTemplate;
    }

    @Bean
    public SpringSecurityAuthenticationSource springSecurityAuthenticationSource() {
        return new SpringSecurityAuthenticationSource();
}
}
