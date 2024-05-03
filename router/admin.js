const express = require('express');
const router = express.Router();

const controller = require("../controller/admin/index");









/// product api

// router.get('/login', controller.authController.loginGet);
router.get('/users', controller.authController.UserGet);


router.get('/product', controller.productController.productGet);
router.get('/add-product', controller.productController.productAddGet);
router.get("/editProduct/:id",controller.productController.getEditProduct);
router.get("/deleteProduct/:id",controller.productController.deleteProduct);
router.post("/add-product",controller.productController.addProduct);
router.post("/updateProduct/:id",controller.productController.updateProduct);







// category admin api

router.get('/category', controller.categoryController.getCategory);
router.get("/deleteCategory/:id",controller.categoryController.deleteCategory);
router.get("/editCategory/:id",controller.categoryController.getEditCategory);
router.post("/updateCategory/:id",controller.categoryController.updateCategory);
router.get("/addCategory",controller.categoryController.getAddCategory);

router.post("/addCategory",controller.categoryController.addCategory);





// router.get('/category', controller.categoryController.getCategory);






// app.post('/webhook', express.raw({type: 'application/json'}), (request, response) => {
//     let event = request.body;
//     // Only verify the event if you have an endpoint secret defined.
//     // Otherwise use the basic event deserialized with JSON.parse
//     if (endpointSecret) {
//       // Get the signature sent by Stripe
//       const signature = request.headers['stripe-signature'];
//       try {
//         event = stripe.webhooks.constructEvent(
//           request.body,
//           signature,
//           endpointSecret
//         );
//       } catch (err) {
//         console.log(`⚠️  Webhook signature verification failed.`, err.message);
//         return response.sendStatus(400);
//       }
//     }
  
//     // Handle the event
//     switch (event.type) {
//       case 'payment_intent.succeeded':
//         const paymentIntent = event.data.object;
//         console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
//         // Then define and call a method to handle the successful payment intent.
//         // handlePaymentIntentSucceeded(paymentIntent);
//         break;
//       case 'payment_method.attached':
//         const paymentMethod = event.data.object;
//         // Then define and call a method to handle the successful attachment of a PaymentMethod.
//         // handlePaymentMethodAttached(paymentMethod);
//         break;
//       default:
//         // Unexpected event type
//         console.log(`Unhandled event type ${event.type}.`);
//     }
  
//     // Return a 200 response to acknowledge receipt of the event
//     response.send();
//   });




module.exports = router
