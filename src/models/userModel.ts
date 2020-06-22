import mongoose from 'mongoose'

export const userSchema =  new mongoose.Schema({
    first_name : {
        type: String,
        required: true,
        trim: true
    },
    last_name : {
        type: String,
        required: true,
        trim: true  
    },
    gender : {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password : {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
})

export const userModel = mongoose.model('User', userSchema);

