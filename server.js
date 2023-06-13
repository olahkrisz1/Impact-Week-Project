require("dotenv").config();

require("./config/mongoose");
const express = require("express");
const Routes = require("./config/Routes");
const cookieParser = require("cookie-parser");
const { requireAuth, checkUser } = require("./middleware/authMiddleware");
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

app.get("/allquestions", requireAuth, (req, res) => res.render("allquestions"));

// Use the question routes
const questionRoutes = require("./config/Routes");
app.use("/allquestions", questionRoutes);

// Use the routes
app.use(Routes);

let PORT = 9000;
app.listen(PORT, () => console.log(`Server on ${PORT}`));
