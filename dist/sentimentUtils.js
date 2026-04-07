/**
 * Utility functions for sentiment analysis and UI representation
 */
/**
 * Get feedback text based on slider value (0-100)
 */
export var getSentimentText = function (value) {
    if (value < 20)
        return "Negative";
    if (value < 40)
        return "Somewhat Negative";
    if (value < 48)
        return "Slightly Negative";
    if (value > 80)
        return "Positive";
    if (value > 60)
        return "Somewhat Positive";
    if (value > 52)
        return "Slightly Positive";
    return "Neutral";
};
/**
 * Get background color based on slider value for the standard SentimentSlider
 */
export var getBackgroundColor = function (value) {
    // For negative sentiments (0-49)
    if (value < 50) {
        // Calculate how negative: 0 = most negative, 49 = barely negative
        var negativeStrength = 1 - (value / 50); // 1 = full negative, 0 = barely negative
        // Negative sentiment colors (red to orange)
        var r = 255;
        var g = Math.round(50 + (negativeStrength < 0.5 ? 150 * (1 - negativeStrength * 2) : 0));
        var b = 0;
        return "rgb(".concat(r, ", ").concat(g, ", ").concat(b, ")");
    }
    // Exact center point is yellow/gold
    else if (value === 50) {
        return "rgb(255, 215, 0)";
    }
    // For positive sentiments (51-100)
    else {
        // Calculate how positive: 51 = barely positive, 100 = most positive
        var positiveStrength = (value - 50) / 50; // 0 = barely positive, 1 = full positive
        // Positive sentiment colors (yellow-green to rich green)
        var r = Math.round(120 + (130 * (1 - positiveStrength)));
        var g = 220;
        var b = Math.round(positiveStrength > 0.7 ? (positiveStrength - 0.7) * 80 : 0);
        return "rgb(".concat(r, ", ").concat(g, ", ").concat(b, ")");
    }
};
/**
 * Get background gradient based on slider value for the Spectacular variant
 */
export var getSpectacularBackground = function (value) {
    var hue = (value / 100) * 120;
    var nextHue = Math.min(120, hue + 20);
    return "linear-gradient(90deg, hsl(".concat(hue, ",85%,50%), hsl(").concat(nextHue, ",85%,50%))");
};
