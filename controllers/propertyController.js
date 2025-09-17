import { getProperties, getProperty, createProperty, deleteProperty } from "../database.js";
import { db } from "../database.js";

//@desc Get all properties
//@route GET /properties
export async function fetchProperties(req, res) {
  try {
    const properties = await getProperties();
    res.json(properties);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

//@desc Get a property
//@route GET /properties/:id
export const fetchProperty = async (req, res, next) => {
  const id = parseInt(req.params.id);
  const property = await getProperty(id);

  if (!property) {
       const error = new Error(`A property with the id of ${id} was not found `);
       error.status = 404;
       return next(error);
    }

  res.status(200).json(property);
};

//@desc create new property
//@route POST /properties
export const createNewProperty = async (req, res, next) => {
  try {
    const {
      estate,
      landSize,
      bedroom,
      houseType,
      price,
      location,
      featured,
    } = req.body;

    const filename = req.file.filename;

    // Convert string "true"/"false" to actual boolean
    const isFeatured = featured === 'true' || featured === true;

    // Save to DB using your helper function
    const result = await createProperty(
      estate,
      landSize,
      bedroom,
      filename,
      houseType,
      price,
      location,
      isFeatured // ✅ use the parsed boolean
    );

    res.status(201).json(result);
    console.log("Uploaded file name:", req.file.filename);
  } catch (err) {
    const error = new Error(`The ${err.message}`);
    error.status = 400;
    return next(error);
  }
};

export const updateProperty = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  // Validate ID
  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ error: "Invalid property ID" });
  }

  // Validate update payload
  if (!updates || Object.keys(updates).length === 0) {
    return res.status(400).json({ error: "No update fields provided" });
  }

  try {
    // Check if property exists
    const [existing] = await db.query("SELECT * FROM properties WHERE id = ?", [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: "Property not found" });
    }

    // Define allowed fields for update
    const allowedFields = [
      "estate",
      "landSize",
      "bedroom",
      "image",
      "houseType",
      "price",
      "location",
      "featured"
    ];

    // Filter and sanitize updates
    const filteredUpdates = Object.entries(updates)
      .filter(([key]) => allowedFields.includes(key))
      .map(([key, value]) => {
        if (key === "featured") {
          return [key, value === true || value === "true" || value === 1 ? 1 : 0];
        }
        return [key, value];
      });

    if (filteredUpdates.length === 0) {
      return res.status(400).json({ error: "No valid fields to update" });
    }

    const fields = filteredUpdates.map(([key]) => `${key} = ?`).join(", ");
    const values = filteredUpdates.map(([_, value]) => value);

    await db.query(`UPDATE properties SET ${fields} WHERE id = ?`, [...values, id]);

    const [updated] = await db.query("SELECT * FROM properties WHERE id = ?", [id]);
    res.json(updated[0]);
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: "Failed to update property" });
  }
};

//@desc Delete a property
//@route DELETE /properties/:id
export const deleteAProperty = async (req, res, next) => {
  const id = parseInt(req.params.id);

  try {
    const result = await deleteProperty(id);

    if (result.affectedRows === 0) {
      const error = new Error(`A property with the id of ${id} was not found`);
      error.status = 404;
      return next(error);
    }

    res.status(200).json({ message: "Property deleted successfully" });
  } catch (err) {
    const error = new Error(`Failed to delete property: ${err.message}`);
    error.status = 500;
    return next(error);
  }
};

// POST /properties/:id/amenities
export const addAmenitiesToProperty = async (req, res) => {
  const { id } = req.params;
  const { amenities } = req.body; // array of strings

  if (!Array.isArray(amenities) || amenities.length === 0) {
    return res.status(400).json({ error: "Amenities must be a non-empty array" });
  }

  try {
    const [property] = await db.query("SELECT * FROM properties WHERE id = ?", [id]);
    if (property.length === 0) {
      return res.status(404).json({ error: "Property not found" });
    }

    for (const name of amenities) {
      const trimmed = name.trim();
      if (!trimmed) continue;

      // Insert amenity if it doesn't exist
      const [existing] = await db.query("SELECT * FROM amenities WHERE name = ?", [trimmed]);
      let amenityId;

      if (existing.length === 0) {
        const result = await db.query("INSERT INTO amenities (name) VALUES (?)", [trimmed]);
        amenityId = result[0].insertId;
      } else {
        amenityId = existing[0].id;
      }

      // Link to property
      await db.query(
        "INSERT IGNORE INTO property_amenities (property_id, amenity_id) VALUES (?, ?)",
        [id, amenityId]
      );
    }

    res.status(200).json({ message: "Amenities added successfully" });
  } catch (err) {
    console.error("Amenity update error:", err);
    res.status(500).json({ error: "Failed to add amenities" });
  }
};

// GET /properties/:id/amenities
export const getAmenitiesForProperty = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query(
      `
      SELECT a.name
      FROM amenities a
      JOIN property_amenities pa ON a.id = pa.amenity_id
      WHERE pa.property_id = ?
      `,
      [id]
    );

    res.json(rows.map((row) => row.name));
  } catch (err) {
    console.error("Fetch amenities error:", err);
    res.status(500).json({ error: "Failed to fetch amenities" });
  }
};
