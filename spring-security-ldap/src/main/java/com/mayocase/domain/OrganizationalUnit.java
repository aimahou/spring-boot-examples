package com.mayocase.domain;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;

import javax.naming.Name;

import org.springframework.ldap.odm.annotations.Attribute;
import org.springframework.ldap.odm.annotations.Entry;
import org.springframework.ldap.odm.annotations.Id;

/**
 * Automatically generated to represent the LDAP object classes
 * "organizationalunit", "top".
 */
@Entry(objectClasses = { "organizationalUnit", "top" })
public final class OrganizationalUnit {

    @Id
    private Name dn;

    @Attribute(name = "objectClass", syntax = "1.3.6.1.4.1.1466.115.121.1.38")
    private List<String> objectClass = new ArrayList<String>();

    @Attribute(name = "ou", syntax = "1.3.6.1.4.1.1466.115.121.1.15")
    private String ou;

    private String name;


    public OrganizationalUnit() {
    }

    public OrganizationalUnit(Name dn) {
        this.dn = dn;

        objectClass.add("top");
        objectClass.add("organizationalUnit");
       

        int size = dn.size();
        if (size > 1) {
            ou = dn.get(size - 1).split("=")[1];
        } else {
            ou = "";
        }

    }

    public Name getDn() {
        return dn;
    }

    public void setDn(Name dn) {
        this.dn = dn;
    }

    public List<String> getObjectClasses() {
        return Collections.unmodifiableList(objectClass);
    }

    public String getOu() {
        return ou;
    }
    
    public void setOu(String ou) {
    	this.ou = ou;
    }


    public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Override
    public String toString() {
        return String.format("objectClasses=%1$s | dn=%2$s | ou=%3$s | street=%4$s | description=%5$s", objectClass,
                dn, ou);
    }

}
