package uk.gov.hmcts.reform.dev.services;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import uk.gov.hmcts.reform.dev.models.Task;
import uk.gov.hmcts.reform.dev.repositories.TaskRepository;

@Service
public class TaskService {
    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public List<Task> getTaskList(int caseId) {
        return taskRepository.findByCaseId(caseId);
    }

    public Task getTaskById(int caseId, int taskId) {
        return taskRepository.findByTaskId(caseId, taskId);
    }

    public Task createTask(Task task) {
        // Validate the Task Object
        if (task.getCaseId() < 1) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "A valid case ID is required."
            );
        }

        if (task.getTitle() == null || task.getTitle().isBlank()) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Task title is required."
            );
        }

        if (task.getDescription() == null || task.getDescription().isBlank()) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Task description is required."
            );
        }

        if (task.getDueDate() == null) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Task due date is required."
            );
        }

        String statusDescription = switch (task.getStatusCode()) {
            case "0001" -> "Not started";
            case "0002" -> "In progress";
            case "0003" -> "On hold";
            case "0004" -> "Complete";
            default -> null;
        };

        if (statusDescription == null) {
            throw new IllegalArgumentException("Task status code is invalid.");
        }

        task.setStatus(statusDescription);

        return taskRepository.create(task);
    }

    public boolean deleteTask(int taskId) {
        return taskRepository.delete(taskId);
    }

    public Task updateTask(int id, String newStatus) {
        Task objTask = getTaskById(1, id);
        
        String strNewStatusDescription = switch (newStatus) {
            case "0001" -> "Not started";
            case "0002" -> "In progress";
            case "0003" -> "On hold";
            case "0004" -> "Complete";
            default -> null; 
        };

        if (strNewStatusDescription == null) {
            return objTask;
        }

        objTask.setStatusCode(newStatus);
        objTask.setStatus(strNewStatusDescription);

        taskRepository.update(id, objTask);

        return objTask;
    }
}