package com.mayocase.java8;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.util.AntPathMatcher;

@RunWith(SpringRunner.class)
@SpringBootTest
public class PathMatcherTest {

	@Autowired
	private AntPathMatcher antPathMatcher = new AntPathMatcher();
	
	@Test
	public void test() {
		
		System.out.println(antPathMatcher.match( "/admin/test","/admin/**"));
		
	}
}
