/**
 * Utility functions for sentiment analysis and UI representation
 */

/**
 * Get feedback text based on slider value (0-100)
 */
export const getSentimentText = (value: number): string => {
  if (value < 20) return "Negative";
  if (value < 40) return "Somewhat Negative";
  if (value < 48) return "Slightly Negative";
  if (value > 80) return "Positive";
  if (value > 60) return "Somewhat Positive";
  if (value > 52) return "Slightly Positive";
  return "Neutral";
};

/**
 * Get background color based on slider value for the standard SentimentSlider
 */
export const getBackgroundColor = (value: number): string => {
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

/**
 * Get background gradient based on slider value for the Spectacular variant
 */
export const getSpectacularBackground = (value: number): string => {
  const hue = (value / 100) * 120;
  const nextHue = Math.min(120, hue + 20);
  return `linear-gradient(90deg, hsl(${hue},85%,50%), hsl(${nextHue},85%,50%))`;
};
