package com.anypost.anyPost.security;


import java.io.IOException;

import com.anypost.anyPost.dto.response.ApiResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import tools.jackson.databind.ObjectMapper;

@Component
public class AuthEntryPoint implements AuthenticationEntryPoint {

    private final ObjectMapper objectMapper;

    AuthEntryPoint(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override
    public void commence(HttpServletRequest req, HttpServletResponse res, AuthenticationException authException)
            throws IOException {

        // 1. Set the response properties
        res.setContentType("application/json");
        res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

        // 2. Create your Unified Response object
        ApiResponse<Object> apiResponse = ApiResponse.error("Unauthorized: " + authException.getMessage(), null);

        // 3. Use Jackson to write the object as JSON directly to the response stream
        objectMapper.writeValue(res.getOutputStream(), apiResponse);
    }
    
}
