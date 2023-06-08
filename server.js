require("dotenv").config();

require("./config/mongoose");
const express = require("express");
const app = express();

// Use CSS,JS
app.use("/public", express.static("public"));

// Set EJS as a view engine
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Make app use the route
app.use(route);

let PORT = 9000;
app.listen(PORT, () => console.log(`Server on ${PORT}`));
