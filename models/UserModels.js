const mongoose = require('mongoose')


const UserSchema = mongoose.Schema({
    user_id: {
        type: Number,
        required: true,
        unique: true,
    },
    full_name: {
        type: String,
        required: true,
    },
    username: String,
    lang: String,
    phone: String,
    active: {
        type: Boolean,
        default: true,
    }

})

const User = mongoose.model("User", UserSchema)

module.exports = {User}