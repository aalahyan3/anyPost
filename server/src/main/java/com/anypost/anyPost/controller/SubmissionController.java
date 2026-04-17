package com.anypost.anyPost.controller;

import com.anypost.anyPost.dto.request.submission.CreateSubmissionRequest;
import com.anypost.anyPost.dto.response.ApiResponse;
import com.anypost.anyPost.entity.Submission;
import com.anypost.anyPost.service.SubmissionService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/f")
public class SubmissionController {
    private final SubmissionService submissionService;

    public SubmissionController(SubmissionService submissionService){
        this.submissionService = submissionService;
    }

    @PostMapping("/{form_id}")
    public ResponseEntity<ApiResponse<Submission>>  createSubmission(@Valid @RequestBody CreateSubmissionRequest request,
                                                                     @PathVariable("form_id")   String formId){
        Submission  submission = submissionService.createSubmission(formId, request);

        return ResponseEntity.ok().body(ApiResponse.success("form was submitted", submission));
    }

//    @GetMapping("/api/v1/submissions")
}
