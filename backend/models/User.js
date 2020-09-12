const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const saltRonds = 10;
const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true, // string에서 공백 제거
    unique: true,
  },
  password: {
    type: String,
    minlength: 5,
  },
  role: {
    type: Number, // 1=admin, 0=user
    default: 0,
  },
  image: {
    type: String,
  },
  token: {
    type: String,
  },
  tokenExp: {
    type: Number,
  },
});

// mongoDB에 저장하기 전에 할 행동
userSchema.pre("save", function (next) {
  var user = this;

  // 비밀번호를 암호화 할때만 작동
  if (user.isModified("password")) {
    // salt 생성
    bcrypt.genSalt(saltRonds, function (err, salt) {
      if (err) return next(err);
      // pw 암호화
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        // 암호화된 pw 저장
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

userSchema.methods.comparePassword = function (plainPassword, cb) {
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

userSchema.methods.generateToken = function (cb) {
  var user = this;
  var token = jwt.sign(user._id.toHexString(), "secretToken");
  user.token = token;
  user.save(function (err, user) {
    if (err) return cb(err);
    cb(null, user);
  });
};

userSchema.statics.findByToken = function (token, cb) {
  var user = this;

  // 토큰을 decode
  jwt.verify(token, "secretToken", function (err, decoded) {
    // 유저 아이디를 이용해서 유저를 찾은 다음
    // 클라이언트에서 가져온 토큰과

    // DB에 보관된 토큰이 일치하는지 확인
    user.findOne({ _id: decoded, token: token }, function (err, user) {
      if (err) return cb(err);
      cb(null, user);
    });
  });
};
const User = mongoose.model("User", userSchema);

module.exports = { User };
