export const MarketOrder = () => {
    return <div>
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
            <button className="w-full rounded-xl border border-slate-800 py-3 bg-white font-semibold">
                Sign up to trade
            </button>
        </div>

        <div className="pt-3 px-2">
            <div className="flex justify-between">
                <div className="text-slate-400 text-sm pl-2">
                    Limit Price
                </div>
                <div className="text-white text-sm pr-2">
                    0.3921
                </div>
            </div>
            <div className="flex justify-between">
                <div className="text-slate-400 text-sm pl-2">
                    Limit Quantity
                </div>
                <div className="text-white text-sm pr-2">
                    -
                </div>
            </div>
            <div className="flex justify-between">
                <div className="text-slate-400 text-sm pl-2">
                    Order Value
                </div>
                <div className="text-white text-sm pr-2">
                    -
                </div>
            </div>
        </div>
    </div>
}