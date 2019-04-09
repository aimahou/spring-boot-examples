package com.mayocase.activiti;

import java.text.SimpleDateFormat;

import org.junit.Test;
import org.springframework.security.core.userdetails.User;

import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.mayocase.domain.Person;
import com.mayocase.domain.SysUser;

public class TestObjectMapper {

	@Test
	public void test2() throws JsonProcessingException{
		
			ObjectMapper objectMapper = new ObjectMapper();
			//序列化的时候序列对象的所有属性
			objectMapper.setSerializationInclusion(Include.ALWAYS);
			//取消时间的转化格式,默认是时间戳,可以取消,同时需要设置要表现的时间格式
			objectMapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
			objectMapper.setDateFormat(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"));

			Person person = new Person();

			person.setDescription("地址");
			person.setCn("name");
			person.setMail("304843734@qq.com");
			//这是最简单的一个例子,把一个对象转换为json字符串
			String personJson = objectMapper.writeValueAsString(person);
			System.out.println(personJson);
			
			//默认为true,会显示时间戳
			objectMapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, true);
			personJson = objectMapper.writeValueAsString(person);
			System.out.println(personJson);
		
	}
}
