const response = require('../../helper/response')
const insert = require('../../database/mysql/insert')
const update = require('../../database/mysql/update')
const deleteRow = require('../../database/mysql/delete')
const checkField = require('../../models/auth/checkField')
const log = require('../../helper/log')
const path = require('path')
const asyncQuery = require('../../helper/asyncQuery')

// Menu Controller
exports.addMenu = async (req, res) => {
    let {nama,stock,id_jenis,harga} = req.body
    
    // parse data
    stock = parseInt(stock)
    id_jenis = parseInt(id_jenis)
    harga = parseInt(harga)
    
    console.log(req.body)

    // get date
    const date = Date.now()

    // file thumbnail
    let file = await req.files.thumbnail 
    let thumbnail = await file.name
        thumbnail = await `${date}.png`
        thumbnail = thumbnail.toString()

    console.log(file)

    // path
    let path_file = path.join(__dirname, '../../../public/img/thumbnail/')
    
    // upload file
    file.mv(path_file+thumbnail, (err) => {
        if(err){
            console.log("error :",err)
        }
    })

    // save data in log
    const id_akun = req.session.user_id;
    
    log(id_akun,`Menambahkan Menu Baru`)

    // insert('menu',{nama,stock,id_jenis,harga,thumbnail},res)

    await asyncQuery(`INSERT INTO menu SET ?`,{nama,stock,id_jenis,harga,thumbnail})

    res.redirect('/manager/menu')
}

exports.updateMenu = async (req, res) => {
    const {id, nama, stock, id_jenis, harga} = req.body
  
    // save data in log
    const id_akun = req.session.user_id;
    log(id_akun,`Memperbarui Data Menu Dengan id = ${id}`)

    // update('menu',{id, nama, stock, id_jenis, harga},res)

    await asyncQuery(`
        UPDATE menu SET 
            nama="${nama}",
            stock=${stock},
            id_jenis=${id_jenis},
            harga=${harga}
        WHERE id=${id}
    `)

    res.redirect('/manager/menu')
}

exports.deleteMenu = (req, res) => {
    const {id} = req.body

     // save data in log
     const id_akun = req.session.user_id;
     log(id_akun,`Menghapus Data Menu Dengan id = ${id}`)

    deleteRow('menu', 'id', id, res)
}


// Menu Type
exports.addMenuType = async (req, res) => {
    const {type_name} = req.body   
    const checkNameTypeMenu = await checkField('jenis','nama',type_name)

    if(checkNameTypeMenu == 0){
        // save data in log
        const id_akun = req.session.user_id;
        log(id_akun,`Menambahkan Jenis Menu Baru`)
        
        insert('jenis',{ketegori:type_name},res)
    }else{
        return response(res,404,{"msg":"Jenis menu yang anda buat sudah ada"})
    }
}

exports.updateMenuType = async (req, res) => {
    const {id, type_name} = req.body
    const checkNameTypeMenu = await checkField('jenis','nama',type_name)

    if(checkNameTypeMenu == 0){
        // save data in log
        const id_akun = req.session.user_id;
        log(id_akun,`Memperbarui Jenis Menu dengan id = ${id}`)
        
        update('jenis', {id, kategori:type_name}, res)
    }else{
        return response(res,404,{"msg":"Jenis menu tidak boleh sama"})
    }
}

exports.deleteMenuType = async (req, res) => {
    const {id} = req.body
    
    // save data in log
    const id_akun = req.session.user_id;
    log(id_akun,`Menghapus Jenis Menu dengan id = ${id}`)
    
    deleteRow('jenis', 'id', id, res)
}