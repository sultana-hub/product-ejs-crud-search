const User = require('../model/user')
const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
// const httpStatusCode=require('../helper/httpStatusCode')
// const  ProductModel = require('../model/products')

class AuthEjsController {

    // async CheckAuth(req, res, next) {
    //     try {
    //         if (req.user) {
    //             next()
    //         } else {
    //             res.redirect('/login');
    //         }
    //     } catch (err) {
    //         console.log(err)
    //     }
    // }


    async register(req, res) {
        try {
            res.render('register', {
                title: "register",
                user: req.user || null
            })

        } catch (error) {
            console.log(error.message);

        }
    }




    async createRegister(req, res) {
        try {
            const { name, email, phone, password } = req.body

            const existEmail = await User.findOne({ email })
            if (existEmail) {
                console.log('email is already exist');

            }
            const salt = 10;
            const hash = bcryptjs.hashSync(password, salt);
            const data = await new User({
                name, email, password: hash, phone
            }).save()
            //console.log('user',data);

            //const result=await data.save()
            if (data) {
                req.flash("message", "user regiaster successfully")
                return res.redirect('/login')
            } else {
                req.flash("message", "user regiaster failed")
                return res.redirect('/register')
            }

        } catch (error) {
            console.log(error.message);

        }
    }


    async loginview(req, res) {
        try {
            const message = req.flash('message')
            res.render('login', {
                title: "login",
                message,
                user: req.user || null
            })

        } catch (error) {
            console.log(error.message);

        }
    }


    async logincreate(req, res) {
        try {
            const { email, password } = req.body
            if (!email || !password) {
                console.log('all filed is require');
                return res.redirect('/login')
            }

            const user = await User.findOne({ email })
            if (!user) {
                console.log('email does not exist');
                return res.redirect('/login')

            }

            //const ismatch= comparePassword(password,user.password)
            const ismatch = bcryptjs.compareSync(password, user.password)

            if (!ismatch) {
                console.log('invalid password');
                return res.redirect('/login')
            }
            const token = jwt.sign({
                _id: user._id,
                name: user.name,
                email: user.email
            }, "helloworldwelcometowebskitters", { expiresIn: "2h" })

            if (token) {
                res.cookie('usertoken', token)
                return res.redirect('/api/dashboard')
            } else {
                return res.redirect('/login')
            }


        } catch (error) {
            console.log(error);

        }
    }


    // async userDashboard(req, res) {
    //     try {
    //         res.render('dashboard', {
    //             user: req.user
    //         })

    //     } catch (error) {
    //         console.log(error.message);

    //     }

    // }

//    async dashboard(req, res) {
//     let data = [];

//     try {
//        const data = await ProductModel.find({deleted:false});

//         return res.render('dashboard', {
//             title: "dashboard",
//             activePage: 'dashboard',
//             data,
//             user: req.user
//         });
//     } catch (error) {
//         console.error("Dashboard error:", error.message); // important for debugging

//         return res.status(400).json({
//             status: false,
//             message: "Not able to access dashboard",
//             error: error.message,
//             data
//         });
//     }
// }




    async logout(req, res) {
        try {
            res.clearCookie('usertoken');
            return res.redirect('/login')

        } catch (error) {
            console.log(error.message);

        }

    }



}



module.exports = new AuthEjsController()