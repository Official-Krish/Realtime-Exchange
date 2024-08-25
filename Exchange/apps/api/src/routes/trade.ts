import { Router } from "express";

export const tradeRouter = Router();

tradeRouter.get("/", async (req, res) => {
    const { market } = req.query;
    // get from DB
    res.json({});
});