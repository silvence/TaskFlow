import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useAuthStore } from '../store/auth';
import { useTaskStore } from '../store/tasks';
import { API_BASE_URL, SOCKET_URL } from '../constants';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import Header from '../components/Header';

const Dashboard = () => {
  const { user, logout, token } = useAuthStore();
  const { setTasks, addTask, updateTask, tasks } = useTaskStore();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { data: tasksData, isError } = useQuery(
    'tasks',
    async () => {
      setIsLoading(true);
      setError(null);
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

        const res = await fetch(`${API_BASE_URL}/api/tasks`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });

        clearTimeout(timeout);

        if (!res.ok) {
          throw new Error(`Failed to fetch tasks: ${res.statusText}`);
        }
        return res.json();
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load tasks';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    { enabled: !!user && !!token, retry: 2, retryDelay: 1000 }
  );

  useEffect(() => {
    if (tasksData && Array.isArray(tasksData)) {
      setTasks(tasksData);
    }
  }, [tasksData, setTasks]);

  // Real-time sync with authenticated socket
  useEffect(() => {
    if (!token || !user) return;

    const socket = new (require('socket.io-client')).io(SOCKET_URL, {
      auth: { token },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    socket.on('connect', () => {
      console.log('Connected to real-time updates');
    });

    socket.on('task:created', (newTask: any) => {
      if (newTask && newTask._id) {
        addTask(newTask);
      }
    });

    socket.on('task:updated', (updatedTask: any) => {
      if (updatedTask && updatedTask._id) {
        updateTask(updatedTask._id, updatedTask);
      }
    });

    socket.on('error', (error: any) => {
      console.error('Socket error:', error);
      setError('Connection error. Some updates may be delayed.');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from real-time updates');
    });

    return () => {
      socket.off('task:created');
      socket.off('task:updated');
      socket.off('error');
      socket.off('connect');
      socket.off('disconnect');
      socket.disconnect();
    };
  }, [token, user, addTask, updateTask]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header user={user} onLogout={logout} />
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 mx-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <main className="max-w-6xl mx-auto px-4 py-8">
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-slate-600">Loading tasks...</div>
          </div>
        )}

        {isError && !isLoading && (
          <div className="text-center py-12">
            <p className="text-red-600">Failed to load tasks. Please try refreshing.</p>
          </div>
        )}

        {!isLoading && !isError && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <TaskList tasks={tasks} />
            </div>
            <div>
              <TaskForm />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
