/**
 * SentimentSlider Integration Example
 * 
 * This example demonstrates how to integrate the SentimentSlider component
 * into a multi-question survey flow with data collection.
 */
import React, { useState } from 'react';
import { SentimentSlider } from '../src';

interface FeedbackQuestion {
  id: string;
  question: string;
}

interface FeedbackResponse {
  questionId: string;
  sentimentValue: number;
  timestamp: number;
}

export default function FeedbackSurvey() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<FeedbackResponse[]>([]);
  const [isSurveyComplete, setIsSurveyComplete] = useState(false);

  // Example questions for a feedback survey
  const questions: FeedbackQuestion[] = [
    {
      id: 'q1',
      question: 'How would you rate your experience with our service?'
    },
    {
      id: 'q2',
      question: 'How likely are you to recommend us to a friend?'
    },
    {
      id: 'q3',
      question: 'How satisfied are you with our customer support?'
    }
  ];

  // Handle sentiment confirmation
  const handleSentimentConfirm = (value: number) => {
    // Create a response object
    const response: FeedbackResponse = {
      questionId: questions[currentQuestionIndex].id,
      sentimentValue: value,
      timestamp: Date.now()
    };

    // Add response to collection
    setResponses([...responses, response]);

    // Move to next question or complete survey
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsSurveyComplete(true);
      // Here you would typically send the data to your backend
      console.log('Survey responses:', [...responses, response]);
    }
  };

  // Reset the survey to start over
  const handleReset = () => {
    setCurrentQuestionIndex(0);
    setResponses([]);
    setIsSurveyComplete(false);
  };

  return (
    <div className="survey-container">
      {!isSurveyComplete ? (
        <>
          <div className="progress-indicator">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
          
          <SentimentSlider
            questionText={questions[currentQuestionIndex].question}
            onConfirm={handleSentimentConfirm}
            nextButtonText={
              currentQuestionIndex < questions.length - 1 
                ? "Next question" 
                : "Complete survey"
            }
          />
        </>
      ) : (
        <div className="survey-complete">
          <h2>Thank you for your feedback!</h2>
          <p>We appreciate your time and input.</p>
          
          <div className="responses-summary">
            <h3>Your Responses:</h3>
            <ul>
              {responses.map((response, index) => {
                const question = questions.find(q => q.id === response.questionId);
                return (
                  <li key={index}>
                    <strong>{question?.question}</strong>
                    <div className="response-value">
                      <span 
                        className="sentiment-indicator"
                        style={{
                          backgroundColor: response.sentimentValue < 40 
                            ? '#e53935' 
                            : response.sentimentValue < 60 
                              ? '#fdd835' 
                              : '#43a047'
                        }}
                      ></span>
                      {response.sentimentValue < 40 
                        ? 'Negative' 
                        : response.sentimentValue < 60 
                          ? 'Neutral' 
                          : 'Positive'} 
                      ({response.sentimentValue}/100)
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
          
          <button 
            className="reset-button"
            onClick={handleReset}
          >
            Take Survey Again
          </button>
        </div>
      )}
    </div>
  );
}