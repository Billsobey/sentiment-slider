# Sentiment Slider (v2.0)

A highly refined, iOS-inspired sentiment slider component focused on
micro-interactions and user experience.

![Sentiment Slider Demo](https://billsobey.github.io/sentiment-slider/assets/IMG_2920.png)

## What's New in v2.0

- **Text-Based Feedback**: Cleaner interface with sentiment text labels instead of emojis
- **Enhanced Design**: More refined iOS-inspired look and feel
- **Improved Animations**: Smoother transitions and more visual feedback
- **Better Touch Handling**: Enhanced mobile experience with improved gesture handling
- **Accessibility Improvements**: Better contrast and text readability

## Demo

Try the interactive demo: [Sentiment Slider Demo](https://billsobey.github.io/sentiment-slider/)

## Installation

```bash
npm install sentiment-slider
# or
yarn add sentiment-slider
```

## Usage

```jsx
import React from 'react';
import { SentimentSlider } from 'sentiment-slider';
import 'sentiment-slider/dist/SentimentSlider.css'; // Don't forget to import the styles!

function FeedbackForm() {
  const handleConfirm = (value) => {
    console.log('Selected sentiment value:', value);
    // Process the sentiment value (0-100)
  };

  return (
    <div>
      <h1>We'd love your feedback</h1>
      
      <SentimentSlider
        questionText="How was your experience today?"
        nextButtonText="Submit"
        onConfirm={handleConfirm}
        initialValue={50}
      />
    </div>
  );
}

export default FeedbackForm;
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initialValue` | number | 50 | Initial value of the slider (0-100) |
| `onConfirm` | function | required | Callback function that receives the final slider value |
| `questionText` | string | "How do you feel?" | The question displayed above the slider |
| `nextButtonText` | string | "Next question" | Text for the confirmation button |
| `className` | string | "" | Additional CSS class for custom styling |

## Features

- **Dynamic Background Colors**: Background shifts smoothly through a color gradient from red (negative) to green (positive) as the slider moves
- **Immediate Visual Feedback**: Real-time text feedback responds to user interaction
- **Dramatic Ripple Effects**: White ripple animations when the slider is released
- **iOS-Inspired Design**: Clean, minimal aesthetic with attention to micro-interactions
- **Multi-Question Flow**: "Next question" button appears after interaction for survey-style applications
- **Touch-Optimized**: Mobile-first design with careful handling of touch events
- **Responsive Layout**: Adapts to different screen sizes and orientations

## Examples

Check out the `examples` directory for sample implementations, including a multi-question survey.

## Browser Compatibility

Tested and working in:

- Chrome (latest)
- Safari (latest)
- Firefox (latest)
- Edge (latest)
- Mobile Safari (iOS 14+)
- Chrome for Android (latest)

## License

MIT © [Bill Sobey](https://github.com/Billsobey)