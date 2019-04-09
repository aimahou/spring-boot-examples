package com.mayocase.config.ldap;

import java.util.Properties;

import javax.annotation.Resource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.core.env.Environment;
import org.springframework.ldap.core.support.BaseLdapPathContextSource;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.ldap.authentication.LdapAuthenticationProvider;
import org.springframework.security.ldap.search.FilterBasedLdapUserSearch;
import org.springframework.stereotype.Service;

@Service("authenticatorProviderBuilder")
@Scope("prototype")
public class AuthenticatorProviderBuilder {
	
	@Autowired
	private LdapConfig ldapConfig;
	
	@Autowired
	private Environment env;
	
    @Resource(name="ldapAuthoritiesPopulator")
    PortalLdapAuthoritiesPopulator ldapAuthoritiesPopulator; 


    public AuthenticationProvider getAuthenticationProvider() {
        //String searchBase = "OU=maksad,DC=mayocase,DC=com";
    	
    	String searchBase =ldapConfig.ldapsearchBase;
        String searchFilter = "(uid={0})";
        String ladpUrl = ldapConfig.getLdapurl();

        BaseLdapPathContextSource contextSource = new LoginContextSource(ladpUrl);

        //BaseLdapPathContextSource contextSource ;
        
        FilterBasedLdapUserSearch userSearch = new FilterBasedLdapUserSearch(searchBase, searchFilter, contextSource);

        LoginAuthenticator ldapAuthenticator = new LoginAuthenticator(contextSource, searchBase, searchFilter);
        ldapAuthenticator.setUserSearch(userSearch);

        LdapAuthenticationProvider ldapAuth = new LdapAuthenticationProvider(ldapAuthenticator, ldapAuthoritiesPopulator);

        return ldapAuth;
    }
}
