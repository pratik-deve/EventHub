package com.eventHubBackend.Spring.Backend.EventHub.controller;



import com.eventHubBackend.Spring.Backend.EventHub.reqresdto.LoginRequest;
import com.eventHubBackend.Spring.Backend.EventHub.jwt.JwtService;
import com.eventHubBackend.Spring.Backend.EventHub.model.User;
import com.eventHubBackend.Spring.Backend.EventHub.principles.UserPrinciple;
import com.eventHubBackend.Spring.Backend.EventHub.service.EventUserDetailsService;
import com.eventHubBackend.Spring.Backend.EventHub.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {


    @Autowired
    UserService service;

    @Autowired
     JwtService jwtService;

    @Autowired
    private AuthenticationManager authManager;

    @Autowired
    EventUserDetailsService userDetailsService;


    @PostMapping("/signup")
    public User signUp(@RequestBody User user){
        service.saveUser(user);
        return user;
    }

    @PostMapping("/signin")
    public ResponseEntity<Map<String, Object>> signIn(@RequestBody LoginRequest loginRequest) {

        Authentication authentication = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getLogin(),
                        loginRequest.getPassword()
                )
        );

        Map<String, Object> response = new HashMap<>();

        if (authentication.isAuthenticated()) {
            // Get the authenticated principal
            UserPrinciple userDetails = (UserPrinciple) authentication.getPrincipal();

            // Generate token with username (or email if you prefer)
            response.put("authToken", jwtService.generateToken(userDetails.getUsername()));
            response.put("Msg", "Logged In Successfully!!");
        } else {
            response.put("Msg", "Login Failed !!");
        }

        return new ResponseEntity<>(response, HttpStatus.ACCEPTED);
    }

    @GetMapping("/getUsers")
    public ResponseEntity<Map<String, Object>> getUsers(){
        List<User> users = service.getUsers();
        Map<String, Object> mp = new HashMap<>();
        mp.put("Users", users);
        return new ResponseEntity<>(mp, HttpStatus.ACCEPTED);
    }
}
