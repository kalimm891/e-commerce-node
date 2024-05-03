const express = require('express');
const router = express.Router();
const {Cart, Product } = require("../models")
const product = require("../controller/productController");
const auth = require("../controller/authController");
const { restrcitLogin, checkAuth } = require("../middleware/auth");
const multer = require("../middleware/uploadImage");
const UploadProfilePicture = multer.upload.single("image");
const userAuth = require("../middleware/user_auth")






/// product api
router.post("/add-product", UploadProfilePicture,   product.addProduct);
router.post("/add-review",  product.addReview);
router.get("/get-product",  userAuth, product.getProduct);
router.get("/get-product-by-id/:productId", product.getProductById);
router.get("/get-review-id/:productId", product.getReviewAdd);
router.get("/home", product.getHome);
router.delete('/delete-product/:productId', userAuth, product.deleteProduct);




// category  api
router.post("/add-category", product.addCategory);
router.get("/get-category", product.getCategory);
router.delete('/delete-category/:categoryId',  product.deleteCategory);
router.put('/update-category/:categoryId',  product.updateCategory);






// cart api
router.post('/add-to-cart', userAuth, product.addToCart);
router.get('/get-cart', userAuth, product.getCart);
router.get('/add-new', product.addnew);
router.delete('/delete-cart/:cartId', product.deleteCart);
router.post('/increament-product/:productId', product.increamentProduct);
router.post('/decreament-product/:productId', product.decreamentProduct);





// auth api 
router.get('/sign-up-get', auth.signUpGet);
router.post('/login', auth.login);
router.post('/checkout', auth.checkout);
router.post('/v1/checkout/sessions', userAuth,  auth.checkout);
router.get('/login-get', auth.loginGet);
router.post('/sign', auth.signUp);
router.get('/logout', auth.logOut);
router.get('/get-checkout', auth.paymentSuccessWebhook);
module.exports = router
