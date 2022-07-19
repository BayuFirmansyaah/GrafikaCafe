const sql = require('../../database/mysql/sql')
const getBy = require('../../database/mysql/getBy')
const convertMonth = require('../../helper/convertMonth')
const getCollection = require('../../database/mysql/getCollection') 

exports.menu = (req, res) => {
    const query = `
    SELECT 
        menu.id,
        menu.nama,
        menu.stock,
        jenis.kategori,
        menu.harga,
        menu.thumbnail
    FROM menu INNER JOIN jenis ON 
    menu.id_jenis = jenis.id
    ORDER BY menu.id DESC
    `

    sql(query, res)
}

exports.log = (req, res) => {
    const query = `
    SELECT 
        log.id, 
        akun.name, 
        log.time,
        log.log 
    FROM akun INNER JOIN log ON 
    akun.id = log.id_akun
    ORDER BY log.id DESC
    ;
    `

    sql(query, res)
}

exports.transactionDailyById = (req, res) => {
    // CHANGE TO SESSION
    const id = 1

    const query = `
    SELECT 
        pembayaran.id, 
        akun.name, 
        pembayaran.total,
        pembayaran.tanggal,
        pembayaran.bulan,
        pembayaran.tahun 
    FROM akun INNER JOIN pembayaran ON 
    akun.id = pembayaran.id_akun
    WHERE akun.id=${id}
    ;
    `

    sql(query, res)
}

exports.reportDaily = (req, res) =>{
    let {date, month, year} = req.params    
    month = convertMonth((parseInt(month))-1)

    const query = `
    SELECT 
       * 
    FROM pembayaran 
    INNER JOIN akun ON
    pembayaran.id_akun = akun.id
    WHERE 
        pembayaran.tanggal=${date} AND
        pembayaran.bulan="${month}" AND
        pembayaran.tahun=${year}
    ORDER BY pembayaran.id DESC
    ;
    `

    sql(query, res)
}

exports.reportMonthly = (req, res) =>{
    let {month, year} = req.params    
    month = convertMonth((parseInt(month))-1)


    const query = `
    SELECT 
        * 
    FROM pembayaran 
    INNER JOIN akun ON
    pembayaran.id_akun = akun.id
    WHERE 
        bulan="${month}" AND
        tahun=${year}
    ORDER BY pembayaran.id DESC
    ;
    `

    sql(query, res)
}

exports.transactionMonthlyById = (req, res) => {
    // CHANGE TO SESSION
    const id = 1

    // this month
    // date from order
    const date = new Date()
    let bulan = date.getMonth()
        bulan = convertMonth(bulan)
    let tahun = date.getFullYear()

    const query = `
    SELECT 
        pembayaran.id, 
        akun.name, 
        pembayaran.total,
        pembayaran.tanggal,
        pembayaran.bulan,
        pembayaran.tahun 
    FROM akun INNER JOIN pembayaran ON 
    akun.id = pembayaran.id_akun
    WHERE 
        akun.id=${id} AND 
        pembayaran.bulan="${bulan}" AND
        pembayaran.tahun = "${tahun}"
    ;
    `

    sql(query, res)
}

exports.tableCollection = (req, res) => {
    const {table} = req.params
    const query =`
        SELECT * FROM ${table}
    `

    getCollection(table, res)
}

exports.detailCollection = (req, res) => {
    getBy(req,res)
}

exports.innerJoin = (req, res) => {
    sql(req.body.query,res)
}
