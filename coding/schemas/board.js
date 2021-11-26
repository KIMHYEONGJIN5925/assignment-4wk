const mongoose = require("mongoose");

const { Schema } = mongoose;
const boardSchema = new Schema({
  boardId: {
    type: Number,
  },
  date: {
    type: String,
  },
  nickname: {
    type: String,
  },
  title: {
    type: String,
  },
  content: {
    type: String,
  },
});

module.exports = mongoose.model("Board", boardSchema); // 이 모델을 라우터에서 사용한다?
