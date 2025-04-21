import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
 */
export function SentimentSlider({
  initialValue = 50,
  onConfirm,
  questionText = "How do you feel?",
  nextButtonText = "Next question",
  className = ""
}: SentimentSliderProps) {
  // Slider state
  const [value, setValue] = useState<number>(initialValue);
  const [isSliding, setIsSliding] = useState<boolean>(false);
  const [isPulsing, setIsPulsing] = useState<boolean>(false);
  const [showNextButton, setShowNextButton] = useState<boolean>(false);
  const [ripples, setRipples] = useState<Array<{ id: number; left: number }>>([]);
  
  // Refs
  const sliderRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      // Remove any event listeners if needed
    };
  }, []);

  // Handle Next button click
  const handleConfirm = () => {
    // Call the provided onConfirm with the current value
    onConfirm(value);
    console.log('Moving to next question...');
  };

  // Start sliding handler
  const onSlideStart = () => {
    setIsSliding(true);
  };

  // Mouse position handler
  const handleSliderClick = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const percentage = Math.min(100, Math.max(0, (offsetX / rect.width) * 100));
    
    setValue(percentage);
  };

  // Touch position handler
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!sliderRef.current || !e.touches[0]) return;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const offsetX = e.touches[0].clientX - rect.left;
    const percentage = Math.min(100, Math.max(0, (offsetX / rect.width) * 100));
    
    setValue(percentage);
  };

  // Slide complete handler
  const handleSlideComplete = (e: React.MouseEvent | React.TouchEvent) => {
    if (isSliding) {
      e.preventDefault();
      setIsSliding(false);
      triggerPulse();
      
      // Show the next button after a delay
      setTimeout(() => {
        setShowNextButton(true);
      }, 1000);
    }
  };

  // Trigger ripple effect
  const triggerPulse = () => {
    setIsPulsing(true);
    
    // Add a new ripple effect at the current position
    if (sliderRef.current) {
      const rect = sliderRef.current.getBoundingClientRect();
      const left = (value / 100) * rect.width;
      
      setRipples(prev => [...prev, { id: Date.now(), left }]);
    }
    
    // Reset the pulse after animation completes
    setTimeout(() => {
      setIsPulsing(false);
    }, 2000);
  };

  // Get sentiment text based on current value
  const getSentimentIndicator = () => {
    if (value < 25) return 'Very Negative';
    if (value < 45) return 'Somewhat Negative';
    if (value > 75) return 'Very Positive';
    if (value > 55) return 'Somewhat Positive';
    return 'Neutral';
  };

  // Create background gradient function that returns smooth transitions
  const getBgGradient = (value: number) => {
    // Exact center point is parchment/off-white
    if (value === 50) {
      return `linear-gradient(135deg, #f5f5dc, #f5f5e2, #f8f8e8)`;
    }
    
    // For negative sentiments (0-49)
    if (value < 50) {
      // Calculate how negative: 0 = most negative, 49 = barely negative
      const negativeStrength = 1 - (value / 50); // 1 = full negative, 0 = barely negative
      
      // Negative sentiment colors (red to orange)
      const r = 255;
      const g = Math.round(50 + (negativeStrength < 0.5 ? 150 * (1 - negativeStrength * 2) : 0));
      const b = 0;
      
      // Create gradient with slight transparency variations for depth
      return `linear-gradient(135deg, 
        rgba(${r}, ${g}, ${b}, 0.7), 
        rgba(${r}, ${Math.min(255, g + 20)}, ${b}, 0.85), 
        rgba(${r}, ${Math.max(0, g - 15)}, ${b}, 0.75))`;
    }
    
    // For positive sentiments (51-100)
    else {
      // Calculate how positive: 51 = barely positive, 100 = most positive
      const positiveStrength = (value - 50) / 50; // 0 = barely positive, 1 = full positive
      
      // Positive sentiment colors (yellow-green to rich green)
      const r = Math.round(120 + (130 * (1 - positiveStrength)));
      const g = 220;
      const b = Math.round(positiveStrength > 0.7 ? (positiveStrength - 0.7) * 80 : 0); // Add a hint of blue for rich greens
      
      // Create gradient with slight transparency variations for depth
      return `linear-gradient(135deg, 
        rgba(${r}, ${g}, ${b}, 0.7), 
        rgba(${Math.max(0, r - 20)}, ${Math.min(255, g + 20)}, ${b}, 0.85), 
        rgba(${Math.max(0, r - 30)}, ${g}, ${Math.min(255, b + 10)}, 0.75))`;
    }
  };
  
  // Get color for the current slider value
  const bgColor = getBgGradient(value);
  
  // Get continuous gradient color for ripples and effects
  const getContinuousGradientColor = (value: number) => {
    // Red to green gradient with yellow in the middle
    if (value <= 50) {
      // Red (255,0,0) to Yellow (255,255,0)
      const green = Math.round((value / 50) * 255);
      return `rgb(255, ${green}, 0)`;
    } else {
      // Yellow (255,255,0) to Green (0,255,0)
      const red = Math.round(255 - ((value - 50) / 50) * 255);
      return `rgb(${red}, 255, 0)`;
    }
  };
  
  return (
    <div 
      className={`min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden touch-none ${className}`}
      style={{ 
        background: bgColor,
        transition: 'background 0.25s ease-in-out', // Smoother, slower transition for color blending
        WebkitOverflowScrolling: 'touch', // iOS smooth scrolling
        WebkitTouchCallout: 'none', // Disable callout
        WebkitUserSelect: 'none', // Disable selection
        userSelect: 'none'
      }}
      ref={containerRef}
    >
      {/* Dramatic ripple effect that fills the screen when slider is released */}
      <AnimatePresence>
        {isPulsing && (
          <>
            {/* First ripple - expands to fill screen */}
            <motion.div
              className="absolute z-20 pointer-events-none rounded-full"
              initial={{ 
                opacity: 0.6,
                width: "100px",
                height: "100px",
                top: "50%",
                left: "50%",
                x: "-50%",
                y: "-50%",
                borderWidth: "8px",
                borderColor: "rgba(255, 255, 255, 0.8)",
                backgroundColor: "rgba(255, 255, 255, 0.05)",
              }}
              animate={{ 
                opacity: [0.6, 0.3, 0],
                width: ["100px", "150vw", "200vw"], // Much larger to ensure it fills the screen
                height: ["100px", "150vw", "200vw"], // Using vw ensures it's relative to screen width
                borderWidth: ["6px", "3px", "1px"],
              }}
              transition={{ 
                duration: 2,
                times: [0, 0.6, 1],
                ease: "easeOut"
              }}
              style={{
                position: "absolute",
                borderStyle: "solid",
                boxShadow: `0 0 40px 12px rgba(255, 255, 255, 0.3)`
              }}
            />
            
            {/* Second ripple - faster but still large */}
            <motion.div
              className="absolute z-20 pointer-events-none rounded-full"
              initial={{ 
                opacity: 0.8,
                width: "80px",
                height: "80px",
                top: "50%",
                left: "50%",
                x: "-50%",
                y: "-50%",
                borderWidth: "7px",
                borderColor: "rgba(255, 255, 255, 0.85)",
                backgroundColor: "rgba(255, 255, 255, 0.03)",
              }}
              animate={{ 
                opacity: [0.8, 0.4, 0],
                width: ["80px", "100vw", "130vw"],
                height: ["80px", "100vw", "130vw"],
                borderWidth: ["5px", "3px", "1px"],
              }}
              transition={{ 
                duration: 1.5,
                times: [0, 0.5, 1],
                ease: "easeOut"
              }}
              style={{
                position: "absolute",
                borderStyle: "solid",
                boxShadow: `0 0 30px 8px rgba(255, 255, 255, 0.35)`
              }}
            />
            
            {/* Third ripple - fastest but smallest for layered effect */}
            <motion.div
              className="absolute z-20 pointer-events-none rounded-full"
              initial={{ 
                opacity: 0.9,
                width: "60px",
                height: "60px",
                top: "50%",
                left: "50%",
                x: "-50%",
                y: "-50%",
                borderWidth: "6px",
                borderColor: "rgba(255, 255, 255, 0.9)",
                backgroundColor: "rgba(255, 255, 255, 0.07)",
              }}
              animate={{ 
                opacity: [0.9, 0.6, 0],
                width: ["60px", "70vw", "90vw"],
                height: ["60px", "70vw", "90vw"],
                borderWidth: ["4px", "2px", "1px"],
              }}
              transition={{ 
                duration: 1.2,
                times: [0, 0.5, 1],
                ease: "easeOut"
              }}
              style={{
                position: "absolute",
                borderStyle: "solid",
                boxShadow: `0 0 20px 6px rgba(255, 255, 255, 0.4)`
              }}
            />
          </>
        )}
      </AnimatePresence>
      
      {/* Header with Sentiment Title */}
      <div className="relative z-10 text-center mb-10 w-full">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex justify-between items-center"
        >
          <div className="w-8"></div> {/* Placeholder for balance */}
          <h1 className="text-black text-xl font-medium">
            {questionText}
          </h1>
          <div className="w-8"></div> {/* Placeholder for balance */}
        </motion.div>
      </div>
      
      {/* Feedback Text Display - Shows the current sentiment without numbers */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-black text-4xl font-light mb-8"
      >
        {getSentimentIndicator()}
      </motion.div>
      
      {/* Horizontal Slider Container - Apple Inspired Design */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="w-full max-w-md z-10 relative touch-none h-[110px]"
      >
        {/* Sentiment Labels */}
        <div className="flex justify-between mb-2 px-1">
          <span className="text-black/80 text-xs uppercase tracking-wide">Negative</span>
          <span className="text-black/80 text-xs uppercase tracking-wide">Positive</span>
        </div>
        
        {/* Apple-Style Pill Slider - Horizontal */}
        <div className="relative mb-0">
          {/* Slider Pill Container */}
          <div 
            className="relative bg-white/20 backdrop-blur-md rounded-full h-[60px] w-full mx-auto overflow-hidden"
            ref={sliderRef}
          >
            {/* Indicator Knob */}
            <div 
              className="absolute h-[52px] w-[52px] rounded-full bg-white shadow-md top-1/2 -translate-y-1/2 transition-transform"
              style={{ 
                left: `calc(${value}% - 26px)`,
                transition: 'left 0.1s ease'
              }}
            ></div>
            
            {/* Filled Track */}
            <div 
              className="absolute top-0 bottom-0 left-0 rounded-l-full bg-white/30"
              style={{ 
                width: `${value}%`,
                transition: 'width 0.1s ease'
              }}
            ></div>
          </div>
          
          {/* Make the whole container clickable with scroll prevention */}
          <div 
            className="absolute inset-0 cursor-pointer touch-none"
            style={{
              WebkitTouchCallout: 'none',
              WebkitUserSelect: 'none',
              userSelect: 'none',
              WebkitTapHighlightColor: 'rgba(0,0,0,0)'
            }}
            onMouseDown={(e) => {
              e.preventDefault(); // Prevent scrolling
              onSlideStart();
              handleSliderClick(e);
            }}
            onTouchStart={(e) => {
              e.preventDefault(); // Prevent scrolling
              e.stopPropagation(); // Stop event bubbling
              onSlideStart();
              handleTouchMove(e);
            }}
            onMouseMove={(e) => {
              if (isSliding) {
                e.preventDefault(); // Prevent scrolling
                handleSliderClick(e);
              }
            }}
            onTouchMove={(e) => {
              if (isSliding) {
                e.preventDefault(); // Prevent scrolling
                e.stopPropagation(); // Stop event bubbling
                handleTouchMove(e);
              }
            }}
            onMouseUp={handleSlideComplete}
            onTouchEnd={handleSlideComplete}
            onMouseLeave={(e) => {
              if (isSliding) {
                handleSlideComplete(e);
              }
            }}
          ></div>
        </div>
      </motion.div>
      
      {/* Fixed-height container for Next Question Button to prevent layout shift */}
      <div className="h-24 relative mt-8 w-full flex justify-center"> {/* Use flexbox for perfect centering */}
        <AnimatePresence>
          {showNextButton && (
            <motion.button
              className="bg-white/90 text-black font-medium py-3 rounded-full shadow-md hover:bg-white transition-colors z-30 absolute flex items-center justify-center w-[160px]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              onClick={() => handleConfirm()}
            >
              {nextButtonText}
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      
      {/* Bottom Instructions Note */}
      <motion.div 
        className="absolute bottom-10 text-center w-full z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: showNextButton ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      >
        <p className="text-black/80 text-sm font-medium">
          {isSliding ? "Release to submit" : "Slide to share your feelings"}
        </p>
      </motion.div>
      
      {/* Subtle ripple effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-5">
        {ripples.map(ripple => (
          <motion.div
            key={ripple.id}
            className="absolute rounded-full"
            style={{ 
              left: `${ripple.left}px`,
              top: '50%',
              translateX: '-50%',
              translateY: '-50%',
              background: `radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 70%)`
            }}
            initial={{ width: 0, height: 0, opacity: 0.3 }}
            animate={{ width: 200, height: 200, opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        ))}
      </div>
    </div>
  );
}