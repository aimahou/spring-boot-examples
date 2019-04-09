package com.mayocase.domain;

import java.security.Timestamp;
import java.util.List;

import javax.naming.Name;

import org.springframework.ldap.odm.annotations.Attribute;
import org.springframework.ldap.odm.annotations.Attribute.Type;
import org.springframework.ldap.odm.annotations.Entry;
import org.springframework.ldap.odm.annotations.Id;


/* Entry标记，一定要有objectClasses属性，objectClasses属性要跟AD里的一致，可以少几项，但不能多一项。
 * LdapQuery里配置时，不需要再使用.where("objectclass").is("person")指定objectClass
 * base属性查询的时候用不到，只有在新建和更新时，ODM会根据此属性进行匹配
*/
@Entry(objectClasses = {"organizationalPerson", "person" }, base="ou=maksad")
public final  class Person {
		
	
	/** 
	 *  每个entry必须指定@Id字段，类型为javax.naming.Name，其实就是DN。
     * 	但是若在LdapContextSource中指定了base，则DN将会按照base截取相对路径。
     * 	比如，DN为cn=user,ou=users,dc=test,dc=com，base为dc=test,dc=com，则取出的user对象DN为cn=user,ou=users。
     */
    @Id
    private Name dn;
    
    /**
     * 必填属性，帐户名
     */
    private String cn;

    /**
     * 必填属性,姓
     */
    private String sn;
    
    
    private String uid;


    private String whenCreated;
    
    /**
     * 类型   //如果字段跟AD里的字段不同，就要用@Attribute来找到对应的AD字段
     */
    @Attribute(name = "objectClass")
    private List<String> objectclass;
        
    /**
     * 电话号码
     */
    @Attribute
    private String telephoneNumber;
    
    /**
     * 跟CN一样
     */
    private String sAMAccountName; 

    
    /**
     * 全称
     */
    private String name;
    
    /**
     * 邮箱
     */
    private String mail;
    
    /**
     * 名字
     */
    private String givenName; 
    
    /**
     * 描述
     */
    private String description;
    
    /**
     * 显示名称 
     */
    private String displayName; 
    
    /**
     * 
     */
    private String distinguishedName;
    
    /**
     * 
     */
    private String userAccountControl;
    
    /**
     * 
     */
    private String userPrincipalName;
    
    
    /**
     * 隶属于
     */
    private List<String> memberOf;
    
    

    /**
     * 可选属性
     */
    /*@Attribute(name = "userPassword")
    private String userPassword; */
    
    
    @Attribute(name="userPassword", type=Type.BINARY)
    private byte[] userPassword;

	public String getDistinguishedName() {
		return distinguishedName;
	}

	public void setDistinguishedName(String distinguishedName) {
		this.distinguishedName = distinguishedName;
	}

	public String getUserPrincipalName() {
		return userPrincipalName;
	}

	public void setUserPrincipalName(String userPrincipalName) {
		this.userPrincipalName = userPrincipalName;
	}

	public String getUserAccountControl() {
		return userAccountControl;
	}

	public void setUserAccountControl(String userAccountControl) {
		this.userAccountControl = userAccountControl;
	}

	public List<String> getObjectclass() {
		return objectclass;
	}

	public void setObjectclass(List<String> objectclass) {
		this.objectclass = objectclass;
	}


	public String getTelephoneNumber() {
		return telephoneNumber;
	}

	public void setTelephoneNumber(String telephoneNumber) {
		this.telephoneNumber = telephoneNumber;
	}


	public Name getDn() {
		return dn;
	}

	public void setDn(Name dn) {
		this.dn = dn;
	}

	public String getSn() {
		return sn;
	}

	public void setSn(String sn) {
		this.sn = sn;
	}

	public String getCn() {
		return cn;
	}

	public void setCn(String cn) {
		this.cn = cn;
	}

	public String getsAMAccountName() {
		return sAMAccountName;
	}

	public void setsAMAccountName(String sAMAccountName) {
		this.sAMAccountName = sAMAccountName;
	}


	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getMail() {
		return mail;
	}

	public void setMail(String mail) {
		this.mail = mail;
	}

	public String getGivenName() {
		return givenName;
	}

	public void setGivenName(String givenName) {
		this.givenName = givenName;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getDisplayName() {
		return displayName;
	}

	public void setDisplayName(String displayName) {
		this.displayName = displayName;
	}

	public List<String> getMemberOf() {
		return memberOf;
	}

	public void setMemberOf(List<String> memberOf) {
		this.memberOf = memberOf;
	}

	public String getWhenCreated() {
		return whenCreated;
	}

	public void setWhenCreated(String whenCreated) {
		this.whenCreated = whenCreated;
	}
	
	
	

	public String getUid() {
		return uid;
	}

	public void setUid(String uid) {
		this.uid = uid;
	}

	

	public byte[] getUserPassword() {
		return userPassword;
	}

	public void setUserPassword(byte[] userPassword) {
		this.userPassword = userPassword;
	}

	@Override
	public String toString() {
		return "Person [dn=" + dn + ", cn=" + cn + ", sn=" + sn + ", whenCreated=" + whenCreated
				+ ", objectclass=" + objectclass + ", telephoneNumber="
				+ telephoneNumber + ", sAMAccountName=" + sAMAccountName + ", name=" + name + ", mail=" + mail
				+ ", givenName=" + givenName + ", description=" + description + ", displayName=" + displayName
				+ ", distinguishedName=" + distinguishedName + ", userAccountControl=" + userAccountControl
				+ ", userPrincipalName=" + userPrincipalName + ", memberOf=" + memberOf + "]";
	}

	
	
	


    

}