import React, { useState, useEffect } from 'react';
import { Cloud, Coins, TrendingUp, RefreshCw, Sun, CloudRain } from 'lucide-react';
import { WidgetData } from '../types';

interface MarketWidgetsProps {
  darkMode: boolean;
}

export default function MarketWidgets({ darkMode }: MarketWidgetsProps) {
  const [data, setData] = useState<WidgetData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/market-widgets');
      if (res.ok && res.headers.get("content-type")?.includes("application/json")) {
        const json = await res.json();
        setData(json);
      } else {
        console.warn("Retrieved invalid and non-JSON content-type from /api/market-widgets");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
    const interval = setInterval(fetchDetails, 15000); // refresh every 15s automatically
    return () => clearInterval(interval);
  }, []);

  if (!data) return null;

  return (
    <div id="market-ticker" className={`text-xs py-1.5 px-4 border-b transition-colors flex items-center justify-between gap-3 overflow-hidden ${
      darkMode 
        ? 'bg-neutral-900 border-neutral-800 text-neutral-300' 
        : 'bg-neutral-50 border-neutral-200 text-neutral-600'
    }`}>
      {/* Real-time Ticker Items - swipeable on smartphone and tablet screens */}
      <div className="flex flex-nowrap items-center gap-6 overflow-x-auto scrollbar-none flex-1 select-none">
        {/* Weather Widget */}
        <div id="widget-weather" className="flex items-center gap-2">
          {data.weather.condition.includes("Hujan") ? (
            <CloudRain size={15} className="text-blue-500 animate-pulse" />
          ) : data.weather.condition.includes("Cerah") ? (
            <Sun size={15} className="text-amber-500 animate-spin" style={{ animationDuration: '6s' }} />
          ) : (
            <Cloud size={15} className="text-gray-400" />
          )}
          <span>
            Cuaca {data.weather.city}: <strong className={`${darkMode ? 'text-white' : 'text-neutral-900'}`}>{data.weather.temp}°C</strong> ({data.weather.condition})
          </span>
        </div>

        {/* Gold Price Widget */}
        <div id="widget-gold" className="flex items-center gap-2">
          <Coins size={15} className="text-amber-400" />
          <span>
            Harga Emas Antam: <strong className={`${darkMode ? 'text-white' : 'text-neutral-900'}`}>IDR {(data.goldPrice.perGramIDR).toLocaleString('id-ID')}/gr</strong>
          </span>
          <span className="text-emerald-500 font-semibold">{data.goldPrice.change}</span>
        </div>

        {/* Exchange Rate (Kurs) Widget */}
        <div id="widget-kurs" className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <TrendingUp size={14} className="text-emerald-500" />
            <span>USD: <strong className={`${darkMode ? 'text-white' : 'text-neutral-900'}`}>IDR {data.kurs.usdToIdr.toLocaleString('id-ID')}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>SGD: <strong className={`${darkMode ? 'text-white' : 'text-neutral-900'}`}>IDR {data.kurs.sgdToIdr.toLocaleString('id-ID')}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>EUR: <strong className={`${darkMode ? 'text-white' : 'text-neutral-900'}`}>IDR {data.kurs.eurToIdr.toLocaleString('id-ID')}</strong></span>
          </div>
        </div>
      </div>

      {/* Manual refresh button */}
      <button
        id="btn-refresh-widgets"
        onClick={fetchDetails}
        disabled={loading}
        className={`flex items-center gap-1 px-2.5 py-0.5 rounded transition-all cursor-pointer select-none border text-[10px] font-bold ${
          darkMode 
            ? 'border-neutral-700 hover:bg-neutral-800 text-neutral-400 active:scale-95' 
            : 'border-neutral-200 hover:bg-neutral-100 text-neutral-500 active:scale-95'
        }`}
      >
        <RefreshCw size={10} className={`${loading ? 'animate-spin text-blue-500' : ''}`} />
        <span>RE-KURS</span>
      </button>
    </div>
  );
}
