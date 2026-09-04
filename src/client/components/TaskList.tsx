import TaskCard from './TaskCard';

interface Task {
  _id: string;
  title: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
}

interface TaskListProps {
  tasks: Task[];
}

const TaskList = ({ tasks }: TaskListProps) => {
  const columns: Array<'todo' | 'in-progress' | 'done'> = ['todo', 'in-progress', 'done'];
  const safeTasks = Array.isArray(tasks) ? tasks : [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {columns.map((status) => (
        <div key={status} className="card p-4">
          <h2 className="text-lg font-semibold mb-4 capitalize text-slate-700">
            {status.replace('-', ' ')}
          </h2>
          <div className="space-y-3">
            {safeTasks
              .filter((t) => t.status === status)
              .map((task) => (
                <TaskCard key={task._id} task={task} />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
