import express from "express";
import path from "path";
import multer from "multer";
import { fetchAgents, fetchAgent, createNewAgent, deleteAnAgent } from "../controllers/agentController.js";

const router = express.Router();
// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const sanitized = file.originalname.replace(/\s+/g, "-").toLowerCase();
    const uniqueName = Date.now() + "-" + sanitized;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

//get all agents
router.get("/", fetchAgents);

//get a single agent
router.get("/:id", fetchAgent);

//Create new agent
router.post("/", upload.single("image"), createNewAgent);

//delete a single agent
router.delete("/:id", deleteAnAgent);

export default router;
