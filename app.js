const path = require("path");
require("dotenv").config(path.join(__dirname,"env"));

const express = require("express");
const app = express();
const cors = require("cors");
const config = require("./config/auth.config");
const port = process.env.PORT || 5000;
const morgan = require("morgan");

const authMiddleware = require("./middlewares/auth.js");
const userRouter = require("./routes/user");
const mypageRouter = require("./routes/mypage");
const contentRouter = require("./routes/content");
const commentRouter = require("./routes/comment");
const contentListRouter = require("./routes/contentList");

app.use(express.static("public"));

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://corona-diary.s3-website.ap-northeast-2.amazonaws.com",
    ],
    allowedHeaders: "*",
    method: ["GET", "POST", "DELETE", "PATCH"],
    credentials: true,
  })
);

app.use(express.json());

// print the request log on console
app.use(morgan("dev"));

// set the secret key variable for jwt
app.set("jwt-secret", config.secret);
app.set("jwt-social-secret", config.socialSecret);

app.get("/", (req, res) => {
  res.send("Hello World! Welcome to Covid19_diary_server!");
});

app.use("/user", userRouter);
app.use("/", contentListRouter);

app.use("/", authMiddleware);

app.use("/content", contentRouter);
app.use("/mypage", mypageRouter);
app.use("/comment", commentRouter);

//배포 시 https를 위한 부분
// require('greenlock-express').init({
// 	packageRoot: __dirname,
// 	configDir: "./greenlock.d",
// 	maintainerEmail: 'shinuhyun@gmail.com'
// }).serve(app);

//local에서 진행하기 위한 부분
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
