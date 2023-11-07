const express = require("express");
const router = express.Router();
const cyphersController = require("../controllers/cyphersController");
const verifyJWT = require("../middleware/verifyJWT");

router.use(verifyJWT);

router
  .route("/")
  .get(cyphersController.getAllCyphers)
  .post(cyphersController.createNewCypher)
  .delete(cyphersController.deleteCypher);

module.exports = router;
