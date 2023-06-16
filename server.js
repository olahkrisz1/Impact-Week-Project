require("dotenv").config();

require("./config/mongoose");
const express = require("express");
const Routes = require("./config/Routes");
const cookieParser = require("cookie-parser");
const { requireAuth, checkUser } = require("./middleware/authMiddleware");
// const { viewpage } = require("./controllers/questionController");
// const { newQuestionForm } = require("./controllers/questionController");
// const { createQuestion } = require("./controllers/questionController");
// const { questionDetails } = require("./controllers/questionController");
// const { deleteQuestion } = require("./controllers/questionController");
// const { editQuestionForm } = require("./controllers/questionController");
// const { updateQuestion } = require("./controllers/questionController");

const app = express();

// Use CSS,JS
app.use("/public", express.static("public"));
app.use(cookieParser());

// Set EJS as a view engine
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Make app use the route
app.get("*", checkUser);

app.get("/", (req, res) => res.render("home"));

// app.get("/allquestions", requireAuth, viewpage);
// app.get("/question", requireAuth, viewpage);
// app.get("/new/question", requireAuth, newQuestionForm);
// app.post("/new/question/", requireAuth, createQuestion);
// app.get("/question/:id", requireAuth, questionDetails);
// app.post("/question/:id/delete", requireAuth, deleteQuestion);
// app.get("/edit/question/:id", requireAuth, editQuestionForm);
// app.post("/edit/question/:id", requireAuth, updateQuestion);

// Use the routes
app.use(Routes);

let PORT = 8500;
app.listen(PORT, () => console.log(`Server on ${PORT}`));
