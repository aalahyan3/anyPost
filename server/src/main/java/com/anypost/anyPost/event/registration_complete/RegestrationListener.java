package com.anypost.anyPost.event.registration_complete;

import java.util.UUID;

import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import com.anypost.anyPost.repository.UserRepository;
import com.anypost.anyPost.service.MailService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class RegestrationListener {
    private final UserRepository userRepository;
    private final MailService mailService;

    public RegestrationListener(UserRepository userRepository, MailService mailService) {
        this.userRepository = userRepository;
        this.mailService = mailService;
    }

    @EventListener
    public void handleRegistrationComplete(OnRegistrationCompleteEvent event) {
       var user = event.getUser();

       String token = UUID.randomUUID().toString();
       long expiryTimeMs = System.currentTimeMillis() + 24 * 60 * 60 * 1000;

       user.setVerificationToken(token);
       user.setVerificationTokenExpiry(expiryTimeMs);
       userRepository.save(user);
       
       log.info("Generated verification token for user: {}", user.getEmail());

       String verificationUrl = "http://localhost:3000/verify-email?type=verify&token=" + token; //TODO: change to frontend url

       try {
           mailService.sendVerificationEmail(user.getEmail(), user.getName(), verificationUrl);
           log.info("Verification email sent successfully to: {}", user.getEmail());
       } catch (Exception e) {
           log.error("Failed to send verification email to: {}", user.getEmail(), e);
       }
    }
}
