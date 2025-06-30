const express = require("express");
const perfumeRouter = express.Router();
const perfumeController = require("../controllers/perfumeController");
const {
  authenticateUser,
  authorizeAdmin,
} = require("../middleware/authenticatedMiddleware");

perfumeRouter
  .get("/", perfumeController.getAllPerfumes)
  .get("/:perfumeId", perfumeController.getPerfumeById)
  .delete(
    "/:perfumeId",
    authenticateUser,
    authorizeAdmin,
    perfumeController.deletePerfumeById
  )
  .post("/", authenticateUser, authorizeAdmin, perfumeController.addPerfume)
  .put(
    "/:perfumeId",
    authenticateUser,
    authorizeAdmin,
    perfumeController.updatePerfumeById
  );

module.exports = perfumeRouter;
