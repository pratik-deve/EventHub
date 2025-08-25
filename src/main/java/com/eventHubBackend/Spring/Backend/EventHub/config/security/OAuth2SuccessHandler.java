package com.eventHubBackend.Spring.Backend.EventHub.config.security;

import com.eventHubBackend.Spring.Backend.EventHub.jwt.JwtService;
import com.eventHubBackend.Spring.Backend.EventHub.model.User;
import com.eventHubBackend.Spring.Backend.EventHub.principles.UserPrinciple;
import com.eventHubBackend.Spring.Backend.EventHub.repository.UserRepo;
import com.eventHubBackend.Spring.Backend.EventHub.service.UserService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;

@Component
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final JwtService jwtService;

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepo userRepo;


    public OAuth2SuccessHandler(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {

        OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();

        String email = oauthUser.getAttribute("email");
        String name = oauthUser.getAttribute("name");
        String token = jwtService.generateToken(email);


        User user = userRepo.findByEmail(email);

        if(user == null){
            user = User.builder()
                    .username(email)
                    .email(email)
                    .fullname(name)
                    .password("{noop} %s".formatted(email))
                    .build();

            userService.saveUser(user);
        }

        // Set Secure HttpOnly Cookie like signin()
        ResponseCookie cookie = ResponseCookie.from("authToken", token)
                .httpOnly(true)
                .secure(true)  // set true in production
                .sameSite("Lax") // "Lax" or "Strict" depending on OAuth redirect
                .path("/")
                .maxAge(24 * 60 * 60) // 1 day
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        // Redirect without token in URL
        String redirectUrl = String.format(
                "http://localhost:3000/oauth2/callback?email=%s&name=%s",
                URLEncoder.encode(email, "UTF-8"),
                URLEncoder.encode(name, "UTF-8")
        );

        response.sendRedirect(redirectUrl);
    }

}

