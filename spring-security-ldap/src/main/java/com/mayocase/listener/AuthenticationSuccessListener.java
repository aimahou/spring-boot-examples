/*package com.mayocase.listener;

import javax.servlet.annotation.WebListener;
import javax.servlet.http.HttpSessionAttributeListener;
import javax.servlet.http.HttpSessionBindingEvent;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;

import com.mayocase.domain.SysUser;
import com.mayocase.util.SessionUtil;

*//**
 * Authentication success listener
 *//*

//@WebListener
public class AuthenticationSuccessListener implements HttpSessionAttributeListener {
    public final static String LOGIN_USER = "LOGIN_USER";

    //在session中添加对象时触发此操作 笼统的说就是调用setAttribute这个方法时候会触发的
    public void attributeAdded(HttpSessionBindingEvent se) {
    	System.out.println("类"+"AuthenticationSuccessListener attributeAdded");
    }

    public void attributeRemoved(HttpSessionBindingEvent se) {
    	System.out.println("类"+"AuthenticationSuccessListener attributeRemoved");
    }

    public void attributeReplaced(HttpSessionBindingEvent se) {
    	System.out.println("类"+"AuthenticationSuccessListener attributeReplaced");
    }
}
*/