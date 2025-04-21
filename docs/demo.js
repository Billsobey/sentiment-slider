// Sentiment Slider Demo JavaScript
document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const demoContainer = document.querySelector('.demo-slider-container');
  const sliderHandle = document.getElementById('slider-handle');
  const sliderFill = document.getElementById('slider-fill');
  const sliderTrack = document.querySelector('.slider-track');
  const sentimentValue = document.getElementById('sentiment-value');
  const nextButton = document.getElementById('next-button');
  const resetButton = document.getElementById('reset-demo');
  
  // State
  let isDragging = false;
  let currentValue = 50; // Default to center position
  let hasInteracted = false;
  
  // Sentiment text labels based on value
  const getSentimentText = (value) => {
    if (value < 20) return "Negative";
    if (value < 40) return "Somewhat Negative";
    if (value < 48) return "Slightly Negative";
    if (value > 80) return "Positive";
    if (value > 60) return "Somewhat Positive";
    if (value > 52) return "Slightly Positive";
    return "Neutral";
  };
  
  // Get background color based on slider value
  const getBackgroundColor = (value) => {
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
  
  // Update the UI based on current value
  const updateUI = (value) => {
    // Update handle position
    const position = `${value}%`;
    sliderHandle.style.left = position;
    
    // Update fill width
    sliderFill.style.width = position;
    
    // Update text
    sentimentValue.textContent = getSentimentText(value);
    
    // Update background color
    demoContainer.style.backgroundColor = getBackgroundColor(value);
  };
  
  // Create ripple effect
  const createRipple = (x) => {
    const ripple = document.createElement('div');
    ripple.classList.add('ripple');
    ripple.style.left = `${x}px`;
    ripple.style.top = '4px'; // Center vertically on the track
    
    sliderTrack.appendChild(ripple);
    
    // Remove after animation completes
    setTimeout(() => {
      ripple.remove();
    }, 800);
  };
  
  // Handle starting to drag
  const startDrag = (e) => {
    isDragging = true;
    document.body.classList.add('no-scroll');
    
    // Hide next button during interaction
    nextButton.classList.remove('visible');
    
    // Update on initial click/touch
    updatePosition(e);
  };
  
  // Handle movement during drag
  const dragMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    updatePosition(e);
  };
  
  // Handle end of drag
  const endDrag = (e) => {
    if (!isDragging) return;
    
    isDragging = false;
    document.body.classList.remove('no-scroll');
    
    // Final position update
    updatePosition(e);
    
    // Create ripple effect at current handle position
    const trackRect = sliderTrack.getBoundingClientRect();
    const rippleX = trackRect.left + (trackRect.width * currentValue / 100);
    createRipple(rippleX - trackRect.left);
    
    // Show next button
    if (!hasInteracted) {
      hasInteracted = true;
      setTimeout(() => {
        nextButton.classList.add('visible');
      }, 500);
    } else {
      nextButton.classList.add('visible');
    }
  };
  
  // Calculate and update position based on mouse/touch
  const updatePosition = (e) => {
    const trackRect = sliderTrack.getBoundingClientRect();
    
    // Get X position (handle both mouse and touch)
    let clientX;
    if (e.type.includes('touch')) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = e.clientX;
    }
    
    // Calculate position as percentage
    let percentage = ((clientX - trackRect.left) / trackRect.width) * 100;
    percentage = Math.max(0, Math.min(100, percentage)); // Clamp between 0-100
    
    currentValue = Math.round(percentage);
    updateUI(currentValue);
  };
  
  // Reset the demo
  const resetDemo = () => {
    currentValue = 50;
    hasInteracted = false;
    nextButton.classList.remove('visible');
    updateUI(currentValue);
  };
  
  // Next button click handler
  nextButton.addEventListener('click', () => {
    alert(`Selected sentiment: ${getSentimentText(currentValue)} (${currentValue}/100)`);
    resetDemo();
  });
  
  // Reset button
  resetButton.addEventListener('click', resetDemo);
  
  // Mouse Events
  sliderTrack.addEventListener('mousedown', startDrag);
  document.addEventListener('mousemove', dragMove);
  document.addEventListener('mouseup', endDrag);
  
  // Touch Events
  sliderTrack.addEventListener('touchstart', startDrag, { passive: false });
  document.addEventListener('touchmove', dragMove, { passive: false });
  document.addEventListener('touchend', endDrag);
  
  // Handle clicks directly on track
  sliderTrack.addEventListener('click', (e) => {
    updatePosition(e);
    
    // Create ripple effect
    const trackRect = sliderTrack.getBoundingClientRect();
    createRipple(e.clientX - trackRect.left);
    
    // Show next button if not already visible
    if (!nextButton.classList.contains('visible')) {
      hasInteracted = true;
      setTimeout(() => {
        nextButton.classList.add('visible');
      }, 500);
    }
  });
  
  // Initialize UI
  updateUI(currentValue);
});