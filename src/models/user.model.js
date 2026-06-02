const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is required for creating User"],
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Invalid Email Address"],
        unique: [true, "Email allready exists"]
    },
    
    name: {
        type: String,
        required: [true,"name is required to creating a account"]
    },

    password: {
        
    }
    
});