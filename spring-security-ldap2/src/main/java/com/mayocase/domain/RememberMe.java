package com.mayocase.domain;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

@Entity
@Table(name = "persistent_logins")
public class RememberMe {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id", nullable = false, updatable = false)
	private Integer id;
	
	@Column(name = "username", nullable = false)//这里的用户名不能是唯一的
	private String username;
	
	@Column(name = "series", nullable = false)
	private String series;
	
	@Column(name = "token", nullable = false)
	private String token;
	
	@Temporal(TemporalType.TIMESTAMP)
	@Column(name="last_used", updatable = false)
	private Date last_used;
}
