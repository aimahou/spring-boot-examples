package com.mayocase.domain;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import org.hibernate.validator.constraints.Length;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

@Entity
@Table(name = "sys_user")
public class SysUser implements UserDetails{

	/**
	 * 
	 */
	private static final long serialVersionUID = 8408371868718508274L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id", nullable = false, updatable = false)
	private Integer id;

	@Column(name = "username", nullable = false, unique = true)
	private String username;
	
	@Column(name = "nickname", nullable = false, unique = true)
	private String nickname;

	@Column(name = "sex", nullable = true)
	private int sex;
	
	@Column(name = "email", nullable = false, unique = true)
	private String email;

	@Column(name = "password", nullable = true)
	@Length(min = 4, message = "*Your password must have at least 5 characters")
	private String password;

	private String tel;//电话
	
	//private String icon;//头像
	
	private String address;
	
	
	@OneToOne(fetch=FetchType.EAGER)
    @JoinColumn(name = "sysrole_id",referencedColumnName = "id",nullable=false)
	private SysRole sysrole;
	
	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public void setUsername(String username) {
		this.username = username;
	}
	
	public String getNickname() {
		return nickname;
	}

	public String getTel() {
		return tel;
	}

	public void setTel(String tel) {
		this.tel = tel;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public void setNickname(String nickname) {
		this.nickname = nickname;
	}
	

	public int getSex() {
		return sex;
	}

	public void setSex(int sex) {
		this.sex = sex;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	@Override
	public String getUsername() {
		return username;
	}

	@Override
	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}


	

	public SysRole getSysrole() {
		return sysrole;
	}

	public void setSysrole(SysRole sysrole) {
		this.sysrole = sysrole;
	}

	// 显示
	@Override
	public String toString() {
		return "User{" + "id=" + id + ", username= " + username + ",nickname= \" + nickname + \", email='" + email.replaceFirst("@.*", "@***")
				+ ", password='" + password.substring(0, 10) + ", sysrole=" + sysrole + '}';
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
				
				Collection<GrantedAuthority> authorities = new ArrayList<>();
				SysRole role = this.getSysrole();
				
				SimpleGrantedAuthority authority = new SimpleGrantedAuthority(role.getName());
				authorities.add(authority);
				return authorities;
	}

	@Override
	public boolean isAccountNonExpired() {
		// TODO Auto-generated method stub
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
		// TODO Auto-generated method stub
		return true;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		// TODO Auto-generated method stub
		return true;
	}

	@Override
	public boolean isEnabled() {
		// TODO Auto-generated method stub
		return true;
	}

	
	
}
