package com.anypost.anyPost.service;

import com.anypost.anyPost.dto.request.submission.CreateSubmissionRequest;
import com.anypost.anyPost.dto.response.SubmissionMetadataResponse;
import com.anypost.anyPost.entity.Form;
import com.anypost.anyPost.entity.Submission;
import com.anypost.anyPost.exception.InactiveFormException;
import com.anypost.anyPost.exception.ResourceNotFoundException;
import com.anypost.anyPost.repository.FormRepository;
import com.anypost.anyPost.repository.SubmissionRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class SubmissionService {
    private final SubmissionRepository  submissionRepository;
    private final FormRepository formRepository;

    public SubmissionService(SubmissionRepository submissionRepository, FormRepository formRepository){
        this.submissionRepository = submissionRepository;
        this.formRepository = formRepository;
    }

    public  Submission    createSubmission(String formId, CreateSubmissionRequest request){
        Form    form = formRepository.findById(formId).orElseThrow(()-> new ResourceNotFoundException("No such form"));

        if (!form.isActive())
                throw new InactiveFormException("Form is not active");

        Submission submission = Submission.builder()
                .data(request.getPayload())
                .formId(formId)
                .build();

        return submissionRepository.save(submission);
    }

    public Page<Submission> getSubmissionsByFormId(String formId, Pageable pageable){
        return submissionRepository.findByFormId(formId, pageable);
    }

    public void deleteSubmissionsByFormId(String formId){
        submissionRepository.deleteByFormId(formId);
    }

    public void deleteSubmissionsByFormIds(List<String> formIds){
        submissionRepository.deleteByFormIdIn(formIds);
    }

    public SubmissionMetadataResponse getSubmissionMetadata(String formId){
        // Get the form to check if it's active
        Form form = formRepository.findById(formId)
                .orElseThrow(() -> new ResourceNotFoundException("No such form"));

        // Get total count
        long totalSubmissions = submissionRepository.countByFormId(formId);

        // Get last submission (latest)
        LocalDateTime lastPulse = submissionRepository.findFirstByFormIdOrderByCreatedAtDesc(formId)
                .map(Submission::getCreatedAt)
                .orElse(null);

        // Get first submission (earliest)
        LocalDateTime firstSubmission = submissionRepository.findFirstByFormIdOrderByCreatedAtAsc(formId)
                .map(Submission::getCreatedAt)
                .orElse(null);

        // Extract all unique field names from submissions
        List<Submission> allSubmissions = submissionRepository.findByFormId(formId);
        Set<String> fieldSet = new HashSet<>();

        for (Submission submission : allSubmissions) {
            if (submission.getData() != null) {
                fieldSet.addAll(submission.getData().keySet());
            }
        }

        String[] fields = fieldSet.toArray(new String[0]);

        return SubmissionMetadataResponse.builder()
                .fields(fields)
                .lastPulse(lastPulse)
                .totalSubmissions(totalSubmissions)
                .firstSubmission(firstSubmission)
                .activeForm(form.isActive())
                .build();
    }

    public List<Submission> getSubmissionsByFormIdAndCreatedAtBetween(
            String formId,
            LocalDateTime start,
            LocalDateTime end
    ) {
        return submissionRepository.findByFormIdAndCreatedAtBetween(formId, start, end);
    }


    public void deleteByFormIdandIds(String formId, List<String> ids){
        List<Submission> submissions = submissionRepository.findByFormIdAndIdIn(formId, ids);
        submissionRepository.deleteAll(submissions);
    }
}
