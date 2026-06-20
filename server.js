require("dotenv").config();

const app = require("./src/app");

const ConnectToDB = require("./src/config/db")



ConnectToDB();

app.listen(3000, () => {
    console.log("Server running on 3000 port");
});
