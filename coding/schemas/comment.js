const mongoose = require("mongoose");

const { Schema } = mongoose;
const commentSchema = new Schema({
  thisBoardId: {
    type: Number,
  },
  nickname: {
    type: String,
  },
  comment: {
    type: String,
  },
  date: {
    type: String,
  },
});

// commentSchema.virtual("userId").get(function () {
//   return this._id.toHexString();
// });
// commentSchema.set("toJSON", {
//   virtuals: true,
// });

module.exports = mongoose.model("Comment", commentSchema); // 이 모델을 라우터에서 사용한다?
