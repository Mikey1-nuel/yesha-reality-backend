import express from "express";
import path from "path";
import multer from "multer";
import {
  fetchProperties,
  fetchProperty,
  createNewProperty,
  updateProperty,
  deleteAProperty,
  addAmenitiesToProperty,
  getAmenitiesForProperty
} from "../controllers/propertyController.js";

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

//get all properties
router.get("/", fetchProperties);

//get a single property
router.get("/:id", fetchProperty);

//Create new property
router.post("/", upload.single("image"), createNewProperty);

//update a single property
router.put("/:id", updateProperty);

//delete a single property
router.delete("/:id", deleteAProperty);

router.post("/:id/amenities", addAmenitiesToProperty);
router.get("/:id/amenities", getAmenitiesForProperty);

export default router;
