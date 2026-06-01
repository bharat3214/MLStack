import React, { useState, useRef, useCallback, useEffect } from 'react'
import { GripVertical } from 'lucide-react'
import './BeforeAfterSlider.css'

/* ═══════════════════════════════════
   BEFORE DIAGRAM DATA
   ═══════════════════════════════════ */
const beforeNodes = [
  { label: 'CSV',          x: 120, y: 110 },
  { label: 'Jupyter',      x: 320, y: 90 },
  { label: 'Excel',        x: 480, y: 115 },
  { label: 'Database',     x: 650, y: 95 },
  { label: 'scikit-learn', x: 760, y: 220 },
  { label: 'Pandas',       x: 160, y: 270 },
  { label: 'Manual Code',  x: 420, y: 290 },
  { label: 'NumPy',        x: 630, y: 275 },
  { label: 'TensorFlow',   x: 150, y: 410 },
  { label: 'Docker',       x: 390, y: 440 },
  { label: 'Flask API',    x: 590, y: 420 },
  { label: 'Dashboard',    x: 740, y: 425 },
]

const beforeLines = [
  [0, 5], [0, 6], [0, 8], [0, 11], [1, 5], [1, 7], [1, 10], [1, 4],
  [2, 5], [2, 9], [2, 6], [3, 6], [3, 11], [3, 8], [4, 6], [4, 10],
  [5, 7], [5, 9], [6, 8], [6, 10], [6, 11], [7, 8], [7, 11],
  [0, 10], [4, 8], [1, 9], [3, 10], [2, 11]
]

const beforeColors = ['#f87171', '#fb923c', '#fb7185', '#fda4af', '#f87171', '#fb923c']

const beforeErrorPills = [
  { label: '✕ Failed',   x: 280, y: 180, bg: 'rgba(239, 68, 68, 0.9)', border: '#ef4444' },
  { label: '⚠ Broken',   x: 520, y: 340, bg: 'rgba(249, 115, 22, 0.9)', border: '#f97316' },
  { label: '△ Stale 3D', x: 670, y: 160, bg: 'rgba(234, 179, 8, 0.9)', border: '#eab308' },
  { label: '△ Cost ↑',   x: 480, y: 450, bg: 'rgba(249, 115, 22, 0.9)', border: '#f97316' },
]

/* ═══════════════════════════════════
   AFTER DIAGRAM DATA
   ═══════════════════════════════════ */
const afterInputs = [
  { label: 'CSV',      y: 90 },
  { label: 'Excel',    y: 170 },
  { label: 'Database', y: 250 },
  { label: 'Images',   y: 330 },
  { label: 'Any Source', y: 410 },
]

const afterOutputs = [
  { label: 'Models',      y: 140 },
  { label: 'Predictions', y: 250 },
  { label: 'APIs',        y: 360 },
]

const hubModules = [
  { title: 'AUTOML',     sub: 'Smart Training', x: 340, y: 170 },
  { title: 'PREPROCESS', sub: 'Auto Cleaning',  x: 470, y: 170 },
  { title: 'EXPLAIN AI', sub: 'SHAP Insights',  x: 340, y: 240 },
  { title: 'EXPORT',     sub: 'One-Click API',  x: 470, y: 240 },
]


/* ═══════════════════════════════════
   BEFORE DIAGRAM COMPONENT
   ═══════════════════════════════════ */
function BeforeDiagram() {
  return (
    <div className="ba-diagram ba-diagram-before">
      <div className="ba-badge-label ba-badge-before">⚠ BEFORE · Spaghetti Pipelines</div>

      <svg viewBox="0 0 900 500" className="ba-svg" preserveAspectRatio="xMidYMid meet">
        {/* Chaotic glowing background blobs */}
        <defs>
          <radialGradient id="redBlob" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="450" cy="250" r="300" fill="url(#redBlob)" />

        {/* Chaos Lines with glowing effects */}
        {beforeLines.map(([a, b], i) => {
          const from = beforeNodes[a]
          const to = beforeNodes[b]
          const color = beforeColors[i % beforeColors.length]
          return (
            <g key={i}>
              <line
                x1={from.x} y1={from.y}
                x2={to.x} y2={to.y}
                stroke={color}
                strokeWidth="1.5"
                strokeDasharray="4 4"
                opacity="0.6"
                className="ba-chaos-line"
                style={{ animationDelay: `${(i * 0.12).toFixed(2)}s` }}
              />
            </g>
          )
        })}

        {/* Messy Nodes */}
        {beforeNodes.map((n, i) => (
          <g key={i} className="ba-node-group">
            <circle cx={n.x} cy={n.y} r="15" fill="#18181b" stroke="#3f3f46" strokeWidth="2" />
            <circle cx={n.x} cy={n.y} r="4" fill="#ef4444" opacity="0.8" />
            <text x={n.x} y={n.y + 28} textAnchor="middle" className="ba-svg-text ba-svg-text-before">
              {n.label}
            </text>
          </g>
        ))}
      </svg>

      {/* Floating Error/Warning Pills */}
      {beforeErrorPills.map((p, i) => (
        <span
          key={i}
          className="ba-pill ba-pill-error"
          style={{
            left: `${(p.x / 900) * 100}%`,
            top: `${(p.y / 500) * 100}%`,
            background: p.bg,
            borderColor: p.border,
            boxShadow: `0 0 12px ${p.border}50`
          }}
        >
          {p.label}
        </span>
      ))}
    </div>
  )
}


/* ═══════════════════════════════════
   AFTER DIAGRAM COMPONENT
   ═══════════════════════════════════ */
function AfterDiagram() {
  const srcX = 120
  const hubLeft = 320
  const hubRight = 580
  const hubWidth = 260
  const hubHeight = 280
  const hubTop = 110
  const outX = 780

  // Connect left inputs to specific y coordinates on the hub's left border
  const leftConnectors = afterInputs.map((s, i) => {
    const startY = s.y
    const endY = hubTop + 40 + i * 50
    const controlX1 = srcX + 80
    const controlX2 = hubLeft - 80
    return {
      d: `M ${srcX} ${startY} C ${controlX1} ${startY}, ${controlX2} ${endY}, ${hubLeft} ${endY}`,
      startY,
      endY
    }
  })

  // Connect hub's right border to outputs
  const rightConnectors = afterOutputs.map((o, i) => {
    const startY = hubTop + 50 + i * 90
    const endY = o.y
    const controlX1 = hubRight + 80
    const controlX2 = outX - 80
    return {
      d: `M ${hubRight} ${startY} C ${controlX1} ${startY}, ${controlX2} ${endY}, ${outX} ${endY}`,
      startY,
      endY
    }
  })

  return (
    <div className="ba-diagram ba-diagram-after">
      <div className="ba-badge-label ba-badge-after">✓ AFTER · MLStack Unified</div>

      <svg viewBox="0 0 900 500" className="ba-svg" preserveAspectRatio="xMidYMid meet">
        {/* Glow definitions */}
        <defs>
          <radialGradient id="greenBlob" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </radialGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <circle cx="450" cy="250" r="320" fill="url(#greenBlob)" />

        {/* Section flow guides */}
        <text x="120" y="55" className="ba-flow-header" textAnchor="middle">01 · CONNECT</text>
        <text x="310" y="55" className="ba-flow-header" textAnchor="middle">02 · COMPOSE</text>
        <text x="450" y="85" className="ba-flow-header" textAnchor="middle">03 · CONTAIN</text>
        <text x="780" y="55" className="ba-flow-header" textAnchor="middle">04 · CONSUME</text>

        {/* Curve Pipelines - Left Side */}
        {leftConnectors.map((c, i) => (
          <g key={`left-g-${i}`}>
            {/* Background path line */}
            <path d={c.d} className="ba-pipe-bg" />
            {/* Animated glowing path line */}
            <path d={c.d} className="ba-pipe-fg ba-pipe-fg-green" />
            {/* Dynamic flowing dot */}
            <circle r="4.5" fill="#34d399" className="ba-flow-particle" filter="url(#glow)">
              <animateMotion dur={`${1.8 + i * 0.25}s`} repeatCount="indefinite" path={c.d} />
            </circle>
          </g>
        ))}

        {/* Curve Pipelines - Right Side */}
        {rightConnectors.map((c, i) => (
          <g key={`right-g-${i}`}>
            {/* Background path line */}
            <path d={c.d} className="ba-pipe-bg" />
            {/* Animated glowing path line */}
            <path d={c.d} className="ba-pipe-fg ba-pipe-fg-orange" />
            {/* Dynamic flowing dot */}
            <circle r="4.5" fill="#fb923c" className="ba-flow-particle" filter="url(#glow)">
              <animateMotion dur={`${2.0 + i * 0.3}s`} repeatCount="indefinite" path={c.d} />
            </circle>
          </g>
        ))}

        {/* ═══ Center MLStack Hub (Native SVG Graphic) ═══ */}
        <g transform={`translate(${hubLeft}, ${hubTop})`}>
          {/* Glassmorphic box frame */}
          <rect
            width={hubWidth}
            height={hubHeight}
            rx="16"
            fill="#09090b"
            stroke="#10b981"
            strokeWidth="2.5"
            className="ba-svg-hub-box"
          />

          {/* Glowing Hub Title */}
          <rect x="20" y="-15" width="220" height="30" rx="8" fill="#111827" stroke="#10b981" strokeWidth="1.5" />
          <text x="130" y="5" textAnchor="middle" className="ba-hub-svg-title">MLStack ENGINE</text>

          {/* Hub Internal Cards */}
          {hubModules.map((m, i) => {
            // Local offset coordinates inside the hub
            const localX = m.x - hubLeft
            const localY = m.y - hubTop
            return (
              <g key={i}>
                <rect
                  x={localX}
                  y={localY}
                  width="110"
                  height="52"
                  rx="8"
                  fill="#18181b"
                  stroke="#27272a"
                  strokeWidth="1.5"
                  className="ba-hub-module-rect"
                />
                <text x={localX + 12} y={localY + 22} className="ba-hub-module-title">{m.title}</text>
                <text x={localX + 12} y={localY + 38} className="ba-hub-module-sub">{m.sub}</text>
              </g>
            )}
          )}

          {/* Secure / Control Header */}
          <rect x="50" y="245" width="160" height="20" rx="10" fill="rgba(16, 185, 129, 0.12)" stroke="rgba(16, 185, 129, 0.3)" strokeWidth="1" />
          <text x="130" y="258" textAnchor="middle" className="ba-hub-secure-text">✓ SECURE &amp; COMPLIANT</text>
        </g>

        {/* Input Nodes (Left side) */}
        {afterInputs.map((s, i) => (
          <g key={`sc-${i}`}>
            <circle cx={srcX} cy={s.y} r="16" fill="#18181b" stroke="#10b981" strokeWidth="2.5" className="ba-node-pulse" />
            <circle cx={srcX} cy={s.y} r="6" fill="#34d399" />
            <text x={srcX - 25} y={s.y + 5} textAnchor="end" className="ba-svg-text ba-svg-text-after font-semibold">
              {s.label}
            </text>
          </g>
        ))}

        {/* Output Nodes (Right side) */}
        {afterOutputs.map((o, i) => (
          <g key={`oc-${i}`}>
            <circle cx={outX} cy={o.y} r="16" fill="#18181b" stroke="#fb923c" strokeWidth="2.5" className="ba-node-pulse-orange" />
            <circle cx={outX} cy={o.y} r="6" fill="#fdba74" />
            <text x={outX + 25} y={o.y + 5} textAnchor="start" className="ba-svg-text ba-svg-text-after font-semibold">
              {o.label}
            </text>
          </g>
        ))}
      </svg>

      {/* Modern success flags row */}
      <div className="ba-success-row">
        <span className="ba-success-pill">✓ Quality 99.8%</span>
        <span className="ba-success-pill">✓ Fully Automated</span>
        <span className="ba-success-pill">✓ No-Code AI</span>
        <span className="ba-success-pill">✓ Production-Ready</span>
      </div>
    </div>
  )
}


/* ═══════════════════════════════════
   MAIN COMPONENT & HANDLER INTERACTION
   ═══════════════════════════════════ */
export default function BeforeAfterSlider() {
  const containerRef = useRef(null)
  const [pos, setPos] = useState(50)
  const dragging = useRef(false)

  const updatePos = useCallback((clientX) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = ((clientX - rect.left) / rect.width) * 100
    setPos(Math.min(96, Math.max(4, x)))
  }, [])

  const onPointerDown = useCallback((e) => {
    e.preventDefault()
    dragging.current = true
    updatePos(e.clientX ?? e.touches?.[0]?.clientX)
  }, [updatePos])

  useEffect(() => {
    const onMove = (e) => {
      if (!dragging.current) return
      updatePos(e.clientX ?? e.touches?.[0]?.clientX)
    }
    const onUp = () => { dragging.current = false }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
  }, [updatePos])

  return (
    <section id="before-after" className="ba-section">
      <div className="ba-header">
        <div className="section-label"><span>Live Transformation</span></div>
        <h2 className="section-title">
          From <span className="ba-red">Spaghetti Pipelines</span> to{' '}
          <span className="ba-green">MLStack Unified</span>
        </h2>
        <p className="section-subtitle">
          Drag the slider to see the magic. Same data, same goals — but replaced with 
          a single, robust, real-time animated workflow.
        </p>
      </div>

      <div
        ref={containerRef}
        className="ba-container"
        onPointerDown={onPointerDown}
        style={{ touchAction: 'none' }}
      >
        {/* After (clean layout always at background layer) */}
        <div className="ba-panel ba-panel-after">
          <AfterDiagram />
        </div>

        {/* Before (clipped messy layout overlaying from the left) */}
        <div
          className="ba-panel ba-panel-before"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        >
          <BeforeDiagram />
        </div>

        {/* Glowing Interactive Sliding Handle */}
        <div className="ba-handle" style={{ left: `${pos}%` }}>
          <div className="ba-handle-line" />
          <div className="ba-handle-btn">
            <GripVertical size={18} />
          </div>
        </div>
      </div>

      <p className="ba-hint">← Drag the handler to compare workflows →</p>
    </section>
  )
}
