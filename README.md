# Sentiment Slider

An advanced sentiment slider component designed for intuitive and engaging user emotion capture, with a focus on mobile-first, accessible interaction design.

## Live Demo

Check out the [live interactive demo](https://billsobey.github.io/sentiment-slider/) and [component documentation](https://billsobey.github.io/sentiment-slider/documentation.html) to experience the sentiment slider in action.

## Features

- 🌈 Dynamic color transitions based on sentiment value
- 💫 Elegant animations and micro-interactions
- 📱 Mobile-optimized touch interactions
- ♿ Accessible design with keyboard support
- 🔄 Real-time visual feedback
- 🎯 Confirmation flow with visual cues

## Installation

```bash
npm install @sentiment-slider/react
```

## Basic Usage

```jsx
import { SentimentSlider } from '@sentiment-slider/react';

function FeedbackForm() {
  const handleConfirm = (value) => {
    console.log(`User sentiment value: ${value}`);
    // Process the sentiment value
  };

  return (
    <SentimentSlider
      onConfirm={handleConfirm}
      initialValue={50}
      questionText="How was your experience today?"
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| initialValue | number | 50 | Initial value for the slider (0-100) |
| onConfirm | function | required | Callback function triggered when user confirms their selection |
| questionText | string | "How do you feel?" | Custom question text |
| nextButtonText | string | "Next question" | Custom next button text |
| className | string | undefined | Additional CSS class for styling |

## Use Cases

- Customer satisfaction surveys
- User experience feedback
- Product reviews
- Employee satisfaction measurement
- Healthcare patient feedback
- Educational feedback systems

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Android Chrome)

## License

MIT © [Sentiment Slider Contributors]