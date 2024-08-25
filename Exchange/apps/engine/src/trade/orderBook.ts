import { BASE_CURRENCY } from "./Engine";

export interface Order {
    price: number;
    quantity: number;
    orderId: string;
    filled: number;
    side : "buy" | "sell";
    userId: string;
}

export interface fill {
    price: string;
    quantity: number;
    tradeId: number;
    otherUserId: string;
    makerOrderId: string;
}


export class Orderbook {
    bids: Order[] = [];
    asks: Order[] = [];
    baseAsset: string;
    quoteAsset: string = BASE_CURRENCY;
    lastTradeId: number;
    currentPrice: number;

    constructor(baseAsset: string, bids: Order[], asks: Order[], lastTradeId: number, currentPrice: number) {
        this.baseAsset = baseAsset;
        this.bids = bids;
        this.asks = asks;
        this.lastTradeId = lastTradeId || 0;
        this.currentPrice = currentPrice || 0;
    }
    ticker(){
        return `${this.baseAsset}_${this.quoteAsset}`;
    }

    getSnapshot(){
        return {
            baseAsset: this.baseAsset,
            bids : this.bids,
            asks : this.asks,
            lastTradeId: this.lastTradeId,
            currentPrice: this.currentPrice
        }
    }

    addOrder(order: Order){
        if (order.side === "buy"){
            const { executedQty, fills } = this.matchBid(order);
            order.filled = executedQty;
            if (executedQty === order.quantity){
                return {
                    executedQty,
                    fills
                }
            }
            this.bids.push(order);
            return {
                executedQty,
                fills
            }
        }else{
            const { executedQty, fills } = this.matchAsk(order);
            order.filled = executedQty;
            if (executedQty === order.quantity){
                return {
                    executedQty,
                    fills
                }
            }
            this.asks.push(order);
            return {
                executedQty,
                fills
            }
        }
    }

    matchBid(order: Order){
        const fills: fill[] = [];
        let executedQty = 0;
        for (let i = 0; i < this.bids.length; i++){
            if (this.bids[i].price >= order.price){
                if (this.bids[i].price >= order.price && executedQty < order.quantity){
                    const filledQty = Math.min(order.quantity - executedQty, this.bids[i].quantity);
                    executedQty += filledQty;

                    fills.push({
                        price: this.bids[i].price.toString(),
                        quantity: filledQty,
                        tradeId: this.lastTradeId++,
                        otherUserId: this.asks[i].userId,
                        makerOrderId: this.bids[i].userId
                    })
                    
                }
            }
        }
        for (let i = 0; i < this.asks.length; i++){
            if (this.asks[i].filled === this.asks[i].quantity){
                this.asks.splice(i, 1);
                i--;
            }
        }
        return {
            executedQty,
            fills
        }
    }

    matchAsk(order: Order){
        const fills: fill[] = [];
        let executedQty = 0;
        for (let i = 0; i < this.bids.length; i++){
            if (this.bids[i].price <= order.price){
                if (this.bids[i].price >= order.price && executedQty < order.quantity){
                    const amountRemaining = Math.min(order.quantity - executedQty, this.bids[i].quantity);
                    executedQty += amountRemaining;
                    this.bids[i].filled += amountRemaining;

                    fills.push({
                        price: this.bids[i].price.toString(),
                        quantity: amountRemaining,
                        tradeId: this.lastTradeId++,
                        otherUserId: this.bids[i].userId,
                        makerOrderId: this.asks[i].userId
                    })
                    
                }
            }
        }
        for (let i = 0; i < this.bids.length; i++){
            if (this.bids[i].filled === this.bids[i].quantity){
                this.bids.splice(i, 1);
                i--;
            }
        }
        return {
            executedQty,
            fills
        }
    }
}