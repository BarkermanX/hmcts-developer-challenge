package uk.gov.hmcts.reform.dev.services;

import java.util.List;

import org.springframework.stereotype.Service;

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

    public void deleteTask(int taskId) {
        taskRepository.delete(taskId);
    }
}