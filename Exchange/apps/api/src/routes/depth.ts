import { Router } from "express";
import { RedisManager } from "../RedisManager";

export const depthRouter = Router();

depthRouter.get("/", async (req, res) => {
    const { market } = req.query;
    const response = await RedisManager.getInstance().sendAndAwait({
        type: "GET_DEPTH",
        data: {
            market: market as string
        }
    });
    res.json(response.payload);
});