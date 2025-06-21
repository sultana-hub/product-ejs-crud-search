const express = require('express')
const dbCon = require('./app/config/dbCon')
const cors = require('cors')
const dotenv = require('dotenv').config()
const ejs = require('ejs')
const bodyParser = require('body-parser')
const path = require('path')
const methodOverride = require('method-override');
var cookieParser = require('cookie-parser')
const flash=require('connect-flash')
const session=require('express-session')

const app = express()
dbCon()

app.use(cors())


app.use(session({
  secret: 'helloworld',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge:60000 }
}))
app.use(flash())
app.use(cookieParser())


//view engine setup

app.set('view engine', 'ejs')
app.set('views', 'views')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(bodyParser.json({
    limit: '100mb',
    parameterLimit: '6000'
}))

app.use(bodyParser.urlencoded({
    limit: '100mb',
    parameterLimit: '6000'
}))
app.use(methodOverride('_method'))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// console.log(ProductsImageUpload.single);
const prodRouter = require('./app/routes/prodRoutes')
app.use('/api', prodRouter)

const AuthEjsRoute=require('./app/routes/authejsRoute')
app.use(AuthEjsRoute)

const port = 3000

app.listen(port, () => {
    console.log("server is running at port", port)
})