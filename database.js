import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

// MySQL connection
export const db = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQL_PORT
}).promise();
console.log("Connecting to MySQL at:", process.env.MYSQL_HOST, process.env.MYSQL_PORT, process.env.MYSQL_DATABASE);

db.connect((err) => {
  if (err) throw err;
  console.log("MySQL connected");
});

// Route to get all properties
export async function getProperties() {
  const [rows] = await db.query('SELECT * FROM properties');
  return rows;
}

export async function getProperty(id) {
    const [rows] = await db.query(`
        SELECT * 
        from properties
        WHERE id = ?
        `, [id]);
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
  // const imagePath = `/uploads/${filename}`;
  const imagePath = `/uploads/${filename}`;

  // const sql = `
  //   INSERT INTO properties (estate, landSize, bedroom, image, houseType, price, location, featured)
  //   VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  // `;

  const sql = `
  INSERT INTO properties (estate, landSize, bedroom, image, houseType, price, location, featured)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
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
  return { message: "Property added successfully", id: result.insertId };
}

export async function updateProperty(id) {
    const [rows] = await db.query(`
        SELECT * 
        from properties
        WHERE id = ?
        `, [id]);
    return rows[0];
}

export async function deleteProperty(id) {
  const [result] = await db.query(
    "DELETE FROM properties WHERE id = ?",
    [id]
  );
  return result;
}

// Route to get all agents
export async function getAllAgents() {
  // const [rows] = await db.query('SELECT * FROM agents');
  // return rows;
  const [rows] = await db.query(
  'SELECT * FROM properties WHERE id = ?',
  [id]
);
}

export async function getAgent(id) {
    const [rows] = await db.query(`
        SELECT * 
        from agents
        WHERE id = ?
        `, [id]);
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
    filename,
    password,
) {
  const imagePath = `/uploads/${filename}`;

  const sql = `
    INSERT INTO agents (fullName, email, phoneNumber, gender, state, experience, agency, image, password)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    fullName,
    email,
    phoneNumber,
    gender,
    state,
    experience,
    agency,
    imagePath,
    password,
  ];

  const [result] = await db.query(sql, values);
  return { message: "Agent added successfully", id: result.insertId };
}

export async function updateAgent(id) {
    const [rows] = await db.query(`
        SELECT * 
        from agents
        WHERE id = ?
        `, [id]);
    return rows[0];
}

export async function deleteAgent(id) {
  const [result] = await db.query(
    "DELETE FROM agents WHERE id = ?",
    [id]
  );
  return result;
}
