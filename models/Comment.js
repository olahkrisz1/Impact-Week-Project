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
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
});

module.exports = mongoose.model("Comment", commentSchema);
