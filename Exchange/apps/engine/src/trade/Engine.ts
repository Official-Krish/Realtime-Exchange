import fs from "fs";
import { fill, Order, Orderbook } from "./orderBook";
import { CANCEL_ORDER, CREATE_ORDER, GET_DEPTH, GET_OPEN_ORDERS, MessageFromApi, ON_RAMP } from "../types/fromApi"; 
import { RedisManager } from "../RedisManager";
import { ORDER_UPDATE, TRADE_ADDED } from "../types";

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

    process({ message, clientId }: {message: MessageFromApi, clientId: string}) {
        switch (message.type) {
            case CREATE_ORDER:
                try {
                    const { executedQty, fills, orderId } = this.createOrder(message.data.market, message.data.price, message.data.quantity, message.data.side, message.data.userId);
                    RedisManager.getInstance().sendToApi(clientId, {
                        type: "ORDER_PLACED",
                        // @ts-ignore
                        payload: {
                            orderId,
                            executedQty,
                            fills
                        }
                    });
                } catch (e) {
                    console.log(e);
                    RedisManager.getInstance().sendToApi(clientId, {
                        type: "ORDER_CANCELLED",
                        payload: {
                            orderId: "",
                            executedQty: 0,
                            remainingQty: 0
                        }
                    });
                }
                break;
            case CANCEL_ORDER:
                try{
                    const orderId = message.data.orderId;
                    const cancelMarket = message.data.market;
                    const cancelOrderbook = this.orderbooks.find(o => o.ticker() === cancelMarket);
                    const quoteAsset = cancelMarket.split("-")[1];
                    if (!cancelOrderbook){
                        throw new Error("Market not found");
                    }

                    const order = cancelOrderbook.asks.find(o => o.orderId === orderId) || cancelOrderbook.bids.find(o => o.orderId === orderId);

                    if (!order){
                        throw new Error("Order not found");
                    }

                    if (order.side === "buy"){
                        const price = cancelOrderbook.cancelBid(order);
                        const leftQuantity = (order.quantity - order.filled) * order.price;

                        this.balances.get(order.userId)![BASE_CURRENCY].available += leftQuantity;

                        this.balances.get(order.userId)![BASE_CURRENCY].locked -= leftQuantity;

                        if (price){
                            this.sendUpdatedDepthAt(price as string, cancelMarket);
                        }
                    }
                    else{
                        const price = cancelOrderbook.cancelAsk(order);
                        const leftQuantity = order.quantity - order.filled;

                        this.balances.get(order.userId)![quoteAsset].available += leftQuantity;

                        this.balances.get(order.userId)![quoteAsset].locked -= leftQuantity;

                        if (price){
                            this.sendUpdatedDepthAt(price as string, cancelMarket);
                        }
                    }

                    RedisManager.getInstance().sendToApi(clientId, {type: "ORDER_CANCELLED", 
                        payload: { 
                            orderId, 
                            executedQty:0, 
                            remainingQty: 0 
                        }
                    });
                }catch(e){
                    console.log("Error cancelling order", e);
                }
                break;
            
            case GET_OPEN_ORDERS:
                try{
                    const openOrderbook = this.orderbooks.find(o => o.ticker() === message.data.market);

                    if (!openOrderbook){
                        throw new Error("Market not found");
                    }

                    const openOrders = openOrderbook.getOpenOrders(message.data.userId);

                    RedisManager.getInstance().sendToApi(clientId, {
                        type: "OPEN_ORDERS",
                        payload: openOrders
                    });
                }catch(e){
                    console.log("Error getting open orders", e);
                }
                break;
            

            case ON_RAMP:
                const userId = message.data.userId;
                const amount = Number(message.data.amount);
                this.onRamp(userId, amount);
                break;

            case GET_DEPTH:
                try{
                    const market = message.data.market;
                    const orderbook = this.orderbooks.find(o => o.ticker() === market);

                    if(!orderbook){
                        throw new Error("Market not found");
                    }
                    RedisManager.getInstance().sendToApi(clientId, {
                        type: "DEPTH",
                        payload: orderbook.getDepth()
                    });
                }catch(e){
                    console.log("Error getting depth", e);
                    RedisManager.getInstance().sendToApi(clientId, {
                        type: "DEPTH",
                        payload: {
                            bids: [],
                            asks: []
                        }
                    });
                }
                break;
        }
    }


    onRamp(userId: string, amount: number){
        const UserBalance = this.balances.get(userId);
        if (!UserBalance){
            this.balances.set(userId, {
                [BASE_CURRENCY]: {
                    available: amount,
                    locked: 0
                },
            });
        }else{
            UserBalance[BASE_CURRENCY].available += amount;
        }
    }


    sendUpdatedDepthAt(price: string, market: string){
        const orderbook = this.orderbooks.find(o => o.ticker() === market);
        if (!orderbook){
            return;
        }
        const depth = orderbook.getDepth();
        const updateAsks = depth?.asks.filter(x => x[0] === price);
        const updateBids = depth?.bids.filter(x => x[0] === price);

        RedisManager.getInstance().publishMessage(`depth@${market}`,{
            stream: `depth@${market}`,
            data: {
                a : updateAsks.length ? updateAsks : [[price, "0"]], 
                b : updateBids?.length ? updateBids : [[price, "0"]], 
                e : "depth"
            }
        });
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
        this.createDbTrades(fills, market, userId);
        this.publishWsDepthUpdates(fills, price,side, market);
        this.publishWsTrades(fills, market, userId);
        this.updateDbOrders(order, executedQty, fills, market);

        return { executedQty, fills, orderId: order.orderId };
    }

    updateDbOrders(order: Order, executedQty: number, fills: fill[], market: string) {
        RedisManager.getInstance().pushMessage({
            type: ORDER_UPDATE,
            data: {
                orderId: order.orderId,
                executedQty: executedQty.toString(),
                market: market,
                price: order.price.toString(),
                quantity: order.quantity.toString(),
                side: order.side,
            }
        });

        fills.forEach(fill => {
            RedisManager.getInstance().pushMessage({
                type: ORDER_UPDATE,
                data: {
                    orderId: fill.makerOrderId,
                    executedQty: fill.quantity.toString()
                }
            });
        });
    }


    publishWsTrades(fills: fill[], market : string, userId: string){
        fills.forEach(fill =>{
            RedisManager.getInstance().publishMessage(`trade@${market}`,{
                stream : `trade@${market}`,
                data : {
                    e: "trade",
                    t : fill.tradeId,
                    m : fill.otherUserId === userId,
                    p : fill.price,
                    q : fill.quantity.toString(),
                    s : market,
                }
            })
        })
    }


    publishWsDepthUpdates(fills: fill[], price: string, side: "buy" | "sell", market: string){
        const orderbook = this.orderbooks.find(o => o.ticker() === market);
        if (!orderbook){
            return;
        }
        const depth = orderbook.getDepth();
        if (side === "buy"){
            const updateAsks = depth?.asks.filter(x => fills.map(f => f.price).includes(x[0].toString()));
            const updateBids = depth?.bids.find(x => x[0] === price);
            console.log("publish ws depth updates", updateAsks, updateBids);

            RedisManager.getInstance().publishMessage(`depth@${market}`,{
                stream: `depth@${market}`,
                data: {
                    a : updateAsks,
                    b : updateBids? [updateBids] : [],
                    e : "depth"
                }
            });
        }

        if (side === "sell"){
            const updateAsks = depth?.asks.find(x => x[0] === price);
            const updateBids = depth?.bids.filter(x => fills.map(f => f.price).includes(x[0].toString()));
            console.log("publish ws depth updates", updateAsks, updateBids);

            RedisManager.getInstance().publishMessage(`depth@${market}`,{
                stream: `depth@${market}`,
                data: {
                    a : updateAsks? [updateAsks] : [],
                    b : updateBids,
                    e : "depth"
                }
            });
        }
    }


    createDbTrades(fills: fill[], market: string, userId: string){
        fills.forEach(fill => {
            RedisManager.getInstance().pushMessage({
                type: TRADE_ADDED,
                data:{
                    market : market,
                    id : fill.tradeId.toString(),
                    isBuyerMaker: fill.otherUserId === userId,
                    price: fill.price,
                    quantity: fill.quantity.toString(),
                    quoteQuantity: (fill.quantity * Number(fill.price)).toString(),
                    timestamp : Date.now(),
                }
            });
        });
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