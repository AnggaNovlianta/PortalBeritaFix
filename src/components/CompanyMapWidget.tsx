import React, { useState } from 'react';
import { Compass, MapPin, Gauge, Info, Navigation, AlertTriangle } from 'lucide-react';

interface CompanyMapWidgetProps {
  websiteSettings: {
    companyName: string;
    companyAddress: string;
    companyMapCoordinates: string;
  };
  themeAccent: {
    bg: string;
    text: string;
    border?: string;
  };
  darkMode: boolean;
  compact?: boolean;
}

export const CompanyMapWidget: React.FC<CompanyMapWidgetProps> = ({
  websiteSettings,
  themeAccent,
  darkMode,
  compact = false
}) => {
  const [routeOrigin, setRouteOrigin] = useState('');
  const [routingResult, setRoutingResult] = useState<string | null>(null);
  const [showTrafficHeatmap, setShowTrafficHeatmap] = useState(true);
  const [trafficIntensity, setTrafficIntensity] = useState<'lancar' | 'padat' | 'macet'>('padat');

  const estimateLocationRoute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!routeOrigin) return;

    let distance = 0;
    let duration = 0;
    let description = '';

    // Tailor-made route descriptions based on traffic intensity and locations
    if (trafficIntensity === 'lancar') {
      distance = Math.round(Math.random() * 8 + 3);
      duration = Math.round(distance * 1.8 + 5);
      description = `Lalu Lintas Lancar Hijau. Rute tercepat dari "${routeOrigin}" melewati Jl. Jenderal Sudirman bebas hambatan. Estimasi tiba dalam ${duration} menit (${distance} km).`;
    } else if (trafficIntensity === 'padat') {
      distance = Math.round(Math.random() * 10 + 4);
      duration = Math.round(distance * 3.5 + 10);
      description = `Lalu Lintas Ramai Merayap. Dari "${routeOrigin}" terhambat di Bundaran HI. Disarankan melewati jalan alternatif Menteng. Estimasi tiba dalam ${duration} menit (${distance} km).`;
    } else {
      distance = Math.round(Math.random() * 12 + 5);
      duration = Math.round(distance * 6.5 + 20);
      description = `MACET SEKTOR UTAMA! Rute dari "${routeOrigin}" menuju kantor kami mengalami hambatan parah di Jl. Rasuna Said karena jam pulang kantor. Estimasi tiba membengkak hingga ${duration} menit (${distance} km).`;
    }

    setRoutingResult(description);
  };

  // Define traffic parameters based on intensity selected
  const getTrafficDetails = () => {
    switch (trafficIntensity) {
      case 'lancar':
        return {
          title: 'Lancar Jaya',
          colorClass: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
          dotColor: 'bg-emerald-500',
          speed: '45-60 km/jam',
          desc: 'Arus jalan mayoritas hijau tanpa hambatan berarti di Thamrin.',
          lineColor: 'bg-emerald-500/30'
        };
      case 'padat':
        return {
          title: 'Ramai Merayap',
          colorClass: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
          dotColor: 'bg-amber-500',
          speed: '20-35 km/jam',
          desc: 'Antrean kendaraan terjadi di persimpangan lampu merah.',
          lineColor: 'bg-amber-500/40'
        };
      case 'macet':
        return {
          title: 'Macet Total',
          colorClass: 'text-rose-500 bg-rose-500/10 border-rose-500/20 animate-pulse',
          dotColor: 'bg-rose-600',
          speed: '5-12 km/jam',
          desc: 'Hambatan kendaraan padat merayap imbas jam sibuk administrasi.',
          lineColor: 'bg-rose-600/60'
        };
    }
  };

  const traffic = getTrafficDetails();
  const [lat, lon] = (websiteSettings.companyMapCoordinates || "-6.2088,106.8456").split(',');

  return (
    <div className={`p-5 rounded-lg border space-y-4 text-xs transition-all ${
      darkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-slate-200 shadow-sm'
    }`}>
      {/* Widget Header with Interactive Icon */}
      <div className="flex items-center justify-between border-b pb-2.5 transition-colors duration-200 border-neutral-800 dark:border-neutral-800 border-slate-100">
        <div className="flex items-center gap-1.5 font-black uppercase tracking-wider text-blue-500">
          <Compass size={14} className={themeAccent.text} />
          <span className={darkMode ? 'text-blue-400' : 'text-slate-800'}>Interactive Map & Lalu Lintas</span>
        </div>
        <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-400`}>
          Live Heatmap
        </span>
      </div>
      
      {/* Address Details */}
      <div className="space-y-1">
        <h4 className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{websiteSettings.companyName}</h4>
        <p className={`text-[11px] leading-relaxed ${darkMode ? 'text-neutral-400' : 'text-slate-600'}`}>{websiteSettings.companyAddress}</p>
      </div>

      {/* Primary Simulator Frame */}
      <div className={`rounded-xl border p-4 relative overflow-hidden space-y-3 ${
        darkMode ? 'bg-black/40 border-neutral-800' : 'bg-slate-50 border-slate-150'
      }`}>
        {/* Lat/Lon and Heatmap Toggle */}
        <div className="flex items-center justify-between text-[10px] text-neutral-400">
          <span className="font-mono text-[9px]">📍 {lat.trim()}, {lon.trim()}</span>
          <button
            onClick={() => setShowTrafficHeatmap(!showTrafficHeatmap)}
            className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border cursor-pointer transition-all ${
              showTrafficHeatmap 
                ? 'bg-red-500/20 text-red-400 border-red-500/30' 
                : 'bg-neutral-800 text-neutral-400 border-neutral-700 hover:text-white'
            }`}
          >
            {showTrafficHeatmap ? '🔥 Heatmap: ON' : '🔴 Heatmap: OFF'}
          </button>
        </div>

        {/* The Graphic Map Box */}
        <div className="h-32 bg-neutral-950 border border-neutral-900 rounded-lg relative flex items-center justify-center overflow-hidden shadow-inner cursor-crosshair group">
          {/* Animated Map Grid lines - Simulated Cartography */}
          <div className="absolute inset-0 opacity-15">
            {/* Horizontal streets */}
            <div className={`absolute top-6 inset-x-0 h-[2px] transition-colors duration-500 ${showTrafficHeatmap ? traffic.lineColor : 'bg-neutral-800'}`} />
            <div className={`absolute top-16 inset-x-0 h-[3px] transition-colors duration-500 ${showTrafficHeatmap ? traffic.lineColor : 'bg-neutral-800'}`} />
            <div className={`absolute top-24 inset-x-0 h-[1.5px] transition-colors duration-300 ${showTrafficHeatmap ? 'bg-emerald-500/20' : 'bg-neutral-800'}`} />
            
            {/* Vertical streets */}
            <div className={`absolute left-8 inset-y-0 w-[2px] transition-colors duration-500 ${showTrafficHeatmap ? traffic.lineColor : 'bg-neutral-800'}`} />
            <div className={`absolute left-24 inset-y-0 w-[4px] transition-colors duration-500 ${showTrafficHeatmap && trafficIntensity === 'macet' ? 'bg-rose-700/60' : showTrafficHeatmap ? traffic.lineColor : 'bg-neutral-800'}`} />
            <div className={`absolute left-40 inset-y-0 w-[2px] transition-colors duration-300 ${showTrafficHeatmap ? 'bg-emerald-500/20' : 'bg-neutral-800'}`} />
          </div>

          {/* Simulated Traffic Flow - Moving particles on streets */}
          {showTrafficHeatmap && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {/* Traffic dots sliding through streets */}
              {/* Jl. Sudirman/Thamrin (Vertical left 24) */}
              <div 
                className={`absolute left-[95px] h-1 w-1 rounded-full ${traffic.dotColor} animate-ping`}
                style={{ top: '20%', animationDuration: trafficIntensity === 'lancar' ? '1s' : trafficIntensity === 'padat' ? '2s' : '4s' }}
              />
              <div 
                className={`absolute left-[97px] h-1 w-1 rounded-full ${traffic.dotColor}`}
                style={{ 
                  animation: `translateYPath 15s infinite linear`,
                  top: '-10px'
                }}
              />
              {/* Jl. Thamrin Utama (Horizontal top 16) */}
              <div 
                className={`absolute top-[63px] h-1.5 w-1.5 rounded-full ${traffic.dotColor}`}
                style={{ 
                  animation: `translateXPath ${trafficIntensity === 'lancar' ? '4s' : trafficIntensity === 'padat' ? '9s' : '18s'} infinite linear`,
                  left: '-10px'
                }}
              />
            </div>
          )}

          {/* Traffic Intensity Heatmap Blobs Overlay */}
          {showTrafficHeatmap && (
            <div className="absolute inset-0 pointer-events-none">
              {/* Primary Heatmap blur circles */}
              <div className={`absolute rounded-full filter blur-[15px] opacity-45 transition-all duration-700 ${
                trafficIntensity === 'lancar' 
                  ? 'bg-emerald-500 w-16 h-16 top-4 left-12' 
                  : trafficIntensity === 'padat'
                    ? 'bg-yellow-500 w-20 h-20 top-8 left-16 animate-pulse'
                    : 'bg-red-600 w-24 h-24 top-6 left-10 animate-pulse'
              }`} />
              
              <div className={`absolute rounded-full filter blur-[20px] opacity-35 transition-all duration-700 ${
                trafficIntensity === 'lancar' 
                  ? 'bg-emerald-400 w-12 h-12 top-14 left-32' 
                  : trafficIntensity === 'padat'
                    ? 'bg-orange-500 w-16 h-16 top-10 left-24 animate-pulse'
                    : 'bg-rose-700 w-28 h-28 top-2 left-20 animate-pulse'
              }`} />

              {/* Static minor green nodes representing alternative green passages */}
              <div className="absolute rounded-full filter blur-[10px] opacity-30 bg-emerald-500 w-12 h-12 bottom-2 right-4" />
            </div>
          )}

          {/* Compass Radar sweep animation to represent GPS positioning */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-24 h-24 rounded-full border border-neutral-800/40 relative flex items-center justify-center">
              <div className="w-16 h-16 rounded-full border border-neutral-900/50" />
              {/* Sweeper arm */}
              <div className="absolute inset-0 border-l border-neutral-750/30 rounded-full animate-spin" style={{ animationDuration: '6s' }} />
            </div>
          </div>

          {/* Center Office Location Marker with glowing pulse */}
          <div className="z-10 flex flex-col items-center">
            <div className="relative">
              {/* Outer pulsing ring */}
              <span className="absolute -inset-1 rounded-full bg-red-650/45 animate-ping" />
              <MapPin className="text-red-500 relative cursor-pointer drop-shadow-[0_2px_8px_rgba(239,68,68,0.5)] transition-transform hover:scale-110" size={24} />
            </div>
            <span className="text-[8px] bg-black/95 text-white p-1 rounded font-black border border-neutral-800 uppercase tracking-tight mt-1 whitespace-nowrap shadow-md">
              Thamrin Precision Lt. 12
            </span>
          </div>
        </div>

        {/* Interactive Controls & Legend */}
        <div className="space-y-2 bg-neutral-900/50 dark:bg-black/20 p-2.5 rounded-lg border border-neutral-850 dark:border-neutral-900">
          <div className="flex items-center justify-between">
            <span className="text-[9px] uppercase tracking-wider text-neutral-400 font-extrabold flex items-center gap-1">
              <Gauge size={10} /> Simulasi Kepadatan Jalan
            </span>
            {/* Selector Options */}
            <div className="flex gap-1">
              {(['lancar', 'padat', 'macet'] as const).map((intensity) => (
                <button
                  key={intensity}
                  onClick={() => setTrafficIntensity(intensity)}
                  className={`text-[8px] font-black uppercase px-2 py-0.5 rounded cursor-pointer transition-all border ${
                    trafficIntensity === intensity
                      ? intensity === 'lancar'
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 font-black shadow-inner shadow-emerald-500/10'
                        : intensity === 'padat'
                          ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 font-black shadow-inner shadow-amber-500/10'
                          : 'bg-rose-500/20 text-rose-400 border-rose-500/40 font-black shadow-inner shadow-rose-300/10 animate-pulse'
                      : 'bg-neutral-800 text-neutral-400 border-neutral-750 hover:text-white'
                  }`}
                >
                  {intensity}
                </button>
              ))}
            </div>
          </div>

          {/* Current Traffic Status Legend Box */}
          <div className={`p-2 rounded border flex items-start gap-2 text-[9px] transition-colors duration-300 ${traffic.colorClass}`}>
            <div className="shrink-0 mt-0.5">
              {trafficIntensity === 'macet' ? <AlertTriangle size={11} className="animate-bounce" /> : <Info size={11} />}
            </div>
            <div>
              <p className="font-extrabold flex items-center gap-1">
                <span>INTENSITAS JALAN: {traffic.title}</span>
                <span className="opacity-60">•</span>
                <span className="font-mono text-[8.5px] tracking-wide">{traffic.speed}</span>
              </p>
              <p className="text-neutral-300 leading-snug mt-0.5">{traffic.desc}</p>
            </div>
          </div>
        </div>

        {/* Route Planner Form */}
        <form onSubmit={estimateLocationRoute} className="space-y-1.5 border-t border-neutral-850 pt-2.5">
          <label className="block text-[8.5px] text-neutral-400 uppercase font-bold flex items-center gap-1">
            <Navigation size={9} /> Estimasi Rute & Waktu Tempuh Terkini
          </label>
          <div className="flex gap-1.5">
            <input 
              type="text" 
              required 
              placeholder="Masukkan titik start (cth: Kemang, Bogor)..." 
              value={routeOrigin}
              onChange={(e) => setRouteOrigin(e.target.value)}
              className="flex-1 bg-neutral-900 p-1 px-2 rounded text-[10px] focus:outline-none text-white border border-neutral-800"
            />
            <button 
              type="submit" 
              className={`p-1 px-2.5 rounded ${themeAccent.bg} hover:opacity-90 text-white font-black text-[9px] tracking-widest cursor-pointer transition-opacity uppercase`}
            >
              HITUNG
            </button>
          </div>
        </form>

        {/* Animated Slide-In routing estimation result */}
        {routingResult && (
          <div className="p-2.5 bg-neutral-900/80 border border-neutral-800 text-[9px] text-cyan-400 rounded leading-relaxed animate-fadeIn relative">
            <button 
              type="button" 
              onClick={() => setRoutingResult(null)} 
              className="absolute top-1 right-1 px-1.5 hover:text-white text-neutral-500 font-bold"
              title="Bersihkan"
            >
              ×
            </button>
            {routingResult}
          </div>
        )}
      </div>

      <style>{`
        @keyframes translateXPath {
          0% { transform: translateX(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateX(200px); opacity: 0; }
        }
        @keyframes translateYPath {
          0% { transform: translateY(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(120px); opacity: 0; }
        }
      `}</style>
    </div>
  );
};
