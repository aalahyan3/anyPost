package com.anypost.anyPost.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
@Builder
public class User {
    @Id
    private String id;

    private String password;
    private String name;

    @Indexed(unique = true)
    @Email(message = "Email is not valid")
    @NotBlank(message = "Email is required")
    private String email;

    // Additional fields for email verification
    @Builder.Default
    private boolean enabled = false;
    
    @Indexed(sparse = true) // sparse = ignore null values
    private String verificationToken;
    private long verificationTokenExpiry;

    // Additional fields for password reset
    @Indexed(sparse = true) // sparse = ignore null values
    private String resetPasswordToken;
    private long resetPasswordTokenExpiry;
}
