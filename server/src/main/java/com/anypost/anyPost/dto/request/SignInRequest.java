package com.anypost.anyPost.dto.request;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SignInRequest(
        // @NotBlank(message = "username is required")
        // @Size(min = 6, max = 14, message = "username must be 6-14 character long")
        // String username,

        @NotBlank
        @Size(min = 6)
        String password,

        @NotBlank
        @Email(message = "Email is not valid")
        String email
)

{ }
