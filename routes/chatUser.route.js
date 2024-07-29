import { Router } from "express";
import { addUser, getUser } from "../controller/chatUser.controller.js";

const userroute = Router();

userroute.post("/add", addUser);

userroute.get("/user", getUser);

export default userroute;
