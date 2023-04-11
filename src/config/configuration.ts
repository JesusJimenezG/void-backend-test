export default () => ({
  server: {
    url: process.env.URL || 'http://localhost:4000',
    port: process.env.PORT || 4000,
    host: process.env.HOST || '0.0.0.0',
  },
  database: {
    type: process.env.DB_TYPE || 'sql',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'postgres',
    database: process.env.DB_NAME || 'postgres',
  },
  secret: {
    riot_key: process.env.RIOT_API_KEY || 'riot_secret',
  },
});
