'use strict';

const aws = require('aws-sdk');
const mysql = require('mysql');
const route53 = new aws.Route53();

module.exports.run = async () => {
  console.log('Updating records');
  const connection = openDatabaseConnection();
  try {
    await clearExistingRecords(connection);
    const records = await collectRecords();
    await Promise.all(records.map((record) => writeRecord(connection, record)));
    console.log(records.length + ' record(s) created');
  } catch (error) {
    console.log("Unable to write records " + error);
  }
  return connection.end();
}

function openDatabaseConnection() {
  const connection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    database: process.env.MYSQL_DB_NAME,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD
  });
   
  connection.connect();
  return connection;
}

async function collectRecords() {
  console.log('Collect records from Route53');
  const zones = await route53.listHostedZones({}).promise();
  const zoneDetails = await Promise.all(zones.HostedZones.map((zone) => {
    return route53.listResourceRecordSets({HostedZoneId:zone.Id}).promise()
  }));
  
  return zoneDetails.reduce((acc, zn) => acc.concat(zn.ResourceRecordSets),[]);
}

function clearExistingRecords(connection) {
  console.log('Purging existing records');
  return new Promise((resolve) => connection.query('DELETE FROM records', () => resolve()));
}

function writeRecord(connection, record) {
  console.log("Writing record:\n\t" + JSON.stringify(record));
  
  return new Promise((resolve) => {
    connection.query(
      'INSERT INTO records (`type`, `name`, `value`, `ttl`) VALUES (?, ?, ?, ?)',
      [record.Type, record.Name, record.ResourceRecords.map((v) => v.Value).join("\n"), record.TTL],
      () => resolve()
    )
  });
}

