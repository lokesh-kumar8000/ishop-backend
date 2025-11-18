const categoryModel = require("../model/category.model");
const productModel = require("../model/product.model");
const {
  createdSuccess,
  errorResponse,
  bedResponse,
  updateresponse,
  deletedresponse,
} = require("../utility/response");
const { createUniqeName } = require("../utility/helper");

const fs = require("fs");
const productModal = require("../model/product.model");

const category = {
  async create(req, res) {
    try {
      const categoryImg = req.files.image;
      const { name, slug } = req.body;
      if (!name || !slug) {
        return bedResponse(res, "name and slug is required");
      }
      const existing = await categoryModel.findOne({ name });
      if (existing) {
        return errorResponse(res, "Category already existing", existing, 400);
      }
      const image = createUniqeName(categoryImg.name);
      const destination = "public/image/category/" + image;
      categoryImg.mv(destination, async (error) => {
        if (error) {
          errorResponse(res, "file not upload");
        } else {
          const category = await categoryModel.create({
            name,
            slug,
            image,
          });
          await category.save();
          createdSuccess(res, "category created successfully");
        }
      });
    } catch (error) {
      console.log(error);
      errorResponse(res, "Internal server error");
    }
  },
  async get(req, res) {
    try {
      const id = req.params.id;

      const limit = parseInt(req.query.limit);

      let allCategory = null;
      if (id) {
        allCategory = await categoryModel.findById(id);
      } else {
        allCategory = await categoryModel.find().limit(limit);

        const data = await Promise.all(
          allCategory.map(async (cat) => {
            const productCount = await productModal.countDocuments({
              categoryId: cat._id,
            });
            return {
              ...cat.toObject(),
              productCount,
            };
          })
        );
        return createdSuccess(res, "find Category ", data);
      }

      if (!allCategory) {
        return bedResponse(res, "Category not exsitng");
      }
    } catch (error) {
      errorResponse(res, "Internal server error");
    }
  },

  async status(req, res) {
    try {
      const id = req.params.id;
      const categoryUpdated = await categoryModel.findOne({ _id: id });
      if (categoryUpdated) {
        await categoryModel.updateOne(
          { _id: id },
          {
            $set: {
              status: !categoryUpdated.status,
            },
          }
        );
      }
      updateresponse(res, "category updated ");
    } catch (error) {
      console.log(error);
      errorResponse(res, "Internal server error");
    }
  },

  async deleted(req, res) {
    try {
      const id = req.params.id;
      const existingCat = await categoryModel.findById(id);
      if (existingCat) {
        fs.unlinkSync(`./public/image/category/${existingCat.image}`);
      }
      const categoryDeleted = await categoryModel.findByIdAndDelete(id);
      deletedresponse(res, "category deleted successfully ", categoryDeleted);
    } catch (error) {
      console.log(error);
      errorResponse(res, "Internal server error");
    }
  },
  async update(req, res) {
    try {
      const categoryImg = req.files.image;
      const id = req.params.id;
      console.log(id);
      const { name, slug } = req.body;
      if (!name || !slug) {
        return bedResponse(res, "name and slug is required");
      }
      const existingItem = await categoryModel.findById(id);
      if (!existingItem) {
        return errorResponse(res, "Category not found ");
      }

      const update = {};
      if (name) update.name = name;
      if (slug) update.slug = slug;

      if (categoryImg) {
        const image = createUniqeName(categoryImg.name);
        const destination = "public/image/category/" + image;
        categoryImg.mv(destination, async (error) => {
          if (error) {
            errorResponse(res, "file not upload");
          } else {
            fs.unlinkSync(`./public/image/category/${existingItem.image}`);

            update.image = image;
            await categoryModel.findByIdAndUpdate(id, {
              $set: update,
            });
            updateresponse(res, "category update successfully");
          }
        });
      }
    } catch (error) {
      console.log(error);
      errorResponse(res, "Internal server error");
    }
  },
};

module.exports = category;
