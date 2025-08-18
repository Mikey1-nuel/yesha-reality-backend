// import mysql from "mysql2";
// import dotenv from "dotenv";
// dotenv.config();

// // MySQL connection
// export const db = mysql.createConnection({
//   host: process.env.MYSQL_HOST,
//   user: process.env.MYSQL_USER,
//   password: process.env.MYSQL_PASSWORD,
//   database: process.env.MYSQL_DATABASE,
//   port: process.env.MYSQL_PORT
// }).promise();
// console.log("Connecting to MySQL at:", process.env.MYSQL_HOST, process.env.MYSQL_PORT, process.env.MYSQL_DATABASE);

// db.connect((err) => {
//   if (err) throw err;
//   console.log("MySQL connected");
// });

// // Route to get all properties
// export async function getProperties() {
//   const [rows] = await db.query('SELECT * FROM properties');
//   return rows;
// }

// export async function getProperty(id) {
//     const [rows] = await db.query(`
//         SELECT * 
//         from properties
//         WHERE id = ?
//         `, [id]);
//     return rows[0];
// }

// export async function createProperty(
//   estate,
//   landSize,
//   bedroom,
//   filename,
//   houseType,
//   price,
//   location,
//   featured = false
// ) {
//   // const imagePath = `/uploads/${filename}`;
//   const imagePath = `/uploads/${filename}`;

//   // const sql = `
//   //   INSERT INTO properties (estate, landSize, bedroom, image, houseType, price, location, featured)
//   //   VALUES (?, ?, ?, ?, ?, ?, ?, ?)
//   // `;

//   const sql = `
//   INSERT INTO properties (estate, landSize, bedroom, image, houseType, price, location, featured)
//   VALUES (?, ?, ?, ?, ?, ?, ?, ?)
// `;

//   const values = [
//     estate,
//     landSize,
//     bedroom,
//     imagePath,
//     houseType,
//     price,
//     location,
//     featured,
//   ];

//   const [result] = await db.query(sql, values);
//   return { message: "Property added successfully", id: result.insertId };
// }

// export async function updateProperty(id) {
//     const [rows] = await db.query(`
//         SELECT * 
//         from properties
//         WHERE id = ?
//         `, [id]);
//     return rows[0];
// }

// export async function deleteProperty(id) {
//   const [result] = await db.query(
//     "DELETE FROM properties WHERE id = ?",
//     [id]
//   );
//   return result;
// }

// // Route to get all agents
// export async function getAllAgents() {
//   // const [rows] = await db.query('SELECT * FROM agents');
//   // return rows;
//   const [rows] = await db.query(
//   'SELECT * FROM properties WHERE id = ?',
//   [id]
// );
// }

// export async function getAgent(id) {
//     const [rows] = await db.query(`
//         SELECT * 
//         from agents
//         WHERE id = ?
//         `, [id]);
//     return rows[0];
// }

// export async function createAgent(
//   fullName,
//     email,
//     phoneNumber,
//     gender,
//     state,
//     experience,
//     agency,
//     filename,
//     password,
// ) {
//   const imagePath = `/uploads/${filename}`;

//   const sql = `
//     INSERT INTO agents (fullName, email, phoneNumber, gender, state, experience, agency, image, password)
//     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
//   `;

//   const values = [
//     fullName,
//     email,
//     phoneNumber,
//     gender,
//     state,
//     experience,
//     agency,
//     imagePath,
//     password,
//   ];

//   const [result] = await db.query(sql, values);
//   return { message: "Agent added successfully", id: result.insertId };
// }

// export async function updateAgent(id) {
//     const [rows] = await db.query(`
//         SELECT * 
//         from agents
//         WHERE id = ?
//         `, [id]);
//     return rows[0];
// }

// export async function deleteAgent(id) {
//   const [result] = await db.query(
//     "DELETE FROM agents WHERE id = ?",
//     [id]
//   );
//   return result;
// }

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
});

console.log("Connecting to MySQL at:", process.env.MYSQL_HOST, process.env.MYSQL_PORT, process.env.MYSQL_DATABASE);
console.log("Connecting to MySQL at:", process.env.MYSQLHOST, process.env.MYSQLPORT, process.env.MYSQL_DATABASE);

db.connect((err) => {
  if (err) throw err;
  console.log("MySQL connected");
});

// Get all properties
export function getProperties(callback) {
  db.query("SELECT * FROM properties", (err, results) => {
    if (err) return callback(err);
    callback(null, results);
  });
}

// Get a single property
export function getProperty(id, callback) {
  db.query("SELECT * FROM properties WHERE id = ?", [id], (err, results) => {
    if (err) return callback(err);
    callback(null, results[0]);
  });
}

// Create a new property
export function createProperty(estate, landSize, bedroom, filename, houseType, price, location, featured = false, callback) {
  const imagePath = `/uploads/${filename}`;
  const sql = `
    INSERT INTO properties (estate, landSize, bedroom, image, houseType, price, location, featured)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [estate, landSize, bedroom, imagePath, houseType, price, location, featured];

  db.query(sql, values, (err, result) => {
    if (err) return callback(err);
    callback(null, { message: "Property added successfully", id: result.insertId });
  });
}

// Update a property (fetch for editing)
export function updateProperty(id, callback) {
  db.query("SELECT * FROM properties WHERE id = ?", [id], (err, results) => {
    if (err) return callback(err);
    callback(null, results[0]);
  });
}

// Delete a property
export function deleteProperty(id, callback) {
  db.query("DELETE FROM properties WHERE id = ?", [id], (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
}

// Get all agents
export function getAllAgents(callback) {
  db.query("SELECT * FROM agents", (err, results) => {
    if (err) return callback(err);
    callback(null, results);
  });
}

// Get a single agent
export function getAgent(id, callback) {
  db.query("SELECT * FROM agents WHERE id = ?", [id], (err, results) => {
    if (err) return callback(err);
    callback(null, results[0]);
  });
}

// Create a new agent
export function createAgent(fullName, email, phoneNumber, gender, state, experience, agency, filename, password, callback) {
  const imagePath = `/uploads/${filename}`;
  const sql = `
    INSERT INTO agents (fullName, email, phoneNumber, gender, state, experience, agency, image, password)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [fullName, email, phoneNumber, gender, state, experience, agency, imagePath, password];

  db.query(sql, values, (err, result) => {
    if (err) return callback(err);
    callback(null, { message: "Agent added successfully", id: result.insertId });
  });
}

// Update an agent (fetch for editing)
export function updateAgent(id, callback) {
  db.query("SELECT * FROM agents WHERE id = ?", [id], (err, results) => {
    if (err) return callback(err);
    callback(null, results[0]);
  });
}

// Delete an agent
export function deleteAgent(id, callback) {
  db.query("DELETE FROM agents WHERE id = ?", [id], (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
}
