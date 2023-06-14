const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");
const Question = require("../models/Question");

const newComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { comments } = req.body;

    // Create a new comment
    const comment = new Comment({
      postId: id,
      comments,
      owner: req.params.id,
    });

    // Save the comment
    await comment.save();

    // Find the question and update the comments array
    const question = await Question.findById(id);
    question.comments.push(comment);
    await question.save();

    res.redirect(`/question/${id}`);
  } catch (error) {
    console.error(error);
    const errorMessage = "Internal Server Error";
    res.render("error", { errorMessage });
  }
};

const getComments = async (request, response) => {
  try {
    const comments = await Comment.find({ postId: request.params.id });

    response.status(200).json(comments);
  } catch (error) {
    response.status(500).json(error);
  }
};

const deleteComment = async (request, response) => {
  try {
    const comment = await Comment.findById(request.params.id);
    await comment.delete();

    response.status(200).json("comment deleted successfully");
  } catch (error) {
    response.status(500).json(error);
  }
};

module.exports = {
  newComment,
  getComments,
  deleteComment,
};
