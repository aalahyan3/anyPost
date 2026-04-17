package com.anypost.anyPost.service;

import com.anypost.anyPost.dto.request.project.CreateProjectRequest;
import com.anypost.anyPost.entity.Form;
import com.anypost.anyPost.entity.Project;
import com.anypost.anyPost.exception.ResourceNotFoundException;
import com.anypost.anyPost.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Objects;

@Service
public class ProjectService {
    private final ProjectRepository projectRepository;
    private final FormService formService;

    private Project getProjectAndCheckPermissions(String id, String userId)
    {
        Project project = projectRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Project was not found"));
        if (!Objects.equals(project.getOwnerId(), userId))
        {
            throw new AccessDeniedException("You don't own this project");
        }
        return project;
    }

    @Autowired
    public ProjectService(ProjectRepository projectRepository, FormService formService)
    {
        this.projectRepository = projectRepository;
        this.formService = formService;
    }

    public List<Project>    getAllUserProjects(String ownerId){
        return projectRepository.findByOwnerId(ownerId);
    }

    public Project  createProject(CreateProjectRequest req, String owner)
    {
        if (projectRepository.existsByNameAndOwnerId(req.name(), owner))
        {
            throw new IllegalArgumentException("Project with name " + req.name() + " Already exist");
        }

        int count = projectRepository.countByOwnerId(owner);

        if (count >= 3){
            throw new IllegalArgumentException("You can only create 3 projects");
        }

        Project newProject = Project.builder().name(req.name()).ownerId(owner).build();

        return projectRepository.save(newProject);
    }

    public Project getProjectById(String id, String userId) throws AccessDeniedException {
        Project project = getProjectAndCheckPermissions(id, userId);

        return project;

    }

    /*
        update project details, check if user owns that project, then check if the name doesn't already exist as if it is unique per user
     */
    public  Project updateProject(String id, String userId, CreateProjectRequest projectToPut){
        Project project = getProjectAndCheckPermissions(id, userId);

        if (!project.getName().equals(projectToPut.name())) {

            if (projectRepository.existsByNameAndOwnerId(projectToPut.name(), userId)) {
                throw new IllegalArgumentException("You already have a project with the name '" + projectToPut.name() + "'.");
            }
            project.setName(projectToPut.name());
        }
        return  projectRepository.save(project);
    }

    @Transactional
    public void deleteProject(String id, String userId)
    {
        Project project = getProjectAndCheckPermissions(id, userId);

        formService.deleteFormsByProjectId(id);
        projectRepository.delete(project);
    }
}
