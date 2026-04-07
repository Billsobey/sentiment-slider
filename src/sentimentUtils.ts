/**
 * Get feedback text based on slider value
 * @param value Slider value (0-100)
 * @returns Sentiment text label
 */
export const getSentimentText = (value: number): string => {
  const clampedValue = Math.max(0, Math.min(100, value));

  if (clampedValue < 20) return "Negative";
  if (clampedValue < 40) return "Somewhat Negative";
  if (clampedValue < 48) return "Slightly Negative";
  if (clampedValue > 80) return "Positive";
  if (clampedValue > 60) return "Somewhat Positive";
  if (clampedValue > 52) return "Slightly Positive";
  return "Neutral";
};

/**
 * Get background color gradient based on slider value for Spectacular variant
 * @param value Slider value (0-100)
 * @returns CSS linear-gradient string
 */
export const getSpectacularBackground = (value: number): string => {
  const clampedValue = Math.max(0, Math.min(100, value));
  const hue = (clampedValue / 100) * 120;
  const nextHue = Math.min(120, hue + 20);
  return `linear-gradient(90deg, hsl(${hue},85%,50%), hsl(${nextHue},85%,50%))`;
};
