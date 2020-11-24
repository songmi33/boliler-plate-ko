const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;


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
const User = mongoose.model("User", userSchema)

module.exports = { User }    // 다른 파일에서도 사용할 수 있도록 export 해줌


