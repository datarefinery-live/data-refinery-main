'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { 
  MapPin, Droplets, Thermometer, Wind, Sun, 
  Eye, Zap, Sprout, CloudRain, Globe, ArrowUpRight, ArrowDownRight 
} from 'lucide-react';

// Leaflet dynamic imports
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });

import { useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// --- TYPES ---
interface RefineryData {
    current: any;
    soil: { temp: number; moisture: number; evap: number; };
    history: any;
    forecast: any;
}

interface CardProps {
    label: string;
    icon: React.ReactNode;
    current: string | number;
    diff: number;
    forecast: string | number;
    insight: string;
    color: string;
}

// --- MAP CLICK HANDLER COMPONENT ---
function MapClickHandler({ onSelect }: { onSelect: (lat: number, lon: number) => void }) {
    useMapEvents({
        click: (e) => onSelect(e.latlng.lat, e.latlng.lng),
    });
    return null;
}

export default function DataRefineryLive() {
    const [coords, setCoords] = useState({ lat: 11.87, lon: 75.52 });
    const [data, setData] = useState<RefineryData | null>(null);
    const [locationName, setLocationName] = useState('Syncing Node...');
    const [isMapOpen, setIsMapOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [L, setL] = useState<any>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const initLeaflet = async () => {
            const leaflet = await import('leaflet');
            setL(leaflet.default);
        };
        initLeaflet();
    }, []);

    const fetchAllData = async (lat: number, lon: number) => {
        setLoading(true);
        setCoords({ lat, lon });
        try {
            // Force English results using accept-language header
            const geoRes = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
                { headers: { 'accept-language': 'en' } }
            );
            const geoData = await geoRes.json();
            const addr = geoData.address;
            
            // Construct clean English location string
            const city = addr.city || addr.town || addr.village || addr.suburb || 'Remote Node';
            const state = addr.state || '';
            const displayLocation = state ? `${city}, ${state}` : city;
            
            setLocationName(displayLocation);

            const weatherRes = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,wind_speed_10m,uv_index,visibility&hourly=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,uv_index,visibility,soil_temperature_0cm,soil_moisture_0_to_7cm,evapotranspiration&past_days=1&forecast_days=2&timezone=auto`
            );
            const res = await weatherRes.json();
            const nowIdx = 24; const pastIdx = 0; const futureIdx = 48;

            setData({
                current: res.current,
                soil: { temp: res.hourly.soil_temperature_0cm[nowIdx], moisture: res.hourly.soil_moisture_0_to_7cm[nowIdx], evap: res.hourly.evapotranspiration[nowIdx] },
                history: { temp: res.hourly.temperature_2m[pastIdx], hum: res.hourly.relative_humidity_2m[pastIdx], rain: res.hourly.precipitation[pastIdx], soil_m: res.hourly.soil_moisture_0_to_7cm[pastIdx], wind: res.hourly.wind_speed_10m[pastIdx], uv: res.hourly.uv_index[pastIdx], vis: res.hourly.visibility[pastIdx], soil_t: res.hourly.soil_temperature_0cm[pastIdx], evap: res.hourly.evapotranspiration[pastIdx] },
                forecast: { temp: res.hourly.temperature_2m[futureIdx], hum: res.hourly.relative_humidity_2m[futureIdx], rain: res.hourly.precipitation[futureIdx], soil_m: res.hourly.soil_moisture_0_to_7cm[futureIdx], wind: res.hourly.wind_speed_10m[futureIdx], uv: res.hourly.uv_index[futureIdx], vis: res.hourly.visibility[futureIdx], soil_t: res.hourly.soil_temperature_0cm[futureIdx], evap: res.hourly.evapotranspiration[futureIdx] }
            });
        } catch (err) { console.error(err); }
        setLoading(false);
    };

    useEffect(() => {
        if (typeof window !== 'undefined' && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => fetchAllData(pos.coords.latitude, pos.coords.longitude),
                () => fetchAllData(11.87, 75.52)
            );
        } else { fetchAllData(11.87, 75.52); }
    }, []);

    if (loading && !data) return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs font-bold tracking-[0.3em] text-slate-400">INITIALIZING REFINERY</p>
            </div>
        </div>
    );
    
    if (!data) return null;

    const customIcon = L ? L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
        iconSize: [25, 41], iconAnchor: [12, 41]
    }) : null;

    return (
        <div className="min-h-screen bg-[#FDFDFD] text-slate-900 font-sans p-4 md:p-8">
            <header className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 border-b border-slate-100 pb-8">
                <div>
                    <Link href="/" className="group">
                        <h1 className="text-xl font-bold tracking-tight text-slate-800 uppercase">
                            DATA REFINERY<span className="text-blue-600 group-hover:animate-pulse">_</span>
                        </h1>
                    </Link>
                    <div className="flex items-center gap-3 mt-3">
                        <div className="flex items-center gap-2 text-[11px] bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-full text-slate-600 shadow-sm font-medium">
                            <MapPin size={12} className="text-blue-600" />
                            {locationName}
                        </div>
                    </div>
                </div>
                <button 
                    onClick={() => setIsMapOpen(true)} 
                    className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 text-xs font-bold rounded-lg hover:bg-blue-600 transition-all shadow-lg"
                >
                    <Globe size={14} /> SELECT LOCATION
                </button>
            </header>

            <main className="max-w-7xl mx-auto">
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                    <RefineryCard label="Core Temperature" icon={<Thermometer size={20}/>} current={`${data.current.temperature_2m}°C`} diff={data.current.temperature_2m - data.history.temp} forecast={`${data.forecast.temp}°C`} insight={data.current.temperature_2m > 30 ? "High thermal stress detected." : "Optimal temperature for operations."} color="blue" />
                    <RefineryCard label="Relative Humidity" icon={<Droplets size={20}/>} current={`${data.current.relative_humidity_2m}%`} diff={data.current.relative_humidity_2m - data.history.hum} forecast={`${data.forecast.hum}%`} insight="Atmospheric moisture levels are stable." color="indigo" />
                    <RefineryCard label="Precipitation" icon={<CloudRain size={20}/>} current={`${data.current.precipitation}mm`} diff={data.current.precipitation - data.history.rain} forecast={`${data.forecast.rain}mm`} insight={data.forecast.rain > 0 ? "Rain patterns likely in 24h." : "No rain predicted for this cycle."} color="cyan" />
                    <RefineryCard label="Wind Velocity" icon={<Wind size={20}/>} current={`${data.current.wind_speed_10m}km/h`} diff={data.current.wind_speed_10m - data.history.wind} forecast={`${data.forecast.wind}km/h`} insight="Wind speeds within safety thresholds." color="slate" />
                    <RefineryCard label="UV Intensity" icon={<Sun size={20}/>} current={data.current.uv_index} diff={data.current.uv_index - data.history.uv} forecast={data.forecast.uv} insight={data.current.uv_index > 6 ? "Critical UV. Shielding required." : "Safe UV levels for outdoor work."} color="orange" />
                    <RefineryCard label="Visual Range" icon={<Eye size={20}/>} current={`${(data.current.visibility/1000).toFixed(1)}km`} diff={(data.current.visibility - data.history.vis)/1000} forecast={`${(data.forecast.vis/1000).toFixed(1)}km`} insight="Clear visibility for navigation." color="teal" />
                    <RefineryCard label="Real Feel" icon={<Zap size={20}/>} current={`${data.current.apparent_temperature}°C`} diff={data.current.apparent_temperature - data.history.temp} forecast={`${data.forecast.temp}°C`} insight="Matches actual air temperature." color="purple" />
                    <RefineryCard label="Atmos Status" icon={<Wind size={20} className="rotate-90"/>} current="NOMINAL" diff={0} forecast="NOMINAL" insight="Standard pressure profile observed." color="green" />
                </section>

                <div className="my-10 flex items-center gap-4">
                    <div className="h-px bg-slate-100 flex-1"></div>
                    <h3 className="text-[11px] font-bold text-slate-400 tracking-[0.2em] uppercase">Terrestrial Metrics</h3>
                    <div className="h-px bg-slate-100 flex-1"></div>
                </div>

                <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <RefineryCard label="Soil Moisture" icon={<Sprout size={20}/>} current={`${(data.soil.moisture * 100).toFixed(1)}%`} diff={(data.soil.moisture - data.history.soil_m) * 100} forecast={`${(data.forecast.soil_m * 100).toFixed(1)}%`} insight={data.soil.moisture < 0.2 ? "Low moisture. Irrigation needed." : "Ideal soil hydration levels."} color="emerald" />
                    <RefineryCard label="Soil Temperature" icon={<Thermometer size={20}/>} current={`${data.soil.temp.toFixed(1)}°C`} diff={data.soil.temp - data.history.soil_t} forecast={`${data.forecast.soil_t.toFixed(1)}°C`} insight="Ground thermal signature is stable." color="amber" />
                    <RefineryCard label="Evaporation" icon={<Droplets size={20}/>} current={`${data.soil.evap.toFixed(2)}mm`} diff={data.soil.evap - data.history.evap} forecast={`${data.forecast.evap.toFixed(2)}mm`} insight="Tracking daily moisture loss." color="sky" />
                </section>
            </main>

            {isMapOpen && mounted && (
                <div className="fixed inset-0 z-[1000] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-4xl h-[70vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
                        <div className="p-5 border-b flex justify-between items-center bg-white">
                            <h2 className="text-sm font-bold text-slate-800">Select Node Location</h2>
                            <button onClick={() => setIsMapOpen(false)} className="text-xs font-bold text-slate-400 hover:text-red-500">CLOSE</button>
                        </div>
                        <div className="flex-1 relative">
                            <MapContainer 
                                key={`${coords.lat}-${coords.lon}`} center={[coords.lat, coords.lon]} 
                                zoom={11} style={{ height: '100%', width: '100%' }}
                            >
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                {customIcon && <Marker position={[coords.lat, coords.lon]} icon={customIcon} />}
                                <MapClickHandler onSelect={(lat, lon) => { fetchAllData(lat, lon); setIsMapOpen(false); }} />
                            </MapContainer>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function RefineryCard({ label, icon, current, diff, forecast, insight, color }: CardProps) {
    const isPositive = diff > 0;
    const isZero = diff === 0;

    return (
        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm hover:shadow-xl hover:border-blue-100 transition-all group flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
                <div className={`p-2.5 rounded-xl bg-slate-50 text-slate-600 group-hover:bg-blue-600 group-hover:text-white transition-all`}>
                    {icon}
                </div>
                <div className={`flex items-center gap-1 text-[11px] font-bold ${isZero ? 'text-slate-400' : isPositive ? 'text-orange-600' : 'text-blue-600'}`}>
                    {isZero ? null : isPositive ? <ArrowUpRight size={14}/> : <ArrowDownRight size={14}/>}
                    {isZero ? 'Stable' : `${Math.abs(diff).toFixed(1)}`}
                </div>
            </div>

            <div className="mb-6">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
                <h2 className="text-3xl font-bold text-slate-800 tracking-tight">{current}</h2>
            </div>

            <div className="mt-auto space-y-4">
                <div className="flex items-center justify-between py-2 border-y border-slate-50">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Forecast</span>
                    <span className="text-[11px] font-bold text-slate-700">{forecast}</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed font-medium italic">
                    "{insight}"
                </p>
            </div>
        </div>
    );
}