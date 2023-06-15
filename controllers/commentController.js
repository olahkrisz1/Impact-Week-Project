const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");
const Question = require("../models/Question");

const newComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { comments } = req.body;
    const { userId } = req.query;

    // Create a new comment
    const comment = new Comment({
      postId: id,
      comments,
      owner: userId,
    });
    //console.log("New Comment:", comment);
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

const deleteComment = (req, res) => {
  const { id } = req.params;

  Comment.findByIdAndRemove(id)
    .then(() => {
      res.redirect("/allquestions"); // Replace with the appropriate URL or route
    })
    .catch((error) => {
      console.error(error);
      const errorMessage = "Internal Server Error";
      res.render("error", { errorMessage });
    });
};

module.exports = {
  newComment,
  getComments,
  deleteComment,
};
