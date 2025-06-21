const httpStatusCode = require('../helper/httpStatusCode')
const { ProductModel, productValidation } = require('../model/products')
const fs = require('fs')
const path = require('path')


class ProductController {


  async CheckAuth(req, res, next) {
        try {
            if (req.user) {
                next()
            } else {
                res.redirect('/login');
            }
        } catch (err) {
            console.log(err)
        }
    }



    async productPage(req, res) {
        try {
            res.render('addProd', { title: "add prod", activePage: 'product', user: req.user })
        } catch (error) {
            return res.status(httpStatusCode.BadRequest).json({
                status: false,
                message: "Not able to access add product page"
            })
        }
    }

    async createproduct(req, res) {

        try {

            console.log(req.body)
            const prodData = {
                productName: req.body.productName,
                productPrice: req.body.productPrice,
                productDesc: req.body.productDesc,
                productColor: Array.isArray(req.body.productColor)
                    ? req.body.productColor
                    : req.body.productColor.split(','),
                productSize: Array.isArray(req.body.productSize)
                    ? req.body.productSize : req.body.productSize.split(', '),
                brandName: req.body.brandName
            }
            console.log(req.file)
            if (req.file) {
                prodData.image = req.file.path
            }

            const { error, value } = productValidation.validate(prodData)

            if (error) {
                return res.status(httpStatusCode.BadRequest).json({
                    status: false,
                    message: error.details[0].message
                })
            } else {
                const data = await ProductModel.create(value)
                res.redirect('/api/dashboard');
                // return res.status(httpStatusCode.Ok).json({
                //     status: true,
                //     message: "Product created successfully",
                //     data: data
                // })
            }
        } catch (error) {
            console.log(error)
            return res.status(httpStatusCode.InternalServerError).json({
                status: false,
                message: "Something went wrong",
                error: error.message
            });
        }




    }

 
    

   async dashboard(req, res) {
    let data = [];

    try {
       const data = await ProductModel.find({deleted:false});

        return res.render('dashboard', {
            title: "dashboard",
            activePage: 'dashboard',
            data,
            user: req.user
        });
    } catch (error) {
        console.error("Dashboard error:", error.message); // important for debugging

        return res.status(400).json({
            status: false,
            message: "Not able to access dashboard",
            error: error.message,
            data
        });
    }
}



async singleProduct(req, res) {
        try {
            const id = req.params.id

            const single = await ProductModel.findById(id)

            return res.status(httpStatusCode.Ok).json({
                status: true,
                message: "get single product successfully",
                data: single
            })

        } catch (error) {
            return res.status(httpStatusCode.InternalserverErrorr).json({
                status: false,
                message: error.message
            })
        }
    }





    async editPage(req, res) {
        try {
            const id = req.params.id
            const data = await ProductModel.findById(id)
            res.render('editProd', { title: "Edit page", data, activePage: 'editProd', user: req.user })

        } catch (error) {
            return res.status(httpStatusCode.InternalserverErrorr).json({
                status: false,
                message: "Error in getting edit page"
            })
        }
    }

    async updateProduct(req, res) {

        try {
            const id = req.params.id;

            // Finding existing product
            const product = await ProductModel.findById(id);
            if (!product) {
                return res.status(httpStatusCode.NotFound).json({
                    status: false,
                    message: "Product not found"
                });
            }

            // Converting comma-separated strings to arrays if provided
            const colorArray = req.body.productColor
                ? req.body.productColor.split(',').map(c => c.trim())
                : product.productColor;

            const sizeArray = req.body.productSize
                ? req.body.productSize.split(',').map(s => s.trim())
                : product.productSize;

            // Updating fields manually
            product.productName = req.body.productName || product.productName;
            product.productPrice = req.body.productPrice || product.productPrice;
            product.productDesc = req.body.productDesc || product.productDesc;
            product.productColor = colorArray;
            product.productSize = sizeArray;
            product.brandName = req.body.brandName || product.brandName;

            // Handle image update
            if (req.file) {
                if (product.image && fs.existsSync(product.image)) {
                    fs.unlinkSync(product.image);
                }
                product.image = req.file.path;
            }

            // Joi Validation
            const { error, value } = productValidation.validate({
                productName: product.productName,
                productPrice: product.productPrice,
                productDesc: product.productDesc,
                productColor: product.productColor,
                productSize: product.productSize,
                brandName: product.brandName,
                image: product.image
            });

            if (error) {
                return res.status(httpStatusCode.BadRequest).json({
                    status: false,
                    message: error.details[0].message
                });
            }

            // Save updated product
            const updatedProduct = await product.save();

            res.redirect('/api/dashboard')

            // return res.status(httpStatusCode.Ok).json({
            //     status: true,
            //     message: "Product updated successfully",
            //     data: updatedProduct
            // });

        } catch (error) {
            console.error("Update product error:", error);
            return res.status(httpStatusCode.InternalServerError).json({
                status: false,
                message: error.message
            });
        }
    }


    //soft delete
    async softDelete(req, res) {
        try {
            const id = req.params.id
            const softDel = await ProductModel.findByIdAndUpdate(id, {
                deleted: true,
                deletedAt: new Date()
            })

            res.redirect('/api/dashboard')
            // return res.status(httpStatusCode.Ok).json({
            //     status: true,
            //     message: "Deleted successfully",
            //     data: softDel
            // })
        } catch (error) {
            return res.status(httpStatusCode.InternalserverErrorr).json({
                status: false,
                message: error.message
            })
        }

    }

    async searchProducts(req, res) {
        try {
            const keyword = req.query.keyword?.trim();

            // if (!keyword) {
            //     return res.status(httpStatusCode.BadRequest).json({
            //         status: false,
            //         message: "Keyword is required",
            //     });
            // }

        // If no keyword, fetch all products and render dashboard
        if (!keyword) {
            const allProducts = await ProductModel.find({ deleted: false });

            return res.render('dashboard', {
                data: allProducts,
                keyword: '',
                message: "",
                user: req.user
            });
        }
            const searchRegex = new RegExp(keyword, 'i'); 
            const data = await ProductModel.find({
                deleted: false,
                $or: [
                    { productName: searchRegex },
                    { brandName: searchRegex }
                ]
            });

            return res.render('dashboard', {
                data,
                keyword,
                message: data.length ? null : 'No matching products found',
                 user: req.user
            });

            // return res.status(httpStatusCode.Ok).json({
            //     status: true,
            //     message: "Search result fetched",
            //     total: products.length,
            //     data: products,
            // });
        } catch (error) {
            return res.status(httpStatusCode.InternalserverErrorr).json({
                status: false,
                message: "Server error",
                error: error.message,
            });
        }
    }




}

module.exports = new ProductController()