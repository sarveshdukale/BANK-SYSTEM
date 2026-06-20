const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema({
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
        type: String,
        required: [true, "Passwpord is required for creating a account"],
        minlength: [6, "password should be contain more than six character"],
        select: false
    },

    
},
    
    { timestamps: true }


);


userSchema.pre("save",async function (next) {
    
    if (!this.isModified("password")) {
        return next()
    }

    const hash = await bcrypt.hash(this.password, 10)
    this.password = hash
    
    return 
})


userSchema.methods.comparePassword = async function (password) {
    
    

    return await bcrypt.compare(password, this.password)
    
}


const userModel = mongoose.model("user", userSchema)

module.exports = userModel;