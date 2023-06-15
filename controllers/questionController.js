const express = require("express");
const router = express.Router();
require("dotenv").config();
const Question = require("../models/Question");
const openai = require("openai");

//Configure OpenAI
const configuration = new openai.Configuration({
  organization: process.env.OPENAI_ORG,
  apiKey: process.env.OPENAI_API_KEY,
});

const openaiapi = new openai.OpenAIApi(configuration);

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

const askOpenai = async (req, res) => {
  const messages = req.body.messages;
  const model = req.body.model;
  const temp = req.body.temp;

  const completion = await openaiapi.createChatCompletion({
    model: model,
    messages: messages,
    temperature: temp,
  });
  res.status(200).json({ result: completion.data.choices });
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
    comments: [],
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
const questionDetails = async (req, res) => {
  const { id } = req.params;

  try {
    const question = await Question.findById(id).populate({
      path: "comments",
      populate: { path: "owner" },
    });
    if (!question) {
      const errorMessage = "Question not found.";
      res.render("error", { errorMessage });
      return;
    }

    res.render("question", { question });
  } catch (error) {
    console.error(error);
    const errorMessage = "Internal Server Error";
    res.render("error", { errorMessage });
  }
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
  askOpenai,
  createQuestion,
  questionDetails,
  deleteQuestion,
  editQuestionForm,
  updateQuestion,
};
