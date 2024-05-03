const {Cart, Category, Product, Newuser } = require("../../models")



exports.getAddCategory = async (req, res) => {
  try {
    return res.render("main/add_category.ejs");
  } catch (error) {
    console.log("error", error);
  }
};


exports.addCategory = async (req, res) => {
    console.log("result");
    try {
        const { name } = req.body;
        const newCategory = await Category.create({ name });
        const response = {
            status: true,
            data: newCategory
        } 
        res.redirect("/admin/category");
    } catch (err) {
        console.log(err)
        return res.status(500).send({
        error: "error"
        });        
    }   
}
exports.getCategory = async (req, res) => {
    console.log("result  ")
    try {
        const categories = await Category.findAll();
        return res.render("main/category.ejs", {data:categories});
    } catch (err) {
        console.log(err)
        return res.status(500).send({
        error: "error "
        });        
    }

}



exports.deleteCategory = async(req,res)=>{
    try {
     await Category.destroy({where:{id:req.params.id}})
     return res.redirect("/admin/category")
    } catch (error) {
     console.log("error",error)
    }
 }



 exports.getEditCategory = async (req, res) => {
    try {
      const data = await Category.findOne({ where: { id: req.params.id } });
      return res.render("main/edit_category.ejs", { data });
    } catch (error) {
      console.log("error", error);
    }
  };



  exports.updateCategory = async (req, res) => {
    const requiredData = {
      name: req.body.name,
    };
    try {
      await Category.update(requiredData, {
        where: { id: req.params.id },
      });
      return res.redirect("/admin/category");
    } catch (error) {
      console.log("error", error);
    }
  };




