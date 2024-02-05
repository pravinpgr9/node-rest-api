const express = require("express");
const app = express();

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");

const userRoute = require('./routes/users')
const authRoute = require('./routes/auth')
const postRoute = require('./routes/posts')

dotenv.config();

// Connect to MongoDB using the new connection string and options
mongoose.connect(process.env.DATABASE_URL)
.then(() => {
console.log("Connected to MongoDB");
})
.catch((error) => {
console.error("Error connecting to MongoDB:", error);
});


//middleware 
app.use(express.json())
// Use helmet for security
app.use(helmet());
// Use morgan for logging requests
app.use(morgan("common"));

// app.get("/",(req,res)=>{
//     res.send("welcome to rest API")
// })

app.use("/api/user",userRoute)
app.use("/api/auth",authRoute)
app.use("/api/posts",postRoute)


app.listen(8808, () => {
    console.log("Backend Server is Running on port 8808.");
});
