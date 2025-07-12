import React, { useState, useEffect } from 'react';
import { CheckCircleIcon, XCircleIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { apiService, Question, AnswerRequest, AnswerResponse } from '../services/apiService';

const PracticeQuestions: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [answerResult, setAnswerResult] = useState<AnswerResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    domain: '',
    difficulty: '',
  });

  const domains = [
    'Design Resilient Architectures',
    'Design High-Performing Architectures',
    'Design Secure Applications and Architectures',
    'Design Cost-Optimized Architectures',
  ];

  const difficulties = ['Easy', 'Medium', 'Hard'];

  useEffect(() => {
    fetchQuestions();
  }, [filters]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await apiService.getQuestions({
        domain: filters.domain || undefined,
        difficulty: filters.difficulty || undefined,
        limit: 50,
      });
      setQuestions(response);
      setCurrentQuestionIndex(0);
      setSelectedAnswer('');
      setShowAnswer(false);
      setAnswerResult(null);
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSubmit = async () => {
    if (!selectedAnswer || !currentQuestion) return;

    const request: AnswerRequest = {
      question_id: currentQuestion.id,
      selected_answer: selectedAnswer,
    };

    try {
      const response = await apiService.submitAnswer(request);
      setAnswerResult(response);
      setShowAnswer(true);
    } catch (error) {
      console.error('Error submitting answer:', error);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer('');
      setShowAnswer(false);
      setAnswerResult(null);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer('');
      setShowAnswer(false);
      setAnswerResult(null);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-aws-orange"></div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">No questions found</h2>
        <p className="text-gray-600">Try adjusting your filters or check back later.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Practice Questions</h1>
            <p className="text-gray-600">
              Question {currentQuestionIndex + 1} of {questions.length}
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Domain</div>
            <div className="font-medium text-aws-orange">{currentQuestion?.domain}</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Domain</label>
            <select
              value={filters.domain}
              onChange={(e) => setFilters({ ...filters, domain: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-aws-orange"
            >
              <option value="">All Domains</option>
              {domains.map((domain) => (
                <option key={domain} value={domain}>{domain}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
            <select
              value={filters.difficulty}
              onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-aws-orange"
            >
              <option value="">All Difficulties</option>
              {difficulties.map((difficulty) => (
                <option key={difficulty} value={difficulty}>{difficulty}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {currentQuestion?.difficulty}
            </span>
            <span className="text-sm text-gray-500">
              {currentQuestion?.aws_service}
            </span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {currentQuestion?.question_text}
          </h3>
        </div>

        {/* Answer Options */}
        <div className="space-y-3 mb-6">
          {['A', 'B', 'C', 'D'].map((option) => {
            const optionText = currentQuestion?.[`option_${option.toLowerCase()}` as keyof Question] as string;
            const isSelected = selectedAnswer === option;
            const isCorrect = answerResult?.correct_answer === option;
            const isWrong = showAnswer && isSelected && !answerResult?.is_correct;
            
            return (
              <button
                key={option}
                onClick={() => !showAnswer && setSelectedAnswer(option)}
                disabled={showAnswer}
                className={`w-full text-left p-4 rounded-lg border transition-colors ${
                  isSelected
                    ? isWrong
                      ? 'border-red-300 bg-red-50'
                      : 'border-aws-orange bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                } ${
                  showAnswer && isCorrect
                    ? 'border-green-300 bg-green-50'
                    : ''
                } ${
                  showAnswer ? 'cursor-not-allowed' : 'cursor-pointer'
                }`}
              >
                <div className="flex items-center">
                  <span className="flex-shrink-0 w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                    {option}
                  </span>
                  <span className="text-gray-900">{optionText}</span>
                  {showAnswer && isCorrect && (
                    <CheckCircleIcon className="ml-auto h-5 w-5 text-green-500" />
                  )}
                  {showAnswer && isWrong && (
                    <XCircleIcon className="ml-auto h-5 w-5 text-red-500" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Answer Result */}
        {showAnswer && answerResult && (
          <div className={`p-4 rounded-lg mb-6 ${
            answerResult.is_correct ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-center mb-2">
              {answerResult.is_correct ? (
                <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
              ) : (
                <XCircleIcon className="h-5 w-5 text-red-500 mr-2" />
              )}
              <span className={`font-medium ${
                answerResult.is_correct ? 'text-green-800' : 'text-red-800'
              }`}>
                {answerResult.is_correct ? 'Correct!' : 'Incorrect'}
              </span>
            </div>
            <p className="text-gray-700 mb-2">
              <strong>Explanation:</strong> {answerResult.explanation}
            </p>
            {!answerResult.is_correct && (
              <p className="text-gray-700">
                <strong>Correct answer:</strong> {answerResult.correct_answer}
              </p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeftIcon className="h-4 w-4 mr-1" />
            Previous
          </button>

          <div className="flex space-x-3">
            {!showAnswer && (
              <button
                onClick={handleAnswerSubmit}
                disabled={!selectedAnswer}
                className="px-6 py-2 bg-aws-orange text-white rounded-md hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Answer
              </button>
            )}
          </div>

          <button
            onClick={handleNextQuestion}
            disabled={currentQuestionIndex === questions.length - 1}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <ChevronRightIcon className="h-4 w-4 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PracticeQuestions;