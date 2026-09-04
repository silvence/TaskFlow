export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
export const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:3001';

export const TASK_PRIORITIES = ['low', 'medium', 'high'] as const;
export const TASK_STATUSES = ['todo', 'in-progress', 'done'] as const;

export const ERROR_MESSAGES = {
  AUTH_FAILED: 'Authentication failed. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  INVALID_INPUT: 'Invalid input. Please check your data.',
};

export const SUCCESS_MESSAGES = {
  TASK_CREATED: 'Task created successfully!',
  TASK_UPDATED: 'Task updated successfully!',
  TASK_DELETED: 'Task deleted successfully!',
};
