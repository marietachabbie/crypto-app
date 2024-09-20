import dotenv from 'dotenv'
dotenv.config();

import express from 'express';
import bodyParser from 'body-parser';
import ErrorHandler from './middlewares/ErrorHandler.js';
import balanceRoute from './routes/balances.js';

const PORT = process.env.PORT || 3001;

const app = express();
app.use(bodyParser.json());
app.use("/api/balances", balanceRoute);

app.use(ErrorHandler);

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});

export default app;
