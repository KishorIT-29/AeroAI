import { useState, useEffect, Suspense, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei'
import { Aircraft } from './components/Aircraft'
import { Atmosphere } from './components/Atmosphere'
import { DashboardUI } from './components/DashboardUI'

// Mock initial data
const INITIAL_FLIGHT_DATA = {
    altitude: 35000,
    latitude: 40.7128,
    longitude: -74.0060,
    wind_speed: 45,
    pressure: 1013,
    humidity: 20,
    temperature: -45,
}

const INITIAL_PREDICTION = {
    probability: 12.5,
    risk_level: 'Low',
    suggestion: 'Sky conditions are clear. Maintain current flight level for optimal fuel efficiency.',
    next_30_min: [10, 15, 12, 14, 18, 15, 12, 11, 10, 9]
}

export default function App() {
    const [flightData, setFlightData] = useState(INITIAL_FLIGHT_DATA)
    const [prediction, setPrediction] = useState(INITIAL_PREDICTION)
    const [isListening, setIsListening] = useState(false)
    const [assistantResponse, setAssistantResponse] = useState("")
    const [isDataLoading, setIsDataLoading] = useState(false)

    // Web Speech API for Voice Assistant
    const recognitionRef = useRef<any>(null)
    const synthRef = useRef<window.SpeechSynthesis | null>(null)

    useEffect(() => {
        // Setup Flight Data Sim
        const interval = setInterval(() => {
            setFlightData(prev => ({
                ...prev,
                altitude: prev.altitude + (Math.random() > 0.5 ? 10 : -10),
                latitude: prev.latitude + 0.001,
                longitude: prev.longitude + 0.001,
            }))
        }, 5000)

        // Setup Speech Recognition
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
            recognitionRef.current = new SpeechRecognition()
            recognitionRef.current.continuous = false
            recognitionRef.current.interimResults = false

            recognitionRef.current.onresult = (event: any) => {
                const text = event.results[0][0].transcript
                handleVoiceCommand(text)
                setIsListening(false)
            }

            recognitionRef.current.onerror = () => setIsListening(false)
            recognitionRef.current.onend = () => setIsListening(false)
        }

        synthRef.current = window.speechSynthesis

        return () => clearInterval(interval)
    }, [])

    // Fetch prediction from backend
    useEffect(() => {
        const fetchPrediction = async () => {
            try {
                const response = await fetch('/api/predict_turbulence', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(flightData)
                })
                const data = await response.json()
                setPrediction(data)
            } catch (err) {
                console.error("Backend unreachable, using simulated prediction.")
            }
        }

        fetchPrediction()
    }, [flightData.altitude]) // Trigger fetch on altitude changes

    const handleVoiceCommand = async (text: string) => {
        setAssistantResponse(`Analyzing: "${text}"...`)

        try {
            const response = await fetch('/api/voice_assistant', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text,
                    flight_context: { ...flightData, ...prediction }
                })
            })
            const data = await response.json()
            setAssistantResponse(data.response)
            speak(data.response)
        } catch (err) {
            setAssistantResponse("SkyAssist: Command received, but central intelligence is unreachable.")
            speak("Command received, but central intelligence is unreachable.")
        }
    }

    const speak = (text: string) => {
        if (synthRef.current) {
            const utterance = new SpeechSynthesisUtterance(text)
            utterance.pitch = 1.1
            utterance.rate = 1.0
            synthRef.current.speak(utterance)
        }
    }

    const startListening = () => {
        if (recognitionRef.current) {
            setIsListening(true)
            recognitionRef.current.start()
        }
    }

    return (
        <div className="h-screen w-full bg-[#05070A] relative overflow-hidden">
            {/* 3D Background Scene */}
            <div className="absolute inset-0 z-0">
                <Canvas shadows>
                    <Suspense fallback={null}>
                        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
                        <OrbitControls
                            enablePan={false}
                            enableZoom={true}
                            minDistance={5}
                            maxDistance={15}
                            autoRotate
                            autoRotateSpeed={0.5}
                        />

                        <ambientLight intensity={0.2} />
                        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                        <pointLight position={[-10, -10, -10]} intensity={0.5} />

                        <Aircraft />
                        <Atmosphere riskLevel={prediction.risk_level} />

                        <ContactShadows position={[0, -1, 0]} opacity={0.4} scale={10} blur={24} far={4} />
                        <Environment preset="night" />
                    </Suspense>
                </Canvas>
            </div>

            {/* Overlay UI */}
            <div className="relative z-10 pointer-events-none h-full">
                <DashboardUI
                    flightData={flightData}
                    prediction={prediction}
                    isListening={isListening}
                    startListening={startListening}
                    assistantResponse={assistantResponse}
                />
            </div>

            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-1/4 bg-gradient-to-b from-aviation-blue/5 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-full h-1/4 bg-gradient-to-t from-aviation-blue/5 to-transparent pointer-events-none" />
        </div>
    )
}
