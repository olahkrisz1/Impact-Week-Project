const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
  postId: {
    type: String,
    required: true,
  },

  comments: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Comment", commentSchema);
