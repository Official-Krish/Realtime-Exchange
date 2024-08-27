"use client";
import { useParams } from "next/navigation";
import { MarketBar } from "../../components/MarketBar";
import { TradeView } from "../../components/TradeView";

export default function Page() {
    const { market } = useParams();
    return <div className="flex flex-row flex-1 h-screen bg-slate-900">
        <div className="flex flex-col flex-1">
            <MarketBar market={market as string} />
            <div className="flex flex-row h-[920px] border-y border-slate-800">
                <div className="flex flex-col flex-1">
                    <TradeView market={market as string} />
                </div>
            </div>
        </div>
    </div>
}