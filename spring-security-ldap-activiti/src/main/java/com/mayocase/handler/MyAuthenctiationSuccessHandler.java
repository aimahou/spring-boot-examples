package com.mayocase.handler;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.core.env.Environment;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.core.session.SessionRegistryImpl;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.mayocase.domain.SysUser;
import com.mayocase.repository.SysRoleRepo;
import com.mayocase.repository.SysUserRepo;
import com.mayocase.util.SessionUtil;

//登录用户认证通过后，显示登录成功页面前，做的操作。
@Component
public class MyAuthenctiationSuccessHandler extends SavedRequestAwareAuthenticationSuccessHandler {

	private static final Logger logger = LoggerFactory.getLogger(MyAuthenctiationSuccessHandler.class);

	// key为sessionId，value为HttpSession，使用static，定义静态变量，使之程序运行时，一直存在内存中。
	// 保存所有已经登录用户的会话（每个浏览器一个会话）
	public static HashMap<String, HttpSession> sessionMap = new HashMap<String, HttpSession>();

	@Autowired
	private Environment env;
	
	@Autowired
	private SysUserRepo sysUserRepo;
	
	@Autowired
	private SysRoleRepo sysRoleRepo;
	
	
	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
			Authentication authentication) throws ServletException, IOException {

		// 1.登录认证成功后，获取用户名
		//（只能在认证成功通过后，才能获得sc，不然在CustomUserService implements UserDetailsService的loadUserByUsername方法中是第二次才能获取到）
		//String nowUser = ((SysUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
		String nowUser = authentication.getName();
		HttpSession nowSession = request.getSession();
		logger.info("当前登录用户：" + nowUser+"， 当前会话ID："+ nowSession.getId());
		
		if(sysUserRepo.findByUsername(nowUser)==null) {
			logger.info("用户第一次登录，将保存信息在数据库中，并分配普通用户权限");
					
			SysUser user1 = new SysUser();
			user1.setUsername(nowUser);
			user1.setEmail(nowUser+"@"+env.getProperty("ldap.domanin"));
			//user1.setAddress("软件园二期望海路61号");
			user1.setNickname(nowUser);
			user1.setSex(1);
			/*BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
			// 加密
			user1.setPassword(passwordEncoder.encode("root"));*/
			
			user1.setSysrole(sysRoleRepo.findById(2).get());
			sysUserRepo.save(user1);
		}
		
		// 2.先判断用户是否重复登录
		Iterator<Entry<String, HttpSession>> iterator = sessionMap.entrySet().iterator();
		while(iterator.hasNext()) {
			Map.Entry<String, HttpSession> entry = iterator.next();
			HttpSession  session = entry.getValue();
			String username = session.getAttribute("USER_NAME").toString();
			logger.info("用户: " + username +", HashMap key: "+entry.getKey()+", session:" + session.toString());
			if (username != null &&!username.equals("")&& username.equals(nowUser)) {
				logger.info("用户: " + username +", HashMap key: "+entry.getKey()+ "，踢除之前登录用户");
				iterator.remove();
				session.invalidate();
			}
		}
		
		// 3.将当前session保存到sessionMap中
		logger.info("新增当前会话到sessionMap中：" + request.getSession().getId());
		nowSession.setMaxInactiveInterval(4*60*60);//以秒为单位，设置4个小时过期
		nowSession.setAttribute("USER_NAME", nowUser);
		sessionMap.put(nowSession.getId(), nowSession);
		
		// 4.查询所有已登录用户
		for(String key:MyAuthenctiationSuccessHandler.sessionMap.keySet()) {
			logger.info("用户:"+MyAuthenctiationSuccessHandler.sessionMap.get(key).getAttribute("USER_NAME")+", HashMap key: "+key+" , session:"+MyAuthenctiationSuccessHandler.sessionMap.get(key));
		}
		logger.info("登录用户数："+MyAuthenctiationSuccessHandler.sessionMap.keySet().size());
		
		super.onAuthenticationSuccess(request, response, authentication);
	}

}
