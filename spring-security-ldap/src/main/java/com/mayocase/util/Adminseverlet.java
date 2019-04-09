/*
package com.mayocase.util;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.mayocase.domain.SysUser;

public class Adminseverlet extends HttpServlet
{
    @Override
    public void init() throws ServletException
    {
        System.out.println("我初始化了");
    }

    @Override
    protected void service(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException
    {
        // AdminJavaBean 为存放账户信息的pojo，即对应数据库字段的javabean。

        SysUser adminJavaBean = new SysUser();

        // 判断map中是否存在该邮箱（账户）

        if (MySessionListner.sessionMap.get(adminJavaBean.getEmail()) != null)
        {

            String info = "账户已在其他地方登录";
            request.setAttribute("info", info);
            request.getRequestDispatcher("Login.jsp").forward(request, response);
        } else
        {
            HttpSession session = request.getSession();
            MySessionListner.sessionMap.put(adminJavaBean.getEmail(), session);

        }
    }
}*/
