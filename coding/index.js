const express = require("express"); //    2-2강
var app = express(); // 익스프레스 앱을 사용
const port = 3000;
var bodyParser = require("body-parser");
const boardRouter = require("./routers/board");
const userRouter = require("./routers/users"); // 로긴회원가입
const commentRouter = require("./routers/comment");
app.use(express.json()); // 4주차 사용예정
app.use(express.urlencoded({ extended: false })); //4주차 사용예정   2-4강
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded());
app.set("views", __dirname + "/views");
app.set("view engine", "ejs"); // 템플릿엔진 ejs를 이 웹의 뷰엔진으로 사용하겠다.
app.use("/api", [boardRouter]); //3-5강
app.use("/api", [userRouter]); // 로긴회원가입
app.use("/api", [commentRouter]); // 댓글라우터

const connect = require("./schemas"); // 3-4강
connect();

app.use((req, res, next) => {
  // console.log(req);
  next();
});

app.get("/", (req, res) => {
  res.send('<a href="/login">로그인페이지로 이동하기</a>');
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/home", (req, res) => {
  // 전체 게시물 조회페이지 렌더
  res.render("index");
});

app.get("/detail", (req, res) => {
  res.render("detail");
});

app.get("/write", (req, res) => {
  res.render("write");
});

app.get("/revise", (req, res) => {
  res.render("revise");
});

app.get("/test", (req, res) => {
  let name = req.query.name; // name을 test.ejs에 쿼리스트링으로 넘겨준다! 2-6강
  res.render("test", { name }); //test.ejs와 name을 쿼리스트링으로 넘긴 후 render 한다.
});

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});

// 한페이지에서 여러개로 가는건 어케함?
//수정한 후에는 어디로감? 조회?? 홈????
// 그리고 수정한 후에는 날짜바꿔야되냐>? 그러면 홈에서도 맨위로 가지는거자나
