import { db } from '../database.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function insertAdmin(email, plainPassword) {
  try {
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const query = `
      INSERT INTO admins (email, password)
      VALUES (?, ?)
    `;
    const values = [email, hashedPassword];

    const [result] = await db.execute(query, values);
    console.log('Admin inserted with ID:', result.insertId);
    return result;
  } catch (err) {
    console.error('Error inserting admin:', err);
    throw err;
  }
}

export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt:', email);

  try {
    const [rows] = await db.execute('SELECT * FROM admins WHERE email = ?', [email]);
    console.log('DB result:', rows);

    const admin = rows[0];
    if (!admin) {
      console.log('Admin not found');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, admin.password);
    console.log('Password match:', match);

    if (!match) {
      console.log('Password mismatch');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: admin.id, role: 'admin' }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    console.log('Token generated:', token);
    res.json({ token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
};
