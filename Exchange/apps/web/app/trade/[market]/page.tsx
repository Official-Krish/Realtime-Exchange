"use client";
import { useParams } from "next/navigation";
import { MarketBar } from "../../components/MarketBar";
import { TradeView } from "../../components/TradeView";
import { Depth } from "../../components/depth/Depth";
import { SwapUI } from "../../components/SwapUI";

export default function Page() {
    const { market } = useParams();
    return <div className="flex flex-row flex-1 h-screen bg-primary">
        <div className="flex flex-col flex-1">
            <MarketBar market={market as string} />
            <div className="flex flex-row h-[920px] border-y border-slate-800">
                <div className="flex flex-col flex-1">
                    <TradeView market={market as string} />
                </div>
                <div className="flex flex-col w-[250px]">
                    <Depth market={market as string} /> 
                </div>
            </div>
        </div>
        <div>
            <div className="flex flex-col w-[250px] border-l border-slate-800">
                <SwapUI market = {market as string} />
            </div>
        </div>
    </div>
}