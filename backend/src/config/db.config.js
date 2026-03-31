// db.config.js
import mysql from 'mysql2/promise';

// Create a connection pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'shewit',
    password: '212223',
    database: 'online_pharmacy',
});

// Function to execute a query
const query = async (sql, params) => {
    const [results] = await pool.execute(sql, params);
    return results;
};

// Function to execute raw SQL (without preparing)
const executeRaw = async (sql) => {
    const connection = await pool.getConnection();
    try {
        const [results] = await connection.query(sql); // Execute raw SQL
        return results;
    } finally {
        connection.release(); // Always release the connection back to the pool
    }
};

// Named exports
export { query, executeRaw };
