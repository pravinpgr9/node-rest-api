const mongoose = require("mongoose");

const LinkedpostSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      max: 50 
    },
    desc:{
      type:String
    },
    city:{
      type:String,
      max:50
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Linkedpost", LinkedpostSchema);