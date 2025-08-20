package com.eventHubBackend.Spring.Backend.EventHub.controllerAdvice;

import com.eventHubBackend.Spring.Backend.EventHub.exception.InvalidJwtSignatureException;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureException;
import io.jsonwebtoken.UnsupportedJwtException;
import org.hibernate.PropertyValueException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.sql.SQLIntegrityConstraintViolationException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    /* ---------- Utility Method ---------- */
    private ResponseEntity<Map<String, Object>> buildResponse(HttpStatus status, String error, String message) {
        Map<String, Object> errorBody = new HashMap<>();
        errorBody.put("timestamp", LocalDateTime.now());
        errorBody.put("status", status.value());
        errorBody.put("error", error);
        errorBody.put("message", message);
        return new ResponseEntity<>(errorBody, status);
    }

    /* ---------- Hibernate Exception ---------- */
    @ExceptionHandler(PropertyValueException.class)
    public ResponseEntity<Map<String, Object>> handlePropertyValueException(PropertyValueException ex) {
        String message = String.format("The property '%s' cannot be null", ex.getPropertyName());
        return buildResponse(HttpStatus.BAD_REQUEST, "Missing required property", message);
    }

    /* ---------- SQL Exception ---------- */
    @ExceptionHandler(SQLIntegrityConstraintViolationException.class)
    public ResponseEntity<Map<String, Object>> handleSQLIntegrityConstraintViolation(SQLIntegrityConstraintViolationException ex) {
        return buildResponse(HttpStatus.BAD_REQUEST, "Data integrity violation", "User Already Exist!!");
    }

    /* ---------- JWT Exceptions ---------- */
    @ExceptionHandler(MalformedJwtException.class)
    public ResponseEntity<Map<String, Object>> handleMalformedJwt(MalformedJwtException ex) {
        return buildResponse(HttpStatus.UNAUTHORIZED, "Invalid JWT format", ex.getMessage());
    }

    @ExceptionHandler(SignatureException.class)
    public ResponseEntity<Map<String, Object>> handleSignatureException(SignatureException ex) {
        return buildResponse(HttpStatus.UNAUTHORIZED, "Invalid JWT signature", ex.getMessage());
    }

    @ExceptionHandler(ExpiredJwtException.class)
    public ResponseEntity<Map<String, Object>> handleExpiredJwt(ExpiredJwtException ex) {
        return buildResponse(HttpStatus.UNAUTHORIZED, "JWT token expired", ex.getMessage());
    }

    @ExceptionHandler(UnsupportedJwtException.class)
    public ResponseEntity<Map<String, Object>> handleUnsupportedJwt(UnsupportedJwtException ex) {
        return buildResponse(HttpStatus.BAD_REQUEST, "Unsupported JWT", ex.getMessage());
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalArgument(IllegalArgumentException ex) {
        return buildResponse(HttpStatus.BAD_REQUEST, "JWT token is empty or null", ex.getMessage());
    }



    @ExceptionHandler(InvalidJwtSignatureException.class)
    public ResponseEntity<Map<String, Object>> handleInvalidJwt(InvalidJwtSignatureException ex) {
        return buildResponse(HttpStatus.UNAUTHORIZED, "", ex.getMessage());
    }


    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<Map<String, Object>> handleInvalidState(IllegalStateException ex) {
        return buildResponse(HttpStatus.UNAUTHORIZED, "", ex.getMessage());
    }


}
