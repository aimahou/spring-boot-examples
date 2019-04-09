/*package com.mayocase.util;

import java.util.HashMap;
import java.util.concurrent.locks.ReadWriteLock;
import java.util.concurrent.locks.ReentrantReadWriteLock;

import javax.servlet.http.HttpSession;

public class SessionManagement {
	 
    private static SessionManagement sessionManagement;
    private HashMap<String, HttpSession> sessionHashMap;
    private ReadWriteLock readWriteLock = new ReentrantReadWriteLock(); //线程同步
 
    private SessionManagement() {
        sessionHashMap = new HashMap<>();
    }
 
    public static SessionManagement getInstance() {
        if (sessionManagement == null) {
            sessionManagement = new SessionManagement();
        }
        return sessionManagement;
    }
 
    //添加session
    public void addSession(String id, HttpSession httpSession) {
 
        readWriteLock.writeLock().lock();//线程锁锁定
        try {
 
            if (httpSession != null && id != null && id.length() > 0) {
                sessionHashMap.put(id, httpSession);
            }
 
        } finally {
            readWriteLock.writeLock().unlock();//线程锁解锁
        }
    }
 
    //删除session
    public void removeSession(String id) {
 
        readWriteLock.writeLock().lock();
        try {
 
            if (id != null && id.length() > 0) {
                sessionHashMap.remove(id);
            }
 
        } finally {
            readWriteLock.writeLock().unlock();
        }
    }
 
    //获取session
    public HttpSession getSession(String sessionId) {
 
        readWriteLock.readLock().lock();
        try {
            if (sessionId == null) {
                return null;
            }
 
            return sessionHashMap.get(sessionId);
 
        } finally {
            readWriteLock.readLock().unlock();
        }
 
    }
 
    //获取session集合
    public HashMap<String, HttpSession> getSessionHashMap() {
        return sessionHashMap;
    }
 
    //设置session集合
    public void setSessionHashMap(HashMap<String, HttpSession> sessionHashMap) {
        this.sessionHashMap = sessionHashMap;
    }
}
*/