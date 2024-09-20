import express from 'express';
import BalanceController from '../controllers/balances.js';

const router = express.Router();

router.post("/", BalanceController.getBalances);

export default router;
