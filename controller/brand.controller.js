const brandModel = require("../model/brand.model");
const productModal = require("../model/product.model");
const { createUniqeName } = require("../utility/helper");
const {
  bedResponse,
  createdSuccess,
  errorResponse,
  updateresponse,
  deletedresponse,
} = require("../utility/response");

const fs = require("fs");
const brand = {
  async create(req, res) {
    try {
      const { name, slug } = req.body;
      const brandImg = req.files.image;
      if (!name || !slug) {
        bedResponse(res, "name and slug is required");
      }

      const existingBrand = await brandModel.findOne({ name });
      if (existingBrand) {
        bedResponse(res, "brand already exist ");
      }

      const image = createUniqeName(brandImg.name);
      const destination = "public/image/brand/" + image;
      brandImg.mv(destination, async (error) => {
        if (error) {
          errorResponse(res, " file not found ");
        } else {
          const brand = await brandModel.create({
            name,
            slug,
            image,
          });
          await brand.save();
          createdSuccess(res, "brand created Successfully"); 
        }
      });
    } catch (error) {
      console.log(error);
      errorResponse(res, "Internal server error");
    }
  },
  async read(req, res) {
    try {
      const id = req.params.id;
      const limit = parseInt(req.query.limit);
      let allbrand = null;
      if (id) {
        allbrand = await brandModel.findById(id);
      } else {
        allbrand = await brandModel.find().limit(limit);

        const data = await Promise.all(
          allbrand.map(async (brand) => {
            const brandCount = await productModal.countDocuments({
              brandId: brand._id,
            });
            return {
              ...brand.toObject(),
              brandCount,
            };
          })
        );
        return createdSuccess(res, "find brand ", data);
      }

      if (!allbrand) {
        return bedResponse(res, "brand not exsitng");
      }
    } catch (error) {
      errorResponse(res, "Internal server error");
    }
  },
  async status(req, res) {
    try {
      const id = req.params.id;
      const brandStatus = await brandModel.findOne({ _id: id });
      if (brandStatus) {
        await brandModel.updateOne(
          { _id: id },
          {
            $set: {
              status: !brandStatus.status,
            },
          }
        );
        updateresponse(res, "Status Updated ");
      }
    } catch (error) {
      console.log(error);
      errorResponse(res);
    }
  },
  async deleted(req, res) {
    try {
      const id = req.params.id;

      const existingBrand = await brandModel.findById(id);
      if (existingBrand) {
        fs.unlinkSync(`./public/image/brand/${existingBrand.image}`);
      }

      const branddeleted = await brandModel.findByIdAndDelete(id);
      deletedresponse(res, "brand remove ", branddeleted);
    } catch (error) {
      console.log(error);
      errorResponse(res);
    }
  },
  async update(req, res) {
    try {
      const brandImg = req.files.image;
      const id = req.params.id;
      const { name, slug } = req.body;
      if (!name || !slug) {
        return bedResponse(res, "name and slug is required");
      }
      const existingbrand = await brandModel.findById(id);
      if (!existingbrand) {
        return errorResponse(res, "Category not found ");
      }

      const update = {};
      if (name) update.name = name;
      if (slug) update.slug = slug;

      if (brandImg) {
        const image = createUniqeName(brandImg.name);
        const destination = "public/image/brand/" + image;
        brandImg.mv(destination, async (error) => {
          if (error) {
            errorResponse(res, "file not upload");
          } else {
            fs.unlinkSync(`./public/image/brand/${existingbrand.image}`);
            update.image = image;
            await brandModel.findByIdAndUpdate(id, {
              $set: update,
            });
            updateresponse(res, "brands update successfully");
          }
        });
      }
    } catch (error) {
      console.log(error);
      errorResponse(res, "Internal server error");
    }
  },
};

module.exports = brand;
