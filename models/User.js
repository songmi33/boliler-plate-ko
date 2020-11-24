const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
    name: {
        type:String,
        maxlength:50
    },
    email: {
        type:String,
        trim:true,   // 입력된 데이터의 띄어쓰기 무시
    },
    password:{
        type:String,
        minlength:5
    },
    lastname:{
        type:String,
        maxlength: 50
    },
    role:{
        type:Number,
        default: 0
    },
    image: String,
    token:{    // 토큰을 사용하여 유효성 검사 가능
        type: String
    },
    tokenExp:{    // 토큰 유효기간
        type:Number
    }
})

userSchema.pre("save", function( next ){
    
    var user = this;
    // 패스워드가 변환될때만 암호화
    if(user.isModified("password")){
        // 비밀번호를 암호화 시킨다.
        bcrypt.genSalt(saltRounds, function(err, salt){
            if(err) return next(err)
            bcrypt.hash(user.password, salt, function(err, hash){
                if(err) return next(err)
                user.password = hash
                next()
            })
        })   
    } else{
        // 비밀 번호를 바꾸지 않는다면 바로 넘어갈 수 있도록 함
        next()
    }   
})

userSchema.methods.comparePassword = function(plainPassword, cb){
    // plainPassword 1234567 암호화된 비밀번호 $2b$10$qO7bOI34ER8WnRW2p07ceOIr9yTiuHTb7dFcXSPqYH3KSTqctv2A6
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if(err) return cb(err);
        cb(null, isMatch);
    })
}


userSchema.methods.generateToken = function(cb){
    var user = this;

    // jsonwebtoken을 이용해서 토큰 생성하기
    
    var token = jwt.sign(user._id.toHexString(), "secretToken");

    user.token = token;
    user.save(function(err, user){
        if(err) return cb(err);
        cb(null, user);
    })
}

userSchema.statics.findByToken = function(token, cb){
    var user = this;
    
    // 토큰을 decode
    jwt.verify(token, "secretToken", function(err, decoded){
        // 유저 아이디를 이용하여 유저를 찾은 다음
        // 클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인
        user.findOne({"_id":decoded, "token":token}, function(err, user){
            if(err) return cb(err)
            cb(null, user)
        })
    })
}
const User = mongoose.model("User", userSchema);

module.exports = { User }    // 다른 파일에서도 사용할 수 있도록 export 해줌


