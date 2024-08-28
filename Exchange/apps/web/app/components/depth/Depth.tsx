import { useState } from "react"
import { AskTable } from "./AsksTable"
import { BidsTable } from "./BidsTable";

export function Depth({ market }: { market: string }) {
    const [asks, setAsks] = useState<[string, string][]>([]);
    const [bids, setBids] = useState<[string, string][]>([]);
    const [price, setPrice] = useState<string>();
    return <div>
        <TableHeader/>
        {asks && <AskTable asks={asks}/>}
        {price && <div>{price}</div>}
        {bids && <BidsTable bids={bids}/>}
    </div>
}

function TableHeader() {
    return <div className="flex justify-between text-xs">
        <div className="text-white">Price</div>
        <div className="text-slate-500">Size</div>
        <div className="text-slate-500">Total</div>
    </div>
}