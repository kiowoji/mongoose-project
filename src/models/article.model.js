import mongoose from "mongoose";

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    minlength: 5,
    maxlength: 400,
    required: true,
    trim: true,
  },
  subtitle: {
    type: String,
    minlength: 5,
  },
  description: {
    type: String,
    minlength: 5,
    maxlength: 5000,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  category: {
    type: String,
    enum: ["sport", "games", "history"],
    required: true,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

articleSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

articleSchema.pre(["updateOne", "findOneAndUpdate"], function (next) {
  const update = this.getUpdate();
  update.$set.updatedAt = new Date();
  next();
});

const Article = mongoose.model("Article", articleSchema);

export default Article;
