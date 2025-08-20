package com.eventHubBackend.Spring.Backend.EventHub.controller;



import com.eventHubBackend.Spring.Backend.EventHub.reqresdto.LoginRequest;
import com.eventHubBackend.Spring.Backend.EventHub.jwt.JwtService;
import com.eventHubBackend.Spring.Backend.EventHub.model.User;
import com.eventHubBackend.Spring.Backend.EventHub.principles.UserPrinciple;
import com.eventHubBackend.Spring.Backend.EventHub.service.EventUserDetailsService;
import com.eventHubBackend.Spring.Backend.EventHub.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
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
            response.put("username", userDetails.getUsername());
            response.put("email", userDetails.getEmail());
            response.put("role", userDetails.getAuthorities());
            response.put("authToken", jwtService.generateToken(userDetails.getUsername()));
            response.put("Msg", "Logged In Successfully!!");
        } else {
            response.put("Msg", "Login Failed !!");
        }

        return new ResponseEntity<>(response, HttpStatus.ACCEPTED);
    }

    @GetMapping("/oauth2/success")
    public ResponseEntity<Map<String, Object>> oauth2Success(Authentication authentication,
                                                             HttpServletRequest request) {
        Map<String, Object> response = new HashMap<>();

        if (authentication != null && authentication.isAuthenticated()) {
            Object principal = authentication.getPrincipal();

            if (principal instanceof OAuth2User oauthUser) {
                String email = oauthUser.getAttribute("email");
                String name = oauthUser.getAttribute("name");

                // Either regenerate token or fetch from session
                String token = (String) request.getSession().getAttribute("OAUTH2_TOKEN");
                if (token == null) {
                    token = jwtService.generateToken(email);
                }

                response.put("username", name);
                response.put("email", email);
                response.put("role", authentication.getAuthorities());
                response.put("authToken", token);
                response.put("Msg", "OAuth2 Login Successful!!");
            } else {
                response.put("Msg", "OAuth2 Login Failed!!");
            }
        } else {
            response.put("Msg", "Authentication Failed!!");
        }

        return new ResponseEntity<>(response, HttpStatus.OK);
    }



    @GetMapping("/getUsers")
    public ResponseEntity<Map<String, Object>> getUsers(){
        List<User> users = service.getUsers();
        Map<String, Object> mp = new HashMap<>();
        mp.put("Users", users);
        return new ResponseEntity<>(mp, HttpStatus.ACCEPTED);
    }
}
