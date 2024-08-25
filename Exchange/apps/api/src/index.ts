import express from 'express';
import cors from 'cors';
import { orderRouter } from './routes/order';
import { depthRouter } from './routes/depth';
import { tradeRouter } from './routes/trade';
import { tickerRouter } from './routes/ticker';
import { klineRouter } from './routes/kline';

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/v1/order", orderRouter);
app.use("/api/v1/depth", depthRouter);
app.use("/api/v1/trades", tradeRouter);
app.use("/api/v1/ticker", tickerRouter);
app.use("/api/v1/kline", klineRouter);


app.listen(3000, () => {
  console.log('Server is running on port 3000');
});