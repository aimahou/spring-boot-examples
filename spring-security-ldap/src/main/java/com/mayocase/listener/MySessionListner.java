package com.mayocase.listener;

import java.util.Iterator;
import java.util.Map.Entry;

import javax.servlet.annotation.WebListener;
import javax.servlet.http.HttpSession;
import javax.servlet.http.HttpSessionEvent;
import javax.servlet.http.HttpSessionListener;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import com.mayocase.domain.SysUser;
import com.mayocase.handler.MyAuthenctiationSuccessHandler;

//启动类加上注解@ServletComponentScan，这样才能扫描到监听器
@WebListener
public class MySessionListner    implements HttpSessionListener {

	private static final Logger logger = LoggerFactory.getLogger(MySessionListner.class);
	
	/**
	 * 新建session时（打开浏览器访问登录页面时，服务器会创建一个新的session）
	 */
	@Override
	public void sessionCreated(HttpSessionEvent httpSessionEvent) {
		logger.info("新建session时");
	}
	/**
	 * 删除session时（退出系统）
	 */
	@Override
	public void sessionDestroyed(HttpSessionEvent httpSessionEvent) {
		logger.info("销毁session时");
		//遍历sessionMap集合，如果当前销毁的session还在sessionMap集合中，就将其删除
		//可能因为session过期时间到了，而不是因为用户重复登录而销毁session
		Iterator<Entry<String, HttpSession>> iterator = MyAuthenctiationSuccessHandler.sessionMap.entrySet().iterator();
		while(iterator.hasNext()) {
			if(!iterator.next().getKey().contains(httpSessionEvent.getSession().getId())) {
				iterator.remove();
			}
		}
	}

	
	
	
	
}
