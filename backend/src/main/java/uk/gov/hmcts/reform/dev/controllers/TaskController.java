package uk.gov.hmcts.reform.dev.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import static org.springframework.http.ResponseEntity.ok;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

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

    @DeleteMapping(value = "/delete-task/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable("id") String id) {
        int parsedId = parseAndValidateId(id);
        
        taskService.deleteTask(parsedId);
        
        return ResponseEntity.noContent().build();
    }

    /**
     * Validates and converts the path variable string into a 32-bit signed integer.
     * Throws specific API exceptions when data requirements fail.
     */
    private int parseAndValidateId(String id) {
        if (id == null || id.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Task ID is required.");
        }

        String trimmed = id.trim();
        
        // Validate character format using regex
        if (!trimmed.matches("^[+-]?\\d+$")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Task ID must be a valid integer format.");
        }

        try {
            // Parse into a wider container (long) to catch bounds violations
            long parsedValue = Long.parseLong(trimmed);
            
            if (parsedValue < Integer.MIN_VALUE || parsedValue > Integer.MAX_VALUE) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Task ID is out of range for a 32-bit integer.");
            }
            
            return (int) parsedValue;
            
        } catch (NumberFormatException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Task ID overflows numeric limits.");
        }
    }
}
