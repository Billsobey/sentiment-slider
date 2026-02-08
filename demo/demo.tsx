import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { SentimentSlider } from 'sentiment-slider/SentimentSlider';
import { SentimentSliderSpectacular } from 'sentiment-slider/SentimentSliderSpectacular';
import 'sentiment-slider/SentimentSlider.css';
import 'sentiment-slider/SentimentSliderSpectacular.css';
import './app.css';

function App() {
  const [demoMode, setDemoMode] = useState<'standard' | 'spectacular'>('standard');
  const [feedbackHistory, setFeedbackHistory] = useState<Array<{value: number; timestamp: Date}>>([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const questions = [
    "How was your experience today?",
    "How likely are you to recommend us?",
    "How satisfied are you with our service?",
  ];

  const handleConfirm = (value: number) => {
    setFeedbackHistory(prev => [...prev, { value, timestamp: new Date() }]);
    setShowSuccessMessage(true);
    
    setTimeout(() => {
      setShowSuccessMessage(false);
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        // Reset to first question after completing all
        setTimeout(() => {
          setCurrentQuestion(0);
          setFeedbackHistory([]);
        }, 2000);
      }
    }, 1500);
  };

  const handleReset = () => {
    setCurrentQuestion(0);
    setFeedbackHistory([]);
    setShowSuccessMessage(false);
  };

  const getSentimentLabel = (value: number): string => {
    if (value < 20) return "Very Negative 😠";
    if (value < 40) return "Negative 😟";
    if (value < 48) return "Slightly Negative 🙁";
    if (value > 80) return "Very Positive 😄";
    if (value > 60) return "Positive 😊";
    if (value > 52) return "Slightly Positive 🙂";
    return "Neutral 😐";
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">Sentiment Slider v2.0</h1>
          <p className="app-subtitle">iOS-inspired sentiment capture with modern React</p>
          <div className="header-badges">
            <span className="badge">TypeScript</span>
            <span className="badge">React 18+</span>
            <span className="badge">Touch Optimized</span>
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="demo-section">
          <div className="demo-controls-header">
            <h2>Interactive Demo</h2>
            <div className="mode-switcher">
              <button 
                className={`mode-btn ${demoMode === 'standard' ? 'active' : ''}`}
                onClick={() => setDemoMode('standard')}
              >
                Standard
              </button>
              <button 
                className={`mode-btn ${demoMode === 'spectacular' ? 'active' : ''}`}
                onClick={() => setDemoMode('spectacular')}
              >
                Spectacular
              </button>
            </div>
          </div>

          <div className="slider-demo-container">
            {showSuccessMessage && (
              <div className="success-overlay">
                <div className="success-message">
                  ✓ Thank you for your feedback!
                </div>
              </div>
            )}
            
            {demoMode === 'standard' ? (
              <SentimentSlider
                questionText={questions[currentQuestion]}
                nextButtonText={currentQuestion < questions.length - 1 ? "Next question" : "Complete survey"}
                onConfirm={handleConfirm}
                initialValue={50}
              />
            ) : (
              <SentimentSliderSpectacular
                questionText={questions[currentQuestion]}
                nextButtonText={currentQuestion < questions.length - 1 ? "Next question" : "Complete survey"}
                onConfirm={handleConfirm}
                initialValue={50}
              />
            )}
          </div>

          <div className="demo-controls">
            <button onClick={handleReset} className="reset-btn">
              Reset Demo
            </button>
            <span className="question-indicator">
              Question {currentQuestion + 1} of {questions.length}
            </span>
          </div>
        </div>

        <aside className="info-section">
          <div className="card">
            <h3>✨ Key Features</h3>
            <ul className="feature-list">
              <li>
                <strong>Dynamic Colors:</strong> Background shifts smoothly from red (negative) through yellow (neutral) to green (positive)
              </li>
              <li>
                <strong>Text Feedback:</strong> Real-time sentiment labels update as you slide
              </li>
              <li>
                <strong>Ripple Effects:</strong> Beautiful white ripple animations on release
              </li>
              <li>
                <strong>iOS-Inspired:</strong> Clean, minimal design with attention to micro-interactions
              </li>
              <li>
                <strong>Touch Optimized:</strong> Mobile-first with careful gesture handling
              </li>
              <li>
                <strong>Responsive:</strong> Adapts beautifully to all screen sizes
              </li>
            </ul>
          </div>

          {feedbackHistory.length > 0 && (
            <div className="card">
              <h3>📊 Feedback History</h3>
              <div className="history-list">
                {feedbackHistory.map((item, index) => (
                  <div key={index} className="history-item">
                    <span className="history-label">
                      {getSentimentLabel(item.value)}
                    </span>
                    <span className="history-value">
                      {item.value}/100
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="card code-card">
            <h3>💻 Quick Start</h3>
            <pre className="code-block"><code>{`npm install sentiment-slider

import { SentimentSlider } from 'sentiment-slider';
import 'sentiment-slider/dist/SentimentSlider.css';

function App() {
  const handleConfirm = (value) => {
    console.log('Sentiment:', value);
  };

  return (
    <SentimentSlider 
      questionText="How do you feel?"
      onConfirm={handleConfirm}
      initialValue={50}
    />
  );
}`}</code></pre>
          </div>
        </aside>
      </main>

      <footer className="app-footer">
        <p>
          <a href="https://github.com/Billsobey/sentiment-slider" target="_blank" rel="noopener noreferrer">
            View on GitHub
          </a>
          {' · '}
          <a href="https://www.npmjs.com/package/sentiment-slider" target="_blank" rel="noopener noreferrer">
            npm Package
          </a>
        </p>
        <p className="footer-copyright">MIT License © 2026 Bill Sobey</p>
      </footer>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
