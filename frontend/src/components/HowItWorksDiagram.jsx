import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Play, RotateCcw, Upload, Cpu, BarChart3, Database, ShieldCheck, Terminal } from 'lucide-react'
import './HowItWorksDiagram.css'

export default function HowItWorksDiagram() {
  const [activeStep, setActiveStep] = useState(0) // 0: Upload, 1: Train, 2: Predict
  const [isSimulating, setIsSimulating] = useState(true)
  
  // Real-time telemetry states
  const [epoch, setEpoch] = useState(0)
  const [accuracy, setAccuracy] = useState(0.0)
  const [loss, setLoss] = useState(1.0)
  const [activeNode, setActiveNode] = useState(0)

  // Simulation timer refs to prevent leaks
  const trainTimerRef = useRef(null)
  const phase2TimeoutRef = useRef(null)
  const phase3TimeoutRef = useRef(null)
  const loopTimerRef = useRef(null)

  // Automatic node highlight rotation inside Step 2
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveNode((prev) => (prev + 1) % 6)
    }, 800)
    return () => clearInterval(timer)
  }, [])

  // Clear all pending timeouts and intervals
  const clearAllTimers = useCallback(() => {
    if (trainTimerRef.current) {
      clearInterval(trainTimerRef.current)
      trainTimerRef.current = null
    }
    if (phase2TimeoutRef.current) {
      clearTimeout(phase2TimeoutRef.current)
      phase2TimeoutRef.current = null
    }
    if (phase3TimeoutRef.current) {
      clearTimeout(phase3TimeoutRef.current)
      phase3TimeoutRef.current = null
    }
    if (loopTimerRef.current) {
      clearInterval(loopTimerRef.current)
      loopTimerRef.current = null
    }
  }, [])

  // Manage Training Simulation Loop
  useEffect(() => {
    if (!isSimulating) {
      clearAllTimers()
      return
    }

    const runSimulation = () => {
      // Clean up previous runs
      clearAllTimers()

      // Phase 1: Upload (0s - 4s)
      setActiveStep(0)
      setEpoch(0)
      setAccuracy(42.5)
      setLoss(0.852)

      // Phase 2: Train (4s - 10s)
      phase2TimeoutRef.current = setTimeout(() => {
        setActiveStep(1)
        let currentEpoch = 1
        
        trainTimerRef.current = setInterval(() => {
          if (currentEpoch <= 50) {
            setEpoch(currentEpoch)
            setAccuracy((prev) => Math.min(99.4, +(prev + (99.4 - prev) * 0.15).toFixed(1)))
            setLoss((prev) => Math.max(0.012, +(prev * 0.82).toFixed(3)))
            currentEpoch += 1
          } else {
            if (trainTimerRef.current) {
              clearInterval(trainTimerRef.current)
              trainTimerRef.current = null
            }
          }
        }, 100)
      }, 4000)

      // Phase 3: Predict (10s - 15s)
      phase3TimeoutRef.current = setTimeout(() => {
        setActiveStep(2)
      }, 10000)
    }

    runSimulation()
    loopTimerRef.current = setInterval(runSimulation, 15000)

    return () => {
      clearAllTimers()
    }
  }, [isSimulating, clearAllTimers])

  const restartSimulation = () => {
    setIsSimulating(false)
    clearAllTimers()
    setTimeout(() => {
      setIsSimulating(true)
    }, 50)
  }

  const stepsDetails = [
    {
      title: '01 · Instant Ingestion',
      subtitle: 'No complex ELT setups or coding',
      desc: 'Drag & drop your spreadsheets, datastores, or raw files. Our engine automatically infers column datatypes, handles missing values, detects class imbalance, and prepares the feature store instantly.',
      badge: 'PROFILER LIVE',
      badgeColor: '#10b981'
    },
    {
      title: '02 · Autonomous AutoML Core',
      subtitle: 'Neural architectural search, simplified',
      desc: 'MLStack spins up high-performance ephemeral training nodes. It searches across hundreds of model parameter combinations, generates clear explainability graphs (SHAP/LIME), and optimizes for top precision.',
      badge: 'TRAINING LIVE',
      badgeColor: '#fb923c'
    },
    {
      title: '03 · Instant Servicing UI & API',
      subtitle: 'Skip Dockerizing and Kubernetes serving',
      desc: 'Once trained, your model is immediately live. Interact with it directly through our beautiful auto-generated Streamlit dashboard, or query the production-ready REST API endpoint with zero extra dev effort.',
      badge: 'SERVING LIVE',
      badgeColor: '#38bdf8'
    }
  ]

  return (
    <section id="how-it-works" className="hiw-section">
      <div className="hiw-header">
        <div className="section-label">
          <span>Workflow System</span>
        </div>
        <h2 className="section-title">
          How <span className="hiw-gradient">MLStack</span> Operates
        </h2>
        <p className="section-subtitle">
          An automated, production-ready pipeline that handles the complex infrastructure for you. 
          Watch the live workflow diagram below.
        </p>
      </div>

      {/* Control Strip */}
      <div className="hiw-controls">
        <div className="hiw-tabs">
          {stepsDetails.map((step, idx) => (
            <button
              key={idx}
              className={`hiw-tab-btn ${activeStep === idx ? 'active' : ''}`}
              onClick={() => {
                setIsSimulating(false)
                setActiveStep(idx)
              }}
            >
              <span className="hiw-tab-num">0{idx + 1}</span>
              <span className="hiw-tab-title">
                {idx === 0 ? 'Ingest' : idx === 1 ? 'Train' : 'Deploy'}
              </span>
            </button>
          ))}
        </div>

        <div className="hiw-action-buttons">
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className={`btn-sim ${isSimulating ? 'active' : ''}`}
          >
            <Play size={14} className={isSimulating ? 'spinning' : ''} />
            {isSimulating ? 'Simulating Pipeline' : 'Simulate Pipeline'}
          </button>
          <button onClick={restartSimulation} className="btn-sim-reset" title="Restart Simulation">
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      {/* Main Interactive Diagram Dashboard */}
      <div className="hiw-dashboard">
        <div className="hiw-diagram-canvas">
          <svg viewBox="0 0 900 360" className="hiw-svg" preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id="pipelineGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#fb923c" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.8" />
              </linearGradient>
              <filter id="glow-heavy" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Connecting Pipes */}
            {/* Pipe 1 -> 2 */}
            <path
              d="M 260 180 Q 330 180, 370 180"
              stroke={activeStep > 0 ? 'url(#pipelineGlow)' : 'rgba(255,255,255,0.06)'}
              strokeWidth="4"
              fill="none"
              className={activeStep === 0 && isSimulating ? 'hiw-pipe-animating' : ''}
            />
            {activeStep === 0 && isSimulating && (
              <circle r="5" fill="#10b981" filter="url(#glow-heavy)">
                <animateMotion dur="2s" repeatCount="indefinite" path="M 260 180 Q 330 180, 370 180" />
              </circle>
            )}

            {/* Pipe 2 -> 3 */}
            <path
              d="M 530 180 Q 570 180, 640 180"
              stroke={activeStep > 1 ? '#38bdf8' : 'rgba(255,255,255,0.06)'}
              strokeWidth="4"
              fill="none"
              className={activeStep === 1 && isSimulating ? 'hiw-pipe-animating' : ''}
            />
            {activeStep === 1 && isSimulating && (
              <circle r="5" fill="#fb923c" filter="url(#glow-heavy)">
                <animateMotion dur="1.8s" repeatCount="indefinite" path="M 530 180 Q 570 180, 640 180" />
              </circle>
            )}

            {/* Grid pattern helper lines */}
            <line x1="0" y1="90" x2="900" y2="90" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
            <line x1="0" y1="270" x2="900" y2="270" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
          </svg>

          {/* BLOCK 1: INGESTION */}
          <div className={`hiw-block hiw-block-ingest ${activeStep === 0 ? 'active' : ''}`}>
            <div className="hiw-block-header">
              <Upload size={16} className="text-emerald" />
              <span>Step 01 · File Profiler</span>
            </div>
            <div className="hiw-ingest-body">
              <div className="hiw-file-slot">
                <Database size={18} className="icon-db" />
                <span className="file-name">sales_churn_2026.csv</span>
                <span className="file-size">14.8 MB</span>
              </div>
              <div className="hiw-progress-wrap">
                <div className="progress-labels">
                  <span>Data Ingestion</span>
                  <span>{activeStep === 0 && isSimulating ? 'Scanning Schema...' : 'Done'}</span>
                </div>
                <div className="progress-bar-container">
                  <div 
                    className={`progress-fill ${activeStep === 0 && isSimulating ? 'loading' : 'complete'}`}
                    style={{ width: activeStep === 0 && isSimulating ? '65%' : '100%' }}
                  />
                </div>
              </div>
              <div className="hiw-column-badges">
                <span className="c-badge">Customer ID</span>
                <span className="c-badge">Age: float</span>
                <span className="c-badge">Target: Class</span>
              </div>
            </div>
          </div>

          {/* BLOCK 2: AUTOML ENGINE */}
          <div className={`hiw-block hiw-block-train ${activeStep === 1 ? 'active' : ''}`}>
            <div className="hiw-block-header">
              <Cpu size={16} className="text-orange" />
              <span>Step 02 · AutoML Core</span>
            </div>
            <div className="hiw-train-body">
              {/* Rotating Neural Matrix diagram */}
              <div className="neural-graph-visual">
                <div className="neural-layers">
                  {[0, 1, 2].map((layerIdx) => (
                    <div className="neural-layer" key={layerIdx}>
                      {[0, 1].map((nodeIdx) => {
                        const globalNodeIdx = layerIdx * 2 + nodeIdx
                        return (
                          <div
                            key={nodeIdx}
                            className={`neural-node ${activeNode === globalNodeIdx ? 'pulse-orange' : ''}`}
                          />
                        )
                      })}
                    </div>
                  ))}
                </div>
                <div className="neural-mesh-glow" />
              </div>

              {/* Real-time Telemetry Dashboard */}
              <div className="hiw-telemetry">
                <div className="t-row">
                  <span className="t-label">EPOCH</span>
                  <span className="t-val font-mono">
                    {activeStep === 1 ? `${epoch}/50` : activeStep > 1 ? '50/50' : '0/50'}
                  </span>
                </div>
                <div className="t-row">
                  <span className="t-label">ACCURACY</span>
                  <span className="t-val font-mono text-emerald">
                    {activeStep === 1 ? `${accuracy}%` : activeStep > 1 ? '99.4%' : '0.0%'}
                  </span>
                </div>
                <div className="t-row">
                  <span className="t-label">LOSS</span>
                  <span className="t-val font-mono text-rose">
                    {activeStep === 1 ? loss : activeStep > 1 ? '0.012' : '1.000'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* BLOCK 3: INSTANT DEPLOYMENT */}
          <div className={`hiw-block hiw-block-deploy ${activeStep === 2 ? 'active' : ''}`}>
            <div className="hiw-block-header">
              <BarChart3 size={16} className="text-blue" />
              <span>Step 03 · Streamlit serving</span>
            </div>
            <div className="hiw-deploy-body">
              <div className="serving-api-mock">
                <div className="api-url">
                  <span className="badge-post">POST</span>
                  <span className="url-text">/v1/models/churn/predict</span>
                </div>
                <div className="json-output">
                  <pre className="font-mono">
{`{
  "prediction": "Active",
  "confidence": 0.994,
  "inference_time": "12ms"
}`}
                  </pre>
                </div>
              </div>
              <div className="hiw-health-indicator">
                <span className="health-dot" />
                <span className="health-text">UI Service Healthy</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Detail Card Box */}
        <div className="hiw-details-panel">
          <div className="hiw-details-header">
            <span
              className="hiw-live-badge"
              style={{
                background: `${stepsDetails[activeStep].badgeColor}12`,
                color: stepsDetails[activeStep].badgeColor,
                borderColor: `${stepsDetails[activeStep].badgeColor}33`
              }}
            >
              {stepsDetails[activeStep].badge}
            </span>
            <h3>{stepsDetails[activeStep].title}</h3>
            <h4>{stepsDetails[activeStep].subtitle}</h4>
          </div>
          <p>{stepsDetails[activeStep].desc}</p>
        </div>
      </div>
    </section>
  )
}
