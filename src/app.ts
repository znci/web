// app.ts

import express from "express";
import createError from "http-errors";
import * as path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import { default as indexRouter } from "./routes/index.ts";
import { default as apiRouter } from "./routes/api.ts";
import { default as oauthRouter } from "./routes/oauth.ts";
import session from "express-session";
import { configDotenv } from "dotenv";

configDotenv({ path: path.join(__dirname, "./.env") });
const app: express.Application = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: process.env.SESSION_SECRET!,
  })
);
app.use("/", indexRouter);
app.use("/api", apiRouter);
app.use("/oauth", oauthRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err: any, req: any, res: any, next: any) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  if (req.originalUrl.startsWith("/api")) {
    res.status(err.status || 500);
    res.send({ msg: err.message, meta: "https://http.cat/" + err.status });
  } else {
    res.status(err.status || 500);
    console.log(err);
    res.send(`<img src="https://http.cat/${err.status}" alt="error" />`);
  }
});

module.exports = app;
export function set(arg0: string, port: any) {
  throw new Error("Function not implemented.");
}
