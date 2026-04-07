import React, { useEffect, useRef, useState, useCallback } from 'react';
import './SentimentSlider.css';
import { getSentimentText, getBackgroundColor } from './sentimentUtils';

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
  const isSlidingRef = useRef(false);
  const [showRipple, setShowRipple] = useState(false);
  const [ripplePosition, setRipplePosition] = useState(50);
  const [showConfirmButton, setShowConfirmButton] = useState(false);
  const sliderRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Update slider value if initialValue prop changes
  useEffect(() => {
    setSliderValue(initialValue);
  }, [initialValue]);

  const preventTouchScroll = useCallback((e: TouchEvent) => {
    if (isSlidingRef.current) {
      e.preventDefault();
    }
  }, []);

  const preventWheelScroll = useCallback((e: WheelEvent) => {
    if (isSlidingRef.current) {
      e.preventDefault();
    }
  }, []);

  const preventElasticScroll = useCallback((e: TouchEvent) => {
    if (isSlidingRef.current && e.touches[0] &&
        (e.touches[0].clientY < 10 ||
         e.touches[0].clientY > window.innerHeight - 10)) {
      e.preventDefault();
    }
  }, []);

  // Prevent scrolling while using slider
  useEffect(() => {
    document.addEventListener('touchmove', preventTouchScroll, { passive: false });
    document.addEventListener('wheel', preventWheelScroll, { passive: false });
    document.addEventListener('touchstart', preventElasticScroll, { passive: false });

    return () => {
      document.removeEventListener('touchmove', preventTouchScroll);
      document.removeEventListener('wheel', preventWheelScroll);
      document.removeEventListener('touchstart', preventElasticScroll);
    };
  }, [preventTouchScroll, preventWheelScroll, preventElasticScroll]);

  useEffect(() => {
    // Use no-scroll class to prevent scrolling
    if (isSliding) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }

    return () => {
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
    isSlidingRef.current = true;
    setShowRipple(false);
    setShowConfirmButton(false);
  };

  // Handle slide end
  const handleSlideEnd = () => {
    setIsSliding(false);
    isSlidingRef.current = false;
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