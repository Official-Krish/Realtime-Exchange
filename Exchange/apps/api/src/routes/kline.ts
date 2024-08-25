import { Router } from "express";
import { Client } from "pg";
const pgClient = new Client({
    user: 'your_user',
    host: 'localhost',
    database: 'my_database',
    password: 'your_password',
    port: 5432,
});

pgClient.connect();
export const klineRouter = Router();

klineRouter.get("/", async (req, res) => {
    const { market, interval, startTime, endTime } = req.query;

    let query;
    switch (interval) {
        case "1m":
            query = "SELCT * FROM klines_1m WHERE bucket >= $1 AND BUCKET <= $2";
            break;
        case "1hr":
            query = "SELCT * FROM klines_1hr WHERE bucket >= $1 AND BUCKET <= $2";
            break;
        case "1w":
            query = "SELCT * FROM klines_1w WHERE bucket >= $1 AND BUCKET <= $2";
            break;
        default:
            return res.status(400).json({ message: "Invalid interval" });
    }

    try{
        //@ts-ignore
        const result = await pgClient.query(query, [new Date(startTime * 1000 as string), new Date(endTime * 1000 as string)]);
        res.json(result.rows.map(x => ({
            close: x.close,
            end: x.bucket,
            high: x.high,
            low: x.low,
            open: x.open,
            quoteVolume: x.quoteVolume,
            start: x.start,
            trades: x.trades,
            volume: x.volume,
        })));
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});