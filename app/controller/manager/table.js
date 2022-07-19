const asyncQuery = require('../../helper/asyncQuery')
const insert = require('../../database/mysql/insert')
const response = require('../../helper/response')
const checkField = require('../../models/auth/checkField')
const log = require('../../helper/log')

exports.table = async (req, res) => {
    const {no_meja} = req.body

    // CHEK IF no_meja ALREADY EXIST
    const check_no_meja = await checkField('meja','no_meja',no_meja)

    if(check_no_meja == 0){
        // save data in log
        const id_akun = req.session.user_id;
        log(id_akun,`Menambahkan Nomor Meja`)
        
        insert("meja", {no_meja,exist:0}, res)
    }else{
        response(res, 404, {"message":"no meja sudah ada"})
    }
}