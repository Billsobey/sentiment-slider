/**
 * SentimentSlider Integration Example
 * 
 * This example demonstrates how to integrate the SentimentSlider component
 * into a multi-question survey flow with data collection.
 */

import React, { useState } from 'react';
import { SentimentSlider } from '../../src/SentimentSlider';

interface FeedbackQuestion {
  id: string;
  question: string;
}

interface FeedbackResponse {
  questionId: string;
  sentimentValue: number;
  timestamp: number;
}

const QUESTIONS: FeedbackQuestion[] = [
  { id: 'product', question: 'How do you feel about our product?' },
  { id: 'support', question: 'How was your experience with our support team?' },
  { id: 'recommend', question: 'How likely are you to recommend us to others?' },
];

export default function FeedbackSurvey() {
  // Track current question index
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // Store collected responses
  const [responses, setResponses] = useState<FeedbackResponse[]>([]);
  
  // Track if survey is complete
  const [isComplete, setIsComplete] = useState(false);
  
  // Get current question
  const currentQuestion = QUESTIONS[currentQuestionIndex];
  
  // Handler for when user confirms their sentiment
  const handleConfirm = (value: number) => {
    // Store the response
    const response: FeedbackResponse = {
      questionId: currentQuestion.id,
      sentimentValue: value,
      timestamp: Date.now(),
    };
    
    const updatedResponses = [...responses, response];
    setResponses(updatedResponses);

    // Move to next question or complete survey
    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsComplete(true);
      // Optional: Submit data to server
      submitFeedback(updatedResponses);
    }
  };
  
  // Optional: Send feedback to server
  const submitFeedback = async (feedbackData: FeedbackResponse[]) => {
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }
      
      console.log('Feedback submitted successfully');
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };
  
  // Restart the survey
  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setResponses([]);
    setIsComplete(false);
  };
  
  // Render the appropriate view based on survey state
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {!isComplete ? (
        // Render the current question with SentimentSlider
        <React.Fragment>
          <h1 className="text-2xl font-bold mb-8 text-center">
            Question {currentQuestionIndex + 1} of {QUESTIONS.length}
          </h1>
          
          <div className="w-full max-w-md">
            <SentimentSlider 
              key={currentQuestion.id} // Important for resetting state between questions
              onConfirm={(value) => handleConfirm(value)}
            />
          </div>
          
          <div className="mt-8 text-center text-gray-600">
            <p>Question: {currentQuestion.question}</p>
          </div>
        </React.Fragment>
      ) : (
        // Render thank you message when complete
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Thank You For Your Feedback!</h1>
          <p className="mb-8 text-gray-600">Your responses have been recorded.</p>
          
          <button
            onClick={handleRestart}
            className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
          >
            Start New Survey
          </button>
          
          {/* Optional: Show response summary */}
          <div className="mt-8 p-4 bg-gray-100 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Your Responses:</h2>
            <ul>
              {responses.map((response, index) => {
                const question = QUESTIONS.find(q => q.id === response.questionId);
                return (
                  <li key={index} className="mb-2">
                    <strong>{question?.question}</strong>: 
                    {response.sentimentValue < 25 ? ' Very Negative' : 
                     response.sentimentValue < 45 ? ' Somewhat Negative' : 
                     response.sentimentValue <= 55 ? ' Neutral' : 
                     response.sentimentValue < 75 ? ' Somewhat Positive' : ' Very Positive'}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}