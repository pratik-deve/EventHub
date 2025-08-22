package com.eventHubBackend.Spring.Backend.EventHub.controller;

import com.eventHubBackend.Spring.Backend.EventHub.jwt.JwtService;
import com.eventHubBackend.Spring.Backend.EventHub.model.User;
import com.eventHubBackend.Spring.Backend.EventHub.principles.UserPrinciple;
import com.eventHubBackend.Spring.Backend.EventHub.reqresdto.EventResponse;
import com.eventHubBackend.Spring.Backend.EventHub.reqresdto.LoginRequest;
import com.eventHubBackend.Spring.Backend.EventHub.reqresdto.UserResponse;
import com.eventHubBackend.Spring.Backend.EventHub.service.EventService;
import com.eventHubBackend.Spring.Backend.EventHub.service.EventUserDetailsService;
import com.eventHubBackend.Spring.Backend.EventHub.service.ImageUploadService;
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
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    UserService userService;

    @Autowired
    EventService eventService;

    @Autowired
    JwtService jwtService;

    @Autowired
    private AuthenticationManager authManager;

    @Autowired
    EventUserDetailsService userDetailsService;

    @Autowired
    ImageUploadService imageUploadService;

    /**
     * Fetch Current Authenticated User
     **/
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal UserPrinciple userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }

        UserResponse userResponse = userService.getUserResponse(userDetails.getUsername());
        return ResponseEntity.ok(userResponse);
    }

    /**
     * User Registration
     **/
    @PostMapping("/signup")
    public User signUp(@RequestBody User user) {
        userService.saveUser(user);
        return user;
    }

    /**
     * User Login
     **/
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
            UserPrinciple userDetails = (UserPrinciple) authentication.getPrincipal();
            UserResponse userResponse = userService.getUserResponse(userDetails.getUsername());
            response.put("user", userResponse);
            response.put("authToken", jwtService.generateToken(userDetails.getUsername()));
            response.put("Msg", "Logged In Successfully!!");
        } else {
            response.put("Msg", "Login Failed !!");
        }

        return new ResponseEntity<>(response, HttpStatus.ACCEPTED);
    }


    /**
     * OAuth2 Success Handler
     **/
    @GetMapping("/oauth2/success")
    public ResponseEntity<Map<String, Object>> oauth2Success(
            Authentication authentication,
            HttpServletRequest request) {
        Map<String, Object> response = new HashMap<>();

        if (authentication != null && authentication.isAuthenticated()) {
            Object principal = authentication.getPrincipal();

            if (principal instanceof OAuth2User oauthUser) {
                String email = oauthUser.getAttribute("email");
                String name = oauthUser.getAttribute("name");

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

    /**
     * Fetch All Users
     **/
    @GetMapping("/getUsers")
    public ResponseEntity<Map<String, Object>> getUsers() {
        List<User> users = userService.getUsers();
        Map<String, Object> mp = new HashMap<>();
        mp.put("Users", users);
        return new ResponseEntity<>(mp, HttpStatus.ACCEPTED);
    }

    /**
     * Like an Event
     **/
    @PostMapping("/liked/{id}")
    public ResponseEntity<Map<String, Object>> likedEvent(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrinciple userDetails) {
        userService.addEvent(userDetails.getUsername(), id);
        Map<String, Object> mp = new HashMap<>();
        mp.put("Event", eventService.getEventById(id));
        return new ResponseEntity<>(mp, HttpStatus.ACCEPTED);
    }

    /**
     * Unlike an Event
     **/
    @DeleteMapping("/unliked/{id}")
    public ResponseEntity<Map<String, Object>> unlikedEvent(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrinciple userDetails) {
        userService.removeEvent(userDetails.getUsername(), id);
        Map<String, Object> mp = new HashMap<>();
        mp.put("Event", eventService.getEventById(id));
        return new ResponseEntity<>(mp, HttpStatus.ACCEPTED);
    }

    /**
     * Fetch All Liked Events
     **/
    @GetMapping("/liked")
    public ResponseEntity<Map<String, Object>> getLikedEvents(
            @AuthenticationPrincipal UserPrinciple userDetails) {
        List<EventResponse> likedEvents = userService.getLikedEvents(userDetails.getUsername());
        Map<String, Object> response = new HashMap<>();
        response.put("likedEvents", likedEvents);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/profile-pic/upload")
    public ResponseEntity<Map<String, String>> uploadUserImage(@RequestParam("file") MultipartFile file,
                                                  @AuthenticationPrincipal UserPrinciple userDetails) {
            Map<String, String> mp = new HashMap<>();
        try {
            String url = imageUploadService.uploadImage(file);
            userService.addProfileUrl(userDetails.getUsername(), url);
            mp.put("imgUrl", url);
            return new ResponseEntity<>(mp, HttpStatus.OK);
        } catch (Exception e) {
            mp.put("msg","Upload failed: " + e.getMessage() );
            return new ResponseEntity<>(mp, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/profile-pic")
    public ResponseEntity<Map<String, String>> getUserImage(@AuthenticationPrincipal UserPrinciple userDetails) {
        Map<String, String> mp = new HashMap<>();

        String imgUrl = userService.getUserImage(userDetails.getUsername());
        mp.put("imgUrl", imgUrl);

        return new ResponseEntity<>(mp, HttpStatus.OK);
    }




}
