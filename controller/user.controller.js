const userModel = require("../model/user.model");
const {
  errorResponse,
  bedResponse,
  createdSuccess,
  successResponse,
} = require("../utility/response");
const Cryptr = require("cryptr");
const cryptr = new Cryptr(process.env.TOKEN_SECRETY_KEY);
var jwt = require("jsonwebtoken");

const user = {
  async register(req, res) {
    try {
      const { name, email, password } = req.body;
      const existing = await userModel.findOne({ email: email });
      if (existing) return bedResponse(res, "email already registrd");
      const encryptedPassword = cryptr.encrypt(password);
      const newUser = await new userModel({
        name,
        email,
        password: encryptedPassword,
      });
      newUser.save();
      const token = jwt.sign(
        {
          id: newUser._id,
          email: newUser.email,
        },
        process.env.TOKEN_SECRETY_KEY,
        { expiresIn: "7d" }
      );
      return createdSuccess(res, "user Registerd", {
        user: {
          ...newUser.toJSON(),
          password: null,
        },
        token,
      });
    } catch (error) {
      console.log(error);
      errorResponse(error);
    }
  },
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const existingUser = await userModel.findOne({ email: email });
      if (!existingUser) return errorResponse(res, "User not found");
      const decryptedPassword = cryptr.decrypt(existingUser.password);
      if (decryptedPassword !== password)
        return errorResponse(res, "Invalid password");

      const token = jwt.sign(
        {
          id: existingUser._id,
          email: existingUser.email,
        },
        process.env.TOKEN_SECRETY_KEY,
        { expiresIn: "7d" }
      );

      return successResponse(res, "User Logged In ", {
        user: {
          ...existingUser.toJSON(),
          password: null,
        },
        token,
      });
    } catch (error) {
      console.log(error);
      errorResponse(error);
    }
  },

  async address(req, res) {
    try {
      const { userData, loginAt, token } = req.body;
      const userId = req.params.userId;
      await userModel.updateOne(
        { _id: userId },
        {
          $push: {
            shipping_address: { ...userData },
          },
        }
      );
      const updatedUser = await userModel.findById(userId);
      return createdSuccess(
        res,
        "user address updated",
        (userWithOutPassword = {
          ...updatedUser.toJSON(),
          password: null,
          loginAt,
          token,
        })
      );
    } catch (error) {
      console.log(error);
      errorResponse(res);
    }
  },
  async get(req, res) {
    try {
      const id = req.params.id;
      let user = null;
      if (id) {
        user = await userModel.findById(id);
      } else {
        user = await userModel.find();
      }
      if (user) {
        return successResponse(res, "user found", user);
      }
    } catch (error) {
      console.log(error);
      errorResponse(res);
    }
  },
  async remove(req, res) {
    try {
      const id = req.params.id;
      const index = req.params.index;
      const userData = await userModel.findById(id);
      if (!userData) return errorResponse(res, "User not found");
      userData?.shipping_address.splice(index, 1);
      await userData.save();
      return successResponse(res, "address deleted", userData);
    } catch (error) {
      console.log(error);
      errorResponse(res);
    }
  },
  async updatePassword(req, res) {
    try {
      const user_id = req.params.user_id;
      const { current, newPass, confirm } = req.body;
      const user = await userModel.findById(user_id);
      if (!user) return errorResponse(res, "User not found");
      const decryptedPassword = cryptr.decrypt(user.password);
      if (decryptedPassword === current) {
        if (newPass === confirm) {
          const encryptedPassword = cryptr.encrypt(newPass);
          const updatePass = await userModel.findByIdAndUpdate(user_id, {
            $set: {
              password: encryptedPassword,
            },
          });
          updatePass.save();
          return createdSuccess(res, "password updated", updatePass);
        } else {
          errorResponse(res, " both password are incurrect ");
        }
      } else {
        errorResponse(res, "Incrrect Old Password");
      }
    } catch (error) {
      console.log(error);
      errorResponse(error);
    }
  },
};

module.exports = user;
