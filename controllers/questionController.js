const express = require("express");
const router = express.Router();
const Question = require("../models/Question");

// Home route - list questions
const viewpage = (req, res) => {
  Question.find({})
    .populate("owner")
    .sort({ createdAt: -1 })
    .then((questions) => {
      res.render("allquestions", { user: req.user, questions: questions });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Internal Server Error");
    });
};

// New question form route
const newQuestionForm = (req, res) => {
  res.render("new");
};

// Create a new question
const createQuestion = (req, res) => {
  const { title, text } = req.body;

  if (!title || !text || title.length <= 10 || text.length <= 10) {
    const errorMessage =
      "Invalid input. Question must be longer than 10 characters, and description must be longer than 10 characters.";
    res.render("error", { errorMessage });
    return;
  }

  const newQuestion = new Question({
    title,
    text,
    createdAt: new Date(),
    owner: req.params.id,
  });

  newQuestion
    .save()
    .then(() => {
      res.redirect("/allquestions");
    })
    .catch((error) => {
      console.error(error);
      const errorMessage = "Internal Server Error";
      res.render("error", { errorMessage });
    });
};

// Question details route
const questionDetails = (req, res) => {
  const { id } = req.params;

  Question.findById(id)
    .then((question) => {
      if (!question) {
        const errorMessage = "Question not found.";
        res.render("error", { errorMessage });
        return;
      }

      res.render("question", { question: question });
    })
    .catch((error) => {
      console.error(error);
      const errorMessage = "Internal Server Error";
      res.render("error", { errorMessage });
    });
};

// Delete question route
const deleteQuestion = (req, res) => {
  const { id } = req.params;

  Question.findByIdAndRemove(id)
    .then(() => {
      res.redirect("/allquestions");
    })
    .catch((error) => {
      console.error(error);
      const errorMessage = "Internal Server Error";
      res.render("error", { errorMessage });
    });
};

// Edit question form route
const editQuestionForm = (req, res) => {
  const { id } = req.params;

  Question.findById(id)
    .then((question) => {
      if (!question) {
        const errorMessage = "Question not found.";
        res.render("error", { errorMessage });
        return;
      }

      res.render("edit", { question });
    })
    .catch((error) => {
      console.error(error);
      const errorMessage = "Internal Server Error";
      res.render("error", { errorMessage });
    });
};

// Update question route
const updateQuestion = (req, res) => {
  const { id } = req.params;
  const { title, text } = req.body;

  if (!title || !text || title.length <= 10 || text.length <= 10) {
    const errorMessage =
      "Invalid input. Question must be longer than 10 characters, and description must be longer than 10 characters.";
    res.render("error", { errorMessage });
    return;
  }

  Question.findById(id)
    .then((question) => {
      if (!question) {
        const errorMessage = "Question not found";
        res.render("error", { errorMessage });
        return;
      }

      question.title = title;
      question.text = text;
      question.updatedAt = new Date();

      return question.save();
    })
    .then(() => {
      res.redirect("/allquestions");
    })
    .catch((error) => {
      console.error(error);
      const errorMessage = "Internal Server Error";
      res.render("error", { errorMessage });
    });
};

module.exports = {
  viewpage,
  newQuestionForm,
  createQuestion,
  questionDetails,
  deleteQuestion,
  editQuestionForm,
  updateQuestion,
};
