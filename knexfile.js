// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    connection: {
      database: 'express_twitter_clone',
      username: 'amirsalar',
      password: '7036',
    },
    migrations: {
      directory: './db/migrations'
    }
  },

};
