const mongoose = require("mongoose");

const cypherSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    plainText: {
      type: String,
      required: true,
    },
    cypherMethod: {
      type: String,
      required: true,
    },
    cypherText: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Cypher", cypherSchema);
