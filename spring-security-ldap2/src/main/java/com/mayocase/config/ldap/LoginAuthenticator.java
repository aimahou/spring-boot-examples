package com.mayocase.config.ldap;

import javax.annotation.Resource;
import javax.naming.Context;
import javax.naming.NamingException;
import javax.naming.directory.Attributes;
import javax.naming.directory.SearchControls;
import javax.naming.ldap.LdapContext;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.EnvironmentAware;
import org.springframework.core.env.Environment;
import org.springframework.ldap.core.AttributesMapper;
import org.springframework.ldap.core.ContextSource;
import org.springframework.ldap.core.DirContextOperations;
import org.springframework.ldap.core.LdapTemplate;
import org.springframework.ldap.filter.AndFilter;
import org.springframework.ldap.filter.EqualsFilter;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.ldap.SpringSecurityLdapTemplate;
import org.springframework.security.ldap.authentication.AbstractLdapAuthenticator;

import com.mayocase.repository.impl.LdapUserAttributeMapper;

/**
 * 自定义的LDAP登录认证器
 */
public class LoginAuthenticator extends AbstractLdapAuthenticator {
    private static final Log logger = LogFactory.getLog(LoginAuthenticator.class);

   
    private final String searchFilter;
    private SearchControls searchControls = new SearchControls();

    @Value("${ldap.ldapbase}") 
    private String searchBase;
    
   
    @Autowired
    LdapUserAttributeMapper ldapUserAttributeMapper;
    
    public LoginAuthenticator(ContextSource contextSource, String searchBase, String searchFilter) {
        super(contextSource);
        
        this.searchFilter = searchFilter;
        this.searchBase = searchBase;

        if (searchBase.length() == 0) {
            logger.info("SearchBase 没有设置. Searches will be performed from the root: ---");
        }
    }

	@Override
    public DirContextOperations authenticate(Authentication authentication) {
        DirContextOperations user = null;

        String username = authentication.getName();
        String password = (String) authentication.getCredentials();

        ContextSource contextSource = getContextSource();
        LdapContext context = (LdapContext) contextSource.getReadOnlyContext();
        
        AndFilter filter = new AndFilter();
        filter.and(new EqualsFilter("sAMAccountName", username));
        filter.and(new EqualsFilter("objectclass", "person"));
        
        try {
            // 尝试使用用户的域账号登陆LDAP，如果连接成功那么就算是通过
            context.addToEnvironment(Context.SECURITY_PRINCIPAL, username + "@mayocase.com");
            context.addToEnvironment(Context.SECURITY_CREDENTIALS, password);
            context.reconnect(null);
        } catch (NamingException e) {
            if (logger.isDebugEnabled()) {
                logger.debug("用户或密码不匹配: " + e.getLocalizedMessage());
            }
            // 如果重新连接不上，则断定为登陆失败
            throw new UsernameNotFoundException("用户或密码不匹配: " + e.getLocalizedMessage());
        }

        LdapTemplate ldapTemplate = new LdapTemplate();
        ldapTemplate.setContextSource(contextSource);
        
        boolean yesorno = ldapTemplate.authenticate(this.searchBase, filter.encode(), password);
        logger.info("+++++++yesorno+++++++++:"+yesorno);
        // 使用用户自己的域账号登陆LDAP，并获取信息。避免使用公用账号获取信息（因为我们压根没有公用账号0_0）
        if (user == null && getUserSearch() != null) {
            searchControls.setSearchScope(SearchControls.SUBTREE_SCOPE);
			/*ldapTemplate.search("OU=Maksad,DC=mayocase,DC=com",filter.encode(), new AttributesMapper<String>() {
	            public String mapFromAttributes(Attributes attrs)
	                    throws NamingException {
	                    return (String) attrs.get("cn").get();
	                 }
			});*/
			
			
			try {
				user = SpringSecurityLdapTemplate.searchForSingleEntryInternal(context, searchControls, this.searchBase, filter.encode(), new String[] { username });
			} catch (NamingException e) {
				if (logger.isDebugEnabled()) {
                    logger.debug("用户或密码不匹配:" + e.getLocalizedMessage());
                }
				e.printStackTrace();
			}
        }

        if (user == null) {
            throw new UsernameNotFoundException("未找到用户：" + username);
        }
        
        return user;
    }

}
