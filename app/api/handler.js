'use strict';

const mysql = require('mysql');

module.exports.run = async (_event, _context, callback) => {
  console.log('Request received');
  const response = {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
    body: JSON.stringify({
      records: await collectRecords()
    })
  };
  
  callback(null, response);
}


function collectRecords() {
  const connection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    database: process.env.MYSQL_DB_NAME,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    connectTimeout: 1000
  });
  
  connection.connect();

  return new Promise((resolve, reject) => {
    try {
      connection.query({sql: 'SELECT * FROM `records` ORDER BY `name`, `type`', timeout: 2000}, (error, results) => {
        if (error) {
          console.log('Query error ' + error);
          reject(error);
        }
        resolve(results);
      });
    } catch (error) {
      //
    }
    connection.end();
  });

}


  