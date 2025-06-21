const express=require('express')
const AuthEjsController = require('../controller/AuthEjsController')
// const AuthCheck = require('../middleware/AuthCheck')

const router=express.Router()



router.get('/register',AuthEjsController.register)
router.post('/register/create',AuthEjsController.createRegister)
router.get('/',AuthEjsController.loginview)
router.post('/login/create',AuthEjsController.logincreate)
// router.get('/dashboard',AuthCheck,AuthEjsController.CheckAuth,AuthEjsController.dashboard)
router.get('/logout',AuthEjsController.logout)



module.exports=router