package com.eventHubBackend.Spring.Backend.EventHub.controller;



import com.eventHubBackend.Spring.Backend.EventHub.jwt.JwtService;
import com.eventHubBackend.Spring.Backend.EventHub.model.User;
import com.eventHubBackend.Spring.Backend.EventHub.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class UserController {


    @Autowired
    UserService service;

    @Autowired
     JwtService jwtService;

    @Autowired
    private AuthenticationManager authManager;



    @PostMapping("/signup")
    public User signUp(@RequestBody User user){
        service.saveUser(user);
        return user;
    }

    @PostMapping("/signin")
    public ResponseEntity<Map<String, Object>> signIn(@RequestBody User user){


        Authentication authentication = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        user.getUsername(),
                        user.getPassword()
                )
        );
        Map<String, Object> mp = new HashMap<>();

        String msg = null;

        if(authentication.isAuthenticated()) {
            msg = "Logged In Successfully!!";
            mp.put("authToken", jwtService.generateToken(user.getUsername()) );
        }
        else msg =  "Login Failed !!";

        mp.put("Msg", msg);
        return new ResponseEntity<>(mp, HttpStatus.ACCEPTED);
    };
}
