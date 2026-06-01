import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { BentoGrid, BentoCard } from '../components/ui/BentoGrid'
import { AnimatedTestimonials } from '../components/ui/AnimatedTestimonials'
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

/* ═══════════════════════════════════
   FEATURE DATA
   ═══════════════════════════════════ */
const features = [
    {
        Icon: Database,
        name: 'Smart Data Profiling',
        description: 'Upload CSV, Excel, or images — instant schema detection, stats, and quality checks.',
        href: '#',
        cta: 'Learn more',
        className: 'bento-wide',
    },
    {
        Icon: Brain,
        name: 'AutoML Training',
        description: 'Automatic model selection, hyperparameter tuning, and cross-validation across 10+ algorithms.',
        href: '#',
        cta: 'Learn more',
        className: '',
    },
    {
        Icon: Sparkles,
        name: 'Explainable AI',
        description: 'Real-time learning timeline shows what the model learned, why it chose each step.',
        href: '#',
        cta: 'Learn more',
        className: '',
    },
    {
        Icon: Target,
        name: 'AI Goal Analysis',
        description: 'Describe your goal in plain English — AI suggests the right target and approach.',
        href: '#',
        cta: 'Learn more',
        className: '',
    },
    {
        Icon: Terminal,
        name: 'Live Developer Logs',
        description: 'Watch training in real time with streaming logs, progress bars, and status updates.',
        href: '#',
        cta: 'Learn more',
        className: 'bento-wide',
    },
    {
        Icon: Shield,
        name: 'Auto Preprocessing',
        description: 'Missing values, encoding, scaling, outlier removal — all handled automatically before training.',
        href: '#',
        cta: 'Learn more',
        className: '',
    },
    {
        Icon: Package,
        name: 'One-Click Export',
        description: 'Download trained models as production-ready packages. Deploy anywhere.',
        href: '#',
        cta: 'Learn more',
        className: '',
    },
]

/* ═══════════════════════════════════
   STEPS DATA
   ═══════════════════════════════════ */
const steps = [
    {
        num: '01',
        icon: Upload,
        title: 'Upload',
        desc: 'Drop your CSV, Excel, or image dataset. We profile it instantly.',
    },
    {
        num: '02',
        icon: Cpu,
        title: 'Train',
        desc: 'AI picks the best model, trains it, explains every decision.',
    },
    {
        num: '03',
        icon: BarChart3,
        title: 'Predict',
        desc: 'Use your model via the built-in Streamlit UI. No deployment needed.',
    },
]

/* ═══════════════════════════════════
   STATS DATA
   ═══════════════════════════════════ */
const stats = [
    { value: '10+', label: 'ML Models per run', icon: Zap },
    { value: '<5min', label: 'Avg training time', icon: Clock },
    { value: '100%', label: 'Open source', icon: Shield },
    { value: '0', label: 'Lines of code needed', icon: Code2 },
]

/* ═══════════════════════════════════
   TEAM DATA
   ═══════════════════════════════════ */


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
        <div className="landing-page">

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
                                <span className="stat-value">10+</span>
                                <span className="stat-label">ML Algorithms</span>
                            </div>
                            <div className="hero-stat-divider" />
                            <div className="hero-stat">
                                <span className="stat-value">94%+</span>
                                <span className="stat-label">Avg Accuracy</span>
                            </div>
                            <div className="hero-stat-divider" />
                            <div className="hero-stat">
                                <span className="stat-value">&lt;5 min</span>
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
                            <div className="mock-body">
                                <div className="mock-sidebar">
                                    <div className="mock-nav-item active"><Database size={14} /> Datasets</div>
                                    <div className="mock-nav-item"><Cpu size={14} /> Training</div>
                                    <div className="mock-nav-item"><Package size={14} /> Models</div>
                                    <div className="mock-nav-item"><BarChart3 size={14} /> Predictions</div>
                                </div>
                                <div className="mock-content">
                                    <div className="mock-terminal">
                                        <div className="term-line"><span className="term-green">✓</span> Preprocessing complete</div>
                                        <div className="term-line"><span className="term-blue">⟳</span> Training RandomForest...</div>
                                        <div className="term-line"><span className="term-blue">⟳</span> Training XGBoost...</div>
                                        <div className="term-line"><span className="term-green">✓</span> Best model: XGBoost — 94.7%</div>
                                        <div className="term-line term-dim">█████████████░░ 87%</div>
                                    </div>
                                    <div className="mock-score-ring">
                                        <svg viewBox="0 0 120 120" className="ring-svg">
                                            <circle cx="60" cy="60" r="52" className="ring-bg" />
                                            <circle cx="60" cy="60" r="52" className="ring-fill" />
                                        </svg>
                                        <div className="ring-label">
                                            <span className="ring-value">94.7%</span>
                                            <span className="ring-text">Accuracy</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
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
                    <h2 className="section-title">Everything you need to ship ML</h2>
                    <p className="section-subtitle">From raw data to production-ready models — without writing a single line of code.</p>
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
            <section id="how-it-works" className="steps-section">
                <FadeIn>
                    <div className="section-label">
                        <Zap size={14} />
                        <span>Workflow</span>
                    </div>
                    <h2 className="section-title">Three steps. That's it.</h2>
                    <p className="section-subtitle">No pipelines to configure. No infrastructure to manage.</p>
                </FadeIn>

                <div className="steps-row">
                    {steps.map((s, i) => (
                        <React.Fragment key={s.num}>
                            <FadeIn delay={i * 0.15}>
                                <div className="step-card">
                                    <span className="step-num">{s.num}</span>
                                    <div className="step-icon-wrap">
                                        <s.icon size={28} />
                                    </div>
                                    <h3>{s.title}</h3>
                                    <p>{s.desc}</p>
                                </div>
                            </FadeIn>
                            {i < steps.length - 1 && (
                                <div className="step-connector">
                                    <ArrowRight size={20} />
                                </div>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </section>

            {/* ═══ STATS STRIP ═══ */}
            <section className="stats-section">
                <div className="stats-row">
                    {stats.map((s, i) => (
                        <FadeIn key={s.label} delay={i * 0.1}>
                            <div className="stat-card">
                                <s.icon size={20} className="stat-icon" />
                                <span className="stat-value">{s.value}</span>
                                <span className="stat-label">{s.label}</span>
                            </div>
                        </FadeIn>
                    ))}
                </div>
            </section>

            {/* ═══ USAGE POLICY ═══ */}
            <section id="usage" className="pricing-section">
                <FadeIn>
                    <div className="section-label">
                        <Sparkles size={14} />
                        <span>Usage</span>
                    </div>
                    <h2 className="section-title">Free for everyone</h2>
                    {/* <p className="section-subtitle">All features unlocked. No Payment Required.</p> */}
                </FadeIn>

                <div className="pricing-grid pricing-grid-single">
                    <FadeIn delay={0.15}>
                        <div className="pricing-card pricing-card-pro">
                            <div className="pricing-popular-badge">
                                <Zap size={12} />
                                Fully Unlocked
                            </div>
                            <div className="pricing-card-header">
                                <span className="pricing-plan-name">Free Tier</span>
                                <div className="pricing-price">
                                    <span className="pricing-amount">5</span>
                                    <span className="pricing-period"> training runs</span>
                                </div>
                                <p className="pricing-desc">Full access to every feature — deployed on free-tier cloud for demonstration</p>
                            </div>
                            <ul className="pricing-features">
                                <li><Check size={16} className="feature-check pro" /> 10+ ML algorithms (incl. XGBoost, LightGBM)</li>
                                <li><Check size={16} className="feature-check pro" /> AI-powered data generation</li>
                                <li><Check size={16} className="feature-check pro" /> YOLOv8 object detection</li>
                                <li><Check size={16} className="feature-check pro" /> Kaggle dataset search &amp; import</li>
                                <li><Check size={16} className="feature-check pro" /> Explainable AI insights</li>
                                <li><Check size={16} className="feature-check pro" /> One-click model export</li>
                                <li><Check size={16} className="feature-check pro" /> Real-time training logs</li>
                            </ul>
                            <div className="pricing-card-footer">
                                <button onClick={() => navigate('/login')} className="pricing-btn pricing-btn-primary">
                                    <Sparkles size={16} />
                                    Start Building Free
                                </button>
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </section>

            {/* ═══ FINAL CTA ═══ */}
            <section className="cta-section">
                <FadeIn>
                    <div className="cta-content">
                        <h2>Ready to build smarter models?</h2>
                        <p>Start training in under 5 minutes. No Payment Required.</p>
                        <button onClick={() => navigate('/login')} className="btn-hero-primary btn-lg">
                            <Sparkles size={20} />
                            Get Started Free
                            <ArrowRight size={20} />
                        </button>
                    </div>
                </FadeIn>
                <div className="cta-orb cta-orb-1" />
                <div className="cta-orb cta-orb-2" />
            </section>


            <footer className="landing-footer">

                <div className="footer-bottom">
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
