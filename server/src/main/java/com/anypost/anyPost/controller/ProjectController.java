package com.anypost.anyPost.controller;

import com.anypost.anyPost.dto.request.project.CreateProjectRequest;
import com.anypost.anyPost.dto.response.ApiResponse;
import com.anypost.anyPost.entity.Project;
import com.anypost.anyPost.security.UserDetailsImpl;
import com.anypost.anyPost.service.ProjectService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/projects")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService){
        this.projectService = projectService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Project>>> getProjects(@AuthenticationPrincipal UserDetailsImpl user) {

        List<Project> projects = projectService.getAllUserProjects(user.getId());
        return ResponseEntity.ok().body(ApiResponse.success("Projects retrieved", projects));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Project>> getProjectById(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetailsImpl user) {
        Project project = projectService.getProjectById(id, user.getId());
        return ResponseEntity.ok().body(ApiResponse.success("Project Fetched successfully", project));
    }


    @PostMapping
    public ResponseEntity<ApiResponse<Project>>    createProject(@AuthenticationPrincipal UserDetailsImpl user, @Valid @RequestBody CreateProjectRequest project)
    {
        Project projectCreated = projectService.createProject(project, user.getId());

        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Project created successfully", projectCreated));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Project>> createProject(@AuthenticationPrincipal UserDetailsImpl user, @Valid @RequestBody CreateProjectRequest projectToPut, @PathVariable String id) {
        Project project = projectService.updateProject(id, user.getId(), projectToPut);

        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.success("Project edited successfully", project)
        );
    }

    @DeleteMapping("{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProject(@AuthenticationPrincipal UserDetailsImpl user, @PathVariable String id) {

        projectService.deleteProject(id, user.getId());
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.success("Project deleted successfully", null)
        );
    }






}
