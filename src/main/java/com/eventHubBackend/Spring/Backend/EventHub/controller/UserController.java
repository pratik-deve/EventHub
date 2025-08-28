package com.eventHubBackend.Spring.Backend.EventHub.controller;

import com.eventHubBackend.Spring.Backend.EventHub.jwt.JwtService;
import com.eventHubBackend.Spring.Backend.EventHub.model.User;
import com.eventHubBackend.Spring.Backend.EventHub.principles.UserPrinciple;
import com.eventHubBackend.Spring.Backend.EventHub.reqresdto.EventResponse;
import com.eventHubBackend.Spring.Backend.EventHub.reqresdto.LoginRequest;
import com.eventHubBackend.Spring.Backend.EventHub.reqresdto.UserRequest;
import com.eventHubBackend.Spring.Backend.EventHub.reqresdto.UserResponse;
import com.eventHubBackend.Spring.Backend.EventHub.service.EventService;
import com.eventHubBackend.Spring.Backend.EventHub.service.EventUserDetailsService;
import com.eventHubBackend.Spring.Backend.EventHub.service.ImageUploadService;
import com.eventHubBackend.Spring.Backend.EventHub.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

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
    public ResponseEntity<Map<String, Object>> signIn(@RequestBody LoginRequest loginRequest, HttpServletResponse response) {
        Authentication authentication = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getLogin(),
                        loginRequest.getPassword()
                )
        );

        Map<String, Object> res = new HashMap<>();

        if (authentication.isAuthenticated()) {
            UserPrinciple userDetails = (UserPrinciple) authentication.getPrincipal();
            UserResponse userResponse = userService.getUserResponse(userDetails.getUsername());
            String jwtToken = jwtService.generateToken(userDetails.getUsername());

            // Set JWT in Secure HTTP-Only Cookie
            ResponseCookie cookie = ResponseCookie.from("authToken", jwtToken)
                    .httpOnly(true)
                    .secure(true)  // Use true in production (HTTPS)
                    .sameSite("Strict") // Or "Lax" for cross-site with OAuth
                    .path("/")
                    .maxAge(24 * 60 * 60) // 1 day expiry
                    .build();

            response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

            res.put("user", userResponse);
            res.put("Msg", "Logged In Successfully!!");
        } else {
            res.put("Msg", "Login Failed!!");
        }

        return ResponseEntity.ok(res);
    }



    /**
     * OAuth2 Success Handler
     **/

    @GetMapping("/oauth2/success")
    public ResponseEntity<Map<String, Object>> oauth2Success(Authentication authentication) {
        Map<String, Object> res = new HashMap<>();

        if (authentication != null && authentication.isAuthenticated()) {
            Object principal = authentication.getPrincipal();

            if (principal instanceof OAuth2User oauthUser) {
                String email = oauthUser.getAttribute("email");
                String name = oauthUser.getAttribute("name");

                res.put("username", name);
                res.put("email", email);
                res.put("role", authentication.getAuthorities());
                res.put("profilePicUrl", oauthUser.getAttribute("picture")); // Optional: Profile picture
                res.put("Msg", "OAuth2 Login Successful!!");
            }
        } else {
            res.put("Msg", "Authentication Failed!!");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(res);
        }

        return ResponseEntity.ok(res);
    }

    @PostMapping("/signout")
    public ResponseEntity<Map<String, String>> signOut(HttpServletResponse response) {
        ResponseCookie deleteCookie = ResponseCookie.from("authToken", "")
                .httpOnly(true)
                .secure(true)  // match your login cookie settings
                .sameSite("Strict")
                .path("/")
                .maxAge(0)     // expire immediately
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, deleteCookie.toString());

        Map<String, String> res = new HashMap<>();
        res.put("message", "Signed out successfully");

        return ResponseEntity.ok(res);
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


    @PutMapping("/{userId}/profile-update")
    public ResponseEntity<Map<String, Object>> updateProfile(@PathVariable Integer userId,
                                                             @RequestBody UserRequest userRequest,
                                                             @AuthenticationPrincipal UserPrinciple userDetials,
                                                             HttpServletResponse response){


        User user = userService.updateUser(userId, userRequest, userDetials);

        String token = jwtService.refreshAuthentication(user);

        Map<String, Object> res = new HashMap<>();

        UserResponse userResponse = userService.getUserResponse(user.getUsername());

        // Set JWT in Secure HTTP-Only Cookie
        ResponseCookie cookie = ResponseCookie.from("authToken", token)
                .httpOnly(true)
                .secure(true)  // Use true in production (HTTPS)
                .sameSite("Strict") // Or "Lax" for cross-site with OAuth
                .path("/")
                .maxAge(24 * 60 * 60) // 1 day expiry
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        res.put("user", userResponse);
        res.put("Msg", "Updated Profile Successfully !!");
        return new ResponseEntity<>(res, HttpStatus.OK);

    }

}
