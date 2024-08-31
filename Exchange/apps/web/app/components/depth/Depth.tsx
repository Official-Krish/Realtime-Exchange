import { useEffect, useState } from "react"
import { AskTable } from "./AsksTable"
import { BidsTable } from "./BidsTable";
import { SignalingManager } from "../../../utils/SignalingManager";
import { getDepth, getTicker, getTrades } from "../../../utils/httpClient";

export function Depth({ market }: { market: string }) {
    const [asks, setAsks] = useState<[string, string][]>([]);
    const [bids, setBids] = useState<[string, string][]>([]);
    const [price, setPrice] = useState<string>();

    useEffect(() => {
        SignalingManager.getInstance().registerCallback("depth", (data : any ) => {
            console.log(data)

            setBids((originalBids) => {
                const bidsAfterUpdate : any = [...(originalBids || [])];

                for (let i = 0; i < bidsAfterUpdate.length; i++) {
                    for (let j = 0; j < data.bids.length; j++)  {
                        if (bidsAfterUpdate[i][0] === data.bids[j][0]) {
                            bidsAfterUpdate[i][1] = data.bids[j][1];
                            if (Number(bidsAfterUpdate[i][1]) === 0) {
                                bidsAfterUpdate.splice(i, 1);
                            }
                            break;
                        }
                    }
                }

                for (let j = 0; j < data.bids.length; j++)  {
                    if (Number(data.bids[j][1]) !== 0 && !bidsAfterUpdate.map((x : any) => x[0]).includes(data.bids[j][0])) {
                        bidsAfterUpdate.push(data.bids[j]);
                        break;
                    }
                }
                bidsAfterUpdate.sort((x : any, y : any) => Number(y[0]) > Number(x[0]) ? -1 : 1);
                return bidsAfterUpdate; 
            });


            setAsks((originalAsks) => {
                const asksAfterUpdate  : any = [...(originalAsks || [])];

                for (let i = 0; i < asksAfterUpdate.length; i++) {
                    for (let j = 0; j < data.asks.length; j++)  {
                        if (asksAfterUpdate[i][0] === data.asks[j][0]) {
                            asksAfterUpdate[i][1] = data.asks[j][1];
                            if (Number(asksAfterUpdate[i][1]) === 0) {
                                asksAfterUpdate.splice(i, 1);
                            }
                            break;
                        }
                    }
                }

                for (let j = 0; j < data.asks.length; j++)  {
                    if (Number(data.asks[j][1]) !== 0 && !asksAfterUpdate.map((x : any) => x[0]).includes(data.asks[j][0])) {
                        asksAfterUpdate.push(data.asks[j]);
                        break;
                    }
                }
                asksAfterUpdate.sort((x : any, y : any) => Number(y[0]) > Number(x[0]) ? 1 : -1);
                return asksAfterUpdate; 
            });
        }, `DEPTH-${market}`);
        
        SignalingManager.getInstance().sendMessage({"method":"SUBSCRIBE","params":[`depth@${market}`]});

        getDepth(market).then(d => {    
            setBids(d.bids.reverse());
            setAsks(d.asks);
        });

        getTicker(market).then(t => setPrice(t.lastPrice));
        getTrades(market).then(t => setPrice(t[0]?.price));

        return () => {
            SignalingManager.getInstance().sendMessage({"method":"UNSUBSCRIBE","params":[`depth@${market}`]});
            SignalingManager.getInstance().deRegisterCallback("depth", `DEPTH-${market}`);
        }
    },[])

    return <div>
        <TableHeader/>
        {asks && <AskTable asks={asks}/>}
        {price && <div>{price}</div>}
        {bids && <BidsTable bids={bids}/>}
    </div>
}

function TableHeader() {
    return <div className="flex justify-between text-sm">
        <div className="text-white">Price</div>
        <div className="text-slate-500">Size</div>
        <div className="text-slate-500 pr-4">Total</div>
    </div>
}