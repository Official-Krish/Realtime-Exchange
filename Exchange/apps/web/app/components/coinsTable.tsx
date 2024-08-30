import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FaSearch } from "react-icons/fa"
import { AiFillDollarCircle, AiOutlineStar, AiFillDelete } from "react-icons/ai"
import { RxCrossCircled, RxCross1 } from "react-icons/rx"
import { FiTrendingDown } from "react-icons/fi"
import { FiTrendingUp } from "react-icons/fi"
import { AiFillCaretDown } from "react-icons/ai"
import { AiOutlineDollarCircle, AiFillStar } from "react-icons/ai"
import { BiRupee } from "react-icons/bi"
import { useToast } from '@chakra-ui/react'
import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    DrawerContentProps,
    DrawerProps,

} from '@chakra-ui/react'
import { useDisclosure } from '@chakra-ui/react';
import { HiOutlineArrowsUpDown } from "react-icons/hi2"
import { Tooltip } from '@chakra-ui/react'
import Link from 'next/link';

type topCoinObj = {
    coinName: string,
    image: string,
    percentChange: number,
    current_price: number,
    id: string,
    symbol: string,
    price_change_percentage_24h: number,
    market_cap: number,
    total_volume: number
}


type CryptoCoin = {
    id: string;
    price: number;
    image: string;
    name: string;
};

export const coinsTable = () => {

    const [cryptoData, setCryptoData] = useState<topCoinObj[]>([]);  // all coins
    const [filteredArray, setFilteredArray] = useState<topCoinObj[]>([]); // all coins
    const [seacrhTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState<number>(1);
    const [active, setActive] = useState(1);
    const [currencyModal, setCurrecnyModal] = useState(false);
    const [currency, setCurrency] = useState("usd");
    const [metaverseCoins, setMetavserseCoins] = useState<topCoinObj[]>([]) // metaverse coins
    const [metaverseFilter, setMetaverseFilter] = useState<topCoinObj[]>([]); // metaverse coins

    const [gamingCoins, setGamingCoins] = useState<topCoinObj[]>([]) // gaimng
    const [gamingFilter, setGamingFilter] = useState<topCoinObj[]>([]) // gaimng

    const [originalARR, setOriginalARR] = useState([]);
    const [tabState, setTabState] = useState("all coins");


    const pages = [1, 2, 3, 4];

    const toast = useToast();


    //fecthnig data
    useEffect(() => {
        // all coins
        fetch(
            `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency.toLowerCase()}&order=market_cap_desc&per_page=80&page=1&sparkline=false`
        )
            .then((response) => response.json())
            .then((data) => {
                setCryptoData(data)
                setOriginalARR(data);
                setFilteredArray(data);
            })
            .catch((error) => {
                // Handle error
                throw new Error('Error fetching all coins: ' + error);
            });

        // metaverse
        fetch(
            `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency.toLowerCase()}&category=metaverse&order=market_cap_desc&per_page=80&page=1&sparkline=false`
        )
            .then((response) => response.json())
            .then((data) => {
                setMetavserseCoins(data)
                setMetaverseFilter(data)
            })
            .catch((error) => {
                // Handle error
                throw new Error('Error fetching metaverse coins: ' + error);
            });

        // gaming
        /* fetch(
             `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency.toLowerCase()}&category=gaming&order=market_cap_desc&per_page=80&page=1&sparkline=false`
         )
             .then((response) => response.json())
             .then((data) => {
                 setGamingCoins(data)
                 setGamingFilter(data)
             })
             .catch((error) => {
                 // Handle error
                 throw new Error('Error fetching gaming coins: ' + error);
             });*/

    }, [currency]);




    const searchHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchTerm = e.target.value;
        setSearchTerm(searchTerm);

        // search for all coins
        if (tabState === "all coins") {

            if (filteredArray.length > 0) {
                const mutateArr = filteredArray.filter((item) => {
                    const coinName = item.id.toLowerCase().includes(searchTerm.toLowerCase());
                    const coinSymbol = item.symbol.toLowerCase().includes(searchTerm.toLowerCase());

                    return coinName || coinSymbol
                });

                setCryptoData(mutateArr);

                // Reset the active page to the first page
                setActive(1);
                setPage(1);
            }
        }

        // search for metaverse

        else if (tabState === "metaverse") {

            if (metaverseFilter.length > 0) {
                const mutateArr = metaverseFilter.filter((item) => {
                    const coinName = item.id.toLowerCase().includes(searchTerm.toLowerCase());
                    const coinSymbol = item.symbol.toLowerCase().includes(searchTerm.toLowerCase());

                    return coinName || coinSymbol
                });

                setCryptoData(mutateArr);

                // Reset the active page to the first page
                setActive(1);
                setPage(1);
            }
        }

        // search for gaming


        else if (tabState === "gaming") {

            if (gamingFilter.length > 0) {
                const mutateArr = gamingFilter.filter((item) => {
                    const coinName = item.id.toLowerCase().includes(searchTerm.toLowerCase());
                    const coinSymbol = item.symbol.toLowerCase().includes(searchTerm.toLowerCase());

                    return coinName || coinSymbol
                });

                setCryptoData(mutateArr);
                setActive(1);
                setPage(1);
            }
        }



    };

    // currecny modal
    const currencyModalToggle = () => {
        setCurrecnyModal(!currencyModal)
    }


    // tabs change 
    const metaVerseCategrotyHandler = () => {
        setCryptoData(metaverseCoins)
        setTabState("metaverse")
    }

    const gamingCoinsCategoryHandler = () => {
        setCryptoData(gamingCoins)
        setTabState("gaming")
    }

    const allCoinsHandler = () => {
        setCryptoData(originalARR)
        setTabState("all coins")
    }

    // add to favourites drawer 
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [sortOrder, setSortOrder] = useState('none');


    const lowTOhighHanler = () => {

        const sortedData = [...cryptoData].sort((a, b) => a.current_price - b.current_price);
        setCryptoData(sortedData);
    }

    const highTOlowHandler = () => {
        const sortedData = [...cryptoData].sort((a, b) => b.current_price - a.current_price);
        setCryptoData(sortedData);
    }


    const MyDrawerContent: React.FC<DrawerProps> = ({ children }) => {
        // Your implementation here
        return <DrawerContent>{children}</DrawerContent>
    };

    const MyDrawerBody: React.FC<DrawerProps> = ({ children }) => {
        // Your implementation here
        return <DrawerBody>{children}</DrawerBody>
    };


    return (
        <div className='pt-8'>
            {/* SEARCH BAR */}
            <div className="flex items-center justify-center py-5">
                <div className="flex items-center gap-8 md:justify-center">
                    <div className="mt-2 relative">
                        <input
                            type="text"
                            placeholder="Search"
                            value={seacrhTerm}
                            onChange={searchHandler}
                            className="px-4 py-1.5 pl-7 boxsh rounded-md bg-transparent border-2 border-gray-200 text-gray-600 focus:outline-none"
                        />
                        <FaSearch className="absolute left-2 top-3 text-gray-400 text-sm" />
                    </div>
    
                    <div onClick={currencyModalToggle} className="flex items-center gap-2 cursor-pointer border rounded w-52 py-5 justify-center h-10 lg:flex">
                        <p>Currency</p>
                        <AiFillCaretDown />
                    </div>
    
                    {/* CURRENCY MODAL */}
                    {currencyModal && (
                        <div className="absolute w-38rem bg-white p-4 rounded shadow-lg">
                            <div className="flex flex-col gap-4">
                                <div
                                    className="flex items-center gap-3 cursor-pointer"
                                    onClick={() => setCurrency("usd")}
                                >
                                    <AiOutlineDollarCircle className="text-xl font-semibold" />
                                    <p>USD</p>
                                </div>
                                <div
                                    className="flex items-center gap-3 cursor-pointer"
                                    onClick={() => setCurrency("inr")}
                                >
                                    <BiRupee className="text-xl font-semibold" />
                                    <p>INR</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
    
                {/* FILTER TABS */}
                <div className="flex gap-8 flex-wrap items-center mt-5 md:mt-0 mx-5">
                    <p
                        className={`${
                            tabState === "all coins"
                                ? "flex justify-center items-center w-24 h-9 rounded-md border border-black cursor-pointer scalee"
                                : "flex justify-center items-center w-24 h-9 rounded-md greyBackground cursor-pointer scalee"
                        }`}
                        onClick={allCoinsHandler}
                    >
                        All Coins
                    </p>
                    <p
                        className={`${
                            tabState === "metaverse"
                                ? "flex justify-center items-center w-24 h-9 rounded-md border border-black cursor-pointer scalee"
                                : "flex justify-center items-center w-24 h-9 rounded-md greyBackground cursor-pointer scalee"
                        }`}
                        onClick={metaVerseCategrotyHandler}
                    >
                        Metaverse
                    </p>
                </div>
            </div>
    
            <br />
    
            {/* MAIN CRYPTO TABLE */}
            <div className="overflow-x-auto">
                {cryptoData.length === 0 ? (
                    <p className="font-semibold flex justify-center items-center mb-4 gap-2">
                        No Results Found
                        <RxCrossCircled className="text-2xl text-red-600" />
                    </p>
                ) : (

                    <table className="mx-auto w-full lg:w-9/12">
                        {/* head */}
                        <thead>
                            <tr className="border-b">
                                <th className="py-3 px-4 text-left">Coin</th>
                                <th className="py-3 px-4 text-left">
                                    <Tooltip label="Low To High">
                                        <span
                                            id="lowTOhigh"
                                            className="flex items-center gap-1 cursor-pointer"
                                            onClick={lowTOhighHanler}
                                        >
                                            Price
                                            <HiOutlineArrowsUpDown className="text-xl" />
                                        </span>
                                    </Tooltip>
                                </th>
                                <th className="py-3 px-4 text-left">Total Volume</th>
                                <th className="py-3 px-4 text-left">
                                    <Tooltip label="High To Low">
                                        <span
                                            id="highTOlow"
                                            className="flex items-center gap-1 cursor-pointer"
                                            onClick={highTOlowHandler}
                                        >
                                            Market Cap
                                            <HiOutlineArrowsUpDown className="text-xl rotate-180" />
                                        </span>
                                    </Tooltip>
                                </th>
                                <th className="py-3 px-4 text-left">Price Change</th>
                            </tr>
                        </thead>
    
                        <tbody>
                            {cryptoData.slice(page * 20 - 20, page * 20).map((coin, index) => (
                                <tr key={coin.id}>
                                    <td className="py-6 cursor-pointer">
                                        <Link href={`/trade/${coin.id}_USDC`}>
                                            <img
                                                src={coin.image}
                                                className="sm:w-12 sm:h-12 w-9 h-9 inline-block mr-2"
                                                alt={coin.id}
                                            />
                                            <span className="font-semibold inline-block uppercase sm:text-base text-sm mr-4">
                                                {coin.id.substring(0, 18)}
                                            </span>
                                        </Link>
                                    </td>
                                    <td className="font-semibold py-6 sm:text-base text-sm">
                                        {currency === "usd" ? (
                                            "$"
                                        ) : (
                                            <BiRupee className="inline-block" />
                                        )}{" "}
                                        {coin.current_price.toLocaleString()}
                                    </td>
                                    <td className="font-semibold pl-6 sm:text-base text-sm">
                                        {coin.total_volume.toLocaleString()}
                                    </td>
                                    <td className="font-semibold text-gray-500 py-6 sm:text-base text-sm">
                                        {currency === "usd" ? (
                                            "$"
                                        ) : (
                                            <BiRupee className="inline-block" />
                                        )}{" "}
                                        {coin.market_cap.toLocaleString()}
                                    </td>
                                    <td
                                        className={`${
                                            coin.price_change_percentage_24h > 0
                                                ? "text-green-600"
                                                : "text-red-600"
                                        } font-semibold py-6 sm:text-base text-sm inline-block align-middle`}
                                    >
                                        <span className="inline-block align-middle">
                                            {coin.price_change_percentage_24h > 0 ? (
                                                <FiTrendingUp className="text-xl" />
                                            ) : (
                                                <FiTrendingDown className="text-xl" />
                                            )}
                                        </span>{" "}
                                        {coin.price_change_percentage_24h.toFixed(2)}%
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
    
            <div className="w80 mx-auto bg-gray-100 mt-4"></div>
            <br />
            <br />
            <br />
    
            {/* PAGINATION */}
            <div className="flex gap-4 flex-wrap justify-center">
                {pages.map((item) => (
                    <p
                        key={item}
                        className={`${
                            active === item
                                ? "bg-black text-white indivitualPage2 font-semibold cursor-pointer"
                                : "indivitualPage font-semibold cursor-pointer"
                        }`}
                        onClick={(e) => {
                            if (e.target instanceof HTMLParagraphElement) {
                                setPage(parseInt(e.target.innerText) || 0);
                                setActive(parseInt(e.target.innerText) || 0);
                            }
                        }}
                    >
                        {item}
                    </p>
                ))}
            </div>
        </div>
    );
    
}

