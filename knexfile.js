const path = require("path");

// Update with your config settings.
/**
* @type { Object.<string, import("knex").Knex.Config> }
*/
module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: path.join(__dirname, "./db.sqlite3"),

    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
  staging: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },
  production: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }
};