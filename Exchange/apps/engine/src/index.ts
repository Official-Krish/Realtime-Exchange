import { createClient } from "redis";
import { Engine } from "./trade/Engine";

async function main() {
    const engine = new Engine();
    const redisClient = createClient();
    await redisClient.connect();
    console.log("Connected to Redis");

    while(true){
        const response = await redisClient.rPop("messages" as string);

        if(response){
            const message = JSON.parse(response);
            engine.process(message);
        }
    }

}