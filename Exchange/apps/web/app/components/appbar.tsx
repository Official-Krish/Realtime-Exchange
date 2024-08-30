export const Appbar = () => {
    return (
        <div className="h-14 bg-main border-b border-slate-800">
            <div className="flex flex-row justify-between h-full px-6">
                <div className="flex space-x-12 items-center">
                    <div className="font-semibold text-xl text-white">Exchange</div>
                    <div className="text-slate-400 py-1.5 font-semibold text-sm">Markets</div>
                    <div className="text-slate-400 py-1.5 font-semibold text-sm">Trade</div>
                    <div className="text-slate-400 py-1.5 font-semibold text-sm">More</div>
                </div>

                <div className="flex items-center">
                    <div className="relative py-1 w-80 rounded-full border bg-zinc-900 border-gray-800 flex items-center">
                        <div className="text-white px-2">{search()}</div>
                        <input
                            placeholder="Search markets"
                            className="py-1 px-1 w-full rounded-full bg-zinc-900 text-md text-white text-sm font-normal border-none focus:outline-none"
                            type="text"
                        />
                    </div>
                </div>


                <div className="flex space-x-4 text-white items-center">
                    <div>
                        {signup()}
                    </div>
                    <div>
                        {signin()}
                    </div>
                </div>
            </div>
        </div>
    );
};

function search() {
    return <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="18" height="18" viewBox="0,0,256,256">
        <g fill="#18181b" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none"><path d="M0,256v-256h256v256z" id="bgRectangle"></path></g><g fill="#737373" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none"><g transform="scale(5.12,5.12)"><path d="M21,3c-9.37891,0 -17,7.62109 -17,17c0,9.37891 7.62109,17 17,17c3.71094,0 7.14063,-1.19531 9.9375,-3.21875l13.15625,13.125l2.8125,-2.8125l-13,-13.03125c2.55469,-2.97656 4.09375,-6.83984 4.09375,-11.0625c0,-9.37891 -7.62109,-17 -17,-17zM21,5c8.29688,0 15,6.70313 15,15c0,8.29688 -6.70312,15 -15,15c-8.29687,0 -15,-6.70312 -15,-15c0,-8.29687 6.70313,-15 15,-15z"></path></g></g>
    </svg>
}


function signup(){
    return <div>
        <button className={`rounded-xl text-green-400 px-3 py-1.5 text-sm font-medium`}
            style={{ backgroundColor: 'rgba(0, 200, 0, 0.2)' }}>
            Sign up
        </button>
    </div>
}
function signin(){
    return <div>
        <button className={`rounded-xl text-sky-500 px-3 py-1.5 text-sm font-semibold`}
            style={{ backgroundColor: 'rgba(76, 148, 255, .16)' }}>
            Sign in
        </button>
    </div>
}