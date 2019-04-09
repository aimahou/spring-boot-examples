package com.mayocase.service;

import java.io.File;
import java.io.InputStream;
import java.util.List;
import java.util.Map;

import org.activiti.engine.repository.Deployment;
import org.activiti.engine.repository.ProcessDefinition;
import org.activiti.engine.task.Comment;
import org.activiti.engine.task.Task;


/**
 * @author zhuyr
 *	请假流程服务
 */
public interface LeaveService {

	/**部署流程定义*/
	public Deployment deploymentProcessDefinition_classpath(String ProcessName,String bpmnPath,String pngPath);
	
	/**查询流程定义*/
	public ProcessDefinition findProcessDefinition(String deploymentId);
	
	/**查询所有流程定义*/
	public List<ProcessDefinition> findAllProcessDefinition();
	
	void saveNewDeploye(File file, String filename);

	List<Deployment> findDeploymentList();

	/*List<ProcessDefinition> findProcessDefinitionList();

	InputStream findImageInputStream(String deploymentId, String imageName);

	void deleteProcessDefinitionByDeploymentId(String deploymentId);

	void saveStartProcess(WorkflowBean workflowBean);

	List<Task> findTaskListByName(String name);

	String findTaskFormKeyByTaskId(String taskId);

	LeaveBill findLeaveBillByTaskId(String taskId);

	List<String> findOutComeListByTaskId(String taskId);

	void saveSubmitTask(WorkflowBean workflowBean);

	List<Comment> findCommentByTaskId(String taskId);

	List<Comment> findCommentByLeaveBillId(Long id);

	ProcessDefinition findProcessDefinitionByTaskId(String taskId);

	Map<String, Object> findCoordingByTask(String taskId);
	*/
}
