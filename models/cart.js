'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Cart.init({
    productId: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    productprice: DataTypes.INTEGER,
    productName: DataTypes.STRING,
    totalPrice: DataTypes.INTEGER,


  }, {
    sequelize,
    modelName: 'Cart',
  });
  return Cart;
};