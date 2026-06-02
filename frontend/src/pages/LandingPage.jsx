import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { BentoGrid, BentoCard } from '../components/ui/BentoGrid'
import { AnimatedTestimonials } from '../components/ui/AnimatedTestimonials'
import BeforeAfterSlider from '../components/BeforeAfterSlider'
import HowItWorksDiagram from '../components/HowItWorksDiagram'
import UsageComputeSimulator from '../components/UsageComputeSimulator'
import {
    Sparkles,
    Database,
    Cpu,
    Brain,
    Target,
    Terminal,
    Package,
    ArrowRight,
    Upload,
    BarChart3,
    Zap,
    Shield,
    Clock,
    Code2,
    ChevronRight,
    Github,
    BookOpen,
    ExternalLink,
    Layers,
    GitBranch,
    Workflow, 
    TrendingUp,
    Atom,
    Network,
    Check
} from 'lucide-react'
import './LandingPage.css'

const API_BASE = import.meta.env.VITE_API_URL || '/api'

/* ═══════════════════════════════════
   Fade-in wrapper for scroll reveal
   ═══════════════════════════════════ */
function FadeIn({ children, delay = 0, className = '' }) {
    const ref = React.useRef(null)
    const isInView = useInView(ref, { once: true, margin: '-80px' })

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay, ease: 'easeOut' }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

// 1. Smart Profiling Visual
function SmartProfilingVisual() {
    return (
        <svg className="micro-svg" viewBox="0 0 240 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Table Mock */}
            <rect x="20" y="15" width="200" height="70" rx="6" fill="#0c0c0e" stroke="rgba(255,255,255,0.04)" strokeWidth="1.5" />
            <line x1="20" y1="35" x2="220" y2="35" stroke="rgba(255,255,255,0.06)" />
            <line x1="20" y1="55" x2="220" y2="55" stroke="rgba(255,255,255,0.04)" />
            <line x1="80" y1="15" x2="80" y2="85" stroke="rgba(255,255,255,0.04)" />
            <line x1="150" y1="15" x2="150" y2="85" stroke="rgba(255,255,255,0.04)" />
            {/* Pulsing slots */}
            <rect x="28" y="22" width="40" height="6" rx="2" fill="rgba(16, 185, 129, 0.15)" />
            <rect x="88" y="22" width="50" height="6" rx="2" fill="rgba(255,255,255,0.05)" />
            <rect x="158" y="22" width="45" height="6" rx="2" fill="rgba(56, 189, 248, 0.15)" />
            
            <rect x="28" y="42" width="30" height="6" rx="2" fill="rgba(255,255,255,0.08)" />
            <rect x="88" y="42" width="40" height="6" rx="2" fill="rgba(16, 185, 129, 0.2)" />
            <rect x="158" y="42" width="35" height="6" rx="2" fill="rgba(255,255,255,0.05)" />
            
            <rect x="28" y="62" width="45" height="6" rx="2" fill="rgba(56, 189, 248, 0.1)" />
            <rect x="88" y="62" width="35" height="6" rx="2" fill="rgba(255,255,255,0.08)" />
            <rect x="158" y="62" width="50" height="6" rx="2" fill="rgba(16, 185, 129, 0.1)" />
            
            {/* Laser scanning bar */}
            <line x1="15" y1="0" x2="225" y2="0" stroke="#10b981" strokeWidth="2" opacity="0.8">
                <animateTransform 
                    attributeName="transform" 
                    type="translate" 
                    values="0 20; 0 80; 0 20" 
                    dur="3s" 
                    repeatCount="indefinite" 
                />
            </line>
            {/* Glowing scan shadow */}
            <rect x="20" y="0" width="200" height="8" fill="url(#scanGlow)" opacity="0.35">
                <animateTransform 
                    attributeName="transform" 
                    type="translate" 
                    values="0 20; 0 78; 0 20" 
                    dur="3s" 
                    repeatCount="indefinite" 
                />
            </rect>
            
            <defs>
                <linearGradient id="scanGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                </linearGradient>
            </defs>
        </svg>
    )
}

// 2. AI Synthetic Data Visual
function AISyntheticVisual() {
    return (
        <svg className="micro-svg" viewBox="0 0 240 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* AI Terminal */}
            <rect x="20" y="15" width="200" height="70" rx="6" fill="#060608" stroke="rgba(255,255,255,0.04)" strokeWidth="1.5" />
            <circle cx="32" cy="27" r="2.5" fill="#10b981" />
            <circle cx="40" cy="27" r="2.5" fill="#38bdf8" />
            <circle cx="48" cy="27" r="2.5" fill="#fb923c" />
            
            {/* Prompt Type */}
            <text x="60" y="30" fill="#a1a1aa" fontSize="6.5" fontFamily="monospace" fontWeight="600">
                AI Prompt: Churn Data Generator
            </text>
            
            {/* Rows Generating */}
            <g>
                <rect x="30" y="42" width="180" height="10" rx="3" fill="rgba(16, 185, 129, 0.08)" stroke="rgba(16, 185, 129, 0.15)" />
                <circle cx="40" cy="47" r="2.5" fill="#10b981" />
                <rect x="52" y="45" width="60" height="4" rx="1" fill="#10b981" opacity="0.6" />
                <rect x="150" y="45" width="40" height="4" rx="1" fill="#38bdf8" opacity="0.6" />
                <animate attributeName="opacity" values="0.2;1;0.2" dur="2s" repeatCount="indefinite" />
            </g>
            
            <g>
                <rect x="30" y="58" width="180" height="10" rx="3" fill="rgba(56, 189, 248, 0.08)" stroke="rgba(56, 189, 248, 0.15)" />
                <circle cx="40" cy="63" r="2.5" fill="#38bdf8" />
                <rect x="52" y="61" width="45" height="4" rx="1" fill="#38bdf8" opacity="0.6" />
                <rect x="130" y="61" width="55" height="4" rx="1" fill="#fb923c" opacity="0.6" />
                <animate attributeName="opacity" values="1;0.2;1" dur="2s" repeatCount="indefinite" />
            </g>
            
            <g>
                <rect x="30" y="74" width="180" height="6" rx="2" fill="rgba(255, 255, 255, 0.02)" />
                <animate attributeName="opacity" values="0.5;1;0.5" dur="1.5s" repeatCount="indefinite" />
            </g>
        </svg>
    )
}

// 3. Auto Training Visual
function AutoTrainingVisual() {
    return (
        <svg className="micro-svg" viewBox="0 0 240 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g transform="translate(10, 0)">
                {/* Connecting Paths */}
                <path d="M 30 50 Q 80 20 130 30 T 200 50" fill="none" stroke="#fb923c" strokeWidth="1.5" strokeDasharray="4 4">
                    <animate attributeName="stroke-dashoffset" values="20;0" dur="2s" repeatCount="indefinite" />
                </path>
                <path d="M 30 50 Q 80 80 130 70 T 200 50" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 4">
                    <animate attributeName="stroke-dashoffset" values="0;20" dur="2s" repeatCount="indefinite" />
                </path>
                <path d="M 30 50 H 200" fill="none" stroke="#10b981" strokeWidth="1.5" strokeDasharray="6 3">
                    <animate attributeName="stroke-dashoffset" values="30;0" dur="2.5s" repeatCount="indefinite" />
                </path>

                {/* Nodes */}
                <circle cx="30" cy="50" r="6" fill="#18181b" stroke="#38bdf8" strokeWidth="2" />
                <circle cx="30" cy="50" r="2.5" fill="#38bdf8" />
                
                <circle cx="100" cy="30" r="5" fill="#18181b" stroke="#fb923c" strokeWidth="2" />
                <circle cx="100" cy="30" r="2" fill="#fb923c" />
                
                <circle cx="130" cy="70" r="5" fill="#18181b" stroke="#10b981" strokeWidth="2">
                    <animate attributeName="r" values="4;6;4" dur="1.5s" repeatCount="indefinite" />
                </circle>
                <circle cx="130" cy="70" r="2" fill="#10b981" />
                
                <circle cx="200" cy="50" r="7" fill="#18181b" stroke="#38bdf8" strokeWidth="2" />
                <circle cx="200" cy="50" r="3" fill="#38bdf8" />
                
                {/* Flowing Laser particles */}
                <circle r="3" fill="#fb923c">
                    <animateMotion dur="2s" repeatCount="indefinite" path="M 30 50 Q 80 20 130 30 T 200 50" />
                </circle>
                <circle r="3" fill="#38bdf8">
                    <animateMotion dur="2.5s" repeatCount="indefinite" path="M 30 50 Q 80 80 130 70 T 200 50" />
                </circle>
            </g>
        </svg>
    )
}

// 4. Kaggle Integration Visual
function KaggleIntegrationVisual() {
    return (
        <svg className="micro-svg" viewBox="0 0 240 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g transform="translate(15, 0)">
                {/* Left Database */}
                <rect x="25" y="30" width="35" height="40" rx="5" fill="#0d0d11" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
                <line x1="25" y1="42" x2="60" y2="42" stroke="rgba(255,255,255,0.06)" />
                <line x1="25" y1="56" x2="60" y2="56" stroke="rgba(255,255,255,0.06)" />
                <circle cx="42.5" cy="36" r="2.5" fill="#38bdf8" />
                <circle cx="42.5" cy="49" r="2.5" fill="#fb923c" />
                <circle cx="42.5" cy="63" r="2.5" fill="#10b981" />
                <text x="27" y="24" fill="#71717a" fontSize="6" fontFamily="monospace" fontWeight="600">Kaggle API</text>
                
                {/* Connecting Pipe */}
                <path d="M 60 50 H 150" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
                <path d="M 60 50 H 150" fill="none" stroke="#10b981" strokeWidth="1.5" strokeDasharray="8 6">
                    <animate attributeName="stroke-dashoffset" values="30;0" dur="2s" repeatCount="indefinite" />
                </path>

                {/* Right Storage */}
                <rect x="150" y="30" width="35" height="40" rx="5" fill="#0d0d11" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
                <line x1="150" y1="42" x2="185" y2="42" stroke="rgba(255,255,255,0.06)" />
                <line x1="150" y1="56" x2="185" y2="56" stroke="rgba(255,255,255,0.06)" />
                <circle cx="167.5" cy="36" r="2.5" fill="#10b981" />
                <circle cx="167.5" cy="49" r="2.5" fill="#10b981" />
                <circle cx="167.5" cy="63" r="2.5" fill="#10b981" />
                <text x="152" y="24" fill="#71717a" fontSize="6" fontFamily="monospace" fontWeight="600">MinIO S3</text>

                {/* Flying Data Packet */}
                <circle r="3" fill="#10b981">
                    <animateMotion dur="1.5s" repeatCount="indefinite" path="M 60 50 H 150" />
                </circle>
            </g>
        </svg>
    )
}

// 5. SHAP Explainable Visual
function SHAPExplainableVisual() {
    return (
        <svg className="micro-svg" viewBox="0 0 240 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g transform="translate(10, 0)">
                <line x1="110" y1="15" x2="110" y2="85" stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeDasharray="3 3" />
                
                {/* Feature 1 (Grows left - negative impact - Orange) */}
                <text x="25" y="28" fill="#71717a" fontSize="6.5" fontFamily="monospace">Age</text>
                <rect x="60" y="22" width="50" height="8" rx="2" fill="#fb923c" opacity="0.85">
                    <animate attributeName="width" values="30;50;30" dur="3s" repeatCount="indefinite" />
                    <animate attributeName="x" values="80;60;80" dur="3s" repeatCount="indefinite" />
                </rect>

                {/* Feature 2 (Grows right - positive impact - Green) */}
                <text x="25" y="48" fill="#71717a" fontSize="6.5" fontFamily="monospace">Balance</text>
                <rect x="110" y="42" width="70" height="8" rx="2" fill="#10b981" opacity="0.85">
                    <animate attributeName="width" values="40;70;40" dur="2.5s" repeatCount="indefinite" />
                </rect>

                {/* Feature 3 (Grows left - negative impact) */}
                <text x="25" y="68" fill="#71717a" fontSize="6.5" fontFamily="monospace">Activity</text>
                <rect x="80" y="62" width="30" height="8" rx="2" fill="#fb923c" opacity="0.6">
                    <animate attributeName="width" values="15;35;15" dur="4s" repeatCount="indefinite" />
                    <animate attributeName="x" values="95;75;95" dur="4s" repeatCount="indefinite" />
                </rect>
            </g>
        </svg>
    )
}

// 6. Interactive & Batch Predictions Visual
function PredictionsVisual() {
    return (
        <svg className="micro-svg" viewBox="0 0 240 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g transform="translate(10, 0)">
                {/* Gate/Server */}
                <rect x="100" y="25" width="40" height="50" rx="8" fill="#0d0d11" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
                <rect x="108" y="33" width="24" height="6" rx="2" fill="#38bdf8" />
                <rect x="108" y="47" width="24" height="6" rx="2" fill="rgba(16, 185, 129, 0.15)" />
                <circle cx="120" cy="63" r="3" fill="#10b981" />
                
                {/* Flow paths */}
                <path d="M 25 35 Q 60 35 100 45" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1.5" />
                <path d="M 25 65 Q 60 65 100 55" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1.5" />
                <path d="M 140 50 H 200" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1.5" />

                {/* Input Stream particles */}
                <circle r="3.5" fill="#38bdf8">
                    <animateMotion dur="2.5s" repeatCount="indefinite" path="M 25 35 Q 60 35 100 45" />
                </circle>
                
                <circle r="3.5" fill="#fb923c">
                    <animateMotion dur="1.8s" repeatCount="indefinite" path="M 25 65 Q 60 65 100 55" />
                </circle>

                {/* Output Stream particles */}
                <circle r="4" fill="#10b981">
                    <animateMotion dur="2s" repeatCount="indefinite" path="M 140 50 H 200" />
                </circle>
                
                <text x="22" y="24" fill="#71717a" fontSize="6.5" fontFamily="monospace">Batch CSV</text>
                <text x="155" y="42" fill="#10b981" fontSize="6.5" fontFamily="monospace" fontWeight="600">Predictions</text>
            </g>
        </svg>
    )
}

/* ═══════════════════════════════════
   FEATURE DATA
   ═══════════════════════════════════ */
const features = [
    {
        Icon: Database,
        name: 'Smart Profiling & Preprocessing',
        description: 'Instant CSV, Excel, and image schema checks, automatic missing value imputation, and class balancing using SMOTE.',
        className: '',
        visual: <SmartProfilingVisual />
    },
    {
        Icon: Sparkles,
        name: 'AI Synthetic Data Builder',
        description: 'Generate complete, realistic tabular rows from simple natural language prompts powered by fallback AI models.',
        className: '',
        visual: <AISyntheticVisual />
    },
    {
        Icon: Cpu,
        name: 'Auto-Training on 10+ Algos',
        description: 'Auto-select, train, and hyperparameter-tune parameters across models including XGBoost, LightGBM, Random Forest, ARIMA, and CNNs.',
        className: '',
        visual: <AutoTrainingVisual />
    },
    {
        Icon: Layers,
        name: 'Kaggle Integration Hub',
        description: 'Connect directly to the Kaggle API to search, download, and store huge public datasets straight into MinIO.',
        className: '',
        visual: <KaggleIntegrationVisual />
    },
    {
        Icon: Brain,
        name: 'SHAP Explainable AI Logs',
        description: 'Understand predictions in detail with automatically computed SHAP feature importance scales and validation stats.',
        className: '',
        visual: <SHAPExplainableVisual />
    },
    {
        Icon: Package,
        name: 'Interactive & Batch Predictions',
        description: 'Run single tests or upload whole batch CSVs to get instant, high-volume prediction outputs served through integrated prediction interfaces.',
        className: '',
        visual: <PredictionsVisual />
    },
]
 





/* ═══════════════════════════════════════════════
   SMOOTH QUADRATIC EASE-OUT COUNTER COMPONENT
   ═══════════════════════════════════════════════ */
function AnimatedCounter({ value, duration = 1800, prefix = "", suffix = "" }) {
    const [count, setCount] = useState(0)

    useEffect(() => {
        let start = 0
        const end = parseInt(value, 10)
        if (isNaN(end)) {
            setCount(value)
            return
        }

        const totalSteps = 60
        const stepTime = duration / totalSteps
        let currentStep = 0

        const timer = setInterval(() => {
            currentStep++
            const progress = currentStep / totalSteps
            const easeOutProgress = 1 - Math.pow(1 - progress, 3) // Cubic ease-out for ultra smooth deceleration
            const nextValue = Math.round(easeOutProgress * end)
            
            setCount(nextValue)

            if (currentStep >= totalSteps) {
                setCount(end)
                clearInterval(timer)
            }
        }, stepTime)

        return () => clearInterval(timer)
    }, [value, duration])

    return <span>{prefix}{count}{suffix}</span>
}

/* ═══════════════════════════════════════════════
   HERO TERMINAL SIMULATION COMPONENT (DYNAMIC AUTOML LOOP)
   ═══════════════════════════════════════════════ */
function HeroTerminalSimulation() {
    const [step, setStep] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setStep((prev) => (prev >= 40 ? 0 : prev + 1))
        }, 320)
        return () => clearInterval(interval)
    }, [])

    let currentPct = 0
    let currentStatus = 'Datasets'
    let progressColor = '#38bdf8' // Default sky-blue
    let accuracyValue = 0.0

    const lines = []

    if (step <= 8) {
        currentStatus = 'Datasets'
        progressColor = '#38bdf8'
        currentPct = Math.min(100, Math.round((step / 8) * 100))
        accuracyValue = 0.0
        lines.push(<div className="term-line" style={{ color: '#38bdf8' }} key="1">⟳ Connecting to dataset S3 bucket...</div>)
        if (step >= 3) {
            lines.push(<div className="term-line" style={{ color: '#a1a1aa' }} key="2">→ Scanning churn_data.csv schema...</div>)
        }
        if (step >= 6) {
            lines.push(<div className="term-line" style={{ color: '#10b981' }} key="3">✓ Schema verified: 12 features found</div>)
        }
    } else if (step <= 18) {
        currentStatus = 'Datasets'
        progressColor = '#38bdf8'
        currentPct = Math.min(100, Math.round(((step - 8) / 10) * 100))
        accuracyValue = 0.0
        lines.push(<div className="term-line" style={{ color: '#10b981' }} key="1">✓ Schema verified: 12 features found</div>)
        lines.push(<div className="term-line" style={{ color: '#38bdf8' }} key="2">⟳ Running SMOTE class balancing...</div>)
        if (step >= 13) {
            lines.push(<div className="term-line" style={{ color: '#38bdf8' }} key="3">⟳ Imputing null age parameters...</div>)
        }
        if (step >= 16) {
            lines.push(<div className="term-line" style={{ color: '#10b981' }} key="4">✓ Preprocessing complete</div>)
        }
    } else if (step <= 30) {
        currentStatus = 'Training'
        progressColor = '#fb923c' // training orange
        currentPct = Math.min(100, Math.round(((step - 18) / 12) * 100))
        accuracyValue = Math.min(94.7, Math.round(((step - 18) / 12) * 94.7 * 10) / 10)
        
        lines.push(<div className="term-line" style={{ color: '#10b981' }} key="1">✓ Preprocessing complete</div>)
        lines.push(<div className="term-line" style={{ color: '#a1a1aa' }} key="2">→ Training RandomForest... 91.8%</div>)
        if (step >= 22) {
            lines.push(<div className="term-line" style={{ color: '#a1a1aa' }} key="3">→ Training LightGBM... 93.5%</div>)
        }
        if (step >= 26) {
            lines.push(<div className="term-line" style={{ color: '#fb923c' }} key="4">⟳ Training XGBoost (tuning)...</div>)
        }
    } else {
        currentStatus = 'Models'
        progressColor = '#10b981' // complete emerald green
        currentPct = 100
        accuracyValue = 94.7
        
        lines.push(<div className="term-line" style={{ color: '#10b981' }} key="1">✓ AutoML execution completed!</div>)
        lines.push(<div className="term-line" style={{ color: '#10b981' }} key="2">★ Champion: XGBoost — Accuracy 94.7%</div>)
        lines.push(<div className="term-line" style={{ color: '#38bdf8' }} key="3">⚡ Dockerizing model artifacts...</div>)
        if (step >= 36) {
            lines.push(<div className="term-line" style={{ color: '#10b981', fontWeight: 'bold' }} key="4">✓ LIVE SANDBOX INSTANTLY READY!</div>)
        }
    }

    const perimeter = 327
    const strokeDashoffset = perimeter - (accuracyValue / 100) * perimeter

    return (
        <div className="mock-body" style={{ transformStyle: 'preserve-3d' }}>
            <div className="mock-sidebar">
                <div className={`mock-nav-item ${currentStatus === 'Datasets' ? 'active' : ''}`} style={{ background: currentStatus === 'Datasets' ? 'rgba(56, 189, 248, 0.08)' : '', color: currentStatus === 'Datasets' ? '#38bdf8' : '' }}><Database size={14} /> Datasets</div>
                <div className={`mock-nav-item ${currentStatus === 'Training' ? 'active' : ''}`} style={{ background: currentStatus === 'Training' ? 'rgba(251, 146, 60, 0.08)' : '', color: currentStatus === 'Training' ? '#fb923c' : '' }}><Cpu size={14} /> Training</div>
                <div className={`mock-nav-item ${currentStatus === 'Models' ? 'active' : ''}`} style={{ background: currentStatus === 'Models' ? 'rgba(16, 185, 129, 0.08)' : '', color: currentStatus === 'Models' ? '#10b981' : '' }}><Package size={14} /> Models</div>
                <div className="mock-nav-item"><BarChart3 size={14} /> Predictions</div>
            </div>
            <div className="mock-content">
                <div className="mock-terminal">
                    <div className="term-lines-wrapper">
                        {lines}
                    </div>
                    <div className="term-progress-container">
                        <div className="term-progress-bar-bg">
                            <div className="term-progress-bar" style={{ width: `${currentPct}%`, backgroundColor: progressColor }} />
                        </div>
                        <span className="term-progress-pct" style={{ color: progressColor }}>{currentPct}%</span>
                    </div>
                </div>
                <div className="mock-score-ring">
                    <svg viewBox="0 0 120 120" className="ring-svg">
                        <circle cx="60" cy="60" r="52" className="ring-bg" />
                        <circle cx="60" cy="60" r="52" className="ring-fill" 
                                style={{ 
                                    stroke: progressColor,
                                    strokeDashoffset: strokeDashoffset,
                                    strokeDasharray: perimeter,
                                    transition: 'stroke-dashoffset 0.1s linear, stroke 0.3s ease'
                                }} 
                        />
                    </svg>
                    <div className="ring-label">
                        <span className="ring-value" style={{ color: accuracyValue > 0 ? progressColor : '#71717a' }}>
                            {accuracyValue > 0 ? `${accuracyValue}%` : '---'}
                        </span>
                        <span className="ring-text">Accuracy</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

/* ═══════════════════════════════════════════════
   LANDING PAGE COMPONENT
   ═══════════════════════════════════════════════ */
export default function LandingPage() {
    const navigate = useNavigate()
    const [scrolled, setScrolled] = useState(false)

    /* ═══ Mouse-tracking tilt for terminal card ═══ */
    const terminalRef = React.useRef(null)
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)

    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [18, -18]), { stiffness: 80, damping: 12 })
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-18, 18]), { stiffness: 80, damping: 12 })

    const handleTerminalMouseMove = (e) => {
        const rect = terminalRef.current?.getBoundingClientRect()
        if (!rect) return
        const x = (e.clientX - rect.left) / rect.width - 0.5
        const y = (e.clientY - rect.top) / rect.height - 0.5
        mouseX.set(x)
        mouseY.set(y)
    }

    const handleTerminalMouseLeave = () => {
        mouseX.set(0)
        mouseY.set(0)
    }

    const location = useLocation()

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 40)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const scrollToSection = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        if (location.state?.scrollTo) {
            const section = location.state.scrollTo
            setTimeout(() => {
                scrollToSection(section)
            }, 150)
            window.history.replaceState({}, document.title)
        }
    }, [location])

    return (
        <div className="landing-page" style={{ position: 'relative' }}>
            {/* Global Page Background Grid & Floating Telemetry Orbs */}
            <div className="global-bg-grid" />
            <div className="global-orb global-orb-green" style={{ top: '15%', left: '-5%', width: '450px', height: '450px' }} />
            <div className="global-orb global-orb-orange" style={{ top: '38%', right: '-8%', width: '380px', height: '380px', animationDelay: '-4s' }} />
            <div className="global-orb global-orb-blue" style={{ top: '62%', left: '8%', width: '320px', height: '320px', animationDelay: '-8s' }} />
            <div className="global-orb global-orb-teal" style={{ top: '85%', right: '5%', width: '400px', height: '400px', animationDelay: '-12s' }} />


            {/* ═══ NAVBAR ═══ */}
            <nav className={`landing-nav ${scrolled ? 'nav-scrolled' : ''}`}>
                <div className="nav-inner">
                    <div className="nav-brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <Sparkles size={22} className="brand-icon" />
                        <span className="brand-text">MLStack</span>
                    </div>

                    <div className="nav-links">
                        <button onClick={() => scrollToSection('features')} className="nav-link">Features</button>
                        <button onClick={() => scrollToSection('how-it-works')} className="nav-link">How it Works</button>
                        <button onClick={() => scrollToSection('usage')} className="nav-link">Usage</button>
                    </div>

                    <div className="nav-actions">
                        <button onClick={() => navigate('/login')} className="nav-cta">
                            Get Started
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </nav>

            {/* ═══ HERO — Text Left, Terminal Right ═══ */}
            <section className="hero-section">
                {/* Animated gradient orbs */}
                <div className="hero-orb orb-1" />
                <div className="hero-orb orb-2" />
                <div className="hero-orb orb-3" />
                <div className="hero-grid-bg" />

                {/* Floating ML icons */}
                {[
                    { Icon: Brain, x: '8%', y: '18%', size: 28, delay: 0, dur: 5 },
                    { Icon: Network, x: '85%', y: '12%', size: 24, delay: 0.8, dur: 6 },
                    { Icon: Layers, x: '5%', y: '72%', size: 22, delay: 1.5, dur: 4.5 },
                    { Icon: Atom, x: '92%', y: '65%', size: 26, delay: 0.3, dur: 5.5 },
                    { Icon: GitBranch, x: '15%', y: '88%', size: 20, delay: 2, dur: 4 },
                    { Icon: Workflow, x: '78%', y: '85%', size: 22, delay: 1.2, dur: 6.5 },
                    { Icon: TrendingUp, x: '50%', y: '8%', size: 20, delay: 0.6, dur: 5 },
                ].map(({ Icon, x, y, size, delay, dur }, i) => (
                    <motion.div
                        key={i}
                        className="hero-float-icon"
                        style={{ left: x, top: y }}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{
                            opacity: [0, 0.35, 0.2, 0.35],
                            scale: 1,
                            y: [0, -12, 0, 12, 0],
                        }}
                        transition={{
                            opacity: { delay, duration: dur, repeat: Infinity },
                            scale: { delay, duration: 0.6 },
                            y: { delay, duration: dur, repeat: Infinity, ease: 'easeInOut' },
                        }}
                    >
                        <Icon size={size} />
                    </motion.div>
                ))}

                <div className="hero-split">
                    {/* Left — Text */}
                    <motion.div
                        className="hero-text hero-text-left"
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, ease: 'easeOut' }}
                    >
                        <motion.div
                            className="hero-badge"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                        >
                            <Zap size={14} />
                            <span>AI-Powered AutoML Engine</span>
                        </motion.div>
                        <h1 className="hero-title">
                            From Raw Data to
                            <br />
                            <span className="hero-gradient-text">Production Models</span>
                            <br />
                            <span className="hero-title-accent">in Minutes.</span>
                        </h1>
                        <p className="hero-subtitle">
                            Drop your CSV. Pick a target. MLStack handles the rest — feature engineering,
                            model selection, hyperparameter tuning, and explainability.
                            <strong> Zero code. Full control.</strong>
                        </p>
                        <div className="hero-actions">
                            <button onClick={() => navigate('/login')} className="btn-hero-primary">
                                <Sparkles size={18} />
                                Start Building Free
                                <ArrowRight size={18} />
                            </button>
                            <button onClick={() => scrollToSection('how-it-works')} className="btn-hero-secondary">
                                See How It Works
                                <ExternalLink size={16} />
                            </button>
                        </div>
                        <div className="hero-stats">
                            <div className="hero-stat">
                                <span className="stat-value">
                                    <AnimatedCounter value="10" suffix="+" />
                                </span>
                                <span className="stat-label">ML Algorithms</span>
                            </div>
                            <div className="hero-stat-divider" />
                            <div className="hero-stat">
                                <span className="stat-value">
                                    <AnimatedCounter value="94" suffix="%+" />
                                </span>
                                <span className="stat-label">Avg Accuracy</span>
                            </div>
                            <div className="hero-stat-divider" />
                            <div className="hero-stat">
                                <span className="stat-value">
                                    <AnimatedCounter value="5" prefix="<" suffix=" min" />
                                </span>
                                <span className="stat-label">To Deploy</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right — Terminal Mock with 3D tilt */}
                    <motion.div
                        ref={terminalRef}
                        className="hero-terminal-wrap"
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
                        style={{
                            rotateX,
                            rotateY,
                            transformPerspective: 800,
                            transformStyle: 'preserve-3d',
                        }}
                        onMouseMove={handleTerminalMouseMove}
                        onMouseLeave={handleTerminalMouseLeave}
                    >
                        <div className="hero-dashboard-mock">
                            <div className="mock-header">
                                <div className="mock-dots">
                                    <span className="dot dot-red" />
                                    <span className="dot dot-yellow" />
                                    <span className="dot dot-green" />
                                </div>
                                <span className="mock-title">MLStack — Training</span>
                            </div>
                            <HeroTerminalSimulation />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ═══ FEATURES (Bento Grid) ═══ */}
            <section id="features" className="features-section">
                <FadeIn>
                    <div className="section-label">
                        <Sparkles size={14} />
                        <span>Capabilities</span>
                    </div>
                    <h2 className="section-title">The complete AutoML engine room</h2>
                    <p className="section-subtitle">Automating the tedious mechanics of data engineering and model tuning so you can ship faster.</p>
                </FadeIn>

                <FadeIn delay={0.1}>
                    <BentoGrid className="bento-3-rows">
                        {features.map((feature) => (
                            <BentoCard key={feature.name} {...feature} />
                        ))}
                    </BentoGrid>
                </FadeIn>
            </section>

            {/* ═══ HOW IT WORKS ═══ */}
            <HowItWorksDiagram />


            {/* ═══ USAGE POLICY ═══ */}
            <UsageComputeSimulator />

            {/* ═══ BEFORE vs AFTER COMPARISON ═══ */}
            <BeforeAfterSlider />

            {/* ═══ FINAL CTA ═══ */}
            <section className="cta-section">
                <FadeIn>
                    <div className="cta-card-glass">
                        {/* Dynamic flowing background animation matching the slider's signature color combination */}
                        <div className="cta-bg-svg-wrap">
                            <svg viewBox="0 0 800 300" className="cta-bg-svg" preserveAspectRatio="none">
                                <defs>
                                    <linearGradient id="cta-grad-green" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.01" />
                                        <stop offset="50%" stopColor="#10b981" stopOpacity="0.12" />
                                        <stop offset="100%" stopColor="#10b981" stopOpacity="0.01" />
                                    </linearGradient>
                                    <linearGradient id="cta-grad-orange" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#fb923c" stopOpacity="0.01" />
                                        <stop offset="50%" stopColor="#fb923c" stopOpacity="0.12" />
                                        <stop offset="100%" stopColor="#fb923c" stopOpacity="0.01" />
                                    </linearGradient>
                                    <linearGradient id="cta-grad-blue" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.01" />
                                        <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.12" />
                                        <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.01" />
                                    </linearGradient>
                                    <filter id="cta-glow" x="-20%" y="-20%" width="140%" height="140%">
                                        <feGaussianBlur stdDeviation="6" result="blur" />
                                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                    </filter>
                                </defs>

                                {/* Path 1: Emerald green flowing laser line */}
                                <path d="M-50,80 Q200,20 400,120 T850,40" fill="none" stroke="url(#cta-grad-green)" strokeWidth="1.5" />
                                <circle r="3.5" fill="#10b981" filter="url(#cta-glow)">
                                    <animateMotion 
                                        dur="6s" 
                                        repeatCount="indefinite" 
                                        path="M-50,80 Q200,20 400,120 T850,40" 
                                    />
                                </circle>

                                {/* Path 2: Orange flowing laser line */}
                                <path d="M-50,160 Q200,240 400,150 T850,220" fill="none" stroke="url(#cta-grad-orange)" strokeWidth="1.5" />
                                <circle r="3.5" fill="#fb923c" filter="url(#cta-glow)">
                                    <animateMotion 
                                        dur="8s" 
                                        repeatCount="indefinite" 
                                        path="M-50,160 Q200,240 400,150 T850,220" 
                                    />
                                </circle>

                                {/* Path 3: Sky-Blue flowing laser line */}
                                <path d="M-50,220 Q200,100 400,220 T850,130" fill="none" stroke="url(#cta-grad-blue)" strokeWidth="1.5" />
                                <circle r="3.5" fill="#38bdf8" filter="url(#cta-glow)">
                                    <animateMotion 
                                        dur="7s" 
                                        repeatCount="indefinite" 
                                        path="M-50,220 Q200,100 400,220 T850,130" 
                                    />
                                </circle>
                            </svg>
                        </div>

                        <div className="cta-glow-pulse" />
                        <div className="cta-glow-pulse-2" />
                        <div className="cta-content" style={{ zIndex: 1 }}>
                            <h2>Ready to accelerate your <span className="cta-gradient-text">ML workflow</span>?</h2>
                            <p style={{ maxWidth: '600px', textAlign: 'center', lineHeight: '1.6' }}>
                                Upload your dataset. Select your target. Spin up a complete automated pipeline with containerized deployments and live sandboxes instantly.
                            </p>
                            <button onClick={() => navigate('/login')} className="btn-hero-primary btn-lg" style={{ marginTop: '1rem' }}>
                                <Sparkles size={20} />
                                Start Building Free
                                <ArrowRight size={20} />
                            </button>
                        </div>
                    </div>
                </FadeIn>
                <div className="cta-orb cta-orb-1" style={{ zIndex: 0 }} />
                <div className="cta-orb cta-orb-2" style={{ zIndex: 0 }} />
            </section>


            <footer className="landing-footer" style={{ paddingTop: '2.5rem', paddingBottom: '2.5rem' }}>
                <div className="footer-bottom" style={{ borderTop: 'none', paddingTop: 0 }}>
                    <span className="footer-copy">© 2026 MLStack. All rights reserved.</span>
                    <div className="footer-status">
                        <div className="status-dot"></div>
                        <span>All Systems Operational</span>
                    </div>
                </div>
            </footer>
        </div>
    )
}
