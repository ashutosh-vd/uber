import { Router } from "express";
import { loginUserController, logoutUserController, refreshAccessToken, registerUserController, getUser } from "../controller/auth.controller.js";
import { protectedRoute } from "../middlewares/protectedRoute.middleware.js";

const router = Router();

router.post("/register", registerUserController);
router.post("/login", loginUserController);
router.post("/logout",protectedRoute, logoutUserController);
router.post("/refresh-token", refreshAccessToken);
router.get("/get-user", protectedRoute, getUser);

export default router;