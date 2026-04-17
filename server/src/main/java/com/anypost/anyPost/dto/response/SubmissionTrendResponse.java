package com.anypost.anyPost.dto.response;

import java.util.List;

public record SubmissionTrendResponse(
        String range,
        String timezone,
        List<SubmissionTrendPoint> points,
        long total
) {
    public record SubmissionTrendPoint(
            String date,
            String label,
            long count
    ) {}
}