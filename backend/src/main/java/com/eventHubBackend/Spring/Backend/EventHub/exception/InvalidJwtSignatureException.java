package com.eventHubBackend.Spring.Backend.EventHub.exception;



import org.springframework.security.core.AuthenticationException;

public class InvalidJwtSignatureException extends AuthenticationException {
    public InvalidJwtSignatureException(String message) {
        super(message);
    }
}
