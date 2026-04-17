package com.anypost.anyPost.dto.request.submission;

import com.fasterxml.jackson.annotation.JsonAnySetter;
import java.util.HashMap;
import java.util.Map;

public class CreateSubmissionRequest {

    private Map<String, Object> payload = new HashMap<>();

    @JsonAnySetter
    public void setPayload(String key, Object value) {
        payload.put(key, value);
    }

    public Map<String, Object> getPayload() {
        return payload;
    }
}