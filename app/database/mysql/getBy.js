const resend = require('../../helper/response')
const connection = require('../../config/mysql-connect')

// method get data by field
module.exports = (req, res) => {
  connection.query(`SELECT * FROM ${req.params.table} WHERE ${req.params.field}='${req.params.value}'`, (err, result, field) => {
    if (err) {
      resend(res,404,err)
    }else{
      resend(res,200,result)
    }
  })
}