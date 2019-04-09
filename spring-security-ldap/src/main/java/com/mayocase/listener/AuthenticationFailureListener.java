/*package com.mayocase.listener;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationListener;
import org.springframework.security.authentication.event.AuthenticationFailureBadCredentialsEvent;
import org.springframework.security.web.authentication.WebAuthenticationDetails;
import org.springframework.stereotype.Component;

@Component
public class AuthenticationFailureListener implements ApplicationListener<AuthenticationFailureBadCredentialsEvent> {

	private static final Logger logger = LoggerFactory.getLogger(AuthenticationFailureListener.class);
	
	//登录失败时执行
	@Override
	public void onApplicationEvent(AuthenticationFailureBadCredentialsEvent e) {
		// TODO Auto-generated method stub
		WebAuthenticationDetails auth = (WebAuthenticationDetails)e.getAuthentication().getDetails();
		
		logger.info("AuthenticationFailureListener登录失败监听器："+auth.getRemoteAddress());
	}

}
*/