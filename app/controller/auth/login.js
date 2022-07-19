const session = require('express-session')
const response = require('../../helper/response')
const login = require('../../models/auth/login')
const log = require('../../helper/log')

module.exports = async (req, res) => {
    try{
        // DESCTRUCTURING DATA
        const {username, password} = req.body

        // CHECK WHEN DATA EMPTY
        if(!username || !password){
            return response(res, 404, {'message':'Mohon lengkapi form ini'})
        }

        // EXECUTE LOGIN
        const user = await login('akun', 'username', {username, password})
        
        // CHEK IF SUCCESS
        if(user.status === 200){
            // save data in log
            log(user.data.user_id,`Login Akun`)
            
            // save data in session
            req.session.user_id = user.data.user_id
            req.session.user_role = user.data.user_role
            req.session.save()

            // redirect by role
            const role = user.data.user_role

            if(role === 1){
                response(res, 200, {path: 'manager'})
            }else if(role === 2 ){
                response(res, 200, {path: 'admin'})
            }else{
                response(res, 200, {path: 'kasir'})
            }
        }else{
            response(res, 404, user)
        }
    }catch(err){
        console.log(err)
        response(res, 500,{'message': 'Terjadi kesalahan yang tidak diketahui ketika proses login'})
    }
}