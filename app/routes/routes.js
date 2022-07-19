const session = require('express-session')
const home = require('../controller/home')
const registration = require('../controller/auth/registration')
const kasir = require('../controller/kasir/order')
const managerMenu = require('../controller/manager/menu')
const managerTable = require('../controller/manager/table')
const login = require('../controller/auth/login')
const secure = require('../helper/session')
const data = require('../controller/data')
const admin = require('../controller/admin')
const role_manager = require('../models/role/manager')
const role_admin = require('../models/role/admin')
const role_kasir = require('../models/role/kasir')
const login_session = require('../helper/login_session')

module.exports = (app) => {

  // INDEX PAGE
  app.get('/',(req, res) => {
      res.render('auth/login',{
        title:'Login | Grafika Cafe',
        css : 'auth/login',
        js: 'auth/index',
      })
  })

  app.get('/logout', (req, res)=>{
    req.session.destroy()
    res.redirect('/')
  })

  // GLOBAL AUTHENTICATION
  app.post('/auth',(req,res)=>{
    login(req, res)
  })

// =============================================================================================
  // MANAGER
    // INDEX
    app.get('/manager/',[login_session], (req, res) => {
      res.render('Manager/index',{
        title:'Dashboar | Manager',
        css : 'manager/index',
        js: 'null',
      })
    })

    // MENU
    app.get('/manager/menu', [login_session], (req, res) => {
      res.render('manager/menu',{
        title:'Menu | Manager',
        css : 'manager/menu',
        js: 'manager/menu',
      })
    })

    // report
    app.get('/manager/report',[login_session], (req, res) => {
      res.render('manager/reportHarian',{
        title:'Report | Manager',
        css : 'manager/report',
        js: 'manager/report',
      })
    })

    app.get('/kasir/report/monthly', [login_session], (req, res) => {
      res.render('kasir/reportBulanan',{
        title:'Report Monthly | Kasir',
        css : 'manager/report',
        js: 'manager/reportMonthly',
      })
    })

    app.get('/manager/logs', [login_session], (req, res) => {
      res.render('manager/log',{
        title:'Log | Manager',
        css : 'manager/report',
        js: 'manager/log',
      })
    })

    app.get('/manager/akun', [login_session], (req, res) => {
      res.render('manager/akun',{
        title:'Log | Manager',
        css : 'manager/akun',
        js: 'manager/akun',
      })
    })

    app.post('/manager/menu', (req, res) => {
      managerMenu.addMenu(req, res)
    })

    app.post('/manager/menu/edit', (req, res) =>{
      managerMenu.updateMenu(req, res)
    })

    app.delete('/manager/menu', (req, res) =>{
      console.log(req.body)
      managerMenu.deleteMenu(req, res)
    })

    // MENU TYPE
    app.post('/manager/menu/type', (req, res) =>{
      managerMenu.addMenuType(req, res)
    })

    app.put('/manager/menu/type', (req, res) => {
      managerMenu.updateMenuType(req, res)
    })

    app.delete('/manager/menu/type', (req, res)=> {
      managerMenu.deleteMenuType(req, res)
    })

    // TABLE 
    app.post('/manager/table', (req, res) => {
      managerTable.table(req, res)
    })

  // END MANAGER
// ========================================================================================


// ======================================================================================== 
  // ADMIN
    
    // REGISTER
    app.post('/admin/account', (req, res) => {
      registration(req, res)
    })

    app.put('/admin/account', (req, res) => {
      admin.updateAccount(req, res)
    })

    app.delete('/admin/account', (req, res) => {
      admin.deleteAccount(req, res)
    })

  // END ADMIN
// =========================================================================================


// =========================================================================================
  // KASIR
    // KASIR UI
    app.get('/kasir', [login_session], (req, res) => {
      res.render('kasir/index',{
        title:'Dashboard | Admin',
        css : 'kasir/index',
        js: 'kasir/index',
      })
    })

    app.get('/kasir/meja', [login_session], (req, res) => {
      res.render('kasir/meja',{
        title:'Dashboard | Admin',
        css : 'kasir/index',
        js: 'kasir/tabel',
      })
    })

    app.get('/kasir/meja/pesanan/:id', (req, res) => {
      res.render('kasir/pesanan',{
        title:'Pesanan | Admin',
        css : 'kasir/pesanan',
        js: 'kasir/pesanan',
      })
    })

    app.get('/kasir/report',[login_session], (req, res) => {
      res.render('kasir/reportHarian',{
        title:'Report | Kasir',
        css : 'manager/report',
        js: 'manager/report',
      })
    })

    app.get('/manager/report/monthly', [login_session], (req, res) => {
      res.render('manager/reportBulanan',{
        title:'Report Monthly | Manager',
        css : 'manager/report',
        js: 'manager/reportMonthly',
      })
    })

    // TRANSACTION
    app.post('/kasir/order/menu', (req, res) => {
      kasir.order(req, res)
    })

    app.put('/kasir/meja/clear',(req,res)=>{
      kasir.clear(req, res)
    })

    app.delete('/kasir/order/menu', (req, res) => {
      kasir.deleteOrder(req, res)
    })

    app.post('/kasir/create/payment', (req, res) => {
      kasir.createPayment(req, res)
    })

    app.delete('/kasir/cancel/payment', (req, res) => {
      kasir.deletePayment(req, res)
    })

    app.post('/kasir/checkout/order', (req, res) => {
      kasir.checkout(req, res)
    })

  // END KASIR
// =========================================================================================



// ==========================================================================================
    // GET DATA 

    app.get('/data/menu', (req, res) => {
      data.menu(req, res)
    })

    app.get('/data/log', (req, res) => {
      data.log(req, res)
    })

    app.get('/data/transaction/daily', (req, res)=> {

    })

    app.get('/data/transction/monthly', (req, res) => {
      
    })

    app.get('/data/transaction/daily/by/id', (req, res) => {
      data.transactionDailyById(req, res)
    })

    app.get('/data/transaction/monthly/by/id', (req, res) => {
      data.transactionMonthlyById(req, res)
    })

    app.get('/data/report/daily/:date/:month/:year', (req, res) => {
      data.reportDaily(req, res)
    })

    app.get('/data/report/monthly/:month/:year', (req, res) => {
      data.reportMonthly(req, res)
    })

    // fleksible query
    app.get('/data/:table', (req, res) => {
      data.tableCollection(req, res)
    })


    app.get('/data/:table/:field/:value', (req,res) => {
      data.detailCollection(req,res)
    })

    app.post('/data/join/',(req,res)=>{
      data.innerJoin(req, res);
    })



    // END GET DATA
// ==========================================================================================

}
