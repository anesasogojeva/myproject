const { Sequelize } = require('sequelize');

// Despite the filename (kept to avoid touching every model's import path),
// this connects to Postgres - this project is deployed against Supabase.
//
// Set DATABASE_URL to your Supabase connection string, e.g.:
//   postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
// For local development without Supabase, you can instead run a local
// Postgres and set DATABASE_URL to something like:
//   postgresql://postgres:postgres@localhost:5432/myproject
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    'DATABASE_URL is not set. Add your Supabase (or local Postgres) connection string to backend/.env'
  );
}

const sequelize = new Sequelize(connectionString, {
  dialect: 'postgres',
  dialectOptions: {
    // Supabase requires SSL; set DB_SSL=false only for a local Postgres
    // instance that doesn't have SSL configured.
    ssl: process.env.DB_SSL === 'false' ? false : { require: true, rejectUnauthorized: false },
  },
  logging: process.env.NODE_ENV === 'production' ? false : console.log,
});

module.exports = sequelize;
