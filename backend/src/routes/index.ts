import { Router } from "express";
import { verifySignature } from "../controllers/verificationController";

const router = Router();

router.post("/verify-signature", verifySignature)

export default router;