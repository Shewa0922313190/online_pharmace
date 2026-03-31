import { executeRaw } from '../config/db.config.js'; 
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function install2() {
    const sqlFilePath = `${__dirname}/sql/schema.sql`;
    let queries = [];
    let finalMessage = { message: '', status: 200 };
    let templien = '';

    // Read SQL file asynchronously
    const sqlFile = await fs.promises.readFile(sqlFilePath, 'utf8');
    
    sqlFile.split('\n').forEach((line) => {
        if (line.trim().startsWith("--") || line.trim() === '') {
            return;
        }

        templien += line;
        if (line.trim().endsWith(";")) {
            const sqlquery = templien.trim();
            queries.push(sqlquery);
            templien = '';
        }
    });

    for (let i = 0; i < queries.length; i++) {
        const sqlquery = queries[i];

        // Handle USE command separately
        if (sqlquery.startsWith("USE")) {
            try {
                await executeRaw(sqlquery); // Use raw execution for USE command
                console.log('Database selected successfully');
            } catch (error) {
                console.error('Error selecting database:', error);
                finalMessage.message = "Database selection failed";
                finalMessage.status = 500;
                break; // Stop execution if there's an error
            }
        } else {
            try {
                await executeRaw(sqlquery); // Execute other SQL commands
                console.log('Table created successfully');
            } catch (error) {
                console.error('Error creating table:', error);
                finalMessage.message = "Not all tables created";
                finalMessage.status = 500;
                break; // Stop execution if there's an error
            }
        }
    }

    if (!finalMessage.message) {
        finalMessage.message = "All tables created successfully";
    }

    return finalMessage;
}

export default { install2 };
