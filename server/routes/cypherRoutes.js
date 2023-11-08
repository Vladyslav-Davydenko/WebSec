const express = require("express");
const router = express.Router();
const cyphersController = require("../controllers/cyphersController");
const verifyJWT = require("../middleware/verifyJWT");
const verifyRoles = require("../middleware/verifyRoles");

router.use(verifyJWT);

router
  .route("/")
  .get(cyphersController.getAllCyphers)
  .post(cyphersController.createNewCypher);

router
  .route("/:id")
  .delete(verifyRoles("Admin"), cyphersController.deleteCypher);

module.exports = router;
