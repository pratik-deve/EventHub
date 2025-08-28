package com.eventHubBackend.Spring.Backend.EventHub.jwt;

import com.eventHubBackend.Spring.Backend.EventHub.exception.InvalidJwtSignatureException;
import com.eventHubBackend.Spring.Backend.EventHub.publicData.PublicEndpoints;
import com.eventHubBackend.Spring.Backend.EventHub.service.EventUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import io.jsonwebtoken.security.SignatureException;

import java.io.IOException;
import java.util.Arrays;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private ApplicationContext context;

    // Centralized list of public (no-auth) endpoints
    private static final String[] PUBLIC_ENDPOINTS = PublicEndpoints.PUBLIC_ENDPOINTS;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();

        boolean isPublic = Arrays.stream(PUBLIC_ENDPOINTS).anyMatch(path::startsWith);
        if(isPublic){
            filterChain.doFilter(request, response);
            return;
        }


        try {
            String token = extractToken(request);

            if (token != null) {
                String userName = jwtService.extractUsername(token);

                if (userName != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    UserDetails userDetails = context.getBean(EventUserDetailsService.class)
                            .loadUserByUsername(userName);

                    if (jwtService.validateToken(token, userDetails)) {
                        UsernamePasswordAuthenticationToken authToken =
                                new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authToken);
                    } else {
                        throw new BadCredentialsException("Invalid JWT token");
                    }
                }
            }
        } catch (SignatureException ex) {
            throw new InvalidJwtSignatureException("Invalid JWT signature");
        }

        filterChain.doFilter(request, response);
    }

    private String extractToken(HttpServletRequest request) {
        // 1. Check Authorization header
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }

        // 2. Check HttpOnly Cookie
        if (request.getCookies() != null) {
            return Arrays.stream(request.getCookies())
                    .filter(c -> "authToken".equals(c.getName()))
                    .map(Cookie::getValue)
                    .findFirst()
                    .orElse(null);
        }

        return null;
    }
}
