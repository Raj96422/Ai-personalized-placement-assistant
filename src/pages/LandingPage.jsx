import { Link } from 'react-router-dom';
import { ArrowRight, Brain, Briefcase, Zap } from 'lucide-react';
import './LandingPage.css';

export default function LandingPage() {
  return (
    <div className="landing-page animate-fade-in">
      <section className="hero">
        <div className="hero-content">
          <div className="badge">✨ AI-Powered Preparation</div>
          <h1 className="hero-title">
            Crack Your Dream Job at <br />
            <span className="gradient-text">Top Indian Tech Giants</span>
          </h1>
          <p className="hero-subtitle">
            Upload your resume, practice company-specific mock interviews, and get a personalized roadmap designed for students facing the highly competitive placement drive.
          </p>
          <div className="cta-group">
            <Link to="/assistant" className="primary-btn">
              Start Preparation <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      <section className="features-grid container">
        <div className="feature-card glass-panel">
          <div className="feature-icon"><Briefcase size={32} /></div>
          <h3>Company Specific</h3>
          <p>Questions tailored specifically for TCS, Infosys, Amazon, Wipro, and other major recruiters dominating campus placements.</p>
        </div>
        <div className="feature-card glass-panel">
          <div className="feature-icon"><Brain size={32} /></div>
          <h3>AI Mock Interview</h3>
          <p>Our intelligent assistant analyzes your resume to formulate challenging questions and evaluates your technical and HR answers instantly.</p>
        </div>
        <div className="feature-card glass-panel">
          <div className="feature-icon"><Zap size={32} /></div>
          <h3>Personalized Roadmap</h3>
          <p>Get a detailed, step-by-step action plan highlighting your weak areas, with resource links to succeed in actual placement interviews.</p>
        </div>
      </section>
    </div>
  );
}
