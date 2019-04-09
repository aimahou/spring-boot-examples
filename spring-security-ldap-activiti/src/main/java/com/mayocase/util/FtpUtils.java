/*package com.mayocase.util;


import org.apache.commons.net.ftp.FTPClient;
import org.apache.commons.net.ftp.FTPReply;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;

*//**
 * Created by laiwr on 2018/5/18.
 *//*
//@Component
public class FtpUtils {

	private static Logger logger = LoggerFactory.getLogger(FtpUtils.class);

    @Autowired
    private FtpConfig ftpConfig;

    public FTPClient ftpClient = null;

    *//**
     * 初始化链接文件
     *//*
    public void initFtpClient() {
        ftpClient = new FTPClient();
        ftpClient.setRemoteVerificationEnabled(false);									//取消服务器获取自身Ip地址和提交的host进行匹配，否则当不一致时会报异常。
        ftpClient.setControlEncoding("utf-8");											//在连接之前设置编码类型为utf-8
        try {
        	ftpClient.setDataTimeout(1000*120);											//设置传输超时时间为120秒
        	ftpClient.connect(ftpConfig.getHostname(), ftpConfig.getPort()); 			//连接ftp服务器
            ftpClient.login(ftpConfig.getUsername(), ftpConfig.getPassword()); 			//登录ftp服务器
            int replyCode = ftpClient.getReplyCode(); 									//是否成功登录服务器
            
            if(!FTPReply.isPositiveCompletion(replyCode)){
            	logger.warn("【initFtpClient】: 登录服务器失败");
            }            
            logger.warn("【initFtpClient】: 使用帐户："+ftpConfig.getUsername()+"密码："+ftpConfig.getPassword()+"登录ftp服务器："+ftpConfig.getHostname()+":"+ftpConfig.getPort());
            logger.warn("【initFtpClient】: 成功登录服务器,被动模式主机："+ftpClient.getPassiveHost()+":"+ftpClient.getPassivePort());
            logger.warn("【initFtpClient】: 成功登录服务器,主动模式主机："+ftpClient.getRemoteAddress()+":"+ftpClient.getRemotePort());
            logger.warn("【initFtpClient】: 成功登录服务器,本地主机："+ftpClient.getLocalAddress()+":"+ftpClient.getLocalPort());
            logger.warn("【initFtpClient】: 成功登录服务器,返回代码："+ftpClient.getReplyCode()+",显示状态"+ftpClient.getStatus());        	

        }catch (MalformedURLException e) {
            e.printStackTrace();
        }catch (IOException e) {
            e.printStackTrace();
        }
    }


    *//**
     * 上传文件
     * @param pathname ftp服务保存地址
     * @param fileName 上传到ftp的文件名
     * @param inputStream 输入文件流
     * @return
     *//*
    public boolean uploadFile( String pathname, String fileName,InputStream inputStream){
        boolean flag = false;
        try{
        	logger.warn("【uploadFile】: " + "开始上传文件");
            initFtpClient();
            ftpClient.setFileType(ftpClient.BINARY_FILE_TYPE);	//设置传输的模式为二进制文件类型传输
            ftpClient.makeDirectory(pathname);						//设置目录
            ftpClient.changeWorkingDirectory(pathname);				//设置工作路径
            
            ftpClient.enterLocalPassiveMode();						//设置被动模式(FTP客户端在docker容器内，需用被动模式)
            ftpClient.storeFile(fileName, inputStream);				//上传
            
            logger.warn("【uploadFile】: " + "上传文件成功");
            flag = true;            
            return flag;
        }catch (Exception e) {
        	logger.warn("【uploadFile】: " + "上传文件失败");
            e.printStackTrace();
            return flag;
        }finally{
        	if(null != inputStream){
        		try {
        			inputStream.close();							//关闭文件流
                    logger.info("关闭流------------------------------");
        		} catch (IOException e) {
        			e.printStackTrace();
        		}
        	}
            if(ftpClient.isConnected()){
                try{
                    ftpClient.logout();								//退出FTP
                    logger.info("退出FTP------------------------------");
                    ftpClient.disconnect();							//断开连接
                    logger.info("断开连接------------------------------");
                    logger.info("连接是否正常------------------------------", ftpClient.isConnected());
                }catch(IOException e){
                    e.printStackTrace();
                }
            }
        }
    }



}

*/