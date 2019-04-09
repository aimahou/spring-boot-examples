package com.mayocase.repository;

import java.util.List;
import com.mayocase.domain.OrganizationalUnit;

public interface OrganizationalUnitRepo {
	
	
	
	List<OrganizationalUnit> findAll(String searchBaseDn);

}
