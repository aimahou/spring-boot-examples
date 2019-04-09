package com.mayocase.config.ldap;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@ConfigurationProperties(prefix = "ldap")
@Component
public class LdapConfig {
	public String ldapurl;
	
	public String ldapadmin;
	
	public String ldappassword;
	
	public String ldapbase;
	
	public String ldapadtype;
	
	public String ldapsearchBase;
	
	public String ldapdomain;

	public String getLdapurl() {
		return ldapurl;
	}

	public void setLdapurl(String ldapurl) {
		this.ldapurl = ldapurl;
	}

	public String getLdapadmin() {
		return ldapadmin;
	}

	public void setLdapadmin(String ldapadmin) {
		this.ldapadmin = ldapadmin;
	}

	public String getLdappassword() {
		return ldappassword;
	}

	public void setLdappassword(String ldappassword) {
		this.ldappassword = ldappassword;
	}

	public String getLdapbase() {
		return ldapbase;
	}

	public void setLdapbase(String ldapbase) {
		this.ldapbase = ldapbase;
	}

	public String getLdapadtype() {
		return ldapadtype;
	}

	public void setLdapadtype(String ldapadtype) {
		this.ldapadtype = ldapadtype;
	}

	public String getLdapsearchBase() {
		return ldapsearchBase;
	}

	public void setLdapsearchBase(String ldapsearchBase) {
		this.ldapsearchBase = ldapsearchBase;
	}

	public String getLdapdomain() {
		return ldapdomain;
	}

	public void setLdapdomain(String ldapdomain) {
		this.ldapdomain = ldapdomain;
	}

	

}
