package com.mayocase.domain;

public enum SexEnum {
    MAN(0),
    WOMAN(1);

    private Integer code;

    SexEnum(Integer code){
        this.code = code;
    }

    public Integer getCode() {
        return code;
    }

    public void setCode(Integer code) {
        this.code = code;
    }
}
