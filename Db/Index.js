import mysql from 'mysql';

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'ecommerce2'
});

export default connection;