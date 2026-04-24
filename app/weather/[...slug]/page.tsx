'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Sun, Cloud, CloudRain, CloudLightning, CloudSun, CloudDrizzle,
  MapPin, TrendingUp, Wind, Droplets, Eye, Gauge, Compass, X, Thermometer 
} from 'lucide-react';

import 'leaflet/dist/leaflet.css';

// --- STABLE MAP COMPONENT ---
const InteractiveMap = ({ coords, setCoords, setShowMap }: any) => {
    if (typeof window === 'undefined') return null;

    const { MapContainer, TileLayer, Marker, useMapEvents } = require('react-leaflet');
    const L = require('leaflet');

    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    });

    function ClickHandler() {
        useMapEvents({
            click(e: any) {
                setCoords({ lat: e.latlng.lat, lon: e.latlng.lng });
                setShowMap(false); 
            },
        });
        return <Marker position={[coords.lat, coords.lon]} />;
    }

    return (
        <MapContainer 
            center={[coords.lat, coords.lon]} 
            zoom={11} 
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={true}
        >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <ClickHandler />
        </MapContainer>
    );
};

export default function DataRefineryCentered() {
    const [coords, setCoords] = useState({ lat: 11.9228, lon: 75.4738 });
    const [data, setData] = useState<any>(null);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [mounted, setMounted] = useState(false);
    const [showMap, setShowMap] = useState(false);

    useEffect(() => {
        setMounted(true);
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const fetchRefineryData = async (lat: number, lon: number) => {
        try {
            const [weatherRes, airRes] = await Promise.all([
                fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,weather_code,relative_humidity_2m,surface_pressure,wind_speed_10m,wind_direction_10m,visibility,cloud_cover,rain,evapotranspiration,soil_temperature_0_to_7cm,soil_moisture_0_to_7cm&daily=weather_code,temperature_2m_max&past_days=4&forecast_days=5&timezone=auto`),
                fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi`)
            ]);

            const w = await weatherRes.json();
            const a = await airRes.json();

            let address = { city: 'Synchronizing...' };
            try {
                const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`, {
                    headers: { 'Accept-Language': 'en' }
                });
                if (geoRes.ok) {
                    const g = await geoRes.json();
                    address = g.address;
                }
            } catch (geoError) {
                console.warn("Geo-Node Offline");
            }

            setData({ current: w.current, daily: w.daily, address: address, aqi: a.current });
        } catch (error) {
            console.error("Refinery Sync Error:", error);
        }
    };

    useEffect(() => { fetchRefineryData(coords.lat, coords.lon); }, [coords]);

    const getWeatherIcon = (code: number, size = 120, stroke = 1, isDark = false) => {
        const colorClass = isDark ? "text-slate-800" : "";
        if (code === 0) return <Sun className={`${colorClass || "text-amber-400"}`} size={size} strokeWidth={stroke} />;
        if (code >= 1 && code <= 2) return <CloudSun className={`${colorClass || "text-amber-300"}`} size={size} strokeWidth={stroke} />;
        if (code === 3) return <Cloud className={`${colorClass || "text-slate-400"}`} size={size} strokeWidth={stroke} />;
        if (code >= 45 && code <= 48) return <Cloud className={`${colorClass || "text-slate-200 opacity-60"}`} size={size} strokeWidth={stroke} />;
        if (code >= 51 && code <= 55) return <CloudDrizzle className={`${colorClass || "text-cyan-300"}`} size={size} strokeWidth={stroke} />;
        if (code >= 61 && code <= 67) return <CloudRain className={`${colorClass || "text-cyan-500"}`} size={size} strokeWidth={stroke} />;
        if (code >= 95) return <CloudLightning className={`${colorClass || "text-rose-500"}`} size={size} strokeWidth={stroke} />;
        return <Sun className={`${colorClass || "text-amber-400"}`} size={size} strokeWidth={stroke} />;
    };

    const sensors = [
        { label: 'AQI Index', value: data?.aqi?.us_aqi, unit: 'US', icon: TrendingUp },
        { label: 'Pressure', value: data?.current?.surface_pressure, unit: 'hPa', icon: Gauge },
        { label: 'Rainfall', value: data?.current?.rain, unit: 'mm', icon: Droplets },
        { label: 'Wind Speed', value: data?.current?.wind_speed_10m, unit: 'km/h', icon: Wind },
        { label: 'Direction', value: data?.current?.wind_direction_10m, unit: '°', icon: Compass },
        { label: 'Visibility', value: (data?.current?.visibility / 1000).toFixed(0), unit: 'km', icon: Eye },
        { label: 'Cloud Cover', value: data?.current?.cloud_cover, unit: '%', icon: Cloud },
        { label: 'Humidity', value: data?.current?.relative_humidity_2m, unit: '%', icon: Droplets }
    ];

    return (
        <div className="min-h-screen bg-white font-mono p-4 md:p-8 text-slate-800 selection:bg-blue-500/10 overflow-x-hidden">
            <header className="max-w-[1540px] mx-auto flex justify-between items-center mb-12 border-b border-gray-100 pb-6">
                <Link href="/" className="text-xl font-bold tracking-tighter uppercase group text-slate-900">
                    data refinery<span className="text-blue-600 group-hover:animate-pulse">_</span>
                </Link>
            </header>

            <main className="w-full max-w-[1540px] mx-auto relative">
                {showMap && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4 bg-black/70 backdrop-blur-md">
                        <div className="w-full max-w-4xl bg-[#1A1C1E] border border-white/10 rounded-[30px] md:rounded-[40px] overflow-hidden shadow-2xl">
                            <div className="p-4 md:p-6 flex justify-between items-center border-b border-white/5">
                                <span className="text-[9px] md:text-[10px] font-normal tracking-[0.3em] text-blue-500 uppercase italic">Manual Node Override</span>
                                <button onClick={() => setShowMap(false)} className="text-slate-400 hover:text-white transition-colors">
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="h-[400px] md:h-[550px] w-full bg-[#0D1117]">
                                {mounted && <InteractiveMap coords={coords} setCoords={setCoords} setShowMap={setShowMap} />}
                            </div>
                        </div>
                    </div>
                )}

                <div className="w-full bg-[#1A1C1E] border border-white/[0.04] rounded-[30px] md:rounded-[40px] p-6 md:p-12 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)] relative overflow-hidden">
                    
                    {/* Upper Stats and Location Info stays the same */}
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 md:gap-12 pb-8 md:pb-10 border-b border-white/[0.06]">
                        <div className="flex-grow space-y-4 md:space-y-6 w-full">
                            <div className="flex items-center gap-3">
                                <button onClick={() => setShowMap(true)} className="p-2 bg-blue-500/10 text-blue-500 rounded-xl border border-blue-500/20 active:scale-95 transition-all">
                                    <MapPin size={14} />
                                </button>
                                <span className="text-[9px] md:text-[10px] font-bold tracking-[0.4em] text-blue-400 uppercase">Current Location</span>
                            </div>
                            <h2 className="text-3xl md:text-5xl font-medium tracking-tighter text-white uppercase break-words leading-tight">
                                {data?.address?.city || data?.address?.town || data?.address?.village || 'SYNCING...'}
                            </h2>
                            <div className="flex flex-col sm:flex-row gap-6 sm:gap-12">
                                <div className="space-y-1">
                                    <p className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-widest">Global Coordinates</p>
                                    <p className="text-[10px] md:text-xs font-normal text-slate-300 italic">{coords.lat.toFixed(4)}° N // {coords.lon.toFixed(4)}° E</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-widest">Date & Time</p>
                                    <p className="text-[10px] md:text-xs font-bold text-blue-400 uppercase italic leading-relaxed">
                                        {mounted ? `${currentTime.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })} // ${currentTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}` : "LINKING..."}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 md:gap-10 bg-black/30 p-6 md:p-8 rounded-[25px] md:rounded-[40px] border border-white/[0.03] w-full lg:w-auto justify-center sm:justify-start">
                            <div className="flex flex-col items-end">
                                <div className="flex items-start">
                                    <span className="text-6xl md:text-8xl font-medium leading-none tracking-tighter text-white">
                                        {data?.current?.temperature_2m.toFixed(1) || '--.-'}
                                    </span>
                                    <span className="text-lg md:text-xl font-normal text-blue-400 ml-1 mt-1 md:mt-2">°C</span>
                                </div>
                                <p className="text-[8px] md:text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-1">
                                    Real Feel <span className="text-amber-400 ml-1 font-medium">{data?.current?.apparent_temperature.toFixed(1)}°</span>
                                </p>
                            </div>
                            <div className="w-[1px] h-12 md:h-20 bg-white/[0.08]"></div>
                            <div className="bg-[#121416] p-3 md:p-4 rounded-2xl md:rounded-3xl border border-white/[0.05]">
                                {getWeatherIcon(data?.current?.weather_code || 0, 65)}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3 md:gap-4 py-8 md:py-10">
                        {sensors.map((sensor, idx) => {
                            const Icon = sensor.icon;
                            return (
                                <div key={idx} className="flex flex-col bg-white/[0.02] p-4 md:p-5 rounded-xl md:rounded-2xl border border-white/[0.04] hover:bg-white/[0.06] transition-all group">
                                    <div className="flex items-center gap-2 mb-2 text-blue-400/80 group-hover:text-blue-400 transition-colors">
                                        <Icon size={12} strokeWidth={1.5} />
                                        <span className="text-[7px] md:text-[8px] font-bold uppercase tracking-wider">{sensor.label}</span>
                                    </div>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-lg md:text-xl font-medium text-white tracking-tighter">{sensor.value ?? '--'}</span>
                                        <span className="text-[7px] md:text-[8px] font-normal text-blue-500 uppercase">{sensor.unit}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Agro-Industrial Telemetry Section */}
                    <div className="py-8 md:py-10 border-t border-white/[0.06]">
                        <div className="flex items-center gap-2 mb-8">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
                            <span className="text-[9px] md:text-[10px] font-bold text-emerald-400 uppercase tracking-[0.4em]">Agro-Industrial Telemetry</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {[
                                { label: 'Soil Moisture', value: data?.current?.soil_moisture_0_to_7cm, unit: 'm³/m³', icon: Droplets },
                                { label: 'Soil Temp', value: data?.current?.soil_temperature_0_to_7cm, unit: '°C', icon: Thermometer },
                                { label: 'Evaporation', value: data?.current?.evapotranspiration, unit: 'mm', icon: Sun },
                                { label: 'Vapor Deficit', value: data?.current?.vapour_pressure_deficit || '0.12', unit: 'kPa', icon: Wind }
                            ].map((item, i) => {
                                const Icon = item.icon;
                                return (
                                    <div key={i} className="flex items-center gap-6 bg-emerald-500/[0.03] p-6 rounded-[25px] border border-emerald-500/20 hover:bg-emerald-500/[0.07] transition-all group">
                                        <div className="p-4 bg-emerald-500/10 rounded-2xl text-emerald-400 group-hover:scale-110 transition-transform">
                                            <Icon size={24} strokeWidth={1.5} />
                                        </div>
                                        <div>
                                            <p className="text-[8px] md:text-[9px] font-bold text-emerald-500/80 uppercase tracking-widest mb-1">{item.label}</p>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-2xl font-medium text-white tracking-tighter">{item.value ?? '--'}</span>
                                                <span className="text-[8px] font-normal text-emerald-400 uppercase">{item.unit}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* CENTERED 9-DAY ATMOSPHERIC STREAM */}
                    <div className="pt-8 md:pt-10 border-t border-white/[0.06]">
                        <div className="flex justify-between items-center mb-6 md:mb-10">
                            <div className="text-[9px] md:text-[10px] font-bold text-white uppercase tracking-[0.2em] md:tracking-[0.4em] flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
                                9-day atmospheric stream
                            </div>
                        </div>
                        
                        {/* justify-center class applied here to centralize the 9 cards */}
                        <div className="flex flex-wrap items-center justify-center pb-6 gap-3 lg:gap-4 no-scrollbar">
                            {data?.daily?.time.map((dateStr: string, i: number) => {
                                const isPeak = i === 4;
                                const temp = data.daily.temperature_2m_max[i];
                                const label = i < 4 ? 'History' : i === 4 ? 'PEAK' : 'Forecast';

                                return (
                                    <div key={i} className={`flex flex-col items-center min-w-[110px] flex-shrink-0 py-5 px-3 rounded-[20px] border transition-all duration-300 h-[190px] justify-center ${isPeak ? 'bg-white border-white shadow-[0_20px_40px_rgba(255,255,255,0.15)] z-10' : 'bg-white/[0.01] border-white/[0.03] hover:bg-white/[0.04]'}`}>
                                        <span className={`text-[9px] md:text-[10px] font-bold mb-3 tracking-tighter ${isPeak ? 'text-slate-500 underline decoration-slate-300 underline-offset-4' : 'text-slate-400'}`}>
                                            {new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' })}
                                        </span>
                                        <div className={`mb-4 p-2 rounded-xl ${isPeak ? 'bg-slate-50' : 'bg-transparent'}`}>
                                            {getWeatherIcon(data.daily.weather_code[i], 28, 1.5, isPeak)}
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <span className={`text-base md:text-lg font-bold leading-none ${isPeak ? 'text-slate-900' : 'text-white'}`}>{temp.toFixed(0)}°</span>
                                            <div className={`mt-3 h-[1px] w-4 ${isPeak ? 'bg-slate-200' : 'bg-white/10'}`}></div>
                                            <span className={`text-[6px] md:text-[7px] font-black uppercase mt-2 tracking-tighter ${isPeak ? 'text-blue-600' : 'text-slate-500'}`}>
                                                {label}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}