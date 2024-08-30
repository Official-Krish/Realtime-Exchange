"use client"
import { hero } from './components/Hero';
import TrendingCoins from './components/TrendingCoins';
import { coinsTable } from './components/coinsTable';
export default function Home() {
  return (
    <div>
      {hero()}
      <TrendingCoins/>
      {coinsTable()}
    </div>
  );
}
