import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { useAuthStore } from '../store/auth';
import { useTaskStore } from '../store/tasks';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import Header from '../components/Header';

const Dashboard = () => {
  const { user, logout } = useAuthStore();
  const { setTasks, tasks } = useTaskStore();
  const { data: tasksData } = useQuery(
    'tasks',
    async () => {
      const res = await fetch('http://localhost:3001/api/tasks', {
        headers: { Authorization: `Bearer ${useAuthStore.getState().token}` },
      });
      return res.json();
    },
    { enabled: !!user }
  );

  useEffect(() => {
    if (tasksData) setTasks(tasksData);
  }, [tasksData, setTasks]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header user={user} onLogout={logout} />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <TaskList tasks={tasks} />
          </div>
          <div>
            <TaskForm />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;