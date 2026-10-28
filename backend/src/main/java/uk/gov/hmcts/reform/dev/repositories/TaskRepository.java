package uk.gov.hmcts.reform.dev.repositories;

import java.util.List;
import java.util.Optional;

import uk.gov.hmcts.reform.dev.models.Task;

public interface TaskRepository {
    Task create(Task task);

    List<Task> findByCaseId(int caseId);

    Task findByTaskId(int caseId, int taskId);

    Optional<Task> findById(int id);

    Optional<Task> update(int id, Task updated);

    boolean delete(int id);
}