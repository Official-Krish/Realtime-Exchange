export const AskTable = ({ asks }: { asks: [string, string][] }) => {
    let currentTotal = 0;
    const relevantAsks = asks.slice(0, 15);
    relevantAsks.reverse();

    const asksWithTotal: [string, string, number][] = relevantAsks.map(([price, quantity]) => [price, quantity, currentTotal += Number(quantity)]);
    const maxTotal = relevantAsks.reduce((acc, [_, quantity]) => acc + Number(quantity), 0);
    asksWithTotal.reverse();

    return <div>
        {asksWithTotal.map(([price, quantity, total]) => <Ask maxTotal={maxTotal} key={price} price={price} quantity={quantity} total={total}/>)}
    </div>
}

function Ask({ price, quantity, total, maxTotal }: { price: string, quantity: string, total: number, maxTotal: number }) {
    return <div className="flex relative width-full">
        <div className={`absolute top-0 left-0 w-${(100 * total / maxTotal).toFixed(2)}%  h-full transition-ease-in-out duration-300`}>
            <div className="flex justify-between text-xs w-full">
                <div>{price}</div>
                <div>{quantity}</div>
                <div>{total}</div>
            </div>
        </div>
    </div>
}