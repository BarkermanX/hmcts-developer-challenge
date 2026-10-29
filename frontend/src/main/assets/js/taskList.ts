import MOJFrontend from '@ministryofjustice/frontend';

async function loadTasks(): Promise<void> {
  try {
    const response = await fetch('/get-tasks');

    if (!response.ok) {
      throw new Error('Failed to load tasks');
    }

    const tableMarkup = await response.text();

    const container = document.getElementById('task-list');

    if (!container) {
      throw new Error('Task list container not found');
    }

    container.innerHTML = tableMarkup;
    MOJFrontend.initAll();

  } catch (error: unknown) {
    console.error('Error loading tasks:', error);
  }
}

const button = document.getElementById('load-tasks-button');

button?.addEventListener('click', () => {
  loadTasks();
});