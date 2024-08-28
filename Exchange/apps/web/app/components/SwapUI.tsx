import { useState } from "react"

export const SwapUI = ({market}: {market: string}) => {
    const [activeTab, setActiveTab] = useState('buy')
    const [type, setType] = useState('limit')
    return <div>
        <div className="flex flex-col">
            <div className="flex flex-row h-[60px]">
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
        </div>
    </div>
}

function BuyButton({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: any }) {
    return <div onClick={() => setActiveTab('buy')}>
        <p className="text-center text-sm font-semibold text-green-200">
            Buy
        </p>
    </div>
}

function SellButton({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: any }) {
    return <div onClick={() => setActiveTab('sell')}>
        <p className="text-center text-sm font-semibold text-red-500">
            Sell
        </p>
    </div>
}


function LimitButton({ type, setType }: { type: string, setType: any }) {
    return <div className="flex flex-col cursor-pointer justify-center py-2" onClick={() => setType('limit')}>
    <div className="text-white">
        Limit
    </div>
</div>
}

function MarketButton({ type, setType }: { type: string, setType: any }) {
    return  <div className="flex flex-col cursor-pointer justify-center py-2" onClick={() => setType('market')}>
    <div className="text-white">
        Market
    </div>
    </div>
}