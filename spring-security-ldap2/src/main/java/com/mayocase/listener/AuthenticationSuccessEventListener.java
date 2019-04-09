/*package com.mayocase.listener;

import java.util.HashMap;

import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationListener;
import org.springframework.security.authentication.event.AuthenticationSuccessEvent;
import org.springframework.security.web.authentication.WebAuthenticationDetails;
import org.springframework.security.web.session.ConcurrentSessionFilter;
import org.springframework.stereotype.Component;

import com.mayocase.handler.MyAuthenctiationSuccessHandler;

@Component
public class AuthenticationSuccessEventListener implements ApplicationListener<AuthenticationSuccessEvent> {

	private static final Logger logger = LoggerFactory.getLogger(AuthenticationSuccessEventListener.class);
	//登录成功执行
	@Override
	public void onApplicationEvent(AuthenticationSuccessEvent e) {
		
		WebAuthenticationDetails auth = (WebAuthenticationDetails)e.getAuthentication().getDetails();
				
		logger.info("登录用户的IP地址："+auth.getRemoteAddress());
	}
}
*/