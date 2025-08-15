import { Router } from "express";
import { loginUserController, logoutUserController, refreshAccessToken, registerUserController } from "../controller/auth.controller.js";
import { protectedRoute } from "../middlewares/protectedRoute.middleware.js";

const router = Router();

router.post("/register", registerUserController);
router.post("/login", loginUserController);
router.post("/logout",protectedRoute, logoutUserController);
router.post("/refresh-token", refreshAccessToken);

export default router;