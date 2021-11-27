const {
  isNickname,
  isPassword,
  isConfirmPassword,
  isNicknameDbCheck,
} = require("./validation");

test("닉네임은 최소 3자이상이고 알파벳대소문자와숫자로 이룬다.", () => {
  expect(isNickname("abc")).toEqual(true);
  expect(isNickname("DEF")).toEqual(true);
  expect(isNickname("789")).toEqual(true);
  expect(isNickname("ppapPPAP1234")).toEqual(true);

  expect(isNickname("aBc12!")).toEqual(false); // 특수문자
  expect(isNickname("한글들어가면안됨")).toEqual(false); // 한글
  expect(isNickname("a1")).toEqual(false); // 최소 글자수
});

test("비밀번호는 최소 4자 이상이고 닉네임과 같은 값이 포함되지 않게 한다.", () => {
  expect(isPassword("a1B3")).toEqual(true);
  expect(isPassword("a1")).toEqual(false);

  expect(isPassword("abc1234")).toEqual(false); // db닉네임값을 포함
});

test("비밀번호 확인은 비밀번호와 정확하게 일치해야 한다.", () => {
  expect(isConfirmPassword("5409igfsb0")).toEqual(true); // 입력비밀번호와 같을때
  expect(isConfirmPassword("1m3m5m7m8dfd")).toEqual(false); // 입력비밀번호와 다를때
});

test("DB에 존재하는 닉네임을 입력하면 가입이 안된다.", () => {
  expect(isNicknameDbCheck("nodbnickname")).toEqual(true);
  expect(isNicknameDbCheck("ppap13579")).toEqual(false);
});
