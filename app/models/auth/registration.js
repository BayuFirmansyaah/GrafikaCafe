const asyncQuery = require('../../helper/asyncQuery')
const returnMessage = require('../../helper/returnMessage')

module.exports = async (table, data) => {
    try{
        // EXECUTE INSERT DATA
        const result = await asyncQuery(`INSERT INTO ${table} SET ?`, [data])

        // CHEK IF SUCCESS
        if(result.affectedRows){
            return returnMessage('200', 'Berhasil melakukan penambahan akun')
        }
        
        // IF NOT SUCCESS
        return returnMessage('400', 'Terjadi kesalahan ketika proses penambahan akun')

    }catch(err){
        // ERROR
        return returnMessage('400', err.sqlMessage)
    }
}