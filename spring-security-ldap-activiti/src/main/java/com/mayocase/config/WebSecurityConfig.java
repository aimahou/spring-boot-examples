package com.mayocase.config;

import java.util.Arrays;
import java.util.Collection;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.event.LoggerListener;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.ldap.authentication.ad.ActiveDirectoryLdapAuthenticationProvider;
import org.springframework.security.web.access.channel.ChannelProcessingFilter;
import org.springframework.security.web.csrf.CsrfFilter;
import org.springframework.web.filter.CharacterEncodingFilter;

import com.mayocase.config.KaptchaAuth.KaptchaAuthenticationFilter;
import com.mayocase.handler.MyAuthenctiationSuccessHandler;




@Configuration
@EnableWebSecurity  
//@EnableGlobalMethodSecurity(securedEnabled = true)  
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

	private static final Logger logger = LoggerFactory.getLogger(WebSecurityConfig.class);
	
	@Autowired
	private Environment env;
	
	@Autowired
	MyLdapUserDetailsMapper myLdapUserDetailsMapper;
	
	@Autowired
	private MyAuthenctiationSuccessHandler myAuthenctiationSuccessHandler;
	
	//定义AD认证方法
	@Bean
    public ActiveDirectoryLdapAuthenticationProvider activeDirectoryLdapAuthenticationProvider() {
        
		final ActiveDirectoryLdapAuthenticationProvider provider = new ActiveDirectoryLdapAuthenticationProvider(env.getProperty("ldap.domanin"), env.getProperty("ldap.url"));
        provider.setConvertSubErrorCodesToExceptions(true);
        provider.setUseAuthenticationRequestCredentials(true);
        //provider.setAuthoritiesMapper(myAuthoritiesMapper()); //see http://comdynamics.net/blog/544/spring-security-3-integration-with-active-directory-ldap/
        provider.setUseAuthenticationRequestCredentials(true);
        
        //设置角色权限
        provider.setUserDetailsContextMapper(myLdapUserDetailsMapper);
        return provider;
    }

	//引入登录监听类(成功/失败)，也可以重写这个类。
    @Bean
    public LoggerListener loggerListener() {
        return new LoggerListener();
    }

    
    //配置地址访问规则
    @Override
    protected void configure(HttpSecurity http) throws Exception {
    	http.authorizeRequests()
    	.antMatchers("/**").permitAll().anyRequest().fullyAuthenticated()
        .and().formLogin()
        //.loginPage("/login").defaultSuccessUrl("/").failureUrl("/login").successHandler(myAuthenctiationSuccessHandler)
        ;
    	
    	
    	//解决中文乱码问题
    	CharacterEncodingFilter filter = new CharacterEncodingFilter();
    	filter.setEncoding("UTF-8");
    	filter.setForceEncoding(true);
    	http.addFilterBefore(filter,CsrfFilter.class);
    	
    	//在认证用户名之前认证验证码，如果验证码错误，将不执行用户名和密码的认证
    	//ChannelProcessingFilter通常是用来过滤哪些请求必须用https协议, 哪些请求必须用http协议, 哪些请求随便用哪个协议都行.
    	http.addFilterBefore(new KaptchaAuthenticationFilter("/login", "/login"), ChannelProcessingFilter.class);
    } 

    /*
    
    //配置单个AuthenticationProvider（ActiveDirectoryLdapAuthenticationProvider）
    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
    	//AuthenticationProvider是做验证工作的组件
        auth.authenticationProvider(activeDirectoryLdapAuthenticationProvider());
    }*/
    
    
    //配置多种认证方式，即多个AuthenticationProvider（用ProviderManager的Arrays.asList添加多个认证方法）
    @Override
    protected AuthenticationManager authenticationManager() throws Exception {
        ProviderManager authenticationManager = new ProviderManager(Arrays.asList(activeDirectoryLdapAuthenticationProvider()));
       //不擦除认证密码，擦除会导致TokenBasedRememberMeServices因为找不到Credentials再调用UserDetailsService而抛出UsernameNotFoundException
        authenticationManager.setEraseCredentialsAfterAuthentication(false);
        return authenticationManager;
    }
    
    
}

