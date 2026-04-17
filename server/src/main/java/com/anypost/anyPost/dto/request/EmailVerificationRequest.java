package com.anypost.anyPost.dto.request;

import java.util.List;

public record EmailVerificationRequest(
    String from,
    List<String> to,
    String subject,
    String html
) {}
