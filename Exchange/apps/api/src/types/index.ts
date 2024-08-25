export const CREATE_ORDER = "CREATE_ORDER";
export const CANCEL_ORDER = "CANCEL_ORDER";
export const ON_RAMP = "ON_RAMP";
export const GET_OPEN_ORDERS = "GET_OPEN_ORDERS";
export const GET_DEPTH = "GET_DEPTH";

export type MessageFromOrderBook = {
    type : "Depth",
    payload :{ 
        market : string,
        bids : [string, string][],
        asks : [string, string][]
    }
} | {
    type : "ORDER_PLACED",
    payload : {
        orderId : string
        executedQty : number 
        fills : [
            {
                price : string,
                qty : string
                tradeId : number
            }
        ]
    }
} | {
    type : "ORDER_CANCELED",
    payload : {
        orderId : string
        executedQty : number
        remainingQty : number
    }
} | {
    type : "OPEN_ORDERS",
    payload : {
        orders : {
            orderId : string,
            executedQty : number,
            price : string,
            quantity : string,
            side : "buy" | "sell"
            userId : string
        }[]
    }
}