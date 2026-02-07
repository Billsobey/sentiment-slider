import React, { useEffect, useRef, useState } from 'react';
import './SentimentSliderSpectacular.css';
/**
 * SentimentSlider Component
 *
 * A touch-friendly sentiment slider with dynamic colors and animations.
 * Version 2.0 - Text-based feedback (no emojis)
 */
export function SentimentSliderSpectacular(_a) {
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
    var getBackground = function (value) {
        var hue = (value / 100) * 120;
        var nextHue = Math.min(120, hue + 20);
        return "linear-gradient(90deg, hsl(".concat(hue, ",85%,50%), hsl(").concat(nextHue, ",85%,50%))");
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
    var background = getBackground(sliderValue);
    var sentimentText = getSentimentText(sliderValue);
    return (React.createElement("div", { className: "sentiment-slider-container ".concat(className), style: { background: background }, ref: containerRef },
        React.createElement("div", { className: "sentiment-content" },
            React.createElement("h2", { className: "sentiment-question" }, questionText),
            React.createElement("div", { className: "slider-container" },
                React.createElement("div", { className: "sentiment-text" }, sentimentText),
                React.createElement("div", { className: "slider-wrapper" },
                    React.createElement("input", { ref: sliderRef, type: "range", min: "0", max: "100", value: sliderValue, onChange: handleSliderChange, onMouseDown: handleSlideStart, onTouchStart: handleSlideStart, onMouseUp: handleSlideEnd, onTouchEnd: handleSlideEnd, className: "sentiment-slider" }),
                    showRipple && (React.createElement(React.Fragment, null,
                        React.createElement("div", { className: "ripple ripple-primary", style: { left: "".concat(ripplePosition, "%") } }),
                        React.createElement("div", { className: "ripple ripple-secondary", style: { left: "".concat(ripplePosition, "%") } })))),
                React.createElement("div", { className: "sentiment-labels" },
                    React.createElement("span", { className: "sentiment-label-negative" }, "Negative"),
                    React.createElement("span", { className: "sentiment-label-positive" }, "Positive")),
                React.createElement("div", { className: "sentiment-instruction" }, "Slide to indicate your sentiment")),
            React.createElement("button", { onClick: handleConfirm, className: "confirm-button ".concat(showConfirmButton ? 'visible' : '') }, nextButtonText))));
}
export default SentimentSliderSpectacular;
