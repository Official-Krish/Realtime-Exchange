"use client"
import { hero } from './components/Hero';
import TrendingCoins from './components/TrendingCoins';
export default function Home() {
  return (
    <div >
      {hero()}
      <TrendingCoins/>

      <div className='w-full h-screen bg-primary'>

      </div>

    </div>

  );
}
