require("dotenv").config();

const app = require("./src/app");

const ConnectToDB = require("./src/config/db")



ConnectToDB();

app.listen(3000, () => {
    console.log("Server running on 3000 port");
});

MONGO_URI= mongodb+srv://TestUser:usersarvesh123@cluster0.ck4xvuc.mongodb.net/Bank-System
JWT_SECRET = 2886b86773fc059041b09c39e712e859e2c3cfc098bca207ff144ccf76acec50