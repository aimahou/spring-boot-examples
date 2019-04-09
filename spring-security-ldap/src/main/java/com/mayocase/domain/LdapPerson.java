package com.mayocase.domain;

import org.springframework.ldap.odm.annotations.Attribute;
import org.springframework.ldap.odm.annotations.DnAttribute;
import org.springframework.ldap.odm.annotations.Entry;
import org.springframework.ldap.odm.annotations.Id;
import org.springframework.ldap.odm.annotations.Transient;
import org.springframework.ldap.support.LdapUtils;

import javax.naming.Name;

/**
 * @author Mattias Hellborg Arthursson
 */
@Entry(objectClasses = { "inetOrgPerson", "organizationalPerson", "person", "top" }, base = "ou=Departments")
public final class LdapPerson {
    @Id
    private Name id;

    @Attribute(name = "cn")
    @DnAttribute(value="cn", index=3)
    private String fullName;

    @Attribute(name = "employeeNumber")
    private String employeeNumber;

    @Attribute(name = "givenName")
    private String firstName;

    @Attribute(name = "sn")
    private String lastName;

    @Attribute(name = "title")
    private String title;

    @Attribute(name = "mail")
    private String email;

    @Attribute(name = "telephoneNumber")
    private String phone;

    @DnAttribute(value="ou", index=2)
    @Transient
    private String unit;

    @DnAttribute(value="ou", index=1)
    @Transient
    private String department;

    
    private String uid;			// user id
	private String cn;			// user name CN (Common Name) : KilDong Hong, SaRang Lee 와 같은 일반적인 이름들 
	private String firstNm;		// first name 성 (SN)
	private String lastNm;		// last name 이름 ()
	private String password;
	private String mail;
	private String ou;			// Organiztion Unit : 조직구분
	private String smarttype;
	private String smartpy;
	private String smartalias;
	private String departmentNumber;
	private String modifyTimestamp;
	private String positionName;
	
	
	public String getPositionName() {
		return positionName;
	}
	public void setPositionName(String positionName) {
		this.positionName = positionName;
	}
	public String getModifyTimestamp() {
		return modifyTimestamp;
	}
	public void setModifyTimestamp(String modifyTimestamp) {
		this.modifyTimestamp = modifyTimestamp;
	}
	public String getDepartmentNumber() {
		return departmentNumber;
	}
	public void setDepartmentNumber(String departmentNumber) {
		this.departmentNumber = departmentNumber;
	}
	public String getSmartpy() {
		return smartpy;
	}
	public void setSmartpy(String smartpy) {
		this.smartpy = smartpy;
	}
	public String getSmartalias() {
		return smartalias;
	}
	public void setSmartalias(String smartalias) {
		this.smartalias = smartalias;
	}
	public String getSmarttype() {
		return smarttype;
	}
	public void setSmarttype(String smarttype) {
		this.smarttype = smarttype;
	}
	public String getUid() {
		return uid;
	}
	public void setUid(String uid) {
		this.uid = uid;
	}
	public String getCn() {
		return cn;
	}
	public void setCn(String cn) {
		this.cn = cn;
	}
	public String getFirstNm() {
		return firstNm;
	}
	public void setFirstNm(String firstNm) {
		this.firstNm = firstNm;
	}
	public String getLastNm() {
		return lastNm;
	}
	public void setLastNm(String lastNm) {
		this.lastNm = lastNm;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getMail() {
		return mail;
	}
	public void setMail(String mail) {
		this.mail = mail;
	}
	public String getOu() {
		return ou;
	}
	public void setOu(String ou) {
		this.ou = ou;
}
    
    
    
    
    
    
    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public Name getId() {
        return id;
    }

    public void setId(Name id) {
        this.id = id;
    }

    public void setId(String id) {
        this.id = LdapUtils.newLdapName(id);
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getEmployeeNumber() {
        return employeeNumber;
    }

    public void setEmployeeNumber(String employeeNumber) {
        this.employeeNumber = employeeNumber;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        LdapPerson person = (LdapPerson) o;

        if (id != null ? !id.equals(person.id) : person.id != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        return id != null ? id.hashCode() : 0;
    }
}

