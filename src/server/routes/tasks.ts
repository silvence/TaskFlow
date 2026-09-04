import { Router } from 'express';
import { AuthRequest, authenticate } from '../middleware/auth';
import Task from '../models/Task';
import { z } from 'zod';

const router = Router();
router.use(authenticate);

const CreateTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  dueDate: z.string().datetime().optional(),
  tags: z.array(z.string()).optional(),
  projectId: z.string().optional(),
});

const UpdateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  status: z.enum(['todo', 'in-progress', 'done']).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  dueDate: z.string().datetime().optional(),
  tags: z.array(z.string()).optional(),
  projectId: z.string().optional(),
  aiSuggestion: z.string().optional(),
});

router.get('/', async (req: AuthRequest, res) => {
  try {
    const { status, priority } = req.query;
    const query: any = { userId: req.userId };
    if (status) query.status = status;
    if (priority) query.priority = priority;

    const tasks = await Task.find(query).sort({ dueDate: 1 }).populate('assignees');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

router.post('/', async (req: AuthRequest, res) => {
  try {
    const data = CreateTaskSchema.parse(req.body);
    const task = new Task({
      ...data,
      userId: req.userId,
    });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create task' });
  }
});

router.patch('/:id', async (req: AuthRequest, res) => {
  try {
    const data = UpdateTaskSchema.parse(req.body);
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { $set: data },
      { new: true, runValidators: true }
    );
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    res.status(400).json({ error: 'Failed to update task' });
  }
});

router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

export default router;
