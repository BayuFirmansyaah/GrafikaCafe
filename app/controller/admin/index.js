const bcrypt = require('bcrypt')
const update = require('../../database/mysql/update')
const deleteRow = require('../../database/mysql/delete') 
const checkField = require('../../models/auth/checkField')
const log = require('../../helper/log')
const response = require('../../helper/response')
const asyncQuery = require('../../helper/asyncQuery')


exports.updateAccount = async (req, res) => {
    // DESCTRUCTURING
    let {id,username,password,repeat_password,name,role} = req.body
    
    if(password == null && repeat_password == null ){
        // IF COLUMN FIELD NULL
        return response(res, 404, {'message':'Kolom Password Harus di isi semua '})
    }else{
        // CHEK IF PASSWORD DOESN'T MATCH
        if(password !== repeat_password){
            return response(res, 404, {'message':'Password harus sama'})
        }

        // ENCRYPTION PASSWORD
        const salt = await bcrypt.genSaltSync(9);
        password = await bcrypt.hashSync(repeat_password, salt);


        // CEK USERNAME 
        const data = asyncQuery(`SELECT * FROM akun WHERE id=${id}`)
        
        data.then( async (identity)=>{ 
            if(identity[0].username === username ){
                // IF USERNAME NOT CHANGE
                // EXECUTE
                executeUpdate({id, username, password, name, role}, res)
            }else{
                // IF USERNAME CHANGE
                // CHEK IF USERNAME ALREADY IN USE
                const usernameReadyInUse = await checkField('akun','username', username)
    
                if(usernameReadyInUse > 0){
                    // IF USERNAME AL READY
                    response(res, 404, {'message':'Username Telah digunakan'})
                }else{
                    // IF USERNAME NOT USED
                    // EXECUTE
                    executeUpdate({id, username, password, name, role}, res)
                }
            }
        })

    }

}

const executeUpdate = (data, res) => {
    update('akun', data, res)
}

exports.deleteAccount = (req, res) => {
    const {id} = req.body


    deleteRow('akun', 'id', id, res)
}