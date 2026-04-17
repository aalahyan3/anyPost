package com.anypost.anyPost.controller;

import com.anypost.anyPost.dto.response.ApiResponse;
import com.anypost.anyPost.repository.UserRepository;
import com.anypost.anyPost.service.MailService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class TestController {

    private final UserRepository userRepository;

    private final MailService mailService;

    public TestController(UserRepository userRepository, MailService mailService) {
        this.userRepository = userRepository;
        this.mailService = mailService;
    }


    @GetMapping("/test")
    public ResponseEntity<?> test(@AuthenticationPrincipal UserDetails user){


        // mailService.sendEmail("me.a.alahyane@gmail.com", "test",  "hello");
        return ResponseEntity.ok().body(
                ApiResponse.success("you are all good",
                        Map.of("userDetails", user, "actual_user", userRepository.findByEmail(user.getUsername())))
        );
    }
}
