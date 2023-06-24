const mongoose = require('mongoose');
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const userRoute = require("./route/user_route");
const dbConfig = require('./database/db');
const admin = require('./route/admin');
const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

mongoose.connect(dbConfig.db, {
    useNewUrlParser: true,
    
}).then(() => {
    console.log('Database successfully connected');
}, 
    error => {
        console.log('Could not connect to database: ' + error)
    }
)

//app.use("/admin", admin);
app.use("/", userRoute);

/*app.use(express.static(path.join(__dirname, "./client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});*/

const port = process.env.PORT || 5000;
app.listen(port, function () {
  console.log("Node Server has Started at Port " + port);
});
