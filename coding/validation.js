module.exports = {
  //닉네임은 최소 3자 이상, 알파벳 대소문자,숫자로 이룬다.
  isNickname: (value) => {
    const nickRegExp = /^[A-Za-z0-9]{3,30}$/g;
    if (!nickRegExp.test(value)) {
      return false;
    } else {
      return true;
    }
  },
  //비빌번호는 최소 4자 이상, 닉네임과 같은값이 포함되지 않게 한다.
  isPassword: (value) => {
    var myDbNickname = "abc1234";

    if (value.length < 4) {
      return false;
    } else if (value.includes(myDbNickname)) {
      return false;
    } else {
      return true;
    }
  },
  //비밀번호확인은 비밀번호와 정확하게 일치해야 한다.
  isConfirmPassword: (value) => {
    var thisPassword = "5409igfsb0";

    if (value === thisPassword) {
      return true;
    } else {
      return false;
    }
  },
  //DB에 존재하는 닉네임을 입력하면 가입이 안된다.
  isNicknameDbCheck: (value) => {
    var alreadyDbNickname = "ppap13579";

    if (value === alreadyDbNickname) {
      return false;
    } else {
      return true;
    }
  },
};
