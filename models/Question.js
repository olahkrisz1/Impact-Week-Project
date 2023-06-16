const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 10,
    },
    text: {
      type: String,
      required: true,
      minlength: 10,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  { timestamps: true }
);

questionSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
