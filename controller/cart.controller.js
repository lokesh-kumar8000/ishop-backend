const cartModel = require("../model/cart.model");
const {
  createdSuccess,
  errorResponse,
  successResponse,
  updateresponse,
} = require("../utility/response");

const cart = {
  async moveDB(req, res) {
    try {
      const { cart, userId } = req.body;

      if (cart == null || cart.length == 0) {
        return successResponse(res, "cart", {
          cart: await cartModel
            .find({ user_id: userId })
            .populate("product_id", "originalPrice _id finalPrice"),
        });
      }

      await Promise.all(
        cart.map(async (product) => {
          const existingItem = await cartModel.findOne({
            user_id: userId,
            product_id: product.productId,
          });

          if (existingItem) {
            existingItem.qty += Number(product.qty);
            await existingItem.save();
          } else {
            await cartModel.create({
              user_id: userId,
              product_id: product.productId,
              qty: product.qty,
            });
          }
        })
      );
      return createdSuccess(res, "Cart Update", {
        cart: await cartModel
          .find({ user_id: userId })
          .populate("product_id", "originalPrice _id finalPrice"),
      });
    } catch (error) {
      console.log(error);
      errorResponse(res);
    }
  },

  async addtoCart(req, res) {
    try {
      const { productId, qty, userId } = req.body; 
      const existingItem = await cartModel.findOne({
        user_id: userId,
        product_id: productId,
      });
      if (existingItem) {
        existingItem.qty += Number(qty);
        await existingItem.save();
      } else {
        const updateCart = await cartModel.create({
          user_id: userId,
          product_id: productId,
          qty: 1,
        });
        await updateCart.save();
      }
      return createdSuccess(res, "Cart add successfull ");
    } catch (error) {
      console.log(error);
      errorResponse(res);
    }
  },

  async removeCart(req, res) {
    try {
      const { id, userId } = req.params;

      await cartModel.deleteOne({
        user_id: userId,
        product_id: id,
      });
      return successResponse(res, "Cart Delete Successfully ");
    } catch (error) {
      console.log(error);
      errorResponse(error);
    }
  },

  async updateDb(req, res) {
    try {
      const { id, userId, flag } = req.params;
      const existingCart = await cartModel.findOne({
        user_id: userId,
        product_id: id,
      });
      if (!existingCart) return errorResponse(res, "cart not found");

      if (flag == "+") {
        existingCart.qty++;
      } else if (flag == "-") {
        if (existingCart.qty > 1) {
          existingCart.qty--;
        }
      } else {
        errorResponse(res, "flag is Missing!");
      }
      existingCart.save();
      return updateresponse(res, "Cart Qty Change");
    } catch (error) {
      console.log(error);
      errorResponse(res);
    }
  },
};

module.exports = cart;
