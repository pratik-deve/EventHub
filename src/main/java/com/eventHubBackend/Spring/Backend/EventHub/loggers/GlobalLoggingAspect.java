package com.eventHubBackend.Spring.Backend.EventHub.loggers;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Slf4j
@Aspect
@Component
public class GlobalLoggingAspect {

    @Autowired
    private HttpServletRequest request;

    // Pointcut for all controllers in your project
    @Pointcut("within(@org.springframework.web.bind.annotation.RestController *)")
    public void controllerPointcut() {}

    // Centralized list of public (no-auth) endpoints
    private static final String[] PUBLIC_ENDPOINTS = {
            "/api/users/signup",
            "/api/users/signin",
    };

    private boolean isPublic() {
        String path = request.getRequestURI();
        return Arrays.stream(PUBLIC_ENDPOINTS).anyMatch(path::equals);
    }

    // Log before execution
    @Before("controllerPointcut()")
    public void logBefore(JoinPoint joinPoint) {

        if(isPublic()) return;

        log.info("Incoming request -> {}.{} with args: {}",
                joinPoint.getSignature().getDeclaringTypeName(),
                joinPoint.getSignature().getName(),
                joinPoint.getArgs());


    }

    // Log after returning response
    @AfterReturning(value = "controllerPointcut()", returning = "response")
    public void logAfterReturning(JoinPoint joinPoint, Object response) {
        if(isPublic()) return;

        log.info("Response from -> {}.{} : {}",
                joinPoint.getSignature().getDeclaringTypeName(),
                joinPoint.getSignature().getName(),
                response);
    }

    // Log exceptions
    @AfterThrowing(value = "controllerPointcut()", throwing = "exception")
    public void logAfterThrowing(JoinPoint joinPoint, Exception exception) {

        if(isPublic()) return;

        log.error("Exception in -> {}.{} : {}",
                joinPoint.getSignature().getDeclaringTypeName(),
                joinPoint.getSignature().getName(),
                exception.getMessage(), exception);
    }
}
