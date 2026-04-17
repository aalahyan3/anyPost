package com.anypost.anyPost.dto.request.forms;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;



public record CreateFormRequest(
        @NotBlank
        @Size(min = 3, max = 20, message = "form name must not be less that 3 character long nor more than 20.")
        String name
) {
}
