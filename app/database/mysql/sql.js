const resend = require('../../helper/response')
const connection = require('../../config/mysql-connect')

// method sql
module.exports= (sql, res) => {
  connection.query(sql,(err,result,rows) => {
    if (err) {
      resend(res,404,err)
    } else {
      resend(res,200,result)
    }
  })
}
