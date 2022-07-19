const asyncQuery = require('../../helper/asyncQuery')
const insert = require('../../database/mysql/insert')
const deleteRow = require('../../database/mysql/delete')
const updateRow = require('../../database/mysql/update')
const response = require('../../helper/response')
const convertMonth = require('../../helper/convertMonth')
const log = require('../../helper/log')

exports.order = async (req, res) => {
    // desctructuring data
    const {id_pembayaran,id_meja,id_menu,jumlah,catatan} = req.body

    // get data from menu
    const menu = await asyncQuery(`SELECT * FROM menu WHERE id=${id_menu}`)
    
    // chek stock already or nah
    if(menu[0].stock >= jumlah){
        // count harga
        const total = menu[0].harga * jumlah

        // save data
        const data = {
            id_pembayaran,
            id_meja,
            id_menu,
            jumlah,
            catatan,
            total
        }

        // update stock into table menu
        const stock = menu[0].stock - jumlah;
        await asyncQuery(`UPDATE menu set stock=${stock} WHERE id=${id_menu}`)

        // update meja into table meja
        await asyncQuery(`UPDATE meja SET exist=1 WHERE id=${id_meja}`)

        // save data in log
        const id_akun = req.session.user_id;
        log(id_akun,`Menambahkan Pesanan dengan id_pembayaran = ${id_pembayaran}`)

        // save order into database
        insert('pesanan', data, res)

    }else{
        response(res, 404, {"message":"Jumlah Stock Yang di pesan melebihi batas yang tersisa"})
    }

}

exports.deleteOrder = async (req, res) => {
    // GET DATA FROM BODY
    const {id} = req.body

    // GET STOCK FROM TABLE PEMESANAN
    const order = await asyncQuery(`SELECT * FROM pesanan WHERE id=${id}`)
    const menu = await asyncQuery(`SELECT * FROM menu WHERE id=${order[0].id_menu}`)
    const stock = menu[0].stock + order[0].jumlah

    // UPDATE STOCK
    await asyncQuery(`UPDATE menu SET stock=${stock} WHERE id=${order[0].id_menu}`)

    // save data in log
    const id_akun = req.session.user_id;
    log(id_akun,`Menghapus Pesanan dengan id = ${id}`)

    // EXECUTE
    deleteRow('pesanan', 'id', id, res)
}


exports.createPayment = (req, res) => {
    //const id_akun = req.session.user_id
    const id_akun = req.session.user_id;

    // date from order
    const date = new Date()
    let tanggal = date.getDate()
    let bulan = date.getMonth()
        bulan = convertMonth(bulan)
    let tahun = date.getFullYear()

    // save data in object
    const data = {
        id_akun,
        tanggal,
        bulan,
        tahun
    }

    // save data in log
    log(id_akun,`Membuat Order Pesanan`)

    // execute
    insert('pembayaran', data, res)
}

exports.deletePayment = (req, res) => {
    const {id} = req.body

     // save data in log
     const id_akun = req.session.user_id;
     log(id_akun,`Melakukan Cancel Pada Order Pesanan`)

    deleteRow('pembayaran', 'id', id, res)
}

exports.checkout = async (req, res) => {
    // GET DATA
    const {id_pembayaran,bayar} = req.body

    // SUM ORDER TOTAL
    const total = await asyncQuery(`SELECT SUM(total) as result FROM pesanan WHERE id_pembayaran=${id_pembayaran}`)

    // UPDATE INTO TABLE PEMBAYARAN
    await asyncQuery(`UPDATE pembayaran SET total=${total[0].result}, bayar=${bayar} WHERE id=${id_pembayaran}`)

    // BAYAR - TOTAL
    const kembalian = bayar-total[0].result

    // save data in log
    const id_akun = req.session.user_id;
    log(id_akun,`Menyelesaikan Order Pesanan Dengan id_pembayaran = ${id_pembayaran}`)
    
    //SEND RESPONSE
    response(res, 200, {"message":"Berhasil Melakukan Pembayaran",kembalian})    
}

exports.clear = (req, res) => {
    const {id} = req.body

    updateRow('meja',{id,exist:0}, res)
}