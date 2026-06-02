const mongoose = require("mongoose");





function ConnectToDB() {
    
    mongoose.connect(process.env.MONGO_URI)
        .then(() => {
        console.log("Server is Connected to DB")
        })
        .catch(err => {
            console.log("Error Ocures to connect DB")
            process.exit(1)
        })

}


module.exports = ConnectToDB;