package com.anypost.anyPost.repository;

import com.anypost.anyPost.entity.Form;
import com.anypost.anyPost.entity.Project;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface FormRepository extends MongoRepository<Form, String> {
        List<Form> findByProjectId(String id);
        Optional<Form> findByIdAndProjectId(String id, String projectId);

        void deleteByProjectId(String projectId);
}
