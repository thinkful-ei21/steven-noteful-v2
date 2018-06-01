'use strict';
 
module.exports = {
  development: {
    client: 'pg',
    connection: process.env.DATABASE_URL ||
    {
      user: 'dev',
      password: 'Fpfmxurc@2',
      database: 'dev'
    }, //(`postgres://${'dev:Fpfmxurc@2@'}localhost/notes`),
    debug: true, // http://knexjs.org/#Installation-debug
    // pool: { min: 1, max: 2 }
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL
  }
};
