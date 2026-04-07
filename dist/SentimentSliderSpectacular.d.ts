import React from 'react';
import './SentimentSliderSpectacular.css';
import { SentimentSliderProps } from './SentimentSlider';
/**
 * SentimentSlider Spectacular Props Interface
 * Reuses props from the base SentimentSlider
 */
export interface SentimentSliderSpectacularProps extends SentimentSliderProps {
}
/**
 * SentimentSlider Component
 *
 * A touch-friendly sentiment slider with dynamic colors and animations.
 * Version 2.0 - Text-based feedback (no emojis)
 */
export declare function SentimentSliderSpectacular({ initialValue, onConfirm, questionText, nextButtonText, className }: SentimentSliderSpectacularProps): React.JSX.Element;
export default SentimentSliderSpectacular;
