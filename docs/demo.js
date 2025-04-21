// React component implementation of the Sentiment Slider for the demo
const { useState, useEffect, useRef } = React;
const { motion, AnimatePresence } = window.Motion;

const SentimentSlider = () => {
  const [sliderValue, setSliderValue] = useState(50);
  const [isSliding, setIsSliding] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [ripples, setRipples] = useState([]);
  const [nextButtonVisible, setNextButtonVisible] = useState(false);
  const sliderRef = useRef(null);
  const containerRef = useRef(null);
  
  const sentimentColors = [
    { threshold: 0, color: '#e53935' },   // Very negative - red
    { threshold: 25, color: '#fb8c00' },  // Somewhat negative - orange
    { threshold: 45, color: '#fdd835' },  // Slightly negative - yellow
    { threshold: 55, color: '#c0ca33' },  // Slightly positive - light green
    { threshold: 75, color: '#43a047' },  // Somewhat positive - green
    { threshold: 100, color: '#2e7d32' }, // Very positive - dark green
  ];
  
  const feedbackMessages = [
    { threshold: 0, text: 'Very Negative', emoji: '😠' },
    { threshold: 20, text: 'Negative', emoji: '😟' },
    { threshold: 40, text: 'Slightly Negative', emoji: '🙁' },
    { threshold: 48, text: 'Neutral', emoji: '😐' },
    { threshold: 60, text: 'Slightly Positive', emoji: '🙂' },
    { threshold: 80, text: 'Positive', emoji: '😊' },
    { threshold: 95, text: 'Very Positive', emoji: '😄' },
  ];

  // Function to calculate background color based on slider value
  const getBackgroundColor = (value) => {
    // Find the relevant color ranges
    let lowerColor;
    let upperColor;
    
    for (let i = 0; i < sentimentColors.length - 1; i++) {
      if (value >= sentimentColors[i].threshold && value < sentimentColors[i + 1].threshold) {
        lowerColor = sentimentColors[i];
        upperColor = sentimentColors[i + 1];
        break;
      }
    }
    
    if (!lowerColor) {
      return sentimentColors[sentimentColors.length - 1].color;
    }
    
    // Calculate how far between the two thresholds the value is (0 to 1)
    const range = upperColor.threshold - lowerColor.threshold;
    const valueInRange = value - lowerColor.threshold;
    const percentage = valueInRange / range;
    
    // Interpolate the color
    return interpolateColor(lowerColor.color, upperColor.color, percentage);
  };
  
  // Function to interpolate between two colors
  const interpolateColor = (color1, color2, factor) => {
    const result = color1.replace(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i, (m, r, g, b) => {
      const hex = (c1, c2) => {
        const hex = Math.round(parseInt(c1, 16) * (1 - factor) + parseInt(c2, 16) * factor).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      };
      
      const r2 = color2.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i)[1];
      const g2 = color2.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i)[2];
      const b2 = color2.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i)[3];
      
      return '#' + hex(r, r2) + hex(g, g2) + hex(b, b2);
    });
    
    return result;
  };
  
  // Get feedback message based on slider value
  const getFeedbackMessage = (value) => {
    for (let i = feedbackMessages.length - 1; i >= 0; i--) {
      if (value >= feedbackMessages[i].threshold) {
        return feedbackMessages[i];
      }
    }
    return feedbackMessages[0];
  };
  
  // Handle slider change
  const handleSliderChange = (e) => {
    const newValue = parseInt(e.target.value, 10);
    setSliderValue(newValue);
  };
  
  // Handle slide start
  const handleSlideStart = () => {
    setIsSliding(true);
    setShowConfirmation(false);
    setNextButtonVisible(false);
  };
  
  // Handle slide end
  const handleSlideEnd = () => {
    if (isSliding) {
      setIsSliding(false);
      setShowConfirmation(true);
      
      // Create ripple effect
      const rippleId = Date.now();
      setRipples(prev => [...prev, { id: rippleId, x: '50%', y: '50%' }]);
      
      // Show the "next question" button after a delay
      setTimeout(() => {
        setNextButtonVisible(true);
      }, 800);
      
      // Clean up ripples after animation
      setTimeout(() => {
        setRipples(prev => prev.filter(ripple => ripple.id !== rippleId));
      }, 1000);
    }
  };
  
  // Handle confirmation
  const handleConfirm = () => {
    alert(`Sentiment value confirmed: ${sliderValue}`);
    
    // Reset the demo
    setSliderValue(50);
    setNextButtonVisible(false);
    setShowConfirmation(false);
  };
  
  // Handle reset demo button
  const handleResetDemo = () => {
    setSliderValue(50);
    setIsSliding(false);
    setShowConfirmation(false);
    setNextButtonVisible(false);
    setRipples([]);
  };
  
  // Add event listener for the reset button
  useEffect(() => {
    const resetButton = document.getElementById('reset-demo');
    resetButton.addEventListener('click', handleResetDemo);
    
    return () => {
      resetButton.removeEventListener('click', handleResetDemo);
    };
  }, []);
  
  // Get current feedback message
  const feedback = getFeedbackMessage(sliderValue);
  
  // Get current background color
  const backgroundColor = getBackgroundColor(sliderValue);
  
  return (
    <div 
      className="sentiment-slider-container"
      style={{ backgroundColor }}
      ref={containerRef}
    >
      <h2 className="sentiment-title">How do you feel?</h2>
      
      <div className="sentiment-feedback">
        {feedback.emoji} {feedback.text}
      </div>
      
      <div className="sentiment-slider-track" ref={sliderRef}>
        <input
          type="range"
          min="0"
          max="100"
          value={sliderValue}
          onChange={handleSliderChange}
          onMouseDown={handleSlideStart}
          onMouseUp={handleSlideEnd}
          onMouseLeave={handleSlideEnd}
          onTouchStart={handleSlideStart}
          onTouchEnd={handleSlideEnd}
          style={{ 
            width: '100%', 
            position: 'absolute',
            opacity: 0,
            height: '30px',
            top: '-10px',
            cursor: 'pointer',
            zIndex: 10
          }}
        />
        <div 
          className="sentiment-slider-handle"
          style={{ left: `${sliderValue}%` }}
        ></div>
      </div>
      
      <div className="sentiment-scale-labels">
        <span className="sentiment-scale-label">Negative</span>
        <span className="sentiment-scale-label">Positive</span>
      </div>
      
      <div 
        className="sentiment-instructions"
        style={{ opacity: isSliding ? 0 : 1 }}
      >
        {isSliding ? 'Release to submit' : 'Slide to indicate your sentiment'}
      </div>
      
      <button 
        className={`sentiment-next-button ${nextButtonVisible ? 'visible' : ''}`}
        onClick={handleConfirm}
      >
        next question
      </button>
      
      <div className="ripple-container">
        {ripples.map(ripple => (
          <div 
            key={ripple.id}
            className="ripple"
            style={{ 
              left: ripple.x,
              top: ripple.y,
              width: '300px',
              height: '300px',
              borderWidth: '6px',
              borderStyle: 'solid',
              borderColor: 'white'
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

// Render the demo component
ReactDOM.render(
  <SentimentSlider />,
  document.getElementById('slider-container')
);