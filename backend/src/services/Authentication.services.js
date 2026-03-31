import bcrypt from 'bcrypt';
import { query, executeRaw } from '../config/db.config.js'; // Adjusted for named exports
// Ensure .js is included if necessary
// src/services/install.service.js


// Now you can use __dirname as needed

 const register = async (data) => {
  try {
     const { first_name, last_name, email, password, phone, role, license_number } = data;
console.log("Registering user with data:", data);
console.log("Password before hashing:", password);
  const hashedPassword = await bcrypt.hash(password, 10);
console.log("Hashed password:", hashedPassword);
  const result = await query(
   `  INSERT INTO Users 
    (first_name, last_name, email, password_hash, role, phone)
    VALUES (?, ?, ?, ?, ?, ?)`,
    [first_name, last_name, email, hashedPassword, role, phone]
  );

  const userId = result.insertId;

  // If pharmacist register → insert license
  if (role === "pharmacist" && license_number) {
    await db.execute(
     ` INSERT INTO Pharmacists (user_ID, license_number)
       VALUES (?, ?)`,
      [userId, license_number]
    );
  }
  } catch (error) {
    console.error("Error occurred while registering user:", error);
    throw new Error("Failed to register user");
  }
 

  return { message: "User registered successfully" };
};

 const login = async (data) => {
  const { email, password } = data;

  const [rows] = await db.execute(
    "SELECT * FROM Users WHERE email = ?",
    [email]
  );

  if (rows.length === 0) {
    throw new Error("User not found");
  }

  const user = rows[0];

  const match = await bcrypt.compare(password, user.password_hash);

  if (!match) {
    throw new Error("Invalid password");
  }

  return {
    message: "Login successful",
    user: {
      id: user.user_ID,
      email: user.email,
      role: user.role
    }
  };
};
export { register, login };
