package uk.gov.hmcts.reform.dev.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import static org.springframework.http.ResponseEntity.ok;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import uk.gov.hmcts.reform.dev.models.Task;
import uk.gov.hmcts.reform.dev.services.TaskService;

@RestController
public class TaskController {
    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping(value = "/get-task-list", produces = "application/json")
    public ResponseEntity<List<Task>> getTaskList(@RequestParam(name = "caseId", defaultValue = "1") int caseId) {
        return ok(taskService.getTaskList(caseId));
    }
}
