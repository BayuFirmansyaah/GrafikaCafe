const resend = require('../../helper/response')
const connection = require('../../config/mysql-connect')

// method update
module.exports = (table, data, res) => {
  let sql = `UPDATE ${table} SET`
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

  // eslint-disable-next-line no-unused-vars
  sql += ' WHERE id=?'
  value.push(data.id)

  // excute
  connection.query(sql, value, (err, rows) => {
    if (err) {
      resend(res,404,{'message':'Gagal Memperbarui Data'})
    } else {
      if( rows.affectedRows > 0){
        resend(res,200,{'message':'Berhasil Memperbarui Data','result':data})
      }else{
        resend(res,404,{'message':'Tidak Ada Data Yang di Perbarui'})
      }
    }
  })

}