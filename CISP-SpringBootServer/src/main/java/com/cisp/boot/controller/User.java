package com.cisp.boot.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
public class User {
    @RequestMapping("/")
    public String GetUser(){
        return "用户1";
    }
}
