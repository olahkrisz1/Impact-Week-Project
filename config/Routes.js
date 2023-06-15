const { Router } = require("express");
const express = require("express");
const authController = require("../controllers/authController");
const questionController = require("../controllers/questionController");
const commentController = require("../controllers/commentController");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

router.get("/signup", authController.signup_get);
router.post("/signup", authController.signup_post);
router.get("/login", authController.login_get);
router.post("/login", authController.login_post);
router.get("/logout", authController.logout_get);

router.get("/allquestions", questionController.viewpage);

router.get("/new/question", questionController.newQuestionForm);
router.post("/chat", questionController.askOpenai);
router.post("/new/question/:id", questionController.createQuestion);
router.get("/question/:id", questionController.questionDetails);
router.post("/question/:id/delete", questionController.deleteQuestion);
router.get("/edit/question/:id", questionController.editQuestionForm);
router.post("/edit/question/:id", questionController.updateQuestion);

router.post(
  "/question/:id/comment",
  authMiddleware.checkUser,
  commentController.newComment
);
router.get("/question/:id/comments", commentController.getComments);
router.post(
  "/comment/:id/delete",
  authMiddleware.checkUser,
  commentController.deleteComment
);

module.exports = router;
