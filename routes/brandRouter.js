const express = require("express");
const brandRouter = express.Router();

const brandController = require("../controllers/brandController");
const {
  authenticateUser,
  authorizeAdmin,
} = require("../middleware/authenticatedMiddleware");
brandRouter
  .get("/", brandController.getAllBrands)
  .get("/:brandId", brandController.getBrandById)
  .delete(
    "/:brandId",
    authenticateUser,
    authorizeAdmin,
    brandController.deleteBrandById
  )
  .post("/", authenticateUser, authorizeAdmin, brandController.addBrand)
  .put(
    "/:brandId",
    authenticateUser,
    authorizeAdmin,
    brandController.updateBrandById
  );
module.exports = brandRouter;
