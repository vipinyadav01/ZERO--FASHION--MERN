import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    profileImage: { type: String, default: "" },
    cartData: { type: Object, default: {} },
    role: { type: String, default: "user" },
    isAdmin: { type: Boolean, default: false },
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
  },
  { timestamps: true, minimize: false }
);

const UserModel = mongoose.models.User || mongoose.model("User", userSchema);

export default UserModel;