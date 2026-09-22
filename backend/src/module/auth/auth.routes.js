import { Router } from "express";
import { authController } from "./auth.controller.js";
import { validate } from "../../middleware/validateMiddleware.js";
import { requireAuth } from "../../middleware/authMiddleware.js";
import { registerSchema, loginSchema, verifyOtpSchema } from "./auth.schema.js";

const router = Router();

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);
router.get("/me", requireAuth, authController.me);

router.post("/otp/request", authController.requestOtp);
router.post("/otp/verify", validate(verifyOtpSchema), authController.confirmOtp);

export default router;
