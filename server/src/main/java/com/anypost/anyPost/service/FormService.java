package com.anypost.anyPost.service;

import com.anypost.anyPost.dto.request.forms.CreateFormRequest;
import com.anypost.anyPost.dto.request.forms.PatchFormRequest;
import com.anypost.anyPost.dto.response.SubmissionMetadataResponse;
import com.anypost.anyPost.dto.response.SubmissionTrendResponse;
import com.anypost.anyPost.entity.Form;
import com.anypost.anyPost.entity.Project;
import com.anypost.anyPost.entity.Submission;
import com.anypost.anyPost.exception.ResourceNotFoundException;
import com.anypost.anyPost.repository.FormRepository;
import com.anypost.anyPost.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.BufferedWriter;
import java.io.IOException;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.TextStyle;
import java.util.*;

@Service
public class FormService {

    private final FormRepository formRepository;
    private final ProjectRepository projectRepository;
    private final SubmissionService submissionService;

    @Autowired
    public FormService(FormRepository formRepository,
                       ProjectRepository projectRepository,
                       SubmissionService submissionService) {
        this.formRepository = formRepository;
        this.projectRepository = projectRepository;
        this.submissionService = submissionService;
    }

    private Project getProjectAndCheckPermissions(String projectId, String userId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project was not found"));

        if (!Objects.equals(project.getOwnerId(), userId)) {
            throw new IllegalArgumentException("You don't own this project");
        }

        return project;
    }

    public List<Form> getAllFormsAssociatedToProject(String projectId, String userId){
        Project project = getProjectAndCheckPermissions(projectId, userId);
        return formRepository.findByProjectId(project.getId());
    }

    public Form createForm(String projectId, String userId, CreateFormRequest request)
    {
        Project project = getProjectAndCheckPermissions(projectId, userId);

        Form form = Form.builder().name(request.name()).projectId(project.getId()).build();

        return formRepository.save(form);
    }

    public Form getFormById(String projectId, String userId, String formId)
    {
        Project project = getProjectAndCheckPermissions(projectId, userId);

        return formRepository.findByIdAndProjectId(formId, project.getId())
                .orElseThrow(() -> new ResourceNotFoundException("form was not found"));
    }

    public Form updateForm(String projectId, String userId, String formId, CreateFormRequest request)
    {
        Form form = getFormById(projectId, userId, formId);
        form.setName(request.name());
        return formRepository.save(form);
    }

    public Form patchForm(String projectId, String userId, String formId, PatchFormRequest request)
    {
        Form form = getFormById(projectId, userId, formId);
        if (request.name() != null)
            form.setName(request.name());
        if (request.active() != null)
            form.setActive(request.active());
        return formRepository.save(form);
    }



    @Transactional
    public void deleteForm(String projectId, String userId, String formId) {
        Form form = getFormById(projectId, userId, formId);
        submissionService.deleteSubmissionsByFormId(formId);
        formRepository.delete(form);
    }

    @Transactional
    public void deleteFormsByProjectId(String projectId) {
        List<Form> forms = formRepository.findByProjectId(projectId);

        List<String> formIds = forms.stream()
                .map(Form::getId)
                .toList();

        if (!formIds.isEmpty()) {
            submissionService.deleteSubmissionsByFormIds(formIds);
            formRepository.deleteByProjectId(projectId);
        }
    }

    public Page<Submission> getAllFormSubmissions(String userId, String projectId, String formId, Pageable pageable){
        getProjectAndCheckPermissions(projectId, userId);
        return submissionService.getSubmissionsByFormId(formId, pageable);
    }

    public SubmissionMetadataResponse getSubmissionMetadata(String userId, String projectId, String formId){
        getProjectAndCheckPermissions(projectId, userId);
        return submissionService.getSubmissionMetadata(formId);
    }



    public SubmissionTrendResponse generateSubmissionTrend(String userId, String projectId, String formId) {
        Form form = getFormById(projectId, userId, formId);

        ZoneId zoneId = ZoneId.of("UTC");
        LocalDate endDate = LocalDate.now(zoneId);
        LocalDate startDate = endDate.minusDays(6);

        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.plusDays(1).atStartOfDay().minusNanos(1);

        List<Submission> submissions =
                submissionService.getSubmissionsByFormIdAndCreatedAtBetween(form.getId(), startDateTime, endDateTime);

        Map<LocalDate, Long> countsByDate = new HashMap<>();

        for (Submission submission : submissions) {
            if (submission.getCreatedAt() == null) {
                continue;
            }

            LocalDate submissionDate = submission.getCreatedAt()
                    .atZone(zoneId)
                    .toLocalDate();

            countsByDate.put(submissionDate, countsByDate.getOrDefault(submissionDate, 0L) + 1);
        }

        List<SubmissionTrendResponse.SubmissionTrendPoint> points = new ArrayList<>();
        long total = 0;

        for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
            long count = countsByDate.getOrDefault(date, 0L);
            total += count;

            points.add(new SubmissionTrendResponse.SubmissionTrendPoint(
                    date.toString(),
                    date.getDayOfWeek().getDisplayName(TextStyle.SHORT, Locale.ENGLISH),
                    count
            ));
        }

        return new SubmissionTrendResponse("LAST_7_DAYS", zoneId.getId(), points, total);
    }

    public void exportSubmissionsCsv(String useId, String projectId, String formId, OutputStream outputStream){
        getFormById(projectId, useId, formId);
        String[] fields = getSubmissionMetadata(useId, projectId, formId).getFields();

        try (BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(outputStream, StandardCharsets.UTF_8)))
        {
            writer.write("_date");

            for (String field : fields) {
                writer.write("," + field);
            }
            writer.write("\n");

            int page = 0;
            int size = 500;
            Page<Submission> submissionPage;

            do {
                submissionPage = submissionService.getSubmissionsByFormId(formId, PageRequest.of(page, size));

                for (Submission submission : submissionPage.getContent()) {
                    Map<String, Object> data = submission.getData();

                    writer.write(submission.getCreatedAt().toString());

                    for (String field : fields) {
                        writer.write("," + data.getOrDefault(field, "")); // TODO: Escape CSV
                    }
                    writer.write("\n");
                }

                writer.flush();
                page++;
            }
            while (submissionPage.hasNext());

        }
        catch (IOException e){
            throw new RuntimeException(e);
        }
    }
}
