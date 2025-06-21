const express = require('express')
const ProductController = require('../controller/ProductController')
const ProductsImageUpload = require('../helper/ProductImageUpload')
const AuthCheck = require('../middleware/AuthCheck')

const router = express.Router()

router.get('/dashboard',AuthCheck,ProductController.CheckAuth,ProductController.dashboard)
//get create product page
router.get('/product',AuthCheck,ProductController.CheckAuth, ProductController.productPage)
//get single product
router.get("/product/single/:id",ProductController.singleProduct)
//create product
router.post('/create/product', ProductsImageUpload.single('image'), ProductController.createproduct)
//update product page
router.get('/product/:id/edit',AuthCheck,ProductController.CheckAuth, ProductController.editPage)
//update product
router.put('/product/update/:id', ProductsImageUpload.single('image'), ProductController.updateProduct)
//delete product
router.delete('/product/delete/:id', ProductController.softDelete)
//search product
router.get("/search", ProductController.searchProducts.bind(ProductController))
module.exports = router