import express from 'express';
import { insertAdmin, loginAdmin } from '../controllers/adminController.js';
const router = express.Router();

router.post('/insert', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const result = await insertAdmin(email, password);
    res.status(201).json({ message: 'Admin created', result });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create admin' });
  }
});

router.post('/login', loginAdmin);

export default router;
