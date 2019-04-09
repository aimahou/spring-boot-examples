package com.mayocase.rest.from;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

import org.hibernate.validator.constraints.Length;
import org.springframework.format.annotation.DateTimeFormat;

public class UserForm {

	
	private Integer id;
	
	@Pattern(regexp = "^[a-zA-Z0-9_]{4,32}$", message = "用户名必须以字母下划线开头，可由字母数字下划线组成")
	private String username;
	
	@NotNull(message = "昵称不能为空")
	private String nickname;
	
	
	private int sex;
	
	@Email(message = "邮箱地址不对")
	private String email;
	
	@Length(min = 4, message = "密码最少要4位")
	private String password;
	
	@Length(min = 4, message = "密码最少要4位")
	private String newPassword;

	@Length(min = 4, message = "密码最少要4位")
	private String newPasswordConfirm;

	@Pattern(regexp = "(^$|[0-9]{11})", message = "电话号码错误")
	private String tel;//电话
	
	//private String icon;//头像
	
	private String address;
	
	private String sysroleid;
	
	@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date birthday;
	
	/**文件 */
    //private MultipartFile file;
	
	public String getTel() {
		return tel;
	}

	public void setTel(String tel) {
		this.tel = tel;
	}
	
	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}


	public int getSex() {
		return sex;
	}

	public void setSex(int sex) {
		this.sex = sex;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getNickname() {
		return nickname;
	}

	public void setNickname(String nickname) {
		this.nickname = nickname;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getNewPassword() {
		return newPassword;
	}

	public void setNewPassword(String newPassword) {
		this.newPassword = newPassword;
	}

	public String getNewPasswordConfirm() {
		return newPasswordConfirm;
	}

	public void setNewPasswordConfirm(String newPasswordConfirm) {
		this.newPasswordConfirm = newPasswordConfirm;
	}

	public String getSysroleid() {
		return sysroleid;
	}

	public void setSysroleid(String sysroleid) {
		this.sysroleid = sysroleid;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}
}
