package com.anypost.anyPost.controller;

import com.anypost.anyPost.dto.request.AccountVerficationRequest;
import com.anypost.anyPost.dto.request.ForgotPasswordRequest;
import com.anypost.anyPost.dto.request.ResetPasswordRequest;
import com.anypost.anyPost.dto.request.SendVerificationEmailRequest;
import com.anypost.anyPost.dto.request.SignInRequest;
import com.anypost.anyPost.dto.request.SignupRequest;
import com.anypost.anyPost.dto.response.ApiResponse;
import com.anypost.anyPost.entity.User;
import com.anypost.anyPost.event.registration_complete.OnRegistrationCompleteEvent;
import com.anypost.anyPost.event.reset_password.OnPasswordResetEvent;
import com.anypost.anyPost.repository.UserRepository;
import com.anypost.anyPost.security.JwtUtil;
import jakarta.validation.Valid;

import java.util.HashMap;
import java.util.Map;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthenticationController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final ApplicationEventPublisher eventPublisher;

    public AuthenticationController(UserRepository userRepository, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager, JwtUtil jwtUtil, ApplicationEventPublisher eventPublisher) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.eventPublisher = eventPublisher;
    }

    @PostMapping("/signin")
    public ResponseEntity<?> signIn(@RequestBody @Valid SignInRequest request){

        try{
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
            );
            
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String token = jwtUtil.generateToken(userDetails.getUsername());

            ResponseCookie  jwtCookie = ResponseCookie.from("jwt", token)
                    .httpOnly(true)
                    .secure(false)
                    .path("/")
                    .maxAge(jwtUtil.getJwtExpiration() / 1_000)
                    .sameSite("Strict")
                    .build();

            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
                    .body(ApiResponse.success("logged in successfully", null));

        }
        catch(DisabledException e)
        {
            User user = userRepository.findByEmail(request.email()).orElseThrow();
            long now = System.currentTimeMillis();

            if (now > user.getVerificationTokenExpiry()) {
                eventPublisher.publishEvent(new OnRegistrationCompleteEvent(user));
            }
            
            return ResponseEntity.status(403)
                    .body(ApiResponse.error("User account is disabled. Check email to verify.", null));
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signUp(@RequestBody @Valid SignupRequest request) {
        if (userRepository.findByEmail(request.email()).isPresent()) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Email is already in use", null));
        }
        
        User newUser = User.builder()
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .name(request.name())
                .build();
        
        User savedUser = userRepository.save(newUser);
        eventPublisher.publishEvent(new OnRegistrationCompleteEvent(savedUser));
        
        return ResponseEntity.status(201)
                .body(ApiResponse.success("Account created. Please check your email to verify your account.", null));
    }


    @PostMapping("/verify")
    public ResponseEntity<?> verifyAccount(@RequestBody @Valid AccountVerficationRequest request)
    {
        User user = userRepository.findByVerificationToken(request.token()).orElse(null);

        if (user == null)
        {
            return ResponseEntity.badRequest().body(ApiResponse.error("Invalid or expired verification token", null));
        }
        user.setEnabled(true);
        user.setVerificationToken(null);
        user.setVerificationTokenExpiry(0);
        userRepository.save(user);

        return ResponseEntity.ok(ApiResponse.success("Account verified successfully. You can now log in.", null));
    }


    @PostMapping("/send-verification-email")
    public ResponseEntity<?> sendVerificationEmail(@RequestBody @Valid SendVerificationEmailRequest request) {
        User user = userRepository.findByEmail(request.email()).orElse(null);

        if (user == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Can't verify this email", null));
        }

        if (user.isEnabled()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Account is already verified", null));
        }

        long now = System.currentTimeMillis();
        if (now < user.getVerificationTokenExpiry()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Verification email already sent. Please check your inbox.", null));
        }

        eventPublisher.publishEvent(new OnRegistrationCompleteEvent(user));
        return ResponseEntity.ok(ApiResponse.success("Verification email sent. Please check your inbox.", null));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        ResponseCookie jwtCookie = ResponseCookie.from("jwt", "")
                .httpOnly(true)
                .secure(false) // TODO change this to true in production
                .path("/")
                .maxAge(0)
                .sameSite("Strict")
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
                .body(ApiResponse.success("Logged out successfully", null));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody @Valid ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.email()).orElse(null);

        if (user == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Can't reset password", null));
        }

        eventPublisher.publishEvent(new OnPasswordResetEvent(user)); // generate token, save to user, send email


        return ResponseEntity.ok(ApiResponse.success("Password reset instructions sent to your email", null));
    
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody @Valid ResetPasswordRequest request) {
        User user = userRepository.findByResetPasswordToken(request.token()).orElse(null);
        
        if (user == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Invalid or expired reset token", null));
        }

        user.setPassword(passwordEncoder.encode(request.new_password()));
        user.setResetPasswordToken(null);
        user.setResetPasswordTokenExpiry(0);
        userRepository.save(user);

        return ResponseEntity.ok(ApiResponse.success("Password reset successfully. You can now log in with your new password.", null));
    }

    @GetMapping("/whoami")
    public ResponseEntity<?> whoAmI(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401)
                    .body(ApiResponse.error("Unauthorized", null));
        }

        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            return ResponseEntity.status(404)
                    .body(ApiResponse.error("User not found", null));
        }

        Map<String, Object> data = new HashMap<>();
        data.put("id", user.getId());
        data.put("email", user.getEmail());
        data.put("name", user.getName());

        return ResponseEntity.ok(ApiResponse.success("Current user", data));
    }
}
