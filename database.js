import mysql from "mysql2";
import dotenv from "dotenv";
import { sendEmail } from "./middleware/sendEmail.js";
dotenv.config();

export const db = mysql
  .createPool({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    port: Number(process.env.MYSQLPORT),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  })
  .promise();

console.log(
  "Connected to MySQL pool at:",
  process.env.MYSQLHOST,
  process.env.MYSQLPORT,
  process.env.MYSQLDATABASE
);

// Route to get all properties
export async function getProperties() {
  const [rows] = await db.query("SELECT * FROM properties");
  return rows;
}

export async function getProperty(id) {
  const [rows] = await db.query(
    `
        SELECT * 
        from properties
        WHERE id = ?
        `,
    [id]
  );
  return rows[0];
}

export async function createProperty(
  estate,
  landSize,
  bedroom,
  filename,
  houseType,
  price,
  location,
  featured = false
) {
  const imagePath = filename; // full Cloudinary URL

  const sql = `
    INSERT INTO properties (
      estate, landSize, bedroom, image, houseType, price, location, featured
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    estate,
    landSize,
    bedroom,
    imagePath,
    houseType,
    price,
    location,
    featured,
  ];

  const [result] = await db.query(sql, values);

  return {
    message: "Property added successfully",
    id: result.insertId,
    estate,
    landSize,
    bedroom,
    image: imagePath,   // ✅ correct variable
    houseType,
    price,
    location,
    featured,           // ✅ use the parameter directly
  };
}

export async function updateProperty(id) {
  const [rows] = await db.query(
    `
        SELECT * 
        from properties
        WHERE id = ?
        `,
    [id]
  );
  return rows[0];
}

export async function deleteProperty(id) {
  const [result] = await db.query("DELETE FROM properties WHERE id = ?", [id]);
  return result;
}

// Route to get all agents
export async function getAllAgents() {
  const [rows] = await db.query("SELECT * FROM agents");
  return rows;
  //   const [rows] = await db.query(
  //   'SELECT * FROM properties WHERE id = ?',
  //   [id]
  // );
}

export async function getAgent(id) {
  const [rows] = await db.query(
    `
        SELECT * 
        from agents
        WHERE id = ?
        `,
    [id]
  );
  return rows[0];
}

export async function createAgent(
  fullName,
  email,
  phoneNumber,
  gender,
  state,
  experience,
  agency,
  bio,
  filename,
  password
) {
  // const imagePath = `/uploads/${filename}`;
  const imagePath = filename; // this will now be full Cloudinary URL

  const sql = `
  INSERT INTO agents (
    fullName, email, phoneNumber, gender, state,
    experience, agency, bio, image, password
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
`;

  const values = [
    fullName,
    email,
    phoneNumber,
    gender,
    state,
    experience,
    agency,
    bio,
    imagePath,
    password,
  ];

  const [result] = await db.query(sql, values);
  return { message: "Agent added successfully", id: result.insertId };
}

export async function updateAgent(id) {
  const [rows] = await db.query(
    `
        SELECT * 
        from agents
        WHERE id = ?
        `,
    [id]
  );
  return rows[0];
}

export async function deleteAgent(id) {
  const [result] = await db.query("DELETE FROM agents WHERE id = ?", [id]);
  return result;
}

export async function notifySubscribers(property) {
  const [subscribers] = await db.query("SELECT email FROM newsletter_subscribers");

  for (const { email } of subscribers) {
    await sendEmail({
      to: email,
      subject: `New Property Added: ${property.estate}`,
      text: `Check out our latest listing!\n\nEstate: ${property.estate}\nLocation: ${property.location}\nPrice: ${property.price}\n\nView more details here: ${property.image}`,
    });
  }
}

