package com.anypost.anyPost.repository;

import com.anypost.anyPost.entity.Project;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public  interface ProjectRepository extends MongoRepository<Project, String> {
    List<Project> findByOwnerId(String ownerId);

    Optional<Project> findByIdAndOwnerId(String id, String ownerId);

    boolean existsByNameAndOwnerId(String name, String ownerId);

    int countByOwnerId(String ownerId);
}
