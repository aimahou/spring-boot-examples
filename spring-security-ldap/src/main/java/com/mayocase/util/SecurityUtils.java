/*package com.mayocase.util;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

public class SecurityUtils {
	public static Authentication getAuthenticationContext(HttpServletRequest request, HttpServletResponse response) throws IOException {
		SecurityContext securityContext = null;
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		if (auth == null) {
			HttpSession session = request.getSession();
			if (session.getAttribute("SPRING_SECURITY_CONTEXT") != null) {
				securityContext = (SecurityContext) session.getAttribute("SPRING_SECURITY_CONTEXT");
				auth = securityContext.getAuthentication();
				SecurityContextHolder.getContext().setAuthentication(auth);
				return auth;
			} else {
//				response.sendError(
//						HttpServletResponse.SC_UNAUTHORIZED,
//						"Unauthorized: Authentication token was either missing or invalid.");
				return null;
				
			}
		}
		return auth;
	}
	public static void updateUserInContext(HttpServletRequest request, UserDetails user) {
		UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
		SecurityContext securityContext = SecurityContextHolder.getContext();
	    securityContext.setAuthentication(authentication);
		HttpSession session = request.getSession(true);
		session.setAttribute("SPRING_SECURITY_CONTEXT", securityContext);
		
	}
}
*/