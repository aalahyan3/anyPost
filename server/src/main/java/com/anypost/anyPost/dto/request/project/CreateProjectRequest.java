package com.anypost.anyPost.dto.request.project;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateProjectRequest(
        @NotBlank
        @Size(min = 3, max = 20, message = "Project name must be between 3 and 20 characters long")
        String name
) { }
