import { Router } from 'express';
import { AuthRequest, authenticate } from '../middleware/auth';
import Project from '../models/Project';
import { z } from 'zod';

const router = Router();
router.use(authenticate);

const CreateProjectSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
});

router.get('/', async (req: AuthRequest, res) => {
  try {
    const projects = await Project.find({
      $or: [{ owner: req.userId }, { members: req.userId }],
    }).populate('owner members');
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

router.post('/', async (req: AuthRequest, res) => {
  try {
    const data = CreateProjectSchema.parse(req.body);
    const project = new Project({
      ...data,
      owner: req.userId,
      members: [req.userId],
    });
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create project' });
  }
});

router.patch('/:id', async (req: AuthRequest, res) => {
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, owner: req.userId },
      req.body,
      { new: true }
    );
    if (!project) return res.status(403).json({ error: 'Unauthorized' });
    res.json(project);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update project' });
  }
});

export default router;