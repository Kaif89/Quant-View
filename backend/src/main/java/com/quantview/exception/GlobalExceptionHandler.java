package com.quantview.exception;

import com.quantview.dto.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.ResourceAccessException;

/**
 * Intercepts all unhandled exceptions across Spring Boot controllers
 * and packages them cleanly into the standard ApiResponse format.
 */
@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<ApiResponse<Void>> handleMissingParams(MissingServletRequestParameterException ex) {
        return ResponseEntity.badRequest().body(ApiResponse.error("Missing required parameter: " + ex.getParameterName()));
    }

    @ExceptionHandler(HttpClientErrorException.class)
    public ResponseEntity<ApiResponse<Void>> handleHttpClientError(HttpClientErrorException ex) {
        // Forward the exact error message from the child service (like Python) if possible
        String body = ex.getResponseBodyAsString();
        String errorMsg = body;
        try {
            // Attempt to extract 'error' from JSON if it's JSON from Python
            if (body.contains("\"error\"")) {
                int start = body.indexOf("\"error\"") + 10;
                int end = body.indexOf("\"", start);
                errorMsg = body.substring(start, end);
            }
        } catch (Exception ignored) {}
        
        return ResponseEntity.status(ex.getStatusCode()).body(ApiResponse.error(errorMsg));
    }

    @ExceptionHandler(HttpServerErrorException.class)
    public ResponseEntity<ApiResponse<Void>> handleHttpServerError(HttpServerErrorException ex) {
        return ResponseEntity.status(ex.getStatusCode()).body(ApiResponse.error("Downstream service error"));
    }

    @ExceptionHandler(ResourceAccessException.class)
    public ResponseEntity<ApiResponse<Void>> handleResourceAccessError(ResourceAccessException ex) {
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(ApiResponse.error("Service temporarily unavailable. Check connections."));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleAllExceptions(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("An unexpected internal error occurred."));
    }
}
