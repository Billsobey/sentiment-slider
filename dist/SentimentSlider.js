import React, { useEffect, useRef, useState } from 'react';
import './SentimentSlider.css';
/**
 * SentimentSlider Component
 *
 * A touch-friendly sentiment slider with dynamic colors and animations.
 * Version 2.0 - Text-based feedback (no emojis)
 */
export function SentimentSlider(_a) {
    var _b = _a.initialValue, initialValue = _b === void 0 ? 50 : _b, onConfirm = _a.onConfirm, _c = _a.questionText, questionText = _c === void 0 ? "How do you feel?" : _c, _d = _a.nextButtonText, nextButtonText = _d === void 0 ? "Next question" : _d, _e = _a.className, className = _e === void 0 ? "" : _e;
    var _f = useState(initialValue), sliderValue = _f[0], setSliderValue = _f[1];
    var _g = useState(false), isSliding = _g[0], setIsSliding = _g[1];
    var _h = useState(false), showRipple = _h[0], setShowRipple = _h[1];
    var _j = useState(50), ripplePosition = _j[0], setRipplePosition = _j[1];
    var _k = useState(false), showConfirmButton = _k[0], setShowConfirmButton = _k[1];
    var sliderRef = useRef(null);
    var containerRef = useRef(null);
    // Update slider value if initialValue prop changes
    useEffect(function () {
        setSliderValue(initialValue);
    }, [initialValue]);
    // Get feedback text based on slider value
    var getSentimentText = function (value) {
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
    // Get background color based on slider value
    var getBackgroundColor = function (value) {
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
    // Prevent scrolling while using slider
    useEffect(function () {
        var preventTouchScroll = function (e) {
            if (isSliding) {
                e.preventDefault();
            }
        };
        var preventWheelScroll = function (e) {
            if (isSliding) {
                e.preventDefault();
            }
        };
        var preventElasticScroll = function (e) {
            if (isSliding && e.touches[0] &&
                (e.touches[0].clientY < 10 ||
                    e.touches[0].clientY > window.innerHeight - 10)) {
                e.preventDefault();
            }
        };
        document.addEventListener('touchmove', preventTouchScroll, { passive: false });
        document.addEventListener('wheel', preventWheelScroll, { passive: false });
        document.addEventListener('touchstart', preventElasticScroll, { passive: false });
        // Use no-scroll class to prevent scrolling
        if (isSliding) {
            document.body.classList.add('no-scroll');
        }
        else {
            document.body.classList.remove('no-scroll');
        }
        return function () {
            document.removeEventListener('touchmove', preventTouchScroll);
            document.removeEventListener('wheel', preventWheelScroll);
            document.removeEventListener('touchstart', preventElasticScroll);
            document.body.classList.remove('no-scroll');
        };
    }, [isSliding]);
    // Handle slider change
    var handleSliderChange = function (event) {
        var newValue = parseInt(event.target.value, 10);
        setSliderValue(newValue);
    };
    // Handle slide start
    var handleSlideStart = function () {
        setIsSliding(true);
        setShowRipple(false);
        setShowConfirmButton(false);
    };
    // Handle slide end
    var handleSlideEnd = function () {
        setIsSliding(false);
        setRipplePosition(sliderValue);
        setShowRipple(true);
        // Show confirmation button after interaction
        setTimeout(function () {
            setShowConfirmButton(true);
        }, 500);
        // Reset ripple after animation
        setTimeout(function () {
            setShowRipple(false);
        }, 600);
    };
    // Handle confirmation
    var handleConfirm = function () {
        if (onConfirm) {
            onConfirm(sliderValue);
        }
    };
    var backgroundColor = getBackgroundColor(sliderValue);
    var sentimentText = getSentimentText(sliderValue);
    return (React.createElement("div", { className: "sentiment-slider-container ".concat(className), style: { backgroundColor: backgroundColor }, ref: containerRef },
        React.createElement("div", { className: "sentiment-content" },
            React.createElement("h2", { className: "sentiment-question" }, questionText),
            React.createElement("div", { className: "slider-container" },
                React.createElement("div", { className: "sentiment-text" }, sentimentText),
                React.createElement("div", { className: "slider-wrapper" },
                    React.createElement("input", { ref: sliderRef, type: "range", min: "0", max: "100", value: sliderValue, onChange: handleSliderChange, onMouseDown: handleSlideStart, onTouchStart: handleSlideStart, onMouseUp: handleSlideEnd, onTouchEnd: handleSlideEnd, className: "sentiment-slider" }),
                    showRipple && (React.createElement("div", { className: "ripple", style: { left: "".concat(ripplePosition, "%") } }))),
                React.createElement("div", { className: "sentiment-labels" },
                    React.createElement("span", { className: "sentiment-label-negative" }, "Negative"),
                    React.createElement("span", { className: "sentiment-label-positive" }, "Positive")),
                React.createElement("div", { className: "sentiment-instruction" }, "Slide to indicate your sentiment")),
            React.createElement("button", { onClick: handleConfirm, className: "confirm-button ".concat(showConfirmButton ? 'visible' : '') }, nextButtonText))));
}
export default SentimentSlider;
