import { useState } from "react"



export const SwapUI = ({market}: {market: string}) => {
    const [activeTab, setActiveTab] = useState('buy')
    const [type, setType] = useState('limit')
    const [selectedCheckbox, setSelectedCheckbox] = useState(null);

    const handleCheckboxClick = (checkbox : any) => {
        setSelectedCheckbox(checkbox === selectedCheckbox ? null : checkbox);
    };
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
                            35.00 USDC
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="pt-3 px-2">
                <div className="text-slate-400 text-xs pl-2">
                    Price
                </div>
                <div className="flex flex-col relative pt-2">
                    <input placeholder="0.00" className="h-12 rounded-lg border bg-[var(--background)] pr-12 text-right text-2xl text-white border-gray-800" type="text" />
                    <div className="flex flex-row absolute right-1 top-1 p-2">
                        <div className="relative pt-2">
                            <img src="https://backpack.exchange/_next/image?url=%2Fcoins%2Fusdc.png&w=48&q=75" className="w-6 h-6" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-3 px-2">
                <div className="text-slate-400 text-xs pl-2">
                    Qunatity
                </div>
                <div className="flex flex-col relative pt-2">
                    <input placeholder="0.00" className="h-12 rounded-lg border bg-[var(--background)] pr-12 text-right text-2xl text-white border-gray-800" type="text" />
                    <div className="flex flex-row absolute right-1 top-1 p-2">
                        <div className="relative pt-2">
                            <img src="https://backpack.exchange/_next/image?url=%2Fcoins%2Fmax.png&w=48&q=75" className="w-6 h-6" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-5 px-2 flex justify-between">
                <div className="text-white text-xs rounded-full bg-gray-700 flex px-3 py-1 cursor-pointer">
                    25%
                </div>
                <div className="text-white text-xs rounded-full bg-gray-700 flex px-3 py-1 cursor-pointer">
                    50%
                </div>
                <div className="text-white text-xs rounded-full bg-gray-700 flex px-3 py-1 cursor-pointer">
                    75%
                </div>
                <div className="text-white text-xs rounded-full bg-gray-700 flex px-3 py-1 cursor-pointer">
                    Max
                </div>
            </div>


            <div className="pt-3 px-2">
                <div className="text-slate-400 text-xs pl-2">
                    Order Value
                </div>
                <div className="flex flex-col relative pt-2">
                    <input placeholder="0.00" className="h-12 rounded-lg border bg-[var(--background)] pr-12 text-right text-2xl text-white border-gray-800" type="text" />
                    <div className="flex flex-row absolute right-1 top-1 p-2">
                        <div className="relative pt-2">
                            <img src="https://backpack.exchange/_next/image?url=%2Fcoins%2Fusdc.png&w=48&q=75" className="w-6 h-6" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="pt-3 px-2">
                <button className="w-full rounded-xl border border-slate-800 py-3 bg-white font-semibold">
                    Sign up to trade
                </button>
            </div>

            <div className="pt-3 px-2 flex justify-start">
                <div
                    className={`flex items-center space-x-2 cursor-pointer transition-opacity duration-300 px-2`}>
                    <input
                        type="checkbox"
                        checked={selectedCheckbox === 'postOnly'}
                        onChange={() => handleCheckboxClick('postOnly')}
                        className="form-checkbox bg-black border-gray-600 focus:ring-transparent focus:ring-offset-0 rounded"
                    />
                    <span className="text-gray-400 text-xs">Post Only</span>
                </div>

                <div
                    className={`flex items-center space-x-2 cursor-pointer transition-opacity duration-300 px-2`}>
                    <input
                        type="checkbox"
                        checked={selectedCheckbox === 'ioc'}
                        onChange={() => handleCheckboxClick('ioc')}
                        className="form-checkbox bg-black border-gray-600 focus:ring-transparent focus:ring-offset-0 rounded"
                    />
                    <span className="text-gray-400 text-xs">IOC</span>
                </div>
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