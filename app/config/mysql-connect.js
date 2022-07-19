const mysql = require('mysql2')

// configuration in database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'grafika_cafe'
})

//create connection
connection.connect((err) => {
  if (err) {
    console.log(err)
  } else {
    console.log('Database Connected')
  }
})

module.exports = connection