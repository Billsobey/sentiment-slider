import React from 'react';
import './SentimentSlider.css';
/**
 * SentimentSlider Props Interface
 */
export interface SentimentSliderProps {
    /**
     * Initial value for the slider (0-100)
     * Default: 50 (neutral position)
     */
    initialValue?: number;
    /**
     * Callback function triggered when user confirms their selection
     */
    onConfirm: (value: number) => void;
    /**
     * Optional custom question text
     * Default: "How do you feel?"
     */
    questionText?: string;
    /**
     * Optional custom next button text
     * Default: "Next question"
     */
    nextButtonText?: string;
    /**
     * Optional class name for additional styling
     */
    className?: string;
}
/**
 * SentimentSlider Component
 *
 * A touch-friendly sentiment slider with dynamic colors and animations.
 * Version 2.0 - Text-based feedback (no emojis)
 */
export declare function SentimentSlider({ initialValue, onConfirm, questionText, nextButtonText, className }: SentimentSliderProps): React.JSX.Element;
export default SentimentSlider;
