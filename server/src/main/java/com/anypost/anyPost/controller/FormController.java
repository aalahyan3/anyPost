package com.anypost.anyPost.controller;

import com.anypost.anyPost.dto.request.forms.CreateFormRequest;
import com.anypost.anyPost.dto.request.forms.PatchFormRequest;
import com.anypost.anyPost.dto.response.ApiResponse;
import com.anypost.anyPost.dto.response.SubmissionMetadataResponse;
import com.anypost.anyPost.dto.response.SubmissionTrendResponse;
import com.anypost.anyPost.entity.Form;
import com.anypost.anyPost.entity.Submission;
import com.anypost.anyPost.security.UserDetailsImpl;
import com.anypost.anyPost.service.FormService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

import java.util.List;

@RestController
@RequestMapping("/api/v1/projects")
public class FormController {

    private final FormService formService;

    public FormController(FormService formService){
        this.formService = formService;
    }

    @GetMapping("/{project_id}/forms")
    public ResponseEntity<ApiResponse<List<Form>>> getForms(@AuthenticationPrincipal UserDetailsImpl user,
                                                            @PathVariable(name = "project_id") String projectId){
        List<Form>  forms = formService.getAllFormsAssociatedToProject(projectId, user.getId());

        return ResponseEntity.ok().body(ApiResponse.success("forms fetched successfully", forms));
    }

    @GetMapping("/{project_id}/forms/{form_id}")
    public ResponseEntity<ApiResponse<Form>>    getForm(@AuthenticationPrincipal UserDetailsImpl user,
                                                        @PathVariable(name = "project_id") String projectId,
                                                        @PathVariable("form_id") String formId){
        Form form = formService.getFormById(projectId, user.getId(), formId);

        return ResponseEntity.ok().body(ApiResponse.success("form fetched successfully", form));
    }

    @PostMapping("/{project_id}/forms")
    public  ResponseEntity<ApiResponse<Form>>   createForm(@AuthenticationPrincipal UserDetailsImpl user,
                                                           @PathVariable(name = "project_id") String projectId,
                                                           @Valid @RequestBody CreateFormRequest request){
        Form form = formService.createForm(projectId, user.getId(), request);

        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("form created successfully", form));
    }

    @PutMapping("/{project_id}/forms/{form_id}")
    public ResponseEntity<ApiResponse<Form>>    updateForm(@AuthenticationPrincipal UserDetailsImpl user,
                                                           @PathVariable(name = "project_id") String projectId,
                                                           @Valid @RequestBody CreateFormRequest request,
                                                           @PathVariable("form_id") String formId){
        Form form = formService.updateForm(projectId, user.getId(), formId, request);

        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.success("form updated successfully", form));
    }

    @PatchMapping("/{project_id}/forms/{form_id}")  ResponseEntity<ApiResponse<Form>> patchForm(@AuthenticationPrincipal UserDetailsImpl user,
                                                               @PathVariable("project_id") String projectId,
                                                               @PathVariable("form_id") String formId,
                                                               @Valid @RequestBody PatchFormRequest request)
    {
        Form form = formService.patchForm(projectId, user.getId(), formId, request);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.success("form updated successfully", form));
    }

    @DeleteMapping("/{project_id}/forms/{form_id}")
    public ResponseEntity<ApiResponse<Void>>    deleteForm(@AuthenticationPrincipal UserDetailsImpl user,
                                                           @PathVariable(name = "project_id") String projectId,
                                                           @PathVariable("form_id") String formId){
        formService.deleteForm(projectId, user.getId(), formId);

        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.success("form deleted successfully", null));
    }

    @GetMapping("/{project_id}/forms/{form_id}/submissions")
    public  ResponseEntity<ApiResponse<Page<Submission>>>   getFormSubmissions(@AuthenticationPrincipal UserDetailsImpl user,
                                                                               @PathVariable("project_id") String projectId,
                                                                               @PathVariable("form_id") String formId,
                                                                               @RequestParam(defaultValue = "0")    int page,
                                                                               @RequestParam(defaultValue = "10")   int size
                                                                               ){

        Pageable pageable = PageRequest.of(page, size);

        Page<Submission>    submissions = formService.getAllFormSubmissions(user.getId(), projectId, formId, pageable);

        return ResponseEntity.ok().body(ApiResponse.success("submissions fetched successfully", submissions));
    }

    @GetMapping("/{project_id}/forms/{form_id}/submissions/metadata")
    public ResponseEntity<ApiResponse<SubmissionMetadataResponse>> getSubmissionMetadata(@AuthenticationPrincipal UserDetailsImpl user,
                                                                                          @PathVariable("project_id") String projectId,
                                                                                          @PathVariable("form_id") String formId){
        SubmissionMetadataResponse metadata = formService.getSubmissionMetadata(user.getId(), projectId, formId);

        return ResponseEntity.ok().body(ApiResponse.success("metadata fetched successfully", metadata));
    }

    @GetMapping("/{project_id}/forms/{form_id}/submissions/trend")
    public  ResponseEntity<ApiResponse<SubmissionTrendResponse>>    getSubmissionsTrend(@AuthenticationPrincipal UserDetailsImpl user,
                                                                                        @PathVariable("project_id") String projectId,
                                                                                        @PathVariable("form_id") String formId)
    {
        SubmissionTrendResponse trend = formService.generateSubmissionTrend(user.getId(), projectId, formId);


        return ResponseEntity.ok().body(ApiResponse.success("trend data fetched", trend));
    }

    @GetMapping(value = "/{project_id}/forms/{form_id}/submissions/export", produces = "text/csv")
    public ResponseEntity<StreamingResponseBody>    exportSubmissionsAsCsv(@AuthenticationPrincipal UserDetailsImpl user,
                                                                           @PathVariable("project_id") String projectId,
                                                                           @PathVariable("form_id") String formId)
    {
        StreamingResponseBody body = oStream -> formService.exportSubmissionsCsv(user.getId(), projectId, formId, oStream);

        // TODO: add headers
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=submissions_" + formId  +".csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(body);
    }
}
