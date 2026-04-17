package com.anypost.anyPost.dto.request;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ResetPasswordRequest(
    @NotBlank(message = "token is required")
    String token,

    @NotBlank(message = "new_password is required")
    @Size(min = 6)
    String new_password
) { }
