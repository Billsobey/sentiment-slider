# SentimentSlider - Technical Documentation

This document provides technical details about the implementation of the SentimentSlider component. It's intended for developers who need to modify, extend, or debug the component.

## Architecture Overview

The SentimentSlider is built using a combination of:

1. **React Component** (`SentimentSlider.tsx`): The main component that renders the UI and handles interactions
2. **Custom Hook** (`use-sentiment.ts`): Manages state and logic related to sentiment values
3. **Utility Functions** (`utils.ts`): Provides helper functions for calculations, especially color interpolation

## Key Dependencies

- **React + TypeScript**: For component structure and type safety
- **Framer Motion**: For animations (ripple effects, button transitions)
- **Tailwind CSS**: For styling and layout

## Component Structure

The component follows this general structure:

```
<Container> (Full screen with dynamic background)
  ├── <Header>
  ├── <SentimentText> (Displays current sentiment text)
  ├── <SliderContainer>
  │   ├── <Labels> (Negative/Positive)
  │   ├── <SliderTrack>
  │   │   ├── <FilledTrack>
  │   │   └── <SliderKnob>
  │   └── <ClickableArea> (For event handling)
  ├── <NextButton> (Appears after interaction)
  ├── <InstructionsText> (Context-sensitive)
  └── <RippleEffects> (Animated on release)
```

## State Management

The component manages several pieces of state:

```typescript
// From use-sentiment.ts custom hook
const [value, setValue] = useState<number>(50);
const [isSliding, setIsSliding] = useState<boolean>(false);
const [isPulsing, setIsPulsing] = useState<boolean>(false);
const [showNextButton, setShowNextButton] = useState<boolean>(false);
const [ripples, setRipples] = useState<Array<{ id: number; left: number }>>([]);
```

These states control:
- Current slider position (0-100)
- Whether the user is currently dragging
- Whether to show the ripple animation
- Whether to show the "Next question" button
- Collection of ripple effects to render

## Event Handling Logic

The component implements sophisticated event handling to ensure smooth interaction:

### Mouse Events

```typescript
onMouseDown={(e) => {
  e.preventDefault();
  onSlideStart();
  handleSliderClick(e);
}}
onMouseMove={(e) => {
  if (isSliding) {
    e.preventDefault();
    handleSliderClick(e);
  }
}}
onMouseUp={handleSlideComplete}
onMouseLeave={(e) => {
  if (isSliding) {
    handleSlideComplete(e);
  }
}}
```

### Touch Events

```typescript
onTouchStart={(e) => {
  e.preventDefault();
  e.stopPropagation();
  onSlideStart();
  handleTouchMove(e);
}}
onTouchMove={(e) => {
  if (isSliding) {
    e.preventDefault();
    e.stopPropagation();
    handleTouchMove(e);
  }
}}
onTouchEnd={handleSlideComplete}
```

## Event Handlers

The component uses these key handler functions:

### Slider Position Calculation

```typescript
const handleSliderClick = (e: React.MouseEvent) => {
  if (!sliderRef.current) return;
  
  const rect = sliderRef.current.getBoundingClientRect();
  const offsetX = e.clientX - rect.left;
  const percentage = Math.min(100, Math.max(0, (offsetX / rect.width) * 100));
  
  setValue(percentage);
};

const handleTouchMove = (e: React.TouchEvent) => {
  if (!sliderRef.current || !e.touches[0]) return;
  
  const rect = sliderRef.current.getBoundingClientRect();
  const offsetX = e.touches[0].clientX - rect.left;
  const percentage = Math.min(100, Math.max(0, (offsetX / rect.width) * 100));
  
  setValue(percentage);
};
```

### Interaction State Management

```typescript
const onSlideStart = () => {
  setIsSliding(true);
};

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
```

## Color System Implementation

The color transitions are implemented using a continuous color calculation system:

```typescript
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
```

## Animation Implementation

The component uses Framer Motion for animations:

### Ripple Effects

```tsx
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
    width: ["100px", "150vw", "200vw"],
    height: ["100px", "150vw", "200vw"],
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
```

### Next Button Animation

```tsx
<motion.button
  className="bg-white/90 text-black font-medium py-3 rounded-full shadow-md hover:bg-white transition-colors z-30 absolute flex items-center justify-center w-[160px]"
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: 10 }}
  transition={{ duration: 0.5, ease: "easeOut" }}
  onClick={onConfirm}
>
  Next question
</motion.button>
```

## Optimization Techniques

The component uses several optimization techniques:

1. **Throttling**: Touch and mouse events could be throttled for better performance
2. **Memoization**: Expensive calculations (like color transitions) could be memoized
3. **Hardware Acceleration**: Uses transform properties for better performance
4. **Event Delegation**: Attaches events to container elements where possible
5. **Conditional Rendering**: Only renders ripple effects when needed

## Troubleshooting Common Issues

### Issue: Slider feels unresponsive
- Ensure event propagation is properly stopped
- Check if browser is throttling JavaScript due to heavy animations
- Verify touch events are being properly handled

### Issue: Colors transition abruptly
- Check the color calculation logic in the getBgGradient function
- Verify the transition duration in the container style

### Issue: Ripple effects don't appear
- Check that the isPulsing state is being set correctly
- Verify z-index values to ensure ripples are visible
- Check Framer Motion is correctly installed and imported

### Issue: Layout shifts when button appears
- Verify the fixed-height container is used around the button
- Check that the absolute positioning is working correctly

## Extension Points

The component was designed to be extensible in these ways:

1. **Custom Colors**: The color calculation functions can be replaced
2. **Additional Props**: New props can be added for customization
3. **Animation Configuration**: The animation parameters can be exposed as props
4. **Feedback Collection**: The onConfirm handler can be extended to collect data

## Performance Considerations

- **Animation Impact**: The ripple animations can be performance-intensive on lower-end devices
- **Event Handling**: Frequent event handling during drags can impact performance
- **Color Calculations**: Complex color calculations happen on each value change

## Accessibility Improvements

Future accessibility improvements could include:

1. **Keyboard Navigation**: Add keyboard controls (arrow keys) for slider movement
2. **ARIA Attributes**: Add aria-valuemin, aria-valuemax, aria-valuenow
3. **Role Definition**: Define appropriate role="slider" attribute
4. **Focus Management**: Improve focus styles and management
5. **Reduced Motion**: Support prefers-reduced-motion media query

## Related Functionality

The SentimentSlider can be connected to other components in your application:

1. **Data Persistence**: Store sentiment values in your application state or database
2. **Analytics Integration**: Track sentiment responses for analysis
3. **Multi-Step Forms**: Use as part of a larger form or survey flow
4. **Results Visualization**: Connect to data visualization components