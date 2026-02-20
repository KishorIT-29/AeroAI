import React from 'react'
import { motion } from 'framer-motion'
import {
    Wind,
    Navigation,
    Thermometer,
    Activity,
    Mic,
    Settings,
    ShieldCheck,
    Plane
} from 'lucide-react'

interface DashboardUIProps {
    flightData: any
    prediction: any
    isListening: boolean
    startListening: () => void
    assistantResponse: string
}

export function DashboardUI({ flightData, prediction, isListening, startListening, assistantResponse }: DashboardUIProps) {
    return (
        <div className="fixed inset-0 pointer-events-none p-6 font-outfit select-none">
            {/* Top Bar */}
            <div className="flex justify-between items-start">
                <div className="glass-dark px-6 py-3 border-l-4 border-aviation-blue rounded-r-lg">
                    <h1 className="text-2xl font-bold tracking-wider text-aviation-blue flex items-center gap-3">
                        <Plane className="w-6 h-6" /> AERO AI <span className="text-xs font-mono opacity-50 border border-white/20 px-2 py-0.5 rounded">v2.0</span>
                    </h1>
                    <p className="text-[10px] mono text-white/40 mt-1 uppercase tracking-widest">Autonomous Safety System</p>
                </div>

                <div className="flex gap-4 items-center h-fit">
                    <div className="glass px-4 py-2 flex items-center gap-3 border-b-2 border-aviation-cyan">
                        <div className={`w-2 h-2 rounded-full animate-pulse ${prediction.risk_level === 'High' ? 'bg-red-500' : 'bg-green-500'}`} />
                        <span className="text-xs mono uppercase tracking-wider">System Status: Online</span>
                    </div>
                    <div className="glass-dark p-2 cursor-pointer pointer-events-auto hover:bg-white/10 transition-colors">
                        <Settings className="w-5 h-5 text-aviation-blue" />
                    </div>
                </div>
            </div>

            {/* Left Panel - Flight Stats */}
            <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="absolute left-6 top-1/2 -translate-y-1/2 w-72 flex flex-col gap-4 pointer-events-auto"
            >
                <Panel title="Telemetry" icon={<Activity className="w-4 h-4" />}>
                    <Stat label="Altitude" value={`${flightData.altitude} ft`} color="cyan" />
                    <Stat label="Airspeed" value="480 knots" color="blue" />
                    <Stat label="Coordinates" value={`${flightData.latitude.toFixed(2)}N, ${flightData.longitude.toFixed(2)}E`} color="amber" />
                    <div className="mt-4 pt-4 border-t border-white/10">
                        <div className="flex justify-between text-[10px] mono text-white/40 mb-2 uppercase italic font-bold">In-Flight Sensors</div>
                        <div className="flex gap-2">
                            <SensorMini icon={<Wind />} label="Wind" value={`${flightData.wind_speed} km/h`} />
                            <SensorMini icon={<Thermometer />} label="Temp" value="-42°C" />
                        </div>
                    </div>
                </Panel>

                <Panel title="Turbulence Density" icon={<Wind className="w-4 h-4" />}>
                    <div className="space-y-4">
                        <div className="relative pt-1">
                            <div className="flex mb-2 items-center justify-between">
                                <div>
                                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-aviation-blue bg-aviation-blue/10">
                                        Probability
                                    </span>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs font-semibold inline-block text-aviation-blue">
                                        {prediction.probability}%
                                    </span>
                                </div>
                            </div>
                            <div className="overflow-hidden h-1.5 mb-4 text-xs flex rounded bg-white/5">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${prediction.probability}%` }}
                                    transition={{ duration: 1 }}
                                    className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${prediction.probability > 70 ? 'bg-aviation-red' : prediction.probability > 40 ? 'bg-aviation-amber' : 'bg-aviation-blue'
                                        }`}
                                />
                            </div>
                        </div>
                    </div>
                </Panel>
            </motion.div>

            {/* Right Panel - AI Analysis */}
            <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="absolute right-6 top-1/2 -translate-y-1/2 w-80 flex flex-col gap-4 pointer-events-auto"
            >
                <Panel title="SkyAssist AI" icon={<ShieldCheck className="w-4 h-4" />}>
                    <div className="bg-aviation-blue/5 border border-aviation-blue/20 p-4 rounded-lg mb-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-2 h-2 bg-aviation-blue rounded-full" />
                            <span className="text-xs font-bold uppercase tracking-widest text-aviation-blue">Active Analysis</span>
                        </div>
                        <p className="text-sm text-white/90 leading-relaxed italic">
                            "{prediction.suggestion}"
                        </p>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center glass px-3 py-2 rounded">
                            <span className="text-xs text-white/60">Risk Level</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${prediction.risk_level === 'High' ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'
                                }`}>
                                {prediction.risk_level}
                            </span>
                        </div>
                        <div className="flex justify-between items-center glass px-3 py-2 rounded">
                            <span className="text-xs text-white/60">Alternate Route</span>
                            <span className="text-[10px] font-bold text-aviation-cyan uppercase tracking-tighter">Available via voice</span>
                        </div>
                    </div>
                </Panel>

                <Panel title="Route Smoothing" icon={<Navigation className="w-4 h-4" />}>
                    <div className="h-24 flex items-end gap-1 px-2">
                        {prediction.next_30_min.map((val: number, i: number) => (
                            <motion.div
                                key={i}
                                initial={{ height: 0 }}
                                animate={{ height: `${val}%` }}
                                className="flex-1 bg-aviation-blue/20 border-t border-aviation-blue/50"
                            />
                        ))}
                    </div>
                    <div className="flex justify-between mt-2 text-[8px] mono text-white/30 uppercase tracking-widest">
                        <span>Now</span>
                        <span>+30 Min</span>
                    </div>
                </Panel>
            </motion.div>

            {/* Bottom Panel - Voice Assistant UI */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[500px] pointer-events-auto">
                <div className={`glass-dark p-6 transition-all duration-500 ${isListening ? 'ring-2 ring-aviation-blue' : ''}`}>
                    <div className="flex items-center gap-6">
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={startListening}
                            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${isListening ? 'bg-aviation-blue shadow-[0_0_20px_rgba(0,242,255,0.5)]' : 'bg-white/5 hover:bg-white/10'
                                }`}
                        >
                            <Mic className={`w-8 h-8 ${isListening ? 'text-black' : 'text-aviation-blue'}`} />
                        </motion.button>
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-aviation-blue">SkyAssist Voice Control</span>
                                <span className="text-[8px] mono text-white/40">Wake Word: "SkyAssist"</span>
                            </div>
                            <div className="h-10 text-white/80 text-sm italic line-clamp-2">
                                {isListening ? "Listening for commands..." : assistantResponse || "Call 'SkyAssist' or click the mic to begin navigation support."}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* HUD Overlays */}
            <div className="absolute inset-x-1/4 top-1/4 bottom-1/4 border-2 border-aviation-blue/10 rounded-[50px] pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 glass px-4 py-1 text-[10px] mono">HUD_MASTER_01</div>
                <div className="absolute -left-4 top-1/2 -translate-y-1/2 origin-center -rotate-90 text-[10px] mono text-aviation-blue/40 tracking-widest uppercase">Pitch Axis</div>
                <div className="absolute -right-4 top-1/2 -translate-y-1/2 origin-center rotate-90 text-[10px] mono text-aviation-blue/40 tracking-widest uppercase">Altitude Ref</div>
            </div>

            <div className="scanline" />
        </div>
    )
}

function Panel({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) {
    return (
        <div className="glass p-5 border-l-2 border-aviation-blue/30">
            <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 bg-aviation-blue/10 rounded text-aviation-blue">
                    {icon}
                </div>
                <h2 className="text-xs font-bold uppercase tracking-widest text-white/80">{title}</h2>
            </div>
            {children}
        </div>
    )
}

function Stat({ label, value, color }: { label: string, value: string, color: 'blue' | 'cyan' | 'amber' }) {
    const colorMap = {
        blue: 'text-aviation-blue',
        cyan: 'text-aviation-cyan',
        amber: 'text-aviation-amber',
    }

    return (
        <div className="flex justify-between items-end mb-2">
            <span className="text-[10px] uppercase text-white/40 font-bold">{label}</span>
            <span className={`text-lg mono font-bold ${colorMap[color]}`}>{value}</span>
        </div>
    )
}

function SensorMini({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
    return (
        <div className="flex-1 glass bg-white/5 p-2 rounded">
            <div className="flex items-center gap-2 mb-1 text-aviation-blue/60 scale-75 origin-left">
                {icon}
                <span className="text-[8px] font-bold uppercase">{label}</span>
            </div>
            <div className="text-xs mono font-bold truncate">{value}</div>
        </div>
    )
}
