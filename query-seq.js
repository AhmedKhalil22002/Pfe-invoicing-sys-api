const mysql = require('mysql2/promise');
require('dotenv').config();

async function run() {
  const connection = await mysql.createConnection({
    host: process.env.DATABASE_HOST || 'localhost',
    user: process.env.DATABASE_USERNAME || 'root',
    password: process.env.DATABASE_PASSWORD || '',
    database: process.env.DATABASE_NAME || 'invoicing',
    port: process.env.DATABASE_PORT || 3306,
  });

  const [rows] = await connection.execute('SELECT * FROM sequences');
  console.log(rows);
  await connection.end();
}
run().catch(console.error);
