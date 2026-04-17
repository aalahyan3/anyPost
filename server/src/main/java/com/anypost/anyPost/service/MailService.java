package com.anypost.anyPost.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import com.anypost.anyPost.dto.request.EmailVerificationRequest;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class MailService {
    private final WebClient webClient;
    private final TemplateEngine templateEngine;

    @Value("${resend.api.key}")
    private String resendApiKey;

    private final String RESEND_BASE_URL = "https://api.resend.com";

    public MailService(WebClient.Builder webClientBuilder, TemplateEngine templateEngine) {
        this.webClient = webClientBuilder.baseUrl(RESEND_BASE_URL).build();
        this.templateEngine = templateEngine;
    }

    public void sendEmail(String to, String subject, String html) {
        EmailVerificationRequest emailRequest = new EmailVerificationRequest(
            "anyPost <onboarding@aalahyan3.tech>",
            List.of(to),
            subject,
            html
        );

        this.webClient.post()
            .uri("/emails")
            .header("Authorization", "Bearer " + resendApiKey)
            .header("Content-Type", "application/json")
            .bodyValue(emailRequest)
            .retrieve()
            .bodyToMono(String.class)
            .doOnSuccess(response -> log.info("Email sent successfully to: {}", to))
            .doOnError(WebClientResponseException.class, e -> log.error("Failed to send email to {}. Status: {}. Response: {}", to, e.getStatusCode(), e.getResponseBodyAsString()))
            .doOnError(Exception.class, e -> log.error("Failed to send email to {}. Reason: {}", to, e.getMessage()))
            .subscribe();
    }

    public void sendVerificationEmail(String to, String name, String verificationLink) {
        Context context = new Context();
        context.setVariable("name", name);
        context.setVariable("link", verificationLink);

        String htmlContent = templateEngine.process("email-verification", context);

        sendEmail(to, "Verify your email address", htmlContent);
    }

    public void sendPasswordResetEmail(String to, String name, String resetLink) {
        Context context = new Context();
        context.setVariable("name", name);
        context.setVariable("link", resetLink);

        String htmlContent = templateEngine.process("password-reset", context);

        sendEmail(to, "Password Reset Request", htmlContent);
    }

}