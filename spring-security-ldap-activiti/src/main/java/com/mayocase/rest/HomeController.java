package com.mayocase.rest;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;

import com.mayocase.domain.Msg;

/**
 * Created by yangyibo on 17/1/18.
 */
@Controller
@RequestMapping("/")
public class HomeController {

    @RequestMapping("/")
    public String index(ModelMap model){
        Msg msg =  new Msg("测试标题","测试内容","欢迎来到HOME页面,您拥有 ROLE_HOME 权限");
        model.addAttribute("msg", msg);
        return "home";
    }
    
    
    @RequestMapping("/login")
    public  String login(){
        return "login";
    }

    @RequestMapping("/logout")
    public  String logout(){
        return "logout";
    }
    
}
