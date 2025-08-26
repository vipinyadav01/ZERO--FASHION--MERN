import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true, select: false },
    profileImage: { type: String, default: "" },
    cartData: { type: Object, default: {} },
    role: { type: String, default: "user", index: true },
    isAdmin: { type: Boolean, default: false, index: true },
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
    isActive: { type: Boolean, default: true, index: true },
    isDeleted: { type: Boolean, default: false, index: true }
  },
  { timestamps: true, minimize: false }
);

userSchema.index({ name: 1, email: 1 });
userSchema.index({ createdAt: -1 });

const UserModel = mongoose.models.User || mongoose.model("User", userSchema);

export default UserModel;