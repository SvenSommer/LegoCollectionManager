import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

// Get the Host from Environment or use default
const host = process.env.DB_HOST || 'localhost';

// Get the User for DB from Environment or use default
const user = process.env.DB_USER || 'zulfiqar';

// Get the Password for DB from Environment or use default
const password = process.env.DB_PASS || 'zulfiqar@619';

// Get the Database from Environment or use default
const database = process.env.DB_DATABASE || 'legosorterdb';

//Get the DB PORT
const port = process.env.DB_PORT || 3307;

// Create the connection with required details
const connection = mysql.createPool({
    host,
    user,
    password,
    database,
    port: parseInt(port.toString()),
    multipleStatements: true
});

export default connection;