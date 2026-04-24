'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Sun, Cloud, CloudRain, CloudLightning, 
  MapPin, TrendingUp, Wind, Droplets, Eye, Gauge, Compass, X
} from 'lucide-react';

import 'leaflet/dist/leaflet.css';

// --- STABLE MAP COMPONENT ---
const InteractiveMap = ({ coords, setCoords, setShowMap }: any) => {
    if (typeof window === 'undefined') return null;

    const { MapContainer, TileLayer, Marker, useMapEvents } = require('react-leaflet');
    const L = require('leaflet');

    // Fix for Leaflet marker icons
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
        // We always show the marker at the current 'confirmed' coordinates
        return <Marker position={[coords.lat, coords.lon]} />;
    }

    return (
        <MapContainer 
            center={[coords.lat, coords.lon]} // Only used on first mount
            zoom={11} 
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={true}
        >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <ClickHandler />
        </MapContainer>
    );
};

export default function DataRefineryStable() {
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
            const [weatherRes, geoRes, airRes] = await Promise.all([
                fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,weather_code,relative_humidity_2m,surface_pressure,wind_speed_10m,wind_direction_10m,visibility,cloud_cover,rain&daily=weather_code,temperature_2m_max&past_days=5&forecast_days=6&timezone=auto`),
                fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`, {
                    headers: { 'Accept-Language': 'en' }
                }),
                fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi`)
            ]);
            const w = await weatherRes.json();
            const g = await geoRes.json();
            const a = await airRes.json();
            setData({ current: w.current, daily: w.daily, address: g.address, aqi: a.current });
        } catch (error) {
            console.error("Refinery Sync Error:", error);
        }
    };

    useEffect(() => { fetchRefineryData(coords.lat, coords.lon); }, [coords]);

    const getWeatherIcon = (code: number, size = 120, stroke = 1) => {
        if (code === 0) return <Sun className="text-amber-400" size={size} strokeWidth={stroke} />;
        if (code >= 1 && code <= 3) return <Cloud className="text-cyan-500/80" size={size} strokeWidth={stroke} />;
        if (code >= 51 && code <= 67) return <CloudRain className="text-cyan-400" size={size} strokeWidth={stroke} />;
        if (code >= 95) return <CloudLightning className="text-rose-400" size={size} strokeWidth={stroke} />;
        return <Sun className="text-amber-400/80" size={size} strokeWidth={stroke} />;
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
        <div className="min-h-screen bg-white font-mono p-8 text-slate-800 selection:bg-cyan-500/10">
            <header className="w-full mb-10">
                <Link href="/" className="text-lg font-medium tracking-tighter uppercase text-slate-900 group">
                    data refinery<span className="text-cyan-600 group-hover:animate-pulse">_</span>
                </Link>
            </header>

            <main className="w-full max-w-[1540px] mx-auto relative">
                {showMap && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
                        <div className="w-full max-w-4xl bg-[#1A1C1E] border border-white/10 rounded-[40px] overflow-hidden shadow-2xl">
                            <div className="p-6 flex justify-between items-center border-b border-white/5">
                                <span className="text-[10px] font-normal tracking-[0.3em] text-cyan-500 uppercase italic tracking-widest">Manual Node Override</span>
                                <button onClick={() => setShowMap(false)} className="text-slate-400 hover:text-white transition-colors">
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="h-[550px] w-full bg-[#0D1117]">
                                {mounted && <InteractiveMap coords={coords} setCoords={setCoords} setShowMap={setShowMap} />}
                            </div>
                        </div>
                    </div>
                )}

                <div className="w-full bg-[#1A1C1E] border border-white/[0.04] rounded-[40px] p-10 md:p-12 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)] relative overflow-hidden">
                    <div className="flex flex-col lg:flex-row justify-between items-center gap-12 pb-10 border-b border-white/[0.06]">
                        <div className="flex-grow space-y-6">
                            <div className="flex items-center gap-3">
                                <button onClick={() => setShowMap(true)} className="p-2 bg-cyan-500/10 text-cyan-500 rounded-xl border border-cyan-500/20 hover:bg-cyan-500/20 transition-all active:scale-95">
                                    <MapPin size={14} strokeWidth={1.5} />
                                </button>
                                <span className="text-[10px] font-normal tracking-[0.4em] text-slate-500 uppercase">Current Terminal</span>
                            </div>
                            <h2 className="text-5xl font-medium tracking-tighter text-white uppercase">
                                {data?.address?.city || data?.address?.town || data?.address?.village || 'SYNCING...'}
                            </h2>
                            <div className="flex gap-12">
                                <div className="space-y-1">
                                    <p className="text-[9px] font-normal text-slate-600 uppercase tracking-widest">Global Coordinates</p>
                                    <p className="text-xs font-normal text-slate-400 italic">{coords.lat.toFixed(4)}° N // {coords.lon.toFixed(4)}° E</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[9px] font-normal text-slate-600 uppercase tracking-widest">Temporal Sync</p>
                                    <p className="text-xs font-normal text-cyan-500/90 uppercase italic">
                                        {mounted ? `${currentTime.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })} // ${currentTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false })}` : "LINKING..."}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-10 bg-black/30 p-8 rounded-[40px] border border-white/[0.03]">
                            <div className="flex flex-col items-end">
                                <div className="flex items-start">
                                    <span className="text-8xl font-medium leading-none tracking-tighter text-white">
                                        {data?.current?.temperature_2m.toFixed(1) || '--.-'}
                                    </span>
                                    <span className="text-xl font-normal text-cyan-500 ml-1 mt-2">°C</span>
                                </div>
                                <p className="text-[10px] font-normal text-slate-500 uppercase tracking-widest mt-2">
                                    Real Feel <span className="text-amber-400 ml-2 font-medium">{data?.current?.apparent_temperature.toFixed(1)}°</span>
                                </p>
                            </div>
                            <div className="w-[1px] h-20 bg-white/[0.08]"></div>
                            <div className="bg-[#121416] p-4 rounded-3xl border border-white/[0.05]">
                                {getWeatherIcon(data?.current?.weather_code || 0, 90)}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 py-10">
                        {sensors.map((sensor, idx) => {
                            const Icon = sensor.icon;
                            return (
                                <div key={idx} className="flex flex-col bg-white/[0.02] p-5 rounded-2xl border border-white/[0.04] hover:bg-white/[0.06] transition-all">
                                    <div className="flex items-center gap-2 mb-2 text-slate-500">
                                        <Icon size={14} strokeWidth={1.5} />
                                        <span className="text-[8px] font-normal uppercase tracking-tighter">{sensor.label}</span>
                                    </div>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-xl font-medium text-white tracking-tighter">{sensor.value ?? '--'}</span>
                                        <span className="text-[8px] font-normal text-cyan-600 uppercase">{sensor.unit}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="pt-10 border-t border-white/[0.06]">
                        <div className="flex justify-between items-center mb-10">
                            <div className="text-[10px] font-normal text-white uppercase tracking-[0.4em] flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.6)]"></div>
                                11-day thermal stream analysis
                            </div>
                            <span className="text-[8px] font-normal text-slate-600 uppercase tracking-widest italic tracking-widest">AERO_STABLE_FIX</span>
                        </div>
                        
                        <div className="flex justify-between items-stretch gap-3">
                            {data?.daily?.time.map((dateStr: string, i: number) => {
                                const isToday = i === 5;
                                const temp = data.daily.temperature_2m_max[i];
                                const label = i < 5 ? 'History' : i === 5 ? 'Peak' : 'Prediction';

                                return (
                                    <div key={i} className={`flex flex-col items-center flex-1 py-6 px-2 rounded-[24px] border transition-all duration-500 ${isToday ? 'bg-cyan-600 border-cyan-400 shadow-2xl -translate-y-2' : 'bg-white/[0.01] border-white/[0.03] hover:bg-white/[0.05]'}`}>
                                        <span className={`text-[10px] font-normal mb-4 tracking-tighter ${isToday ? 'text-white underline underline-offset-8 decoration-white/30' : 'text-slate-500'}`}>
                                            {new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                                        </span>
                                        <div className={`mb-5 p-2 rounded-2xl ${isToday ? 'bg-black/20' : 'bg-transparent'}`}>
                                            {getWeatherIcon(data.daily.weather_code[i], 28, 1.5)}
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <span className="text-lg font-medium leading-none text-white">{temp.toFixed(0)}°</span>
                                            <div className={`mt-3 h-[1px] w-4 ${isToday ? 'bg-white/40' : 'bg-white/10'}`}></div>
                                            <span className={`text-[7px] font-normal uppercase mt-2 tracking-tighter ${isToday ? 'text-cyan-100' : 'text-slate-600'}`}>
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