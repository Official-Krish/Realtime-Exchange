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