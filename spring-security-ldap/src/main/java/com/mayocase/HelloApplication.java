package com.mayocase;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.ServletComponentScan;
import org.springframework.context.annotation.ImportResource;
import org.springframework.transaction.annotation.EnableTransactionManagement;
//import org.springframework.test.context.ContextConfiguration;

//@EnableTransactionManagement
/**
 * @author zhuyr
 *
 */
@ServletComponentScan
@SpringBootApplication
@ImportResource(value = "classpath:spring-security-context.xml")
//@ContextConfiguration(locations={"classpath:spring-security-context.xml",""})
public class HelloApplication {

	public static void main(String[] args) {
		SpringApplication.run(HelloApplication.class, args);
	}
}
