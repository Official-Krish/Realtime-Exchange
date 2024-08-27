import { useEffect, useState } from "react";
import type { Ticker } from "../../utils/types";
import { getTicker } from "../../utils/httpClient";
import { SignalingManager } from "../../utils/SignalingManager";

export const MarketBar = ({market} : {market: string}) => {
    const [ticker, setTicker] = useState<Ticker | null>(null);

    useEffect(() => {
        getTicker(market).then(setTicker);
        SignalingManager.getInstance().registerCallback("ticker", (data: Partial<Ticker>)  =>  setTicker(prevTicker => ({
            firstPrice: data?.firstPrice ?? prevTicker?.firstPrice ?? '',
            high: data?.high ?? prevTicker?.high ?? '',
            lastPrice: data?.lastPrice ?? prevTicker?.lastPrice ?? '',
            low: data?.low ?? prevTicker?.low ?? '',
            priceChange: data?.priceChange ?? prevTicker?.priceChange ?? '',
            priceChangePercent: data?.priceChangePercent ?? prevTicker?.priceChangePercent ?? '',
            quoteVolume: data?.quoteVolume ?? prevTicker?.quoteVolume ?? '',
            symbol: data?.symbol ?? prevTicker?.symbol ?? '',
            trades: data?.trades ?? prevTicker?.trades ?? '',
            volume: data?.volume ?? prevTicker?.volume ?? '',
        })), `TICKER-${market}`);
        SignalingManager.getInstance().sendMessage({"method":"SUBSCRIBE","params":[`ticker.${market}`]}	);

        return () => {
            SignalingManager.getInstance().deRegisterCallback("ticker", `TICKER-${market}`);
            SignalingManager.getInstance().sendMessage({"method":"UNSUBSCRIBE","params":[`ticker.${market}`]}	);
        }
    }, [market]);

    return <div>
        <div className="flex items-center flex-row relative w-full overflow-hidden border-b border-slate-800">
            <div className="flex items-center justify-between flex-row no-scrollbar overflow-auto pr-4">
                <Ticker market={market} />
                <div className="flex items-center flex-row space-x-8 pl-4">

                    <div className="flex flex-col h-full justify-center">
                        <p className={`font-medium tabular-nums text-greenText text-md text-green-500`}>{ticker?.lastPrice}</p>
                        <p className="font-medium text-sm tabular-nums text-white">${ticker?.lastPrice}</p>
                    </div>

                    <div className="flex flex-col">
                        <div className="font-medium text-slate-400 text-sm">24H Change</div>
                        <p className={` text-sm font-medium tabular-nums leading-5 text-greenText ${Number(ticker?.priceChange) > 0 ? "text-green-500" : "text-red-500"}`}>{Number(ticker?.priceChange) > 0 ? "+" : ""} {ticker?.priceChange} {Number(ticker?.priceChangePercent)?.toFixed(2)}%</p>
                    </div>

                    <div className="flex flex-col">
                        <p className="font-medium  text-slate-400 text-sm">24H High</p>
                        <p className="text-sm font-medium tabular-nums leading-5">{ticker?.high}</p>
                    </div>

                    <div className="flex flex-col">
                        <p className="font-medium text-slate-400 text-sm">24H Low</p>
                        <p className="font-medium tabular-nums leading-5 text-sm ">{ticker?.low}</p>
                    </div>

                    <button type="button" className="font-medium transition-opacity hover:opacity-80 hover:cursor-pointer text-base text-left" data-rac="">
                        <div className="flex flex-col">
                            <p className="font-medium text-slate-400 text-sm">24H Volume</p>
                            <p className="mt-1 font-medium tabular-nums leading-5 text-sm ">{ticker?.volume}</p>
                        </div>
                    </button>
                    
                </div>
            </div>
        </div>
    </div>
}

function Ticker({market} : {market: string}) {
    return <div className="flex h-[60px] space-x-4 cursor-pointer">
        <div className="flex flex-row relative ml-2 -mr-4">
            <img src="https://backpack.exchange/_next/image?url=%2Fcoins%2Fsol.png&w=48&q=75" className="w-12 h-12 rounded-full mt-2" />

            <div className="mt-4 px-4 ">
                <div className="text-lg text-white font-bold hover:text-slate-300"> {market.replace("_", " / ")} </div>
            </div>
        </div>
    </div>
}