const express = require("express");
const router = express.Router();
const cyphersController = require("../controllers/cyphersController");
const verifyJWT = require("../middleware/verifyJWT");
const verifyRoles = require("../middleware/verifyRoles");

router.use(verifyJWT);

router
  .route("/")
  .get(verifyRoles("Admin"), cyphersController.getAllCyphers)
  .post(verifyRoles("Admin"), cyphersController.createNewCypher)
  .delete(verifyRoles("Admin"), cyphersController.deleteCypher);

module.exports = router;
