import { useState } from 'react';
import { useTaskStore } from '../store/tasks';
import { API_BASE_URL } from '../constants';
import { sanitizeInput } from '../utils/sanitize';
import useApi from '../hooks/useApi';

const TaskForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { addTask } = useTaskStore();
  const api = useApi();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const sanitizedTitle = sanitizeInput(title);
    if (!sanitizedTitle.trim()) {
      setError('Task title cannot be empty');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const newTask = await api.post(`${API_BASE_URL}/api/tasks`, {
        title: sanitizedTitle,
        description: sanitizeInput(description),
        priority,
      });

      addTask(newTask);
      setTitle('');
      setDescription('');
      setPriority('medium');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create task';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-6">
      <h2 className="text-xl font-bold mb-4 text-slate-900">New Task</h2>
      {error && <div className="bg-red-50 text-red-600 p-2 rounded mb-4 text-sm">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          disabled={loading}
          maxLength={100}
        />
        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="resize-none"
          disabled={loading}
          maxLength={500}
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as any)}
          disabled={loading}
        >
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? 'Creating...' : 'Create Task'}
        </button>
      </form>
    </div>
  );
};

export default TaskForm;
