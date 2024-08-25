import { Router } from "express";

export const tickerRouter = Router();

tickerRouter.get("/", async (req, res) => {
    const { market } = req.query;
    // get from DB
    res.json({});
});