import express from 'express';
import { db } from '../database.js';
const router = express.Router();

router.post("/subscribe", async (req, res) => {
  const { email } = req.body;
  await db.query("INSERT INTO newsletter_subscribers (email) VALUES (?)", [email]);
  res.json({ message: "Subscribed successfully!" });
});

export default router;
