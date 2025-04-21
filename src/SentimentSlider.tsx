import React, { useEffect, useRef, useState } from 'react';
import './SentimentSlider.css';

/**
 * SentimentSlider Props Interface
 */
export interface SentimentSliderProps {
  /**
   * Initial value for the slider (0-100)
   * Default: 50 (neutral position)
   */
  initialValue?: number;
  
  /**
   * Callback function triggered when user confirms their selection
   */
  onConfirm: (value: number) => void;
  
  /**
   * Optional custom question text
   * Default: "How do you feel?"
   */
  questionText?: string;
  
  /**
   * Optional custom next button text
   * Default: "Next question"
   */
  nextButtonText?: string;
  
  /**
   * Optional class name for additional styling
   */
  className?: string;
}

/**
 * SentimentSlider Component
 * 
 * A touch-friendly sentiment slider with dynamic colors and animations.
 * Version 2.0 - Text-based feedback (no emojis)
 */
export function SentimentSlider({
  initialValue = 50,
  onConfirm,
  questionText = "How do you feel?",
  nextButtonText = "Next question",
  className = ""
}: SentimentSliderProps) {
  const [sliderValue, setSliderValue] = useState(initialValue);
  const [isSliding, setIsSliding] = useState(false);
  const [showRipple, setShowRipple] = useState(false);
  const [ripplePosition, setRipplePosition] = useState(50);
  const [showConfirmButton, setShowConfirmButton] = useState(false);
  const sliderRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Get feedback text based on slider value
  const getSentimentText = (value: number): string => {
    if (value < 20) return "Negative";
    if (value < 40) return "Somewhat Negative";
    if (value < 48) return "Slightly Negative";
    if (value > 80) return "Positive";
    if (value > 60) return "Somewhat Positive";
    if (value > 52) return "Slightly Positive";
    return "Neutral";
  };

  // Get background color based on slider value
  const getBackgroundColor = (value: number): string => {
    // For negative sentiments (0-49)
    if (value < 50) {
      // Calculate how negative: 0 = most negative, 49 = barely negative
      const negativeStrength = 1 - (value / 50); // 1 = full negative, 0 = barely negative
      
      // Negative sentiment colors (red to orange)
      const r = 255;
      const g = Math.round(50 + (negativeStrength < 0.5 ? 150 * (1 - negativeStrength * 2) : 0));
      const b = 0;
      
      return `rgb(${r}, ${g}, ${b})`;
    }
    // Exact center point is yellow/gold
    else if (value === 50) {
      return `rgb(255, 215, 0)`;
    }
    // For positive sentiments (51-100)
    else {
      // Calculate how positive: 51 = barely positive, 100 = most positive
      const positiveStrength = (value - 50) / 50; // 0 = barely positive, 1 = full positive
      
      // Positive sentiment colors (yellow-green to rich green)
      const r = Math.round(120 + (130 * (1 - positiveStrength)));
      const g = 220;
      const b = Math.round(positiveStrength > 0.7 ? (positiveStrength - 0.7) * 80 : 0);
      
      return `rgb(${r}, ${g}, ${b})`;
    }
  };

  // Prevent scrolling while using slider
  useEffect(() => {
    const preventTouchScroll = (e: TouchEvent) => {
      if (isSliding) {
        e.preventDefault();
      }
    };

    const preventWheelScroll = (e: WheelEvent) => {
      if (isSliding) {
        e.preventDefault();
      }
    };

    const preventElasticScroll = (e: TouchEvent) => {
      if (isSliding && e.touches[0] && 
          (e.touches[0].clientY < 10 || 
           e.touches[0].clientY > window.innerHeight - 10)) {
        e.preventDefault();
      }
    };

    document.addEventListener('touchmove', preventTouchScroll, { passive: false });
    document.addEventListener('wheel', preventWheelScroll, { passive: false });
    document.addEventListener('touchstart', preventElasticScroll, { passive: false });

    // Use no-scroll class to prevent scrolling
    if (isSliding) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }

    return () => {
      document.removeEventListener('touchmove', preventTouchScroll);
      document.removeEventListener('wheel', preventWheelScroll);
      document.removeEventListener('touchstart', preventElasticScroll);
      document.body.classList.remove('no-scroll');
    };
  }, [isSliding]);

  // Handle slider change
  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(event.target.value, 10);
    setSliderValue(newValue);
  };

  // Handle slide start
  const handleSlideStart = () => {
    setIsSliding(true);
    setShowRipple(false);
    setShowConfirmButton(false);
  };

  // Handle slide end
  const handleSlideEnd = () => {
    setIsSliding(false);
    setRipplePosition(sliderValue);
    setShowRipple(true);
    
    // Show confirmation button after interaction
    setTimeout(() => {
      setShowConfirmButton(true);
    }, 500);
    
    // Reset ripple after animation
    setTimeout(() => {
      setShowRipple(false);
    }, 600);
  };

  // Handle confirmation
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm(sliderValue);
    }
  };

  const backgroundColor = getBackgroundColor(sliderValue);
  const sentimentText = getSentimentText(sliderValue);

  return (
    <div 
      className={`sentiment-slider-container ${className}`} 
      style={{ backgroundColor }}
      ref={containerRef}
    >
      <div className="sentiment-content">
        <h2 className="sentiment-question">{questionText}</h2>
        
        <div className="slider-container">
          <div className="sentiment-text">{sentimentText}</div>
          
          <div className="slider-wrapper">
            <input
              ref={sliderRef}
              type="range"
              min="0"
              max="100"
              value={sliderValue}
              onChange={handleSliderChange}
              onMouseDown={handleSlideStart}
              onTouchStart={handleSlideStart}
              onMouseUp={handleSlideEnd}
              onTouchEnd={handleSlideEnd}
              className="sentiment-slider"
            />
            
            {showRipple && (
              <div 
                className="ripple" 
                style={{ left: `${ripplePosition}%` }}
              ></div>
            )}
          </div>
          
          <div className="sentiment-labels">
            <span className="sentiment-label-negative">Negative</span>
            <span className="sentiment-label-positive">Positive</span>
          </div>
          
          <div className="sentiment-instruction">
            Slide to indicate your sentiment
          </div>
        </div>
        
        <button 
          onClick={handleConfirm}
          className={`confirm-button ${showConfirmButton ? 'visible' : ''}`}
        >
          {nextButtonText}
        </button>
      </div>
    </div>
  );
}

export default SentimentSlider;