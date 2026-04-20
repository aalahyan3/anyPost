package com.anypost.anyPost.repository;

import com.anypost.anyPost.entity.Submission;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface SubmissionRepository extends MongoRepository<Submission, String> {
    List<Submission> findByFormId(String id);

    Optional<Submission> findByIdAndFormId(String id, String formId);

    Page<Submission> findByFormId(String formId, Pageable pageable);

    void deleteByFormId(String formId);

    void deleteByFormIdIn(List<String> formIds);

    long countByFormId(String formId); // returns the number of submissions for a given form

    Optional<Submission> findFirstByFormIdOrderByCreatedAtDesc(String formId); // find the latest submission for a given form

    Optional<Submission> findFirstByFormIdOrderByCreatedAtAsc(String formId); // find the earliest submission for a given form

    List<Submission> findByFormIdAndCreatedAtBetween(
            String formId,
            LocalDateTime start,
            LocalDateTime end
    );


    List<Submission>    findByFormIdAndIdIn(String formId, List<String> ids);
}