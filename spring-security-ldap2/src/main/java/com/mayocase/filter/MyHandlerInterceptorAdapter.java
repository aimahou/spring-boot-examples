/*package com.mayocase.filter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.context.SecurityContextImpl;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

public class MyHandlerInterceptorAdapter extends HandlerInterceptorAdapter {
	
	private static final Logger logger = LoggerFactory.getLogger(MyHandlerInterceptorAdapter.class);
	
	public boolean  preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception{
		SecurityContextImpl se = (SecurityContextImpl) request.getSession().getAttribute("SPRING_SECURITY_CONTEXT");
		if(se!=null){
			return true;
		}
		return false;
		
	}

}
*/