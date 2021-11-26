const express = require("express");
const User = require("../schemas/user"); // 스키마에서 모델을 가져옴
const Joi = require("joi"); // 유효성검사 하기위해 joi 임포트
var jwt = require("jsonwebtoken");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");

const postUsersSchema = Joi.object({
  //스키마정의하기 , 유효성검사
  nickname: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{4,30}$")).required(),
  confirmPassword: Joi.string().required(),
});

router.post("/users", async (req, res) => {
  // 포스트메소드, 경로는 /users
  try {
    const { nickname, password, confirmPassword } =
      await postUsersSchema.validateAsync(req.body); // Joi스키마 정의된 것으로 유효성검증

    if (password !== confirmPassword) {
      // 다르면 에러 만들기
      res.status(400).send({
        // 400이하는 정상코드로 인식, 400의 뜻 Bad Request. 일반적으로 400(Bad Request)으로 잡는다.
        errorMessage: "패스워드가 패스워드 확인란과 동일하지 않습니다.",
      });
      return; // 패스워드가 다르더라도 아래 코드가 실행되지 않도록 return처리해준다. return처리 = 이 이벤트 핸들러에서 나가버림
    }
    if (password.search(nickname) > -1) {
      res.status(400).send({
        // 400이하는 정상코드로 인식, 400의 뜻 Bad Request. 일반적으로 400(Bad Request)으로 잡는다.
        errorMessage: "비밀번호에 닉네임이 포함되어 있습니다.",
      });
      return; // 패스워드가 다르더라도 아래 코드가 실행되지 않도록 return처리해준다. return처리 = 이 이벤트 핸들러에서 나가버림
    }
    //저장하면 되는데 이메일,닉네임 db와 일치하는 값 있으면 안되니까 확인하기
    // 굳이 사용자한테 안말함. db에 어떤 값이 있는지 알려주는 꼴

    const existUsers = await User.find({
      // 확인하기
      nickname, // 이메일이 겹치거나 닉네임이 겹치거나 하면
    });

    if (existUsers.length) {
      res.status(400).send({
        //이메일이 겹치거나 닉네임이 겹치거나 하면 에러메세지를 내준다.
        errorMessage: "이미 가입된 닉네임이 있습니다.",
      });
      return; // 에러가 났으면 어차피 끝난거임
    }

    const user = new User({ nickname, password }); //위에 둘다 에러가 안났을 시에는 저장 작업하기
    console.log("회원가입 지나가유");
    await user.save(); // 사용자 저장하기

    res.status(201).send({}); // 그냥 send는 200의 값을 반환해서 이상은 없는데, rest api 원칙에 따르면 201(created) 보내기
  } catch (err) {
    console.log(err);
    res.status(400).send({
      errorMessage: "요청한 회원가입 데이터 형식이 올바르지 않습니다.",
    });
  }
});

// 로그인 POST
const postAuthSchema = Joi.object({
  //스키마정의하기
  nickname: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{4,30}$")).required(),
});
router.post("/auth", async (req, res) => {
  //로그인api 작성준비
  try {
    const { nickname, password } = await postAuthSchema.validateAsync(req.body);

    const user = await User.findOne({ nickname, password }).exec(); // 두 값이 일치하는 사용자가 있는지 확인한다.

    if (!user) {
      //유저가없다면
      res.status(400).send({
        // 에러메시지 내기. 401도 인증실패라 둘다 맞다.
        errorMessage: "닉네임 또는 패스워드를 확인해주세요.", // 불친절하게 다알려주지 말자
      });
      return; // 에러났으면 리턴해야함
    }
    // 사용자가 있는경우 토큰을 만든다. 위쪽 모듈 불러왔는지 체크하고
    const token = jwt.sign({ userId: user.userId }, "my-secret-key"); // sign을 해야 토큰을 만들 수 있음.
    console.log("로그인지나가유~~");
    res.send({
      // 토큰만들었으면 응답하면됨.
      token, // 응답할때도 token 이라는 key에 jwt token을 반환해야 프론트에서 정상동작하도록 해놓음.
    });
    // 로그인은 됨. 알 수 없는 문제 발생.새로 프로젝트를 만들다보니 다른 api가실패해서 그렇다.
    // 그 중 내정보조회 api가 실패해서 그렇다.
    // 내정보조회 api를 만들기 이전에 사용자 인증 미들웨어를 구현해야한다.
    // 그러면 내정보조회 api 만들기 쉬움!! 자세한건 나중에 알려준댜
  } catch (error) {
    res.status(400).send({
      errorMessage: "요청한 로그인 데이터 형식이 올바르지 않습니다.",
    });
  }
});

//미들웨어 ---------------------------------
//미들웨어를 붙이는 방법은 다양하다!!!!

// 아까 알수없는 문제 발생시에 get이었고 경로는 /users/me 였음.
router.get("/users/me", authMiddleware, async (req, res) => {
  //요 경로로 들어오는 경우에만 미들웨어가 붙는다!!
  const { user } = res.locals; // (json형식으로 유저정보 나타냄)
  console.log(user); //미들웨어를 거쳐와야 정보가 담김
  // res.status(400).send({ // 테스트용 아깐 404였는데 이 코드 작성후 확인했을 때에는 400이 떴다. 작동상태 확인완료, 하지만 아무런 영향을 끼치지는 못하는 것도 확인
  res.send({
    user: {
      // 가지고 있는 정보들 중에서 중요한 정보 빼고 클라이언트에게 전송한다.
      nickname: user.nickname, // 닉네임만 보내줌
    },
  });
});

module.exports = router;
