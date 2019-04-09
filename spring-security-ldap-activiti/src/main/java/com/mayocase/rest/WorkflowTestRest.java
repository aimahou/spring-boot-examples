package com.mayocase.rest;

import java.util.List;

import org.activiti.engine.repository.Deployment;
import org.activiti.engine.repository.ProcessDefinition;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mayocase.service.LeaveService;

@RestController
@RequestMapping("/admin")
public class WorkflowTestRest {

	private static final Logger LOGGER = LoggerFactory.getLogger(WorkflowTestRest.class);
	
	@Autowired
	private LeaveService iWorkflowService;
	
	private Deployment deployment;
	
	@RequestMapping("/w1")
    public String test1() {
		deployment = iWorkflowService.deploymentProcessDefinition_classpath(null, null, null);
		
    	return "部署流程定义ID:"+deployment.getId();
    }
	
	@RequestMapping("/w2")
    public String test2() {
		
		List<ProcessDefinition> list =iWorkflowService.findAllProcessDefinition();
		
    	return "有"+String.valueOf(list.size()+ "个流程定义");
    }
}
