const { DataSource } = require('typeorm');
const path = require('path');
require('dotenv').config();

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [path.join(__dirname, 'src', '**', '*.entity{.ts,.js}')],
  migrations: [path.join(__dirname, 'src', 'migrations', '*{.ts,.js}')],
  synchronize: false,
  ssl: {
    rejectUnauthorized: false,
    ca: process.env.DB_SSL_CA,
  },
});

module.exports = dataSource;
