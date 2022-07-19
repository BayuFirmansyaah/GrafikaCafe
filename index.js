const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')
const routes = require('./app/routes/routes')
const upload = require('express-fileupload')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const MySQLStore = require('express-mysql-session')(session)
const port = process.env.PORT || 3000
const app = express()

// ejs
app.set('views', path.join(__dirname, 'app/views'))
app.set('view engine', 'ejs')

// session configuration
app.use(session({
  store: new MySQLStore({
      host: "localhost",
      user: "root",
      password: "",
      database: "express",
      clearExpired: true,
      checkExpirationInterval: 600000,
      expiration: 2628000000,
      createDatabaseTable: true,
      connectionLimit: 1,
      endConnectionOnClose: true,
      charset: 'utf8mb4_bin',
      schema: {
          tableName: 'sessions',
          columnNames: {
              session_id: 'session_id',
              expires: 'expires',
              data: 'data'
          }
      }
  }),
  secret: 'mySecretKey',
  name: '_user',
  resave: false,
  saveUninitialized: false,
  cookie: {
      secure: false,
      httpOnly: true,
      expires: new Date(1000 * 60 * 60 * 24 * 30),
      maxAge: 2628000000
  },
}))


// configuration
app.use(cors())
app.use(upload())
app.use(bodyParser.json({}))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, '/public')))
app.set('trust proxy', 1)

// use routes
routes(app)

// listen server
app.listen(port, async () => {
  console.log(`server running on port ${port}`)
})
