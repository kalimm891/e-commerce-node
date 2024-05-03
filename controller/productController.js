    const {Cart, review, Category, Product, Newuser } = require("../models")
    const path = require("path")
    const ejs = require("ejs");
    const helper = require("../utils/helper");
    const jwt = require("jsonwebtoken")

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
    exports.getProduct = async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1; // Get page number from query parameter or default to 1
            const limit = 10; // Number of products per page
            const offset = (page - 1) * limit; // Calculate offset for pagination
    
            const products = await Product.findAll({ offset, limit });
    
            // Calculate total number of products (for pagination)
            const totalCount = await Product.count();
    
            // Calculate total number of pages
            const totalPages = Math.ceil(totalCount / limit);
    
            // Pass paginated data and pagination metadata to the EJS template
            // return res.json({products});
            return res.render("../views/pages/product.ejs", {
                products,
                currentPage: page,
                totalPages
            });

        } catch (err) {
            console.error(err);
            return res.status(500).send({ error: "Internal server error" });
        }
    };
exports.addToCart = async (req, res) => {
    try {
        // Assuming productId and userId are sent in the request body
        let token = helper.getCookieUser(req);

        // const token = req.headers.authorization;
        // if (!token) {
        //     return res.status(401).json({ error: "Authorization token is missing" });
        //   }
          const decodedToken = jwt.verify(token, "@eshop");
          if (!decodedToken) {
            return res.status(401).json({ error: "Invalid token" });
          }      

        var { productId, userId } = req.body;


        console.log("decodedToken.id");
        console.log(decodedToken.id);
        console.log("decodedToken.id");


        userId=decodedToken.id;
        // productId =7;

        // Fetch product details based on productId
        const product = await Product.findByPk(productId);
        
        if (!product) {
            return res.status(404).json({ status: false, error: 'Product not found' });
        }
        // Check if the product is already in the cart for the user
        let cartItem = await Cart.findOne({ where: { productId, userId } });

        if (cartItem) {
            // If the product already exists in the cart, update the quantity
            cartItem.quantity += 1;
            // cartItem.totalPrice = (cartItem.quantity * product.price).toFixed(2); // Calculate and set total price

            await cartItem.save();
        } else {
            // If the product is not in the cart, create a new cart entry
            cartItem = await Cart.create({ 
                productId, 
                quantity: 1, 
                userId, 
                productName: product.name, // Include product name
                productprice: product.price,
                // totalPrice: product.price // Initialize total price with product price
                 // Include product price
            });
        }
        const totalAmount = await calculateTotalAmount(userId);
        const cartItems = await Cart.update( {totalPrice: totalAmount}, { where: { userId } } );


        console.log("totalAmount");
        console.log(totalAmount);

        return res.redirect('/api/get-cart');
    } catch (err) {
        console.error("Error adding product to cart:", err);
        return res.status(500).json({ status: false, error: "Internal server error" });
    }
};
async function calculateTotalAmount(userId) {
    try {
        const cartItems = await Cart.findAll({ where: { userId } });
        let totalAmount = 0;

        cartItems.forEach(item => {
            totalAmount += item.quantity * item.productprice;
        });

        return totalAmount;
    } catch (err) {
        console.error("Error calculating total amount:", err);
        return 0;
    }
}
exports.getCart = async (req, res) => {
    console.log("result2")
    try {
        let token = helper.getCookieUser(req);

        const decodedToken = jwt.verify(token, "@eshop");
        if (!decodedToken) {
          return res.status(401).json({ error: "Invalid token" });
        }      



      console.log("decodedToken.id");
      console.log(decodedToken.id);
      console.log("decodedToken.id");

        const userId = decodedToken.id;

        let result = await Cart.findAll({
            where: { userId }

            // include: [Product]
        });

        const response = {
            status: true,
            data: result    
        } 
        console.log(response.data);
        console.log("response.data");

        // return res.status(200).send(response);
        var data = "kalim";
        return res.render("../views/pages/cart.ejs", {cartData:response.data});
        // return res.render("pages/product.ejs");
        return template;

    } catch (err) {
        console.log(err)
        return res.status(500).send({
        error: "error "
        });        
    }
}
exports.getHome = async (req, res) => {
    console.log("result2")
    try {

        const products = await Product.findAll();
        const categories = await Category.findAll();


        return   res.render("index", {
            products,

            categories
          });
        // return res.render("pages/product.ejs");

    } catch (err) {
        console.log(err)
        return res.status(500).send({
        error: "error "
        });        
    }
}
exports.addnew = async (req, res) => {
    console.log("result2")
    try {
        return res.render("../views/pages/add_product.ejs", {cartData:"kalim"});
    } catch (err) {
        console.log(err)
        return res.status(500).send({
        error: "error "
        });        
    }
}
exports.getProductById = async (req, res) => {


    try {
        const productId = req.params.productId; // Get product ID from request parameters
        
        // Find the product by its ID
        // const product = await Product.findByPk(productId);
        const data = await Product.findOne({ where: { id: req.params.productId } });

        let reviewData = await review.findAll({
            where: { productId: req.params.productId }

            // include: [Product]
        });

        // const reviewData = await review.findOne({  });
        
        if (!data) {
            return res.status(404).send({ error: "Product not found" });
        }
        console.log("reviewData")
        console.log(reviewData)
        console.log("reviewData")
        // If the product is found, return it in the response
        // return res.status(200).send(product);
        // return res.status(200).send(reviewData);
        return res.render("../views/pages/product_view.ejs", {data, reviewData});
    } catch (err) {
        console.error(err);
        return res.status(500).send({ error: "Internal server error" });
    }
};


exports.getReviewAdd = async (req, res) => {


    try {
        const productId = req.params.productId; // Get product ID from request parameters
        
        // Find the product by its ID
        // const product = await Product.findByPk(productId);
        const data = await Product.findOne({ where: { id: req.params.productId } });
        
        if (!data) {
            return res.status(404).send({ error: "Product not found" });
        }
        return res.render("../views/pages/add_review.ejs", {data});
    } catch (err) {
        console.error(err);
        return res.status(500).send({ error: "Internal server error" });
    }
};




exports.addReview = async (req, res) => {


    
    console.log("result");
    try {
        let token = helper.getCookieUser(req);

        // const token = req.headers.authorization;
        // if (!token) {
        //     return res.status(401).json({ error: "Authorization token is missing" });
        //   }
          const decodedToken = jwt.verify(token, "@eshop");
          if (!decodedToken) {
            return res.status(401).json({ error: "Invalid token" });
          }      

        var { productId, userId , comment, rating} = req.body;

        userId =decodedToken.id;
        // const { name } = req.body;
        const newCategory = await review.create({productId, userId, comment, rating});
        const response = {
            status: true,
            data: newCategory
        } 
        res.redirect("/api/home");
    } catch (err) {
        console.log(err)
        return res.status(500).send({
        error: "error"
        });        
    }   
}






exports.deleteProduct = async (req, res) => {
    try {
        const productId = req.params.productId;

        // Delete the product from the database
        await Product.destroy({
            where: { id: productId }
        });

        // Send a success response
        return res.status(200).json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
};
exports.deleteCart = async (req, res) => {
    try {

        let token = helper.getCookieUser(req);

        const decodedToken = jwt.verify(token, "@eshop");
        if (!decodedToken) {
          return res.status(401).json({ error: "Invalid token" });
        }      
        const userId = decodedToken.id;


        await Cart.destroy({
            where: { id: req.params.cartId }
        });
        const totalAmount = await calculateTotalAmount(userId);

        const cartItems = await Cart.update( {totalPrice: totalAmount}, { where: { userId } } );
        // Send a success response
        return res.status(200).json({ success: true, message: 'cart deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
};
exports.increamentProduct = async (req, res) => {
    console.log("result");
    try {

        let token = helper.getCookieUser(req);

        const decodedToken = jwt.verify(token, "@eshop");
        if (!decodedToken) {
          return res.status(401).json({ error: "Invalid token" });
        }      



      console.log("decodedToken.id");
      console.log(decodedToken.id);
      console.log("decodedToken.id");

        // const userId = decodedToken.id;
        var { productId, userId } = req.body;

        userId = decodedToken.id;
        
        // Find the cart item by productId and userId
        const cartItem = await Cart.findOne({ where: { productId, userId } });
        if (!cartItem) {
            return res.status(404).json({ status: false, error: 'Cart item not found' });
        }

        // Increase the quantity by 1
        cartItem.quantity += 1;
        await cartItem.save();
        const totalAmount = await calculateTotalAmount(userId);

        const cartItems = await Cart.update( {totalPrice: totalAmount}, { where: { userId } } );

        return res.status(200).json({ status: true, message: 'Cart item quantity increased successfully' });
    } catch (err) {
        console.error("Error increasing cart item quantity:", err);
        return res.status(500).json({ status: false, error: "Internal server error" });
    } 
}

exports.decreamentProduct = async (req, res) => {
    console.log("result");
    try {

        let token = helper.getCookieUser(req);

        const decodedToken = jwt.verify(token, "@eshop");
        if (!decodedToken) {
          return res.status(401).json({ error: "Invalid token" });
        }      



      console.log("decodedToken.id");
      console.log(decodedToken.id);
      console.log("decodedToken.id");

        // const userId = decodedToken.id;
                var { productId, userId } = req.body;
                    userId = decodedToken.id;

                
                // Find the cart item by productId and userId
                const cartItem = await Cart.findOne({ where: { productId, userId } });
                if (!cartItem) {
                    return res.status(404).json({ status: false, error: 'Cart item not found' });
                }
        
                // Decrease the quantity by 1 if it's greater than 1
                if (cartItem.quantity > 1) {
                    cartItem.quantity -= 1;
                    await cartItem.save();
                }
                const totalAmount = await calculateTotalAmount(userId);

        const cartItems = await Cart.update( {totalPrice: totalAmount}, { where: { userId } } );
                return res.status(200).json({ status: true, message: 'Cart item quantity decreased successfully' });
            } catch (err) {
                console.error("Error decreasing cart item quantity:", err);
                return res.status(500).json({ status: false, error: "Internal server error" });
            }
}








exports.addCategory = async (req, res) => {
    console.log("result");
    try {


        const { name } = req.body;
        const newCategory = await Category.create({ name });
        const response = {
            status: true,
            data: newCategory
        } 
        // return  res.redirect('/api/get-product');
        return res.status(200).send(response);
    } catch (err) {
        console.log(err)
        return res.status(500).send({
        error: "error"
        });        
    }   
}
exports.getCategory = async (req, res) => {
    console.log("result");
    try {
        const categories = await Category.findAll();
        const response = {
            status: true,
            data: categories
        } 
        // return  res.redirect('/api/get-product');
        return res.status(200).send(response);
    } catch (err) {
        console.log(err)
        return res.status(500).send({
        error: "error"
        });        
    }   
}
exports.deleteCategory = async (req, res) => {
    try {


                const { id } = req.params.categoryId;

        await Category.destroy({
            where: { id: req.params.categoryId }
        });

        // Send a success response
        return res.status(200).json({ success: true, message: 'Category deleted successfully' });
        // const { id } = req.params.categoryId;
        // const category = await Category.findByPk(id);
        // if (!category) {
        //     return res.status(404).json({ error: 'Category not found' });
        // }
        // await category.destroy();

        // Send a success response
        return res.status(200).json({ success: true, message: 'category deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
};
exports.updateCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const category = await Category.findByPk(req.params.categoryId);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        await category.update({ name });

        // Send a success response
        const response = {
            status: true,
            data: category
        } 
        // return  res.redirect('/api/get-product');
        return res.status(200).send(response);
    } catch (error) {
        console.error('Error deleting product:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
};



