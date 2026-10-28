/*
    This class simulates a database providing temporaary instance storage for this demo 
*/

package uk.gov.hmcts.reform.dev.repositories;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

import org.springframework.stereotype.Repository;

import uk.gov.hmcts.reform.dev.models.Task;

@Repository
public class InMemoryTaskRepository implements TaskRepository {
    private final Map<Integer, Task> tasks = new ConcurrentHashMap<>();
    private final AtomicInteger nextId = new AtomicInteger(1);

    @Override
    public Task create(Task task) {
        task.setId(nextId.getAndIncrement());
        tasks.put(task.getId(), task);
        return task;
    }

    @Override
    public List<Task> findByCaseId(int caseId) {
        return tasks.values().stream()
            .filter(task -> task.getCaseId() == caseId)
            .toList();
    }

    @Override
    public Task findByTaskId(int caseId, int taskId) {
    return tasks.values().stream()
        .filter(task -> 
            task.getCaseId() == caseId
            && task.getId() == taskId)
        .findFirst()
        .orElse(null);
}

    @Override
    public Optional<Task> findById(int id) {
        return Optional.ofNullable(tasks.get(id));
    }

    @Override
    public Optional<Task> update(int id, Task updated) {
        updated.setId(id);
        return Optional.ofNullable(tasks.computeIfPresent(id, (key, current) -> updated));
    }

    @Override
    public boolean delete(int id) {
        return tasks.remove(id) != null;
    }
}