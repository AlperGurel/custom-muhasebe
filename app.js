const express = require("express")
const app = express();
const cors = require("cors");
const path = require("path");

//routes
const indexRouter = require("./routes/index");
const tablesRouter = require("./routes/tables")
const veriRouter = require("./routes/veri")

app.set("view engine", "ejs");

app.use(cors());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === "OPTIONS"){
        res.header("Access-Control-Allow-Methods", "PUT, POST, UPDATE, PATCH, DELETE, GET");
        return res.status(200).json();
    }
    next();
})


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));
app.use(express.static(path.join(__dirname, 'views')));


app.use("/", indexRouter);
app.use("/tables", tablesRouter);
app.use("/veri", veriRouter);

app.use((req, res, next)=>{
    const error = new Error("Not Found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app;