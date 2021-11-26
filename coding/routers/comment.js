const express = require("express");
const Comment = require("../schemas/comment");
const router = express.Router();
var jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/auth-middleware");
const { json } = require("body-parser");

// 해당글의 모든 댓글을 조회
router.get("/comment/:boardId", async (req, res, next) => {
  try {
    // const { user } = res.locals;
    // const nickname = user.nickname;
    const zz = req.params; // { boardId: '1637735868036' }
    console.log(zz);
    let aa = zz["boardId"];
    console.log(aa); //
    const comment = await Comment.find({ thisBoardId: aa }).sort("-date");
    res.json({ comment: comment });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

//댓글 작성
router.post(`/comment`, authMiddleware, async (req, res) => {
  console.log("----------------");
  console.log(res.locals.user);
  console.log(res.locals);
  console.log("----------------");

  const { user } = res.locals;
  const nickname = user.nickname;
  const { thisBoardId, comment, date } = req.body;

  await Comment.create({
    thisBoardId: thisBoardId,
    nickname: nickname,
    comment: comment,
    date: date,
  });
  res.send({ result: "success" });
});

module.exports = router;

//댓글 수정
router.patch("/comment/:date", async (req, res) => {
  const { date } = req.params;
  // const data = { title, writer, content } = req.body; 배열로 넣으려고 했는데 안됨

  const { comment } = req.body;
  console.log(req.body);
  console.log("수정용 리퀘바디");

  // const {  } = req.body;
  // console.log(title, writer, content)

  const updateComment = await Comment.find({ date });
  if (updateComment.length > 0) {
    // boards에 같은 boardId가 있으면
    await Comment.updateOne({ date: date }, { $set: { comment } });
  } // boardId가 같은 아이템을 찾아서 새로운 수량으로 바꿔줘라
  res.send({ result: "success" });
});

// 댓글 삭제
router.delete("/comment/:date", async (req, res) => {
  const { date } = req.params;

  const deleteComment = await Comment.find({ date });
  if (deleteComment.length > 0) {
    await Comment.deleteOne({ date });
  }
  res.send({ result: "success" });
});

module.exports = router;
