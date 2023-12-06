import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    minlength: 4,
    maxlength: 50,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    minlength: 3,
    maxlength: 60,
    required: true,
    trim: true,
  },
  fullName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: {
      validator: (email) => {
        const re = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
        return re.test(email);
      },
      message: "Please enter a valid email.",
    },
  },
  role: {
    type: String,
    enum: ["admin", "writer", "guest"],
  },
  age: {
    type: Number,
    min: 1,
    max: 99,
  },
  numberOfArticles: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre("save", function (next) {
  this.fullName = `${this.firstName} ${this.lastName}`;
  if (this.age < 0) this.age = 1;
  next();
});

userSchema.pre(["updateOne", "findOneAndUpdate"], function (next) {
  const update = this.getUpdate();
  if (update.$set) {
    update.$set.updatedAt = new Date();
    update.$set.fullName = `${update.$set.firstName} ${update.$set.lastName}`;
  }
  next();
});

const User = mongoose.model("User", userSchema);

export default User;
