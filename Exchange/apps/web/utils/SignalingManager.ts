import { WS_SERVER } from "../config";
import { Ticker } from "./types";

export class SignalingManager {
    private ws : WebSocket;
    private static instance : SignalingManager;
    private id : number;
    private callbacks : any = {};
    private bufferedMessages : any = [];
    private initialized : boolean = false;

    private constructor(){
        this.ws = new WebSocket(WS_SERVER);
        this.bufferedMessages = [];
        this.id = 1;
        this.init();
    }

    public static getInstance(){
        if (!this.instance){
            this.instance = new SignalingManager();
        }
        return this.instance;
    }

    init(){
        this.ws.onopen = () => {
            this.initialized = true;
            this.bufferedMessages.forEach((message : any) => {
                this.ws.send(JSON.stringify(message));
            });
            this.bufferedMessages = [];
        }

        this.ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            const type = message.data.e;
            if (this.callbacks[type]){
                this.callbacks[type].forEach((callback : any) => {
                    if (type == "ticker"){
                        const newTicker : Partial<Ticker> = {
                            lastPrice: message.data.c,
                            high: message.data.h,
                            low: message.data.l,
                            volume: message.data.v,
                            quoteVolume: message.data.V,
                            symbol : message.data.s
                        }
                        callback(newTicker);
                    }

                    if (type == "depth"){
                        const updatedBids = message.data.b;
                        const updatedAsks = message.data.a;
                        callback({bids: updatedBids, asks: updatedAsks});
                    }
                });
            }
        }
    }

    sendMessage(message : any){
        const messageToSend = {
            ...message,
            id: this.id++
        }

        if (this.initialized){
            this.ws.send(JSON.stringify(messageToSend));
        } else {
            this.bufferedMessages.push(messageToSend);
            return;
        }
    }

    async registerCallback(type: string, callback: any, id: string) {
        this.callbacks[type] = this.callbacks[type] || [];
        this.callbacks[type].push({ callback, id });
    }

    async deRegisterCallback(type: string, id: string) {
        if (this.callbacks[type]) {
            const index = this.callbacks[type].findIndex((callback : any) => callback.id === id);
            if (index !== -1) {
                this.callbacks[type].splice(index, 1);
            }
        }
    }
}