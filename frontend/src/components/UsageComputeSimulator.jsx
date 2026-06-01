import React from 'react'
import { Sparkles, Zap, CheckCircle2, ShieldCheck, Cpu, Database, Layout } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import './UsageComputeSimulator.css'

export default function UsageComputeSimulator() {
  const navigate = useNavigate()

  return (
    <section id="usage" className="usage-section">
      <div className="usage-header">
        <div className="section-label">
          <Sparkles size={14} />
          <span>Access Tier</span>
        </div>
        <h2 className="section-title">
          Fully Unlocked, <span className="usage-gradient">100% Free</span>
        </h2>
        <p className="section-subtitle">
          No credit card. No payment gateways. Experience the full power of automated ML with direct free-tier access.
        </p>
      </div>

      <div className="usage-centered-container">
        {/* THE QUANTUM DEVELOPER PASS */}
        <div className="usage-pass-card centered-pass">
          <div className="pass-glow-border" />
          
          <div className="pass-header">
            <div className="pass-badge">
              <Zap size={12} fill="#10b981" />
              <span>QUANTUM DEVELOPER ACCESS</span>
            </div>
            <h3>MLStack Workspace Pass</h3>
            <p className="pass-plan-type">Free Tier · Infinite Potential</p>
          </div>

          {/* Real-time App Systems Status Grid */}
          <div className="pass-status-grid">
            <div className="status-item">
              <div className="status-icon-wrap">
                <Cpu size={18} className="text-emerald" />
              </div>
              <div className="status-info">
                <span className="status-label">AutoML Engine</span>
                <span className="status-badge-unlocked">✓ UNLOCKED</span>
              </div>
            </div>

            <div className="status-item">
              <div className="status-icon-wrap">
                <Layout size={18} className="text-emerald" />
              </div>
              <div className="status-info">
                <span className="status-label">Streamlit Hosting</span>
                <span className="status-badge-unlocked">✓ UNLOCKED</span>
              </div>
            </div>

            <div className="status-item">
              <div className="status-icon-wrap">
                <Database size={18} className="text-emerald" />
              </div>
              <div className="status-info">
                <span className="status-label">Ingestion Limit</span>
                <span className="status-badge-limit">5 Runs / Day</span>
              </div>
            </div>
          </div>

          <div className="pass-separator" />

          {/* Actual Supported Features */}
          <ul className="pass-features-list">
            <li>
              <CheckCircle2 size={16} className="pass-check text-emerald" />
              <span>Train XGBoost, LightGBM, &amp; RandomForest models</span>
            </li>
            <li>
              <CheckCircle2 size={16} className="pass-check text-emerald" />
              <span>Automatic YOLOv8 object detection processing</span>
            </li>
            <li>
              <CheckCircle2 size={16} className="pass-check text-emerald" />
              <span>Explainable AI metrics (SHAP value summaries)</span>
            </li>
            <li>
              <CheckCircle2 size={16} className="pass-check text-emerald" />
              <span>Instant model deployments to Streamlit dashboards</span>
            </li>
          </ul>

          <div className="pass-footer">
            <button onClick={() => navigate('/login')} className="pass-cta-btn">
              <Sparkles size={16} />
              Claim Free Workspace Access
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
