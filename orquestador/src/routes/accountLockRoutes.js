// routes/accountLockRoutes.js
import express from "express";
import { getAccountLocks, unlockAccount } from "../controllers/accountLockController.js";

const router = express.Router();

router.get("/account-locks", getAccountLocks);
router.put("/account-locks/unlock/:id", unlockAccount);

export default router;
