/*package com.mayocase.filter;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;

import org.springframework.security.core.session.SessionInformation;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.web.RedirectStrategy;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.security.web.session.ConcurrentSessionFilter;
import org.springframework.stereotype.Component;


@Component
public class MyConcurrentSessionFilter extends ConcurrentSessionFilter{

	public MyConcurrentSessionFilter(SessionRegistry sessionRegistry) {
		super(sessionRegistry);
		// TODO Auto-generated constructor stub
	}

	@Override
	public void afterPropertiesSet() {
		// TODO Auto-generated method stub
		super.afterPropertiesSet();
	}

	@Override
	public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
			throws IOException, ServletException {
		//System.out.println("2.过滤器MyConcurrentSessionFilter");
		super.doFilter(req, res, chain);
	}

	@Override
	protected String determineExpiredUrl(HttpServletRequest request, SessionInformation info) {
		// TODO Auto-generated method stub
		return super.determineExpiredUrl(request, info);
	}

	@Override
	public void setLogoutHandlers(LogoutHandler[] handlers) {
		// TODO Auto-generated method stub
		super.setLogoutHandlers(handlers);
	}

	@Override
	public void setRedirectStrategy(RedirectStrategy redirectStrategy) {
		// TODO Auto-generated method stub
		super.setRedirectStrategy(redirectStrategy);
	}

	
	ConcurrentSessionFilter做的功能比较简单，主要是判断session是否过期以及更新最新访问时间
	通过代码HttpSession session = request.getSession(false);判断获取session
	1、首先判断session是否存在--------HttpSession session = request.getSession(false)
   		如果session不存在，直接放过，执行下一个过滤器。
  		如果存在，则执行第二步
	2、根据sessionid从sessionRegistry中获取SessionInformation，从SessionInformation中获取session是否过期
   		如果没有过期，则更新SessionInformation的访问日期。
   		如果过期，则执行doLogout()方法，这个方法会将session无效，并将SecurityContext中的Authentication中的权限置空，同时在SecurityContenxtHoloder中清除SecurityContext
   		然后查看是否有跳转的URL，如果有就跳转，没有就输出提示信息
	在ConcurrentSessionFilter有两个重要的类需要知道，一个是sessionRegistry（默认使用sessionRegistryImpl），一个是SessionInformation 。
	sessionRegistry顾名思义 session注册表，有维护两个类变量ConcurrentMap<Object,Set<String>> principals 和Map<String, SessionInformation> sessionIds
	principals以用户认证信息为key，values值sessionId集合，sessionIds以sessionId为key，以SessionInformation 为values值。
	sessionInformation只要存放4个参数，一个是lastRequest;（最近访问时间），一个是sessionId，一个是principal（用户认证权限），一个是expired (是否过期)
	
	

}

*/