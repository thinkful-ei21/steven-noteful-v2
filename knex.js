'use strict';
 
const knexConfig = require('./knexfile');

const environment = process.env.NODE_ENV || 'development';
console.log(process.env.NODE_ENV);

module.exports = require('knex')(knexConfig[environment]);

// const configs = {
// 	development: {
// 		client: 'pg',
// 		connection: process.env.DATABASE_URL || 'postgres://localhost/noteful',
// 		pool: {
// 			min: 1,
// 			max: 2
// 		}
// 	},
// 	production: {
// 		client: 'pg',
// 		connection: process.env.DATABASE_URL,
// 		pool: {
// 			min: 10,
// 			max: 20
// 		}
// 	}
// }
// module.exports = require('knex')(configs[process.env.NODE_EVN]);
