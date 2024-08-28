export const BidsTable = ({ bids }: { bids: [string, string][] }) => {
    let curentTotal = 0;
    let relevantBids = bids.slice(0, 15);
    const bidsWithTotal : [string, string, number][] = relevantBids.map(([price, quantity]) => [price, quantity, curentTotal += Number(quantity)]);
    const maxTotal = relevantBids.reduce((acc, [_, quantity]) => acc + Number(quantity), 0);
    bidsWithTotal.reverse();

    return <div>
        {bidsWithTotal?.map(([price, quantity, total]) => <Bid maxTotal={maxTotal} total={total} key={price} price={price} quantity={quantity} />)}
    </div>
}


function Bid({ price, quantity, total, maxTotal }: { price: string, quantity: string, total: number, maxTotal: number }) {
    return <div>
        <div className="flex relative width-full">
            <div className={`absolute top-0 left-0 w-${(100 * total / maxTotal).toFixed(2)}%  h-full transition-ease-in-out duration-300`}>
                <div className="flex justify-between text-xs w-full">
                    <div>{price}</div>
                    <div>{quantity}</div>
                    <div>{total}</div>
                </div>
            </div>
        </div>
    </div>
}