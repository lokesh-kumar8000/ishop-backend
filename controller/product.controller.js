const productModal = require("../model/product.model");
const categoryModal = require("../model/category.model");
const brandModel = require("../model/brand.model");
const colorModel = require("../model/color.model");
const { createUniqeName } = require("../utility/helper");
const {
  createdSuccess,
  errorResponse,
  bedResponse,
  successResponse,
  deletedresponse,
  updateresponse,
} = require("../utility/response");
const fs = require("fs");

async function savefile(imgObj) {
  const imageName = createUniqeName(imgObj.name);
  const destination = "public/image/product/" + imageName;
  await imgObj.mv(destination); 
  return imageName;
}

const product = {
  async create(req, res) {
    try {
      const thumbnail = req.files?.thumbnail
        ? await savefile(req.files.thumbnail)
        : null;

      const images = req.files?.images
        ? await Promise.all(
            (Array.isArray(req.files.images)
              ? req.files.images
              : [req.files.images]
            ).map((img) => savefile(img))
          )
        : [];

      await productModal.create({
        ...req.body,
        colors: JSON.parse(req.body.colors),
        thumbnail,
        images,
      });
      return createdSuccess(res, "product created !");
    } catch (error) {
      console.log(error);
      errorResponse(res);
    }
  },
  async read(req, res) {
    try {
      const {
        categorySlug,
        brandSlug,
        colorSlug,
        min,
        max,
        limit,
        currentPage,
      } = req.query;
      const id = req.params.id;
      let limits = limit || 12;
      let skip = (currentPage - 1) * limits;
      // console.log(skip, "skip");
      const filterQuery = {};
      if (categorySlug) {
        const category = await categoryModal.findOne({ slug: categorySlug });
        if (category) {
          filterQuery.categoryId = category._id;
        }
      }
      if (brandSlug) {
        const brand = await brandModel.findOne({ slug: brandSlug });
        if (brand) {
          filterQuery.brandId = brand._id;
        }
      }
      if (colorSlug) {
        const color = await colorModel.findOne({ slug: colorSlug });
        if (color) {
          filterQuery.colors = color._id;
        }
      }

      if (min && max) {
        filterQuery.finalPrice = {
          $gte: min,
          $lte: max,
        };
      }
      let product = null;
      if (id) {
        product = await productModal
          .findById(id)
          .populate(["categoryId", "brandId", "colors"]);
      } else {
        product = await productModal
          .find(filterQuery)
          .populate(["categoryId", "brandId", "colors"])
          .skip(skip)
          .limit(limits);
      }

      if (!product) {
        bedResponse(res, "product not exist");
      }
      const totalProduct = await productModal.countDocuments();
      return res.status(200).json({
        success: true,
        status: "success",
        message: "product find",
        timestamp: new Date().toISOString(),
        data: product,
        total_product: totalProduct,
      });
    } catch (error) {
      console.log(error);
      errorResponse(res, error);
    }
  },
  async status(req, res) {
    try {
      const id = req.params.id;
      const { flag } = req.body;
      const findStatus = await productModal.findOne({ _id: id });
      let updated = {};
      if (flag === 1) {
        updated = { stock: !findStatus.stock };
      } else if (flag === 2) {
        updated = { topSelling: !findStatus.topSelling };
      } else if (flag === 3) {
        updated = { status: !findStatus.status };
      }

      await productModal.updateOne(
        { _id: id },
        {
          $set: updated,
        }
      );
      updateresponse(res, "product status updated");
    } catch (error) {
      console.log(error);
      errorResponse(res, error);
    }
  },
  async deleted(req, res) {
    try {
      const { id } = req.params;
      const existingPro = await productModal.findById(id);
      if (existingPro) {
        if (existingPro.thumbnail) {
          fs.unlinkSync(`./public/image/product/${existingPro.thumbnail}`);
        }
        if (Array.isArray(existingPro.images)) {
          existingPro.images.forEach((img) => {
            fs.unlinkSync(`./public/image/product/${img}`);
          });
        }
        const productDelete = await productModal.findByIdAndDelete(id);
        deletedresponse(res, "product deleted", productDelete);
      }
    } catch (error) {
      console.log(error);
      errorResponse(res, error);
    }
  },
  async updated(req, res) {
    try {
      const { id } = req.params;
      const existingProduct = await productModal.findById(id);
      if (!existingProduct) {
        return bedResponse(res, "product not found");
      }

      let thumbnail = existingProduct.thumbnail;
      if (req.files?.thumbnail) {
        if (existingProduct.thumbnail) {
          try {
            fs.unlinkSync(
              `./public/image/product/${existingProduct.thumbnail}`
            );
          } catch (error) {
            console.log("Thumbnail not found to delete");
          }
        }
        thumbnail = await savefile(req.files.thumbnail);
      }

      let images = existingProduct.images || [];
      if (req.files?.images) {
        if (existingProduct.images && existingProduct.images.length > 0) {
          existingProduct.images.forEach((img) => {
            try {
              fs.unlinkSync(`./public/image/product/${img}`);
            } catch (error) {
              console.log("Image not found to delete");
            }
          });
        }

        images = await Promise.all(
          (Array.isArray(req.files.images)
            ? req.files.images
            : [req.files.images]
          ).map((img) => savefile(img))
        );
      }

      const update = {
        ...req.body,
        colors: req.body.colors
          ? JSON.parse(req.body.colors)
          : existingProduct.colors,
        thumbnail,
        images,
      };

      await productModal.findByIdAndUpdate(id, { $set: update });

      return createdSuccess(res, "Product updated successfully!");
    } catch (error) {
      console.log(error);
      errorResponse(res);
    }
  },
};

module.exports = product;
2;
