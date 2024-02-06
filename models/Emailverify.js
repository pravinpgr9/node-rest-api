const mongoose = require("mongoose");

// Define Emailverify schema
const EmailverifySchema = new mongoose.Schema({
    email: {
      type: String,
      required: true,
    },
    verified_at: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    remarks: {
      type: String,
      required: true,
    },
    error: {
      type: String
    },
    error_code: {
      type: Number,
      required: true,
    },
  });

module.exports = mongoose.model("Emailverify", EmailverifySchema);