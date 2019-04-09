/*package com.mayocase.filter;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.web.context.SecurityContextPersistenceFilter;
import org.springframework.stereotype.Component;

import com.mayocase.util.SessionUtil;

@Component
public class MySecurityContextPersistenceFilter extends SecurityContextPersistenceFilter{

	@Override
	public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
			throws IOException, ServletException {

		
		//这个过滤器会执行多次
		HttpServletRequest request = (HttpServletRequest) req;  
        HttpServletResponse response = (HttpServletResponse) res;  
        
		//System.out.println("1.执行过滤MySecurityContextPersistenceFilter");
		
		
		super.doFilter(req, res, chain);
	}

	

	
	
}
*/