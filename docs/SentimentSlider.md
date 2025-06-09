# SentimentSlider

> A highly polished sentiment capture component with iOS-inspired design aesthetic and micro-interactions.

The SentimentSlider provides a tactile, intuitive way for users to express their feelings on a scale from negative to positive, featuring dynamic color transitions, ripple effects, and smooth animations. It was designed with a mobile-first approach to create a joyful, engaging interaction pattern.

## Visual Example

![Sentiment Slider Demo](../assets/IMG_2920.png)

## Use Cases

- Feedback collection after product usage
- Customer satisfaction surveys
- Emotional response tracking
- NPS alternative with a more visual approach
- Real-time sentiment capture during user experiences

## Anatomy

The SentimentSlider consists of:
1. A title/question display
2. A dynamic sentiment text display ("Very Negative", "Somewhat Positive", etc.)
3. A horizontal slider with pill-shaped track and circular handle
4. Contextual labels at slider endpoints
5. A "Next question" button that appears after interaction
6. Ripple effects that appear when the slider is released
7. Instruction text that changes based on interaction state

## Behavior

- The slider starts at the center position (50) representing a neutral sentiment
- As the user drags the handle, the background color transitions smoothly between emotional states
- When the user releases the slider, ripple animations expand outward
- After completing the gesture, a "Next question" button fades in
- The component prevents default scrolling behavior while interacting with the slider

## Interaction States

1. **Initial state**: Neutral position, instruction text visible
2. **Dragging state**: Background color changes, instruction text updates to "Release to submit"
3. **Released state**: Ripple effect animation, "Next question" button appears
4. **Complete state**: Ready for progression to next question

## Color System

The slider uses a continuous color gradient system:
- **0-25**: Red tones representing negative sentiment
- **26-45**: Orange tones representing somewhat negative sentiment
- **46-55**: Neutral beige/off-white tones
- **56-75**: Light green tones representing somewhat positive sentiment
- **76-100**: Rich green tones representing positive sentiment

Colors transition smoothly with a 0.25s ease-in-out transition for a polished feel.

## Implementation Example

```tsx
// Import the component
import { SentimentSlider } from '../src/SentimentSlider';
import { useState } from 'react';

function CustomerFeedbackForm() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const questions = [
    "How was your experience with our product?",
    "How did our customer service make you feel?",
    "How likely are you to recommend us to others?"
  ];
  
  const handleNextQuestion = () => {
    setCurrentQuestion(prev => 
      prev < questions.length - 1 ? prev + 1 : prev
    );
  };
  
  return (
    <div className="feedback-container">
      {currentQuestion < questions.length ? (
        <SentimentSlider 
          onConfirm={handleNextQuestion}
          key={currentQuestion} // Force re-render on question change
        />
      ) : (
        <div className="thank-you-message">
          <h2>Thank you for your feedback!</h2>
        </div>
      )}
    </div>
  );
}
```

## Customization API

The SentimentSlider component accepts the following props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onConfirm` | `() => void` | required | Function called when user clicks "Next question" |
| `initialValue` | `number` | `50` | Starting position of the slider (0-100) |

## Accessibility Considerations

- Use meaningful question text to provide context for the sentiment being measured
- The slider operation works with touch, mouse, and can be extended for keyboard support
- Text maintains proper contrast against the changing background colors
- Consider adding ARIA labels for screen reader support in your implementation

## Design Guidelines

- **Placement**: Give the component full attention in the user interface, avoid competing elements
- **Context**: Provide clear instructions and context before showing the slider
- **Question Sequence**: When using for multiple questions, maintain visual consistency
- **Neutral Starting Point**: Always start at the neutral position to avoid bias
- **Response Collection**: Pair with appropriate data collection to store sentiment responses

## Technical Details

The SentimentSlider is built with:
- React + TypeScript
- Tailwind CSS for styling
- Framer Motion for animations
- Custom hooks for state management
- Mathematical color interpolation for smooth transitions

## Browser Support

The component has been tested in:
- Chrome, Firefox, Safari, Edge (latest versions)
- iOS Safari (14+)
- Android Chrome (latest)

## Code Structure

```
src/
  └── SentimentSlider.tsx  # Main component implementation
```

## Event Handling Details

The component implements sophisticated event handling to ensure smooth touch and mouse interactions:

```typescript
// Touch event handling example (simplified)
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

## Related Components

- **RatingScale**: For numerical ratings (1-5, 1-10)
- **EmojiReaction**: For emoji-based feedback
- **MultiChoiceFeedback**: For predefined feedback options