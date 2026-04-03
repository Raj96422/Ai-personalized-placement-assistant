import { useState } from 'react';
import { Upload, ChevronRight, CheckCircle, Loader2, Sparkles, Map } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Assistant.css';

export default function Assistant() {
  const [step, setStep] = useState(1);
  const [resumeFile, setResumeFile] = useState(null);
  const [targetCompany, setTargetCompany] = useState('TCS');
  const [targetRole, setTargetRole] = useState('SDE');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});

  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [error, setError] = useState(null);

  const { token } = useAuth();

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setResumeFile(e.target.files[0]);
    }
  };

  const generateQuestions = async () => {
    if (!resumeFile) {
      setError("Please upload your resume first!");
      return;
    }
    
    setError(null);
    setIsGenerating(true);
    setStep(2);

    const formData = new FormData();
    formData.append('resume', resumeFile);
    formData.append('targetCompany', targetCompany);
    formData.append('targetRole', targetRole);

    try {
      const res = await fetch('http://localhost:5000/api/ai/generate-questions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate');
      
      setQuestions(data.questions || []);
      setStep(3);
    } catch (err) {
      setError(err.message);
      setStep(1);
    } finally {
      setIsGenerating(false);
    }
  };

  const submitAnswers = async () => {
    setStep(4);
    setIsEvaluating(true);
    setError(null);

    // Map questions to user answers
    const qaPairs = questions.map((q, idx) => ({
      question: q,
      answer: answers[idx] || "No answer provided.",
    }));

    try {
      const res = await fetch('http://localhost:5000/api/ai/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          targetCompany,
          targetRole,
          qaPairs
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Evaluation failed');
      
      setEvaluation(data);
      setStep(5);
    } catch (err) {
      setError(err.message);
      setStep(3);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="assistant-container animate-fade-in">
      <div className="progress-bar">
        <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>Setup</div>
        <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>Interview</div>
        <div className={`progress-step ${step >= 5 ? 'active' : ''}`}>Roadmap</div>
      </div>

      {error && <div className="tip-card warning mb-4">{error}</div>}

      {(step === 1 || step === 2) && (
        <div className="glass-panel setup-panel">
          <h2><Sparkles color="#60a5fa" size={24} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '8px' }}/> Configure Assessment</h2>
          <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
            Provide your resume and target placement goals to let the AI tailor your test.
          </p>
          
          <div className="input-group">
            <label>Upload Resume (PDF)</label>
            <div className="file-upload-box">
              <Upload size={32} color="#94a3b8" />
              <p>{resumeFile ? resumeFile.name : "Click or drag resume here"}</p>
              <input type="file" accept=".pdf" onChange={handleFileChange} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
            <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
              <label>Target Company</label>
              <select value={targetCompany} onChange={e => setTargetCompany(e.target.value)}>
                <option value="TCS">TCS (Ninja/Digital)</option>
                <option value="Infosys">Infosys</option>
                <option value="Amazon">Amazon</option>
                <option value="Wipro">Wipro</option>
                <option value="Accenture">Accenture</option>
              </select>
            </div>
            <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
              <label>Target Role</label>
              <select value={targetRole} onChange={e => setTargetRole(e.target.value)}>
                <option value="SDE">Software Engineer / SDE</option>
                <option value="DataAnalyst">Data Analyst</option>
                <option value="Frontend">Frontend Developer</option>
                <option value="Backend">Backend Developer</option>
              </select>
            </div>
          </div>

          <button className="primary-btn" onClick={generateQuestions} disabled={isGenerating}>
            {isGenerating ? <><Loader2 className="spinner" size={20} /> Generating AI Profile...</> : "Generate Mock Interview"}
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="glass-panel interview-panel">
          <div className="mb-3">
            <span className="badge">LIVE MOCK INTERVIEW</span>
            <h2 className="mt-4">Simulated Questions for {targetCompany}</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Answer the following questions generated based on your resume profile.</p>
          </div>
          
          <div className="questions-list">
            {questions.map((q, idx) => (
              <div key={idx} className="question-box">
                <h4><strong style={{ color: '#60a5fa' }}>Q{idx + 1}:</strong> {q}</h4>
                <textarea 
                  placeholder="Draft your answer here..."
                  value={answers[idx] || ''}
                  onChange={(e) => setAnswers({ ...answers, [idx]: e.target.value })}
                ></textarea>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-4">
            <button className="primary-btn" onClick={submitAnswers} disabled={isEvaluating}>
              Submit Answers & Get Evaluation <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="glass-panel text-center" style={{ padding: '60px 20px' }}>
          <Loader2 size={48} className="spinner mx-auto mb-3" color="#3b82f6" />
          <h2>AI is evaluating your responses...</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Comparing against top {targetCompany} expectations.</p>
        </div>
      )}

      {step === 5 && evaluation && (
        <div className="glass-panel results-panel">
          <div className="results-header pt-2 pb-4" style={{ textAlign: 'center', borderBottom: '1px solid var(--card-border)' }}>
            <h2>
              <CheckCircle color={evaluation.score > 70 ? "#10b981" : "#f59e0b"} size={32} style={{ display: 'inline', verticalAlign: 'middle' }} /> 
              Evaluation Complete
            </h2>
            <p>Score: <strong style={{ color: evaluation.score > 70 ? '#10b981' : '#f59e0b', fontSize: '1.2rem' }}>{evaluation.score}/100</strong></p>
          </div>

          <div className="feedback-section mt-4 mb-4">
            <h3>Detailed Feedback</h3>
            <div className="tip-card success mt-2">
              <strong>Strengths:</strong> {evaluation.strengths}
            </div>
            <div className="tip-card warning mt-2">
              <strong>Needs Improvement:</strong> {evaluation.improvements}
            </div>
          </div>

          <h3><Map size={24} style={{ display: 'inline', verticalAlign: 'middle' }} /> Personalized 7-Day Roadmap to Placement</h3>
          <div className="roadmap">
            {evaluation.roadmap && evaluation.roadmap.map((item, idx) => (
              <div key={idx} className="roadmap-step">
                <div className="step-num">{item.title}</div>
                <div className="step-content">
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-4 pt-4">
            <button className="secondary-btn" onClick={() => { setStep(1); setResumeFile(null); setAnswers({}); setError(null); }}>
              Take Another Mock Interview
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
