package com.anypost.anyPost.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubmissionMetadataResponse {
    private String[] fields;
    private LocalDateTime lastPulse;
    private Long totalSubmissions;
    private LocalDateTime firstSubmission;
    private Boolean activeForm;
}
