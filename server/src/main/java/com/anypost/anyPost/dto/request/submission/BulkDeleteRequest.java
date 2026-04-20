package com.anypost.anyPost.dto.request.submission;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record BulkDeleteRequest(
        @NotEmpty
        List<String> ids
) {
}
