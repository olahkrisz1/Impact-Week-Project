const express = require("express");
const authController = require("../controllers/authController");
const questionController = require("../controllers/questionController");

const router = express.Router();

router.get("/signup", authController.signup_get);
router.post("/signup", authController.signup_post);
router.get("/login", authController.login_get);
router.post("/login", authController.login_post);
router.get("/logout", authController.logout_get);

router.get("/", questionController.homepage);
router.get("/new/question", questionController.newQuestionForm);
router.post("/new/question", questionController.createQuestion);
router.get("/question/:id", questionController.questionDetails);
router.post("/question/:id/delete", questionController.deleteQuestion);
router.get("/edit/question/:id", questionController.editQuestionForm);
router.post("/edit/question/:id", questionController.updateQuestion);

module.exports = router;
