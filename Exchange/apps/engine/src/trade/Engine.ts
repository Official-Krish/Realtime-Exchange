import fs from "fs";
import { fill, Order, Orderbook } from "./orderBook";
import { CREATE_ORDER, MessageFromApi } from "../types/fromApi"; 
import { RedisManager } from "../RedisManager";

export const BASE_CURRENCY = "USDT";
interface UserBalance {
    [key: string]: {
        available: number;
        locked: number;
    }
}
export class Engine {
    private orderbooks: Orderbook[] = [];
    private balances: Map<string, UserBalance> = new Map();

    constructor() {
        let snapshot = null;
        try {
            if (process.env.WITH_SNAPSHOT){
                snapshot = fs.readFileSync("./snapshot.json");
            }
        } catch(e){
            console.log("No snapshot found");
        }

        if (snapshot){
            const snapshotData = JSON.parse(snapshot.toString());
            this.orderbooks = snapshotData.orderbooks.map((o : any) => new Orderbook(o.baseAsset, o.bids, o.asks, o.lastTradeId, o.currentPrice));
        } else{
            this.orderbooks = [new Orderbook("SOL", [], [], 0, 0)];
            this.setBaseBalances();
        }
        setInterval(() => {
            this.saveSnapshot();
        }, 30000);
    }

    saveSnapshot(){
        const snapshot = {
            orderbooks: this.orderbooks.map(o => o.getSnapshot()),
            balances: Array.from(this.balances.entries())
        }
        fs.writeFileSync("./snapshot.json", JSON.stringify(snapshot));
    }

    setBaseBalances(){
        this.balances.set("1", {
            [BASE_CURRENCY]: {
                available: 100000,
                locked: 0
            },
            "SOL": {
                available: 100000,
                locked: 0
            }
        });

        this.balances.set("2", {
            [BASE_CURRENCY]: {
                available: 100000,
                locked: 0
            },
            "SOL": {
                available: 100000,
                locked: 0
            }
        });

        this.balances.set("3", {
            [BASE_CURRENCY]: {
                available: 100000,
                locked: 0
            },
            "SOL": {
                available: 100000,
                locked: 0
            }
        });
    }

    process({ message, clientId } : {message: MessageFromApi, clientId : string}){
        switch(message.type){
            case CREATE_ORDER:
                try{
                    const { executedQty, fills, orderId } = this.createOrder(message.data.market, message.data.price, message.data.quantity, message.data.side, message.data.userId);

                    RedisManager.getInstance().sendToApi(clientId, {
                        type: "ORDER_PLACED",
                        payload: {
                            orderId,
                            executedQty,
                            fills
                        }
                    });
                } catch(e){
                    console.log(e);
                    RedisManager.getInstance().sendToApi(clientId, {
                        type : "ORDER_CANCELLED",
                        payload:{
                            orderId : "",
                            executedQty: 0,
                            remainingQty: 0
                        }
                    });
                }
                break;
            }
    }

    createOrder(market: string, price: string, quantity: string, side: "buy" | "sell", userId: string){
        const orderbook = this.orderbooks.find(o => o.baseAsset === market);
        const baseAsset = market.split("-")[0];
        const quoteAsset = market.split("-")[1];

        if (!orderbook){
            throw new Error("Market not found");
        }

        this.checkandLockFunds(baseAsset, quoteAsset, price, quantity, side, userId);

        const order : Order = { 
            price : Number(price),
            quantity : Number(quantity),
            orderId : Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
            filled : 0,
            side,
            userId
        }

        const { fills, executedQty } = orderbook.addOrder(order);

        this.updateBalances(fills, baseAsset, quoteAsset, executedQty,side, userId);


        return { executedQty, fills, orderId: order.orderId };
    }


    updateBalances(fills: fill[], baseAsset: string, quoteAsset: string, executedQty: number, side: "buy" | "sell", userId: string){
        if (side === "buy"){
            fills.forEach(fill => {
                //@ts-ignore
                this.balances.get(fill.otherUserId)[quoteAsset].available = this.balances.get(fill.otherUserId)?.[quoteAsset].available + (fill.qty * fill.price);

                //@ts-ignore
                this.balances.get(userId)[quoteAsset].locked = this.balances.get(userId)?.[quoteAsset].locked - (fill.qty * fill.price);


                //@ts-ignore
                this.balances.get(fill.otherUserId)[baseAsset].locked = this.balances.get(fill.otherUserId)?.[baseAsset].locked - fill.qty;

                //@ts-ignore
                this.balances.get(userId)[baseAsset].available = this.balances.get(userId)?.[baseAsset].available + fill.qty;

            })
        }
    }

    checkandLockFunds(baseAsset: string, quoteAsset: string, price: string, quantity: string, side: "buy" | "sell", userId: string){

        if (side === "buy"){
            if ((this.balances.get(userId)?.[quoteAsset].available  || 0 ) < Number(price) * Number(quantity)){
                throw new Error("Insufficient balance");
            }
            this.balances.get(userId)![quoteAsset].available -= Number(price) * Number(quantity);
            this.balances.get(userId)![quoteAsset].locked += (Number(quantity) * Number(price));
        }
        else{

            if ((this.balances.get(userId)?.[baseAsset].available || 0) < Number(quantity)){
                throw new Error("Insufficient balance");
            }
            this.balances.get(userId)![baseAsset].available -= Number(quantity);
            this.balances.get(userId)![baseAsset].locked += Number(quantity);
        }
    }
}