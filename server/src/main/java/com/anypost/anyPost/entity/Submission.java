package com.anypost.anyPost.entity;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document(collection = "submissions")
public class Submission {

    @Id
    private String id;

    @Indexed
    @Field(name = "form_id")
    @NotBlank
    private String formId;

    private Map<String, Object> data;

//    private Object  metadata;

    @CreatedDate
    private LocalDateTime createdAt;
}
