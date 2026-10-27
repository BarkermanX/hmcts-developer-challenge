package uk.gov.hmcts.reform.dev;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import uk.gov.hmcts.reform.dev.models.Task;
import uk.gov.hmcts.reform.dev.repositories.TaskRepository;

import java.time.LocalDateTime;

@Component
public class TaskDataSeeder implements CommandLineRunner {
    private final TaskRepository taskRepository;

    public TaskDataSeeder(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @Override
    public void run(String... args) {
        int caseId = 1;

        if (!taskRepository.findByCaseId(caseId).isEmpty()) {
            return;
        }

        taskRepository.create(new Task(
            0, caseId, "Review case documents",
            "Check the submitted documents for completeness.",
            "Not started", LocalDateTime.now().plusDays(2)
        ));

        taskRepository.create(new Task(
            0, caseId, "Contact the applicant",
            "Request any missing information.",
            "In progress", LocalDateTime.now().plusDays(5)
        ));
    }
}