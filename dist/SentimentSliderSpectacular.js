import React, { useEffect, useRef, useState, useCallback } from 'react';
import './SentimentSliderSpectacular.css';
import { getSentimentText, getSpectacularBackground } from './sentimentUtils';
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
    var isSlidingRef = useRef(false);
    var _h = useState(false), showRipple = _h[0], setShowRipple = _h[1];
    var _j = useState(50), ripplePosition = _j[0], setRipplePosition = _j[1];
    var _k = useState(false), showConfirmButton = _k[0], setShowConfirmButton = _k[1];
    var sliderRef = useRef(null);
    var containerRef = useRef(null);
    // Update slider value if initialValue prop changes
    useEffect(function () {
        setSliderValue(initialValue);
    }, [initialValue]);
    var preventTouchScroll = useCallback(function (e) {
        if (isSlidingRef.current) {
            e.preventDefault();
        }
    }, []);
    var preventWheelScroll = useCallback(function (e) {
        if (isSlidingRef.current) {
            e.preventDefault();
        }
    }, []);
    var preventElasticScroll = useCallback(function (e) {
        if (isSlidingRef.current && e.touches[0] &&
            (e.touches[0].clientY < 10 ||
                e.touches[0].clientY > window.innerHeight - 10)) {
            e.preventDefault();
        }
    }, []);
    // Prevent scrolling while using slider
    useEffect(function () {
        document.addEventListener('touchmove', preventTouchScroll, { passive: false });
        document.addEventListener('wheel', preventWheelScroll, { passive: false });
        document.addEventListener('touchstart', preventElasticScroll, { passive: false });
        return function () {
            document.removeEventListener('touchmove', preventTouchScroll);
            document.removeEventListener('wheel', preventWheelScroll);
            document.removeEventListener('touchstart', preventElasticScroll);
        };
    }, [preventTouchScroll, preventWheelScroll, preventElasticScroll]);
    useEffect(function () {
        // Use no-scroll class to prevent scrolling
        if (isSliding) {
            document.body.classList.add('no-scroll');
        }
        else {
            document.body.classList.remove('no-scroll');
        }
        return function () {
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
        isSlidingRef.current = true;
        setShowRipple(false);
        setShowConfirmButton(false);
    };
    // Handle slide end
    var handleSlideEnd = function () {
        setIsSliding(false);
        isSlidingRef.current = false;
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
    var background = getSpectacularBackground(sliderValue);
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
