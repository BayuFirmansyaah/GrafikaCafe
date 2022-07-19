const bcrypt = require('bcrypt')
const registration = require('../../models/auth/registration')
const response = require('../../helper/response')
const asyncQuery = require('../../helper/asyncQuery')
const checkField = require('../../models/auth/checkField')
const log = require('../../helper/log')

module.exports = async (req, res) => {
    try{
     
        // DESTRUCTURING DATA 
        let {username, password, repeat_password, name, role} = req.body

        // CHEK DATA WHEN EMPTY
        if(!username || !password || !repeat_password || !name || !role){
            return response(res, 404, {'message':'Mohon lengkapi form ini'})
        }

        // CHEK IF PASSWORD DOESN'T MATCH
        if(password !== repeat_password){
           return response(res, 404, {'message':'Password harus sama'})
        }

        // CHEK IF USERNAME ALREADY IN USE
        const usernameReadyInUse = await checkField('akun','username', username)
        
        if(usernameReadyInUse > 0){
            response(res, 404, {'message':'Username Telah digunakan'})
        }else{
            // HASH PASSWORD
            const salt = await bcrypt.genSaltSync(9);
            password = await bcrypt.hashSync(repeat_password, salt);
            
            // EXECUTE 
            const {status, message} = await registration('akun',{username, password, name, role})

            // save data in log
            const id = req.session.user_id;
            log(id,`Membuat Akun Baru`)

            // SEND RESPONSE
            response(res, status, {message})
        }
        
    }catch(err){
        // PROGRAM ERROR
        console.log(err)
        return false
    }
}