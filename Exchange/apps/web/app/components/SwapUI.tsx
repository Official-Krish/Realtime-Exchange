import { useState } from "react"
import { LimitOrder } from "./limitOrder";
import { MarketOrder } from "./MarketOrder";

export const SwapUI = ({market}: {market: string}) => {
    const [activeTab, setActiveTab] = useState('buy')
    const [type, setType] = useState('limit')

    return <div>
        <div className="flex flex-col">
            <div className="flex flex-row h-[60px] cursor-pointer">
                <BuyButton activeTab={activeTab} setActiveTab={setActiveTab}/>
                <SellButton activeTab={activeTab} setActiveTab={setActiveTab}/>
            </div>
            <div className="flex flex-col gap-1">
                <div className="px-3">
                    <div className="flex flex-row flex-0 gap-5">
                        <LimitButton type={type} setType={setType}/>
                        <MarketButton type={type} setType={setType}/>
                    </div>
                </div>
            </div>

            <div className="flex justify-between pt-1">
                <div className="flex text-slate-400 text-xs">
                    <div className="pl-2">
                        Available Balance
                    </div>
                </div>
                <div className="flex">
                    <div className="text-white text-xs">
                        <div className="pr-3">
                            {activeTab === 'buy' ? '0.00000 USDC' : '0.00 SOL'} 
                        </div>
                    </div>
                </div>
            </div>
            <div>
                {type === "limit" ? <LimitOrder/> : <MarketOrder/>}
            </div>
            
        </div>
    </div>
}

function BuyButton({ activeTab, setActiveTab } : { activeTab: string, setActiveTab: any }) {
    return (
        <div
            className={`flex flex-col flex-1 cursor-pointer justify-center border-b-2 p-4 mb-[-2px] 
            ${activeTab === 'buy' 
                ? 'border-b-green-500' 
                : 'border-b-gray-800 hover:border-b-gray-500'}`}
                style={{ backgroundColor: activeTab === 'buy' ? 'rgba(0, 200, 0, 0.1)' : 'transparent' }}
            onClick={() => setActiveTab('buy')}
        >
            <p className="text-center text-sm font-semibold text-green-500">
                Buy
            </p>
        </div>
    );
}


function SellButton({ activeTab, setActiveTab } : { activeTab: string, setActiveTab: any }) {
    return (
        <div
            className={`flex flex-col flex-1 cursor-pointer justify-center border-b-2 p-4 mb-[-2px] 
            ${activeTab === 'sell' 
                ? 'border-b-red-500' 
                : 'border-b-gray-800 hover:border-b-gray-500'}`}
                style={{ backgroundColor: activeTab === 'sell' ? 'rgba(42,21,25,255)' : 'transparent' }}
            onClick={() => setActiveTab('sell')}
        >
            <p className="text-center text-sm font-semibold text-red-500">
                Buy
            </p>
        </div>
    );
}


function LimitButton({ type, setType }: { type: string, setType: any }) {
    return <div className="flex flex-col cursor-pointer justify-center py-2" onClick={() => setType('limit')}>
    <div className={`text-white font-medium py-1  text-sm ${type === "limit"
        ? 'border-b-2 border-b-sky-600' 
        : ''}
    `} >
        Limit
    </div>
</div>
}

function MarketButton({ type, setType }: { type: string, setType: any }) {
    return  <div className="flex flex-col cursor-pointer justify-center py-2" onClick={() => setType('market')}>
        <div className={`text-white font-medium py-1 text-sm ${type === "market"
            ? 'border-b-2 border-b-sky-600' 
            : ''
            }`}>
            Market
        </div>
    </div>
}