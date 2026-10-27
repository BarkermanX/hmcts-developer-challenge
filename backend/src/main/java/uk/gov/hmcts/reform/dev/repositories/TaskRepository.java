package uk.gov.hmcts.reform.dev.repositories;

import uk.gov.hmcts.reform.dev.models.Task;

import java.util.List;
import java.util.Optional;

public interface TaskRepository {
    Task create(Task task);

    List<Task> findByCaseId(int caseId);

    Optional<Task> findById(int id);

    Optional<Task> update(int id, Task updated);

    boolean delete(int id);
}