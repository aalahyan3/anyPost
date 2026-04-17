package com.anypost.anyPost.dto.request;

import jakarta.validation.constraints.NotBlank;

public record AccountVerficationRequest(
        @NotBlank(message = "Verification token is required")
        String token
) {}
