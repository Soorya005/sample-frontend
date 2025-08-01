const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    pincode: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // This adds createdAt and updatedAt fields automatically
  }
);

// // Hash the phone number before saving
// userSchema.pre("save", async function (next) {
//   if (this.isModified("phone")) {
//     this.phone = await bcrypt.hash(this.phone, 10);
//   }
//   next();
// });

module.exports = mongoose.model("User", userSchema);
