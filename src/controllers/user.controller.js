import User from "../models/user.model.js";
import Article from "../models/article.model.js";

export const getUsers = async (req, res, next) => {
  try {
    const { sortBy = "asc" } = req.query;

    const users = await User.find({}, { _id: 1, fullName: 1, email: 1, age: 1 })
      .sort({ age: sortBy })
      .exec();

    return res.status(200).json({
      success: true,
      message: "Successfully retrieved users",
      data: users,
    });
  } catch (err) {
    next(err);
  }
};

export const getUserByIdWithArticles = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id).populate({
      path: "articles",
      select: "-_id title subtitle createdAt",
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({
      success: true,
      message: "Successfully retrieved user with articles",
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const savedUser = await User.create(req.body);

    res.status(201).json({
      message: "User created successfully",
      data: savedUser,
    });
  } catch (err) {
    next(err);
  }
};

export const updateUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { firstName, lastName, age } = req.body;

    const updatedUser = await User.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          firstName,
          lastName,
          age,
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res
      .status(200)
      .json({ message: "User updated successfully.", data: updatedUser });
  } catch (err) {
    next(err);
  }
};

export const deleteUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    await Article.updateMany(
      { _id: { $in: user.likedArticles } },
      { $pull: { likes: id } }
    );

    await User.findByIdAndDelete(id);
    await Article.deleteMany({ owner: id });

    res.status(200).json({ message: "User deleted successfully." });
  } catch (err) {
    next(err);
  }
};
