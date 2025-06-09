import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SentimentSliderSpectacular from './SentimentSliderSpectacular';

it('calls onConfirm with the slider value after sliding and confirming', () => {
  jest.useFakeTimers();
  const onConfirm = jest.fn();
  render(<SentimentSliderSpectacular onConfirm={onConfirm} />);

  const slider = screen.getByRole('slider');

  fireEvent.mouseDown(slider);
  fireEvent.change(slider, { target: { value: '80' } });
  fireEvent.mouseUp(slider);

  jest.advanceTimersByTime(501);

  const button = screen.getByRole('button', { name: /next question/i });
  fireEvent.click(button);

  expect(onConfirm).toHaveBeenCalledWith(80);
  jest.useRealTimers();
});
