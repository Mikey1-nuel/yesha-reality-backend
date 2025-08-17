import { getProperties, getProperty, createProperty, deleteProperty } from "../database.js";
// import { db } from "../database.js";

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
