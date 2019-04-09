/*package com.mayocase.filter;

import java.io.IOException;
import java.util.List;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.session.SessionInformation;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.core.session.SessionRegistryImpl;
import org.springframework.web.filter.GenericFilterBean;

import com.mayocase.domain.SysUser;
import com.mayocase.util.ContextHolderUtils;
import com.mayocase.util.SessionUtil;

public class MySessionFilter extends GenericFilterBean{
	
	private static final Logger logger = LoggerFactory.getLogger(MySessionFilter.class);

	@Autowired
    //@Qualifier("sessionRegistry")
    private SessionRegistry sessionRegistry;

    //@Bean(name="sessionRegistry",value="sessionRegistry")
    @Bean
    //@Bean(name="sessionRegistry")
    public SessionRegistry getSessionRegistry(){
        return new SessionRegistryImpl();
    }
    
	
	@Override
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)throws IOException, ServletException {
		
		
		
		if (SecurityContextHolder.getContext() != null && SecurityContextHolder.getContext().getAuthentication() != null) {
			Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
			if (authentication.getDetails() != null && BaseUser.class.isAssignableFrom(authentication.getDetails().getClass())) {
				BaseUser current = (BaseUser) authentication.getDetails();
				UserSessionContext.set(current);
			}
		}
		try {
			chain.doFilter(request, response);
		} finally {
			UserSessionContext.set(null);
}
		
	}

	//https://github.com/georgezeng/collectinfo.web/blob/d3a0f839987c20bca2f16e1a1e21d82c204c558e/src/main/java/com/collectinfo/config/SecurityConfig.java

}
*/