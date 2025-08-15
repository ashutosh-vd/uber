import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import { CORS_OPTIONS } from "./config/index.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
//app.use(express.static());
app.use(cookieParser());
app.use(cors(CORS_OPTIONS));

import authRouter from "./routers/auth.router.js";
app.use("/v1/api/auth", authRouter);

export default app;