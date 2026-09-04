interface Task {
  _id: string;
  title: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
}

const priorityColors = {
  low: 'bg-green-100 text-green-700',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-red-100 text-red-700',
};

const TaskCard = ({ task }: { task: Task }) => {
  let daysLeft: number | null = null;
  if (task.dueDate) {
    const timeDiff = new Date(task.dueDate).getTime() - Date.now();
    if (!isNaN(timeDiff)) {
      daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    }
  }

  return (
    <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 hover:border-blue-300 transition-colors">
      <h3 className="font-medium text-slate-900 mb-2">{task.title}</h3>
      <div className="flex items-center gap-2">
        <span className={`text-xs font-semibold px-2 py-1 rounded ${priorityColors[task.priority] || priorityColors.medium}`}>
          {task.priority}
        </span>
        {daysLeft !== null && (
          <span className="text-xs text-slate-500">{daysLeft}d left</span>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
