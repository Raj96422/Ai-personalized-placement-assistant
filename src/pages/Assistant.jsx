import { useState } from 'react';
import { Upload, ChevronRight, CheckCircle, FileText, Loader2, Sparkles, Map } from 'lucide-react';
import './Assistant.css';

const mockQuestions = {
  SDE: [
    "Could you explain an instance where you had to optimize a complex algorithm?",
    "How does Garbage Collection work in Java, and how does it relate to your project on xyz?",
    "Explain the concept of an interface vs an abstract class, and when you would use either."
  ],
  DataAnalyst: [
    "Can you walk me through your process of handling missing data in a large dataset?",
    "Write a SQL query to find the second highest salary from an Employee table.",
    "How did you leverage Python to extract insights in your recent internship project?"
  ]
};

export default function Assistant() {
  const [step, setStep] = useState(1);
  const [resumeName, setResumeName] = useState('');
  const [targetCompany, setTargetCompany] = useState('TCS');
  const [targetRole, setTargetRole] = useState('SDE');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});

  const [isEvaluating, setIsEvaluating] = useState(false);

  // Step 1 Flow
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setResumeName(e.target.files[0].name);
    }
  };

  const generateQuestions = () => {
    if (!resumeName) {
      alert("Please upload your resume first!");
      return;
    }
    setStep(2);
    setIsGenerating(true);
    
    // Simulate AI generation time
    setTimeout(() => {
      setQuestions(mockQuestions[targetRole] || mockQuestions.SDE);
      setIsGenerating(false);
      setStep(3);
    }, 2500);
  };

  // Step 3 Flow
  const submitAnswers = () => {
    setStep(4);
    setIsEvaluating(true);

    // Simulate Evaluation time
    setTimeout(() => {
      setIsEvaluating(false);
      setStep(5);
    }, 3000);
  };

  return (
    <div className="assistant-container animate-fade-in">
      <div className="progress-bar">
        <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>Setup</div>
        <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>Interview</div>
        <div className={`progress-step ${step >= 5 ? 'active' : ''}`}>Roadmap</div>
      </div>

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
              <p>{resumeName ? resumeName : "Click or drag resume here"}</p>
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
              </select>
            </div>
            <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
              <label>Target Role</label>
              <select value={targetRole} onChange={e => setTargetRole(e.target.value)}>
                <option value="SDE">Software Engineer / SDE</option>
                <option value="DataAnalyst">Data Analyst</option>
              </select>
            </div>
          </div>

          <button className="primary-btn" onClick={generateQuestions} disabled={isGenerating}>
            {isGenerating ? <><Loader2 className="spinner" size={20} /> AI Analyzing Resume...</> : "Generate Mock Interview"}
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
            <button className="primary-btn" onClick={submitAnswers}>
              Submit Answers & Get Evaluation <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="glass-panel text-center" style={{ padding: '60px 20px' }}>
          <Loader2 size={48} className="spinner mx-auto mb-3" color="#3b82f6" />
          <h2>AI is evaluating your responses...</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Comparing against top {targetCompany} standards.</p>
        </div>
      )}

      {step === 5 && (
        <div className="glass-panel results-panel">
          <div className="results-header pt-2 pb-4" style={{ textAlign: 'center', borderBottom: '1px solid var(--card-border)' }}>
            <h2><CheckCircle color="#10b981" size={32} style={{ display: 'inline', verticalAlign: 'middle' }} /> Evaluation Complete</h2>
            <p>Score: <strong style={{ color: '#10b981', fontSize: '1.2rem' }}>72/100</strong> — Good fit conceptually, but practical articulation needs work for {targetCompany}.</p>
          </div>

          <div className="feedback-section mt-4 mb-4">
            <h3>Detailed Feedback</h3>
            <div className="tip-card warning mt-2">
              <strong>Needs Improvement:</strong> Your explanation of optimization algorithms was vague. Try using the STAR method.
            </div>
            <div className="tip-card success mt-2">
              <strong>Strengths:</strong> Good grasp of Java fundamentals and real-world applicability in your project section.
            </div>
          </div>

          <h3><Map size={24} style={{ display: 'inline', verticalAlign: 'middle' }} /> Personalized 7-Day Roadmap to Placement</h3>
          <div className="roadmap">
            <div className="roadmap-step">
              <div className="step-num">Day 1-2</div>
              <div className="step-content">
                <h4>Algorithm Articulation</h4>
                <p>Focus on verbally explaining Time & Space complexities using the STAR framework.</p>
              </div>
            </div>
            <div className="roadmap-step">
              <div className="step-num">Day 3-5</div>
              <div className="step-content">
                <h4>{targetCompany} Core CS Concepts</h4>
                <p>Revise DBMS and OOPS in depth. Check out 'Top 50 Core CS Questions for {targetCompany}'.</p>
              </div>
            </div>
            <div className="roadmap-step">
              <div className="step-num">Day 6-7</div>
              <div className="step-content">
                <h4>HR & Behavioral Mock</h4>
                <p>Prepare standard HR questions ("Why {targetCompany}", "Challenge you faced").</p>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-4 pt-4">
            <button className="secondary-btn" onClick={() => { setStep(1); setResumeName(''); setAnswers({}); }}>
              Take Another Mock Interview
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
