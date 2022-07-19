const resend = require('../../helper/response')
const connection = require('../../config/mysql-connect')

// method insert data
module.exports = (table, data, res) => {
  let sql = `INSERT INTO ${table} SET`
  const key = Object.keys(data)
  const value = []

  // length to know position or array
  let length = key.length
  length -= 1
  let index

  for (let i = 0; i < key.length; i++) {
    if (key[i] !== 'id' && key[i] !== 'table') {
      // eslint-disable-next-line no-unused-vars
      index = key.indexOf(key[i])
      if (index !== length) {
        sql += ` ${key[i]}=?,`
        value.push(data[key[i]])
      } else {
        sql += ` ${key[i]}=?`
        value.push(data[key[i]])
      }
    }
  }

  let status = null

  // excute
  connection.query(sql, value, (err, result, rows) => {
    if (err) {
      resend(res,404,{'message':'Gagal Menambahkan Data'})
    } else {
      if( result.affectedRows > 0){
        let data_insert = data
            data_insert.id = result.insertId
        resend(res,200,{'message':'Berhasil Menambahkan Data','result':data_insert,'insert':result.affectedRows})
      }else{
        resend(res,404,{'message':'Tidak Ada Data Yang ditambahkan'})
      }
    }
  })
}