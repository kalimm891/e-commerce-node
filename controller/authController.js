const { Cart,   Newuser, Product } = require("../models");
const bcrypt = require("bcrypt");

const stripe = require('stripe')('sk_test_51P9n6JSIVDUYpW6Up773itAnpVJ5yAg5j10VFjrqZ9mShzBwdHk0Y71uqMwgnLBK3nC69pBDldVYjdO5gGQJWOdK00Wr9ZONIp');

const jwt = require("jsonwebtoken");


const {v4: uuidv4} = require("uuid");

const {setUserId} = require("../service/auth_service")
const helper = require("../utils/helper");

const {getProduct} = require("../controller/productController")




exports.signUp = async (req, res) => {
    console.log(" result ")
    console.log(req.body.email)
    console.log(req.body.password)
    try {


        const passwordHash = await bcrypt.hash(req.body.password, 10);
        const userData = {
            
            email: req.body.email,
            password: passwordHash,
          };

        // req.body.email;
        // req.body.password
        // let salt =  await bcrypt.genSalt(10)
        // let hash = await bcrypt.hash(req.body.password, 10)

        // req.body.password =hash;

        let result = await Newuser.create(userData);

        const response = {
            status: true,
            data: result
        } 



        
        // return  res.redirect('/home');
        // return res.status(200).send(response);
        // return res.render("../views/pages/cart.ejs", {name:"kalim"});
        return  res.redirect('login-get');
    } catch (err) {
        console.log(err)
        return res.status(500).send({
        error: "error "
        });        
    }
}



exports.signUpGet = async (req, res) => {
    console.log("result  ")
    try {
        return res.render("../views/pages/sign_up.ejs", {name:"kalim"});
    } catch (err) {
        console.log(err)
        return res.status(500).send({
        error: "error "
        });        
    }
}




exports.login = async (req, res) => {
    const { email, password } = req.body;
    console.log("result  ")
    try {

        const user = await Newuser.findOne({ where: { email } });
  
        if (!user) {
            res.status(401).json({ message: 'Invalid credentials' });
            // res.status(401).json({ message: 'Invalid credentials' });
        //        const response = {
        //     status: true,
        //     data: user
        // } 

        //   res.status(200).json(response );
        // res.status(200).json({ message: 'Login successful' });

        }

        const result = await bcrypt.compare(password, user.password);




        let token = jwt.sign(
            { id: user.id, email: user.email },
            "@eshop",
            { expiresIn: "365d" }
          );


          await user.update({ token }, { where: { id: user.id } });
          res.cookie("user-token", token, { maxAge: 1000 * 60 * 60 * 24 * 365 });
        //  else {
        //   res.status(401).json({ message: 'Invalid credentials' });
        // }
        // // const seesionId = uuidv4();
        // // setUserId(seesionId, user);

        // res.cookie("uid", seesionId);
        return  res.redirect('/api/home');
    } catch (err) {
        console.log(err)
        return res.status(500).send({
        error: "error "
        });        
    }
}


exports.checkout = async (req, res) => {


    let token = helper.getCookieUser(req);

    const decodedToken = jwt.verify(token, "@eshop");
    if (!decodedToken) {
      return res.status(401).json({ error: "Invalid token" });
    }      



  console.log("decodedToken.id");
  console.log(decodedToken.id);
  console.log("decodedToken.id");

    const userId = decodedToken.id;

    
    
    
    console.log("result");

    try {

        let result = await Cart.findAll({
            where: { userId }
        });


        const lintItem = result.map((product)=>({
            price_data: {
                currency: 'INR',
                product_data: {
                  name: product.productName,
                },
                unit_amount: (product.productprice)*100,
              },
              quantity: product.quantity,


            
                

        }));


        const session = await stripe.checkout.sessions.create({
            line_items:lintItem,
            
            // [
            //   {
            //     price_data: {
            //       currency: 'INR',
            //       product_data: {
            //         name: 'T-shirt',
            //       },
            //       unit_amount: 2000,
            //     },
            //     quantity: 1,
            //   },
            // ],
            customer_email:"kalim@gmail.com",
            

            billing_address_collection: 'required', // Collect billing address


            shipping_address_collection: {
                allowed_countries: ['IN'] // Only allow shipping address in India
            },


            mode: 'payment',
            success_url: 'http://localhost:8080/api/success.html',
            cancel_url: 'http://localhost:8080/cancel',
          });
        

        
        console.log('Checkout session created:', session);
        // Redirect to Stripe Checkout using session.id
        // return res.json({ sess: session });
        return res.redirect(session.url);
    } catch (error) {
        console.error('Error creating Checkout session:', error);
        return res.status(500).json({ error: 'Error creating Checkout session' });
    }
}




exports.paymentSuccessWebhook = async (req, res) => {
    try {
        // Retrieve the Checkout session ID from the request body
        const { session_id } = "cs_test_a1EUICLZMsMcoQI3d7XTgeAu0H7w31JrpUrnK7Fq66k88EBOrozqoUTFcY";

        // Retrieve the payment details using the Checkout session ID
        const session = await stripe.checkout.sessions.retrieve("cs_test_a1ETKqr09RVAFO4JhTwV5bohqi37QNDuBoqZItzvG3cTk4EgHmXTMdW90b");

        // Retrieve the payment ID from the session
        const payment_id = session.payment_intent;

        // Save the payment ID in the database
        // Replace this with your database integration logic
        // Example: await savePaymentIdToDatabase(payment_id);

        console.log('Payment ID:', payment_id);

        // if(payment_id != null){

        //     await Newuser.create({
        //         email:"khan@gmail.com",
        //         password:"12345"
        //     });


        // }
        
        // Respond with a success status
        res.status(200).json({data:session})
    } catch (error) {
        console.error('Error handling payment webhook:', error);
        res.status(500).end();
    }
}





exports.loginGet = async (req, res) => {
    console.log("result  ")
    try {

        
        return res.render("../views/pages/login.ejs", {name:"kalim"});
    } catch (err) {
        console.log(err)
        return res.status(500).send({
        error: "error "
        });        
    }
}






exports.logOut = async (req, res) => {
    console.log("result  ")
    try {

        
        const { error, message, formValue, isLoggedIn } = req.query;
    res.clearCookie("user-token");
    req.success = "Successfully LogOut.";
    res.status(200).send("Successfully logged out.");
        // Redirect the user to the login page or any other desired destination
        // return  res.redirect('login-get');

        
        // return res.render("../views/pages/login.ejs", {name:"kalim"});

    } catch (err) {
        console.log(err)
        return res.status(500).send({
        error: "error "
        });        
    }
}



exports.addProduct = async (req, res) => {
    console.log("result");
    try {
        req.file ? req.body.images = req.file.filename: null
        req.body.name;
        req.body.price;

        let result = await Product.create(req.body);
        const response = {
            status: true,
            data: result
        } 
        return  res.redirect('/api/get-product');

        // return res.status(200).send(response);
    } catch (err) {
        console.log(err)
        return res.status(500).send({
        error: "error"
        });        
    }   
}
