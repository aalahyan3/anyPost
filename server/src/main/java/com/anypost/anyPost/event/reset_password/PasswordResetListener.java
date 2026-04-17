package com.anypost.anyPost.event.reset_password;

import java.util.UUID;

import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import com.anypost.anyPost.repository.UserRepository;
import com.anypost.anyPost.service.MailService;

import lombok.extern.slf4j.Slf4j;


@Slf4j
@Component
public class PasswordResetListener {
    private final MailService mailService;
    private final UserRepository userRepository;
    
    public PasswordResetListener(MailService mailService, UserRepository userRepository) {
        this.mailService = mailService;
        this.userRepository = userRepository;
    }

    @EventListener
    public void handlePasswordReset(OnPasswordResetEvent event) {
        var user = event.getUser();

        String token = UUID.randomUUID().toString();
        long expiryTimeMs = System.currentTimeMillis() + 15 * 60 * 1000; //  Token valid for 15 minutes

        user.setResetPasswordToken(token);
        user.setResetPasswordTokenExpiry(expiryTimeMs);
        userRepository.save(user);




        String resetUrl = "http://localhost:3000/reset-password?token=" + user.getResetPasswordToken(); // TODO: change to frontend url

        try {
            mailService.sendPasswordResetEmail(user.getEmail(), user.getName(), resetUrl);
            log.info("Password reset email sent successfully to: {}", user.getEmail());
        } catch (Exception e) {
            log.error("Failed to send password reset email to: {}", user.getEmail(), e);
        }
    }

}
