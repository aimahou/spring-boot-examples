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
	
	@Autowired
	// @Qualifier("sessionRegistry")
	private SessionRegistry sessionRegistry;

	// @Bean(name="sessionRegistry",value="sessionRegistry")
	@Bean
	// @Bean(name="sessionRegistry")
	public SessionRegistry getSessionRegistry() {
		return new SessionRegistryImpl();
	}
	
	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
			Authentication authentication) throws ServletException, IOException {

		String currentuser = authentication.getName();
		if(sysUserRepo.findByUsername(currentuser)==null) {
			logger.info("用户第一次登录，将保存信息在数据库中，并分配普通用户权限");
					
			SysUser user1 = new SysUser();
			user1.setUsername(currentuser);
			user1.setEmail(currentuser+"@"+env.getProperty("ldap.domanin"));
			//user1.setAddress("软件园二期望海路61号");
			user1.setNickname(currentuser);
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
			HttpSession session = entry.getValue();
			
			
			// 2.1 判断session中所包含的用户名称是否有当前登录用户
			String username = SessionUtil.getUserName(session);
			logger.info("session里的用户名是："+username);
			if (username != null &&!username.equals("")&& username.equals(currentuser)) {
				logger.info("用户：" + currentuser + "已经在其它地方登录过，将踢除！");
				logger.info("删除的会话："+entry.getKey());
				// 2.2 从sessionMap中踢除会话
				iterator.remove();
				//设置session过期
				SessionUtil.expireSession(session);
								
				// 2.3 从sessionRegistry中踢除会话并销毁session
				sessionRegistry.removeSessionInformation(session.getId());
			}
		}
		
		// 3.将当前session保存到sessionMap中
		logger.info("将当前会话:" + request.getSession().getId() + "，保存到sessionMap");
		HttpSession session = request.getSession();
		session.setAttribute("username", currentuser);
		session.setMaxInactiveInterval(60*60*12);
		sessionMap.put(session.getId(), session);
		for (Entry<String, HttpSession> entry : sessionMap.entrySet()) {
			logger.info("显示已经保存的sessionMap:Key: " + entry.getKey() + " Value: " + entry.getValue());
		}

		// 4.打印所有认证通过的用户（包含重复登录的,不过上面已经踢除了）
		List<Object> principals = sessionRegistry.getAllPrincipals();
  		List<String> usersNamesList = new ArrayList<String>();
  		for (Object principal: principals) {
  		    if (principal instanceof SysUser) {
  		        usersNamesList.add(((SysUser) principal).getUsername());
  		    }
  		}
  		logger.info("已经认证通过的用户数:"+usersNamesList.size()+"，已经认证通过用户："+usersNamesList.toString());
		
		super.onAuthenticationSuccess(request, response, authentication);
	}

}
