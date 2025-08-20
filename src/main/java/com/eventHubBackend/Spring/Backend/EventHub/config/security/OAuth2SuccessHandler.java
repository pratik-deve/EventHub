package com.eventHubBackend.Spring.Backend.EventHub.config.security;

import com.eventHubBackend.Spring.Backend.EventHub.jwt.JwtService;
import com.eventHubBackend.Spring.Backend.EventHub.principles.UserPrinciple;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;

@Component
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final JwtService jwtService;


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

        // Redirect to popup result page with params
        String redirectUrl = String.format(
                "http://localhost:3000/oauth2/callback?email=%s&name=%s&token=%s",
                URLEncoder.encode(email, "UTF-8"),
                URLEncoder.encode(name, "UTF-8"),
                URLEncoder.encode(token, "UTF-8")
        );

        response.sendRedirect(redirectUrl);

    }
}

