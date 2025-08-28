package com.eventHubBackend.Spring.Backend.EventHub.publicData;

public class PublicEndpoints {

    // Centralized list of public (no-auth) endpoints
    public static final String[] PUBLIC_ENDPOINTS = {
            "/api/users/signup",
            "/api/users/signin",
            "/api/users/oauth2/success/**",
            "/api/events/**", // example for public events list
            "/swagger-ui/**",        // if you expose Swagger
            "/v3/api-docs/**"    // OpenAPI docs
    };
}
