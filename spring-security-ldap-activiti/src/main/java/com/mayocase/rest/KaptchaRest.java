package com.mayocase.rest;

import java.awt.image.BufferedImage;
import java.util.concurrent.TimeUnit;

import javax.imageio.ImageIO;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import com.google.code.kaptcha.Producer;
import com.google.code.kaptcha.Constants;

@Controller
@RequestMapping("/kaptcha/*")
public class KaptchaRest {

	@Autowired
    private Producer captchaProducer;
	
	@RequestMapping
	public ModelAndView getKaptchaImage(HttpServletRequest request, HttpServletResponse response) throws Exception {
		HttpSession session = request.getSession();
		/*String code = (String)session.getAttribute(Constants.KAPTCHA_SESSION_KEY);
		System.out.println("******************验证码是: " + code + "******************");*/
		
		/*response.setDateHeader("Expires", 0);
		
		// Set standard HTTP/1.1 no-cache headers.
		response.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
		
		// Set IE extended HTTP/1.1 no-cache headers (use addHeader).
		response.addHeader("Cache-Control", "post-check=0, pre-check=0");
		
		// Set standard HTTP/1.0 no-cache header.
		response.setHeader("Pragma", "no-cache");
		
		// return a jpeg
		response.setContentType("image/jpeg");
		*/
		// 创建图片中的验证码
		String key = Constants.KAPTCHA_SESSION_KEY ; 
		String capText = captchaProducer.createText();
		System.out.println("键值："+key+"，图片中的验证码是: " + capText + "******************");
		
		// 保存到session中
		session.setAttribute(key, capText);

		//生成图片验证码
		BufferedImage bi = captchaProducer.createImage(capText);
		ServletOutputStream out = response.getOutputStream();
		
		// write the data out
		ImageIO.write(bi, "jpg", out);
		try {
			out.flush();
		} finally {
			out.close();
		}
		return null;
	}

	/*@RequestMapping(value = "/kaptchaImage")
	public ModelAndView getKaptchaImage(HttpServletRequest request,	HttpServletResponse response) throws Exception {
		response.setDateHeader("Expires", 0);
		response.setHeader("Cache-Control",
				"no-store, no-cache, must-revalidate");
		response.addHeader("Cache-Control", "post-check=0, pre-check=0");
		response.setHeader("Pragma", "no-cache");
		response.setContentType("image/jpeg");
 
		String capText = captchaProducer.createText();
		System.out.println("capText: " + capText);
 
		try {
			String uuid=UUID.getUUID32().trim().toString();			
			redisTemplate.opsForValue().set(uuid, capText,60*5,TimeUnit.SECONDS);
			Cookie cookie = new Cookie("captchaCode",uuid);
	        response.addCookie(cookie);
		} catch (Exception e) {
			e.printStackTrace();
		}
 
		
 
		BufferedImage bi = captchaProducer.createImage(capText);
		ServletOutputStream out = response.getOutputStream();
		ImageIO.write(bi, "jpg", out);
		try {
			out.flush();
		} finally {
			out.close();
		}
		return null;
	}*/
}
