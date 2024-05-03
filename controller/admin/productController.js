const {Cart, Category, Product, Newuser } = require("../../models")











exports.productGet = async (req, res) => {
    const products = await Product.findAll();
    console.log("result  ")
    try {
        return res.render("main/product.ejs", {data:products});
    } catch (err) {
        console.log(err)
        return res.status(500).send({
        error: "error "
        });        
    }
}




exports.productAddGet = async (req, res) => {
    console.log("result  ")
    try {
        return res.render("main/add_product.ejs", {name:"kalim"});
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
        const { name, price } = req.body;
        const newCategory = await Product.create({ name, price });
        const response = {
            status: true,
            data: newCategory
        } 
        res.redirect("/admin/product");
    } catch (err) {
        console.log(err)
        return res.status(500).send({
        error: "error"
        });        
    }   
}


exports.deleteProduct = async(req,res)=>{
    try {
     await Product.destroy({where:{id:req.params.id}})
     return res.redirect("/admin/product")
    } catch (error) {
     console.log("error",error)
    }
 }

 exports.getEditProduct = async (req, res) => {
    try {
      const data = await Product.findOne({ where: { id: req.params.id } });
      return res.render("main/edit_product.ejs", { data });
    } catch (error) {
      console.log("error", error);
    }
  };



  exports.updateProduct = async (req, res) => {
    const requiredData = {
      name: req.body.name,
      price: req.body.price,
    };

    console.log("requiredData");
    console.log(requiredData);
    console.log("requiredData");
    try {
      await Product.update(requiredData, {
        where: { id: req.params.id },
      });
      return res.redirect("/admin/product");
    } catch (error) {
      console.log("error", error);
    }
  };





  









