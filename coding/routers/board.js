const express = require("express");
const Board = require("../schemas/board"); // 스키마에서 모델을 가져옴

const router = express.Router();

//전체게시물 조회
router.get("/board", async (req, res, next) => {
  try {
    const { name } = req.query;
    const board = await Board.find({ name }).sort("-boardId");
    res.json({ board: board });
  } catch (err) {
    console.error(err);
    next(err);
  }
});
 
//상세 조회
router.get("/board/:boardId", async (req, res) => {
  const { boardId } = req.params;
  board = await Board.findOne({ boardId: boardId });
  res.json({ detail: board });
});


//게시물 작성
router.post('/board', async (req, res) => {
  const {boardId, date, name, pass, title, content } = req.body;
  await Board.create({boardId: boardId, date: date, name: name, pass: pass, title: title, content: content });
  res.send({ result: "success" });
});


//수정페이지 게시글 보여주기
router.get("/updateBoard/:boardId", async (req, res) => { // api에 boards의 boardId값
  const { boardId } = req.params; // req.params 에서 값 가져옴
  board = await Board.findOne({ boardId: boardId }); // 여러개 중 특정 하나 클릭 했을 때 상세 페이지로 넘어감
  res.json({ detail: board }); // detail 이라는 key 에 boards 담음
});


//게시글 수정
router.patch("/board/:boardId/update", async (req, res) => {
  const { boardId } = req.params;
  // const data = { title, writer, content } = req.body; 배열로 넣으려고 했는데 안됨
  console.log(req.body)
  const { title, name, content, pass } = req.body;
  console.log(title)
  // const {  } = req.body;
  // console.log(title, writer, content)

  const isIdInBoard = await Board.find({ boardId });
  if (isIdInBoard.length > 0) { // boards에 같은 boardId가 있으면
      await Board.updateOne({ boardId:boardId }, { $set: { title, name, content, pass } }); 
  } // boardId가 같은 아이템을 찾아서 새로운 수량으로 바꿔줘라
  res.send({ result: "success" });
})


// 게시글 삭제
router.delete("/board/:boardId/delete", async (req, res) => {
  const { boardId } = req.params;

  const isIdInBoard = await Board.find({ boardId });
  if (isIdInBoard.length > 0) {
      await Board.deleteOne({ boardId });
  }
  res.send({ result: "success" });
});


module.exports = router;