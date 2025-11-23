const colorModel = require("../model/color.model");
const {
  bedResponse,
  errorResponse,
  successResponse,
  createdSuccess,
  deletedresponse,
  updateresponse,
} = require("../utility/response");

const color = {
  async create(req, res) {
    try {
      const { name, slug, hexCode } = req.body;
      if (!name || !slug || !hexCode) {
        return bedResponse(res, "name , slug and hexcode is required");
      }

      const exixtingColor = await colorModel.findOne({ name });
      if (exixtingColor) {
        bedResponse(res, "color already existing", exixtingColor);
      }
      await colorModel.create({
        name,
        slug,
        hexCode,
      });
      createdSuccess(res, "color created successfully!");
    } catch (error) {
      console.log(error);
      errorResponse(res);
    }
  },

  async read(req, res) {
    try {
      const id = req.params.id;
      let colorsGet = null;
      if (id) {
        colorsGet = await colorModel.findById(id);
      } else {
        colorsGet = await colorModel.find();
      }
      if (!colorsGet) {
        return bedResponse(res, " This color not exist ");
      }
      return successResponse(res, " Find all colors ", colorsGet);
    } catch (error) {
      console.log(error);
      errorResponse(res);
    }
  },

  async status(req, res) {
    try {
      const id = req.params.id;
      const colorsId = await colorModel.findOne({ _id: id });
      if (colorsId) {
        const colorStatus = await colorModel.updateOne(
          { _id: id },
          {
            $set: {
              status: !colorsId.status,
            },
          }
        );
        successResponse(res, "color status update", colorStatus);
      }
    } catch (error) {
      console.log(error);
      errorResponse(res);
    }
  },

  async deleted(req, res) {
    try {
      const id = req.params.id;
      const colorDeleted = await colorModel.findByIdAndDelete(id);
      deletedresponse(res, "color deleted... ", colorDeleted);
    } catch (error) {
      console.log(error);
      errorResponse(res);
    }
  },
  async update(req, res) {
    try {
      const id = req.params.id;
      const { name, slug, hexCode } = req.body;
      if (!name || !slug || !hexCode) {
        return bedResponse(res, "name,slug and hexCode is required");
      }
      const existingItem = await colorModel.findById(id);
      if (!existingItem) {
        return errorResponse(res, "Category not found ");
      }

      const update = {};
      if (name) update.name = name;
      if (slug) update.slug = slug;
      if (hexCode) update.hexCode = hexCode;
      await colorModel.findByIdAndUpdate(id, {
        $set: update,
      });
      updateresponse(res, "color update successfully");
    } catch (error) {
      console.log(error);
      errorResponse(res, "Internal server error");
    }
  },
};

module.exports = color;
