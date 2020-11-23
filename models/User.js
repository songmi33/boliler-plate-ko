const mongoose = require("mongoose");

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

const User = mongoose.model("User", userSchema)

module.exports = { User }    // 다른 파일에서도 사용할 수 있도록 export 해줌


